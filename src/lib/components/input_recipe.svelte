<script>
export let name;
export let index;
import { createEventDispatcher } from 'svelte';
import { invalidateAll} from '$app/navigation';
import { deserialize } from '$app/forms';
import EditRecipe from "/src/lib/components/edit_recipe.svelte";

const dispatch = createEventDispatcher();
let recipe;
const measurements = ["teaspoon", "cup", "tablespoon", "pound", "gram", "g", "large", "medium", "small", "clove", "whole", "ounce", "pint", "inch", "ear"];
let multiplier = 1;

const conv_frac = {"¼": .25, "½": .5, "¾": .75, "⅐": .142857, "⅑": .111111, "⅒": .1, "⅓": .333333, "⅔": .666667, "⅕": .2, 
                    "⅖": .4, "⅗": .6, "⅘": .8, "⅙": .166667, "⅚": .833333, "⅛": .125, "⅜": .375, "⅝": .625, "⅞": .875};

const reg_exp = {replace: {
                    "$2": /^(\*)([A-z0-9 ()/’,-.ñ;è'\t]+)/,
                    "$1 $2": /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d+)([A-z|(])/,
                    "": /about/i,
                    "$2 $3": /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d+) to (\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d+)([A-z|(])/
                }, 
                match: [
                    //  6 medium tomatillos (about 1 1/2 pounds, 0.7kg), husks removed and halved
                    //  1 medium onion, thinly sliced (about 6 ounces; 170g)
                    {exp:/^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d+|\d\/\d|\d \d\/\d) ([A-zñ]+)(.*)/, amnt: 1, unit: 2, name: 3},
                    //  1 cup/200 grams granulated sugar
                    //  ¼ cup/30 grams confectioners’ sugar
                    {exp:/^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) ([A-z]+)\/(\d+) ([A-z]+) (.*)/, amnt: 1, unit: 2, name: 5},
                    //  amount unit (something in parenthasis) name
                    //  1 tablespoon (15ml) vegetable oil
                    //  1 1/4 cup (60ml) vegetable oil
                    {exp:/^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) ([A-z]+) (\(\w+\)) (.*)/, amnt: 1, unit: 2, name: 4},
                    //  1 (14 ounce; 396g) block firm tofu, cut into 1- by 2- by 1/2-inch squares
                    //  1 (1-inch) knob ginger, peeled, roughly chopped
                    {exp:/^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) \((\d+)[ -](\w+)(|[; ,] \d+\w+)\) ([A-z]+) (.*)/, amnt: [1,2], unit: 3, name: [5,6]},
                ]};



function forward_input(e) {
    let items = process_recipe(e.srcElement.value.split("\n"));
	dispatch('recipe_edited', {
        items: items, 
        multiplier: multiplier,
        index: index
    });
}

function update_recipe(e){
    recipe = e.detail.recipe;
    multiplier = e.detail.multiplier;
    dispatch('recipe_edited', {
        items: recipe.ingredients, 
        multiplier: multiplier,
        index: index
    });
}



function process_recipe(in_lines) {
    for (let key in reg_exp.replace){
        in_lines[0] = in_lines[0].replace(reg_exp.replace[key],key).trim();
    }  

    let ingr = false;
    let cnt = 0
    for (let match of reg_exp.match){
        let curr = in_lines[0].match(match.exp);
        if (curr){
            // log_match(curr, cnt);
            let amount;
            let name;
            if (typeof match.amnt == "number") amount = curr[match.amnt];
            else amount = curr[match.amnt[0]] * curr[match.amnt[1]];
            
            if (typeof match.name == "number") name = curr[match.name];
            else name = curr[match.name[0]] + " " + curr[match.name[1]];

            ingr = {
                    amount: convert_amount(amount), 
                    unit: make_singular(curr[match.unit]), 
                    name: trim_name(name.trim()),
                    original: [in_lines[0]]
            };
        }
        curr = false;
        cnt++;
    }

    if (ingr && !ingr.unit.includes("can") && !ingr.unit.includes("block") && !measurements.includes(ingr.unit)) {
        ingr.name = ingr.unit+" "+ingr.name;
        ingr.unit = "whole";
    }

    if (!ingr && in_lines[0]) ingr = {amount: false, unit: false, name: in_lines[0], original:[in_lines[0]]};

    if (in_lines.slice(1).length) return [ingr].concat(process_recipe(in_lines.slice(1)));
    else return ingr;
}

function convert_amount(in_amount) {
    let result = 0;
        if (typeof in_amount != "string") return in_amount;
        if (in_amount.match(/^[\u00BC-\u00BE\u2150-\u215E]/)){
            result = conv_frac[in_amount];
        } else if (in_amount.match(/\d[\u00BC-\u00BE\u2150-\u215E]/)) {
            result = parseInt(in_amount.charAt(0)) + conv_frac[in_amount.charAt(1)];
        } else if (in_amount.match(/^\d\/\d/)) {
            result = eval(in_amount);
        } else if (in_amount.match(/\d \d\/\d/)) {
            let tmp = in_amount.split(" ");
            result = parseInt(tmp[0]) + eval(tmp[1]);
        } else {
            result = parseFloat(in_amount);
        }
        return Math.round((result + Number.EPSILON) * 100) / 100
    }

function trim_name(in_name) {
    let out = in_name.replace(/\(([^\)]+)\)/, "");
    // out = (out.indexOf(",") > 0) ? out.substring(0, out.indexOf(",")) : out;
    out = out.trim();
    // if (out.indexOf("s") == out.length - 1) out = out.substring(0, out.length - 1);
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
        result.data.url = e.srcElement.value;
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
<div id="main" class="flex flex-col">
    
    {#if recipe}
        <EditRecipe {recipe} {index} on:update_recipe={update_recipe}/>
    {:else}
        <div class="link">
            <form method='POST' on:input|preventDefault={fetch_recipe}>
                <input placeholder="Link to recipe" name="url" type="text" class="input input-bordered input-xs w-full text-center input-accent"/>
            </form>
        </div>
        <div class="divider">OR</div>
        <div class="flex justify-center">
            <textarea id="ingr_list_input" cols="60" rows="10" class="textarea textarea-primary" placeholder="Paste ingredient list here" on:input|preventDefault={forward_input} on:delete|preventDefault={forward_input}></textarea>
        </div>
    {/if}
</div>


