<script>
export let name;
export let index;
import { createEventDispatcher } from 'svelte';
import { invalidateAll, goto } from '$app/navigation';
import { applyAction, deserialize } from '$app/forms';
import { currentUser, pb } from '/src/lib/pocketbase';
import EditRecipe from "/src/lib/components/edit_recipe.svelte";

const dispatch = createEventDispatcher();
export let test_mode;
let recipe;
const measurements = ["teaspoon", "cup", "tablespoon", "pound", "gram", "g", "large", "medium", "small", "clove", "whole", "ounce"];
let multiplier = 1;

const conv_frac = {"¼": .25, "½": .5, "¾": .75, "⅐": .142857, "⅑": .111111, "⅒": .1, "⅓": .333333, "⅔": .666667, "⅕": .2, 
                    "⅖": .4, "⅗": .6, "⅘": .8, "⅙": .166667, "⅚": .833333, "⅛": .125, "⅜": .375, "⅝": .625, "⅞": .875};




function forward_input(e) {
    multiplier = get_multiplier(e);
    let items = process_recipe(e.srcElement.value.split("\n"));
	dispatch('recipe_edited', {
        items: items, 
        multiplier: multiplier,
        index: index
    });
}

function update_recipe(e){
    recipe = e.detail.recipe;
    dispatch('recipe_edited', {
        items: recipe.ingredients, 
        multiplier: multiplier,
        index: index
    });
}

function update_multiplier(e){
    let desired_servings = e.srcElement.parentElement.parentElement.getElementsByClassName("desired_servings")[0].value;
    let servings_in_recipe = e.srcElement.parentElement.parentElement.getElementsByClassName("recipe_servings")[0].value;
    multiplier = desired_servings / servings_in_recipe;
    dispatch("update_multiplier", {
        multiplier: multiplier,
        index: index
    });
}

function process_recipe(in_lines) {
    if (in_lines[0] == null) return false;
    
    in_lines[0] = in_lines[0].replace(
        /^(\*)([A-z0-9 ()/’,-.ñ;è'\t]+)/,
        "$2"
    ).trim();

    in_lines[0] = in_lines[0].replace(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d+)([A-z])/,
        "$1 $2"
    );
    
    let ingr = false;

    let curr = in_lines[0].match(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d+|\d\/\d|\d \d\/\d) ([A-zñ]+)[, | ]([A-z0-9 ()/’,-.ñ;è']+)/ 
    );
    //  6 medium tomatillos (about 1 1/2 pounds, 0.7kg), husks removed and halved
    //  1 medium onion, thinly sliced (about 6 ounces; 170g)
    if (curr){
        // log_match(curr, 1);
        ingr = {
                amount: convert_amount(curr[1]), 
                unit: make_singular(curr[2]), 
                name: trim_name(curr[3].trim()),
                original: [in_lines[0]]
        };
    }
    curr = false;
    curr = in_lines[0].match(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) ([A-z]+)\/(\d+) ([A-z]+) ([A-z0-9 ()/’,-.;']+)/
    );
    //  1 cup/200 grams granulated sugar
    //  ¼ cup/30 grams confectioners’ sugar
    if (curr){
        // log_match(curr, 2);      
        ingr = {
            amount: convert_amount(curr[1]), 
            unit: make_singular(curr[2]), 
            name: trim_name(curr[5].trim()),
            original: [in_lines[0]]
        };
    }
    curr = false;
    curr = in_lines[0].match(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) ([A-z]+) (\(\w+\)) ([A-z0-9 ()/’,-.;']+)/
    );
    //  amount unit (something in parenthasis) name
    //  1 tablespoon (15ml) vegetable oil
    //  1 1/4 cup (60ml) vegetable oil
    if (curr){
        // log_match(curr, 3);      
        ingr = {
            amount: convert_amount(curr[1]), 
            unit: make_singular(curr[2]), 
            name: trim_name(curr[4].trim()),
            original: [in_lines[0]]
        };
    }
    curr = false;
    curr = in_lines[0].match(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) \((\d+[ -]\w+)(|[; ,] \d+\w+)\) ([A-z]+) ([A-z0-9 ()/’,-.;']+)/
    );
    //  1 (14 ounce; 396g) block firm tofu, cut into 1- by 2- by 1/2-inch squares
    //  1 (1-inch) knob ginger, peeled, roughly chopped
    if (curr){
        // log_match(curr, 4); 
        ingr = {
            amount: convert_amount(curr[1]), 
            unit: make_singular(curr[2] + " " + curr[4]), 
            name: trim_name(curr[5].trim()),
            original: [in_lines[0]]
        };
    }
    if (ingr && !ingr.unit.includes("can") && !ingr.unit.includes("block") && !measurements.includes(ingr.unit)) {
        ingr.name = ingr.unit+" "+ingr.name;
        ingr.unit = "whole";
    }
    if (!ingr && in_lines[0]) ingr = {amount: false, unit: false, name: false, original:[in_lines[0]]};
    return [ingr].concat(process_recipe(in_lines.slice(1)));
}

function convert_amount(in_amount) {
        if (in_amount != "string") return in_amount;
        if (in_amount.match(/^[\u00BC-\u00BE\u2150-\u215E]/)){
            return conv_frac[in_amount];
        } else if (in_amount.match(/\d[\u00BC-\u00BE\u2150-\u215E]/)) {
            return parseInt(in_amount.charAt(0)) + conv_frac[in_amount.charAt(1)];
        } else if (in_amount.match(/^\d\/\d/)) {
            return eval(in_amount);
        } else if (in_amount.match(/\d \d\/\d/)) {
            let tmp = in_amount.split(" ");
            return parseInt(tmp[0]) + eval(tmp[1]);
        } else {
            return parseFloat(in_amount);
        }
    }

function trim_name(in_name) {
    let out = in_name.replace(/\(([^\)]+)\)/, "");
    out = (out.indexOf(",") > 0) ? out.substring(0, out.indexOf(",")) : out;
    out = out.trim();
    if (out.indexOf("s") == out.length - 1) out = out.substring(0, out.length - 1);
    return out
}

function log_match(match_arr, loop_num){
    console.log("loop", loop_num);
    let cnt = 0;
    match_arr.forEach(element => {
        console.log(cnt++, element);
    });
}

function make_singular(unit) {
    unit = unit.toLowerCase();
    return (unit.substring(unit.length-1) == "s") ? unit.substring(0, unit.length-1) : unit;
}

function get_multiplier(e){
    let servings_in_recipe = parseFloat(e.target.parentElement.previousElementSibling.previousElementSibling.children[0].getElementsByTagName("input")[0].value);
    let desired_servings = parseFloat(e.target.parentElement.previousElementSibling.previousElementSibling.children[1].getElementsByTagName("input")[0].value);
    return desired_servings / servings_in_recipe;
}

async function fetch_recipe(e){
    const data = new FormData(this);

    const response = await fetch(this.action, {
        method: 'POST',
        body: data
    });

    /** @type {import('@sveltejs/kit').ActionResult} */
    const result = deserialize(await response.text());
    if (result.data.err) {
        alert(result.data.err);
        e.srcElement.value = "";
    } else if (result.type === 'success') {
        result.data.ingredients = process_recipe(result.data.ingredients);
        recipe = result.data;
        dispatch('recipe_edited', {
            items: result.data.ingredients, 
            multiplier: multiplier,
            index: index
        });
        // re-run all `load` functions, following the successful update
        await invalidateAll();
    }
    
    
    // applyAction(result);
}

</script>
<div id="main">
    {#if test_mode}
        <p class="test_btn" on:click|preventDefault={test_process_recipe}>test process_recipe</p>
        {#each Object.entries(tests) as [key, value]}
          <p class="test_btn" on:click|preventDefault={() => {test_process_recipe(event, key)}}>test process_recipe set {key}</p>
        {/each}
    {/if}

    <div id="servings">
        <div class="seperated">
            <label for="recipe_servings">recipe servings</label>
            <input type="number" name="recipe_servings" id="recipe_servings" class="recipe_servings" value={recipe ? recipe.servings : 1} on:input|preventDefault={update_multiplier} on:delete|preventDefault={update_multiplier} min=1>
        </div>
        <div class="seperated">
            <label for="desired_servings">desired servings</label>
            <input type="number" name="desired_servings" id="desired_servings" class="desired_servings" value={recipe ? recipe.servings : 1} on:input|preventDefault={update_multiplier} on:delete|preventDefault={update_multiplier} min=1>
        </div>
    </div>
    <div class="link">
        <form method='POST' on:input|preventDefault={fetch_recipe}>
            <label for="url" class="link_label">Link to recipe</label>
            <input name="url" type="text" class="link_input"/>
        </form>
    </div>
    {#if recipe}
        <EditRecipe {recipe} {index} on:update_recipe={update_recipe}/>
    {:else}
        <div id="title">
            <label for="recipe" id="label">{name}:</label>
            <textarea id="ingr_list_input" cols="30" rows="10" on:input|preventDefault={forward_input} on:delete|preventDefault={forward_input}></textarea>
        </div>
    {/if}
</div>



<style>

    #main {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: auto;
    }

    p {
        border: solid black 2px;
    }

    #servings, .link {
        display: flex;
        margin: auto;
        padding: 5px 0;
    }

    .link {
        width: 70%;
    }

    form {
        width: 100%;
    }

    .link_input {
        width: 100%;
        font-size: 1em;
    }

    #title {
        display: flex;
        margin: auto;
        width: 100%;
        padding: 5px;
        align-content: center;
        justify-content: center;
        /* align-items: center; */
    }

    #label {
        transform: rotate(90deg);
        transform-origin: 0 0;

        /* margin: 10px; */
        position: relative;
        top: 25px;
        left: 50px;
        
    }

    #ingr_list_input {
        /* margin: auto;
        position: relative; */
        width:60%;
    }
    input[type="number"] {
        width: 30px;
    }

    .test_btn {
        width: fit-content;
        cursor: pointer;
        border: 2px solid black;
        background: red;
        color: black;
        margin: 5px;
        border-radius: 8px;
        padding: 5px;
    }
</style>