<script>
export let name;
export let index;
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
// const number_match = /(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d)/;
const test_mode = false;
const measurements = ["teaspoon", "cup", "tablespoon", "pound", "gram", "g", "large", "medium", "small", "clove", "whole", "ounce"];

const conv_frac = {"¼": .25, "½": .5, "¾": .75, "⅐": .142857, "⅑": .111111, "⅒": .1, "⅓": .333333, "⅔": .666667, "⅕": .2, 
                    "⅖": .4, "⅗": .6, "⅘": .8, "⅙": .166667, "⅚": .833333, "⅛": .125, "⅜": .375, "⅝": .625, "⅞": .875};

const tests = [
    {test: [
            "Yield: 8 to 10 servings",
            "For the Frosting",
            "",
            "¾cup/180 milliliters heavy cream",
            "2teaspoons loose Earl Grey tea",
            "¼cup/30 grams confectioners’ sugar",
            "½cup/115 grams mascarpone or softened cream cheese (see Tip)",
            "For the Cake",
            "",
            "½cup/115 grams unsalted butter (1 stick), at room temperature, plus more for greasing the pan",
            "1½cups/190 grams all-purpose flour",
            "1tablespoon loose Earl Grey tea",
            "1teaspoon baking powder",
            "½teaspoon kosher salt",
            "1cup/200 grams granulated sugar",
            "2teaspoons freshly grated orange zest (from 1 large orange)",
            "2large eggs, at room temperature",
            "½cup/120 milliliters whole milk, at room temperature",
            "¼cup/45 grams chopped dark chocolate"
            ], 
        answer: [
            false,
            false,
            false,
            {"amount":.75,"unit":"cup","name":"heavy cream"},
            {"amount":2,"unit":"teaspoon","name":"loose Earl Grey tea"},
            {"amount":.25,"unit":"cup","name":"confectioners’ sugar"},
            {"amount":.5,"unit":"cup","name":"mascarpone or softened cream cheese"},
            false,
            false,
            {"amount":.5,"unit":"cup","name":"unsalted butter"},
            {"amount":1.5,"unit":"cup","name":"all-purpose flour"},
            {"amount":1,"unit":"tablespoon","name":"loose Earl Grey tea"},
            {"amount":1,"unit":"teaspoon","name":"baking powder"},
            {"amount":.5,"unit":"teaspoon","name":"kosher salt"},
            {"amount":1,"unit":"cup","name":"granulated sugar"},
            {"amount":2,"unit":"teaspoon","name":"freshly grated orange zest"},
            {"amount":2,"unit":"large","name":"eggs"},
            {"amount":.5,"unit":"cup","name":"whole milk"},
            {"amount":.25,"unit":"cup","name":"chopped dark chocolate"},
            false
    ]},
    {test: [
            "2 medium onions, divided",
            "1/2 cup (8g) chopped fresh cilantro leaves and tender stems",
            "3 pounds boneless pork shoulder, cut into 2-inch cubes",
            "1 tablespoon (8g) kosher salt, plus more to taste; for table salt, use half of the volume or an equal amount by weight",
            "1 medium orange",
            "6 cloves garlic, halved, divided",
            "2 bay leaves",
            "1 cinnamon stick, broken into three or four pieces",
            "1 1/4 cup (60ml) vegetable oil",
            "6 medium tomatillos (about 1 1/2 pounds, 0.7kg), husks removed and halved",
            "2 jalapeño peppers, stem removed and halved lengthwise",
            "24 corn tortillas",
            "1 cup (150g) crumbled queso fresco",
            "3 limes, cut into wedges"
            ], 
        answer: [
            {"amount":2,"unit":"medium","name":"onions"},
            {"amount":.5,"unit":"cup","name":"chopped fresh cilantro leaves and tender stems"},
            {"amount":3,"unit":"pound","name":"boneless pork shoulder"},
            {"amount":1,"unit":"tablespoon","name":"kosher salt"},
            {"amount":1,"unit":"medium","name":"orange"},
            {"amount":6,"unit":"clove","name":"garlic"},
            {"amount":2,"unit":"whole","name":"bay leaves"},
            {"amount":1,"unit":"whole","name":"cinnamon stick"},
            {"amount":1.25,"unit":"cup","name":"vegetable oil"},
            {"amount":6,"unit":"medium","name":"tomatillos"},
            {"amount":2,"unit":"whole","name":"jalapeño peppers"},
            {"amount":24,"unit":"whole","name":"corn tortillas"},
            {"amount":1,"unit":"cup","name":"crumbled queso fresco"},
            {"amount":3,"unit":"whole","name":"lime cut into wedges"},
            false
    ]},
    {test: [
            "1 (14 ounce; 396g) block firm tofu, cut into 1- by 2- by 1/2-inch squares",
            "5 tablespoons (75ml) extra-virgin olive oil, divided",
            "3/4 ounce (3 tablespoons; 22g) za'atar, divided",
            "1 large grapefruit (357g; 12.5 ounces), cut into segments, juice reserved separately",
            "2 tablespoons (30ml) tahini",
            "1 tablespoon (15ml) white or yellow miso paste",
            "1 tablespoon (15ml) juice from 1 lemon",
            "1 teaspoon (5ml) honey or agave nectar",
            "Kosher salt and freshly ground black pepper",
            "1 large avocado, cut into 1/2-inch chunks (about 1/2 cup)",
            "5 ounces (about 5 cups; 142g) greens, such as baby kale, spinach, or arugula, see note"
            ], 
        answer: [
            false,
            {amount: 5, unit: "tablespoon", name: "extra-virgin olive oil"},
            {amount: .75, unit: "ounce", name: "za'atar"},
            {amount: 1, unit: "large", name: "grapefruit"},
            {amount: 2, unit: "tablespoon", name: "tahini"},
            {amount: 1, unit: "tablespoon", name: "white or yellow miso paste"},
            {amount: 1, unit: "tablespoon", name: "juice from 1 lemon"},
            {amount: 1, unit: "teaspoon", name: "honey or agave nectar"},
            false,
            {amount: 1, unit: "large", name: "avocado"},
            {amount: 5, unit: "ounce", name: "greens"},
            false
    ]},
    {test: [
            "FOR THE LEMON PEEL BROTH:",
            "",
            "4 celery stalks, including leaves",
            "2 garlic bulbs, sliced in half horizontally",
            "Peels from 4 lemons",
            "2 teaspoons sea salt",
            "1 teaspoon black peppercorns",
            "10 cups water",
            "FOR THE TORTELLINI SOUP:",
            "",
            "9 ounces store-bought tortellini",
            "4 cups Lemon Peel Broth",
            "2 cups fresh spinach",
            "1 cup frozen peas, thawed",
            "1 tablespoon fresh lemon juice",
            "2 cups fresh basil leaves",
            "Extra-virgin olive oil, for drizzling",
            "Pinch of red pepper flakes (optional)",
            "Sea salt and freshly ground black pepper",
            ], 
        answer: [
            false,
            false,
            {amount: 4, unit: "whole", name: "celery stalks"},
            {amount: 2, unit: "whole", name: "garlic bulbs"},
            false,
            {amount: 2, unit: "teaspoon", name: "sea salt"},
            {amount: 1, unit: "teaspoon", name: "black peppercorns"},
            {amount: 10, unit: "cup", name: "water"},
            false,
            false,
            {amount: 9, unit: "ounce", name: "store-bought tortellini"},
            {amount: 4, unit: "cup", name: "Lemon Peel Broth"},
            {amount: 2, unit: "cup", name: "fresh spinach"},
            {amount: 1, unit: "cup", name: "frozen peas"},
            {amount: 1, unit: "tablespoon", name: "fresh lemon juice"},
            {amount: 2, unit: "cup", name: "fresh basil leaves"},
            false,
            false,
            false,
            false
        ]}
];



function forward_input(e) {
    let items = process_recipe(e.data.split("\n"));
	dispatch('recipe_edited', {
        items: items, 
        index: index
    });
}

function process_recipe(in_lines) {
    if (in_lines[0] == null) return false;

    in_lines[0] = in_lines[0].replace(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d)([A-z])/,
        "$1 $2"
    );
    
    let ingr = false;
    
    let curr = in_lines[0].match(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d+|\d\/\d|\d \d\/\d) ([A-zñ]+)[, | ]([A-z0-9 ()/’,-.ñ;']+)/ 
    );
    if (curr){
        // log_match(curr, 1);
        ingr = {
                amount: convert_amount(curr[1]), 
                unit: make_singular(curr[2]), 
                name: trim_name(curr[3].trim())
        };
    }
    curr = false;
    curr = in_lines[0].match(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) ([A-z]+)\/(\d+) ([A-z]+) ([A-z0-9 ()/’,-.;']+)/
    );
    if (curr){
        // log_match(curr, 2);      
        ingr = {
            amount: convert_amount(curr[1]), 
            unit: make_singular(curr[2]), 
            name: trim_name(curr[5].trim())
        };
    }
    curr = false;
    curr = in_lines[0].match(
        /^(\d[\u00BC-\u00BE\u2150-\u215E]|[\u00BC-\u00BE\u2150-\u215E]|\d|\d\/\d|\d \d\/\d) ([A-z]+) (\(\w+\)) ([A-z0-9 ()/’,-.;']+)/
    );
    if (curr){
        // log_match(curr, 3);      
        ingr = {
            amount: convert_amount(curr[1]), 
            unit: make_singular(curr[2]), 
            name: trim_name(curr[4].trim())
        };
    }
    if (ingr && measurements.includes(ingr.unit)) {
        ingr.unit = ingr.unit;
    }else if (ingr) {
        ingr.name = ingr.unit+" "+ingr.name;
        ingr.unit = "whole";
    }
    return [ingr].concat(process_recipe(in_lines.slice(1)));
}

function convert_amount(in_amount) {
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

function test_process_recipe(event, test_to_run = -1){
    if (test_to_run == -1){
        
        let i = 0;
        tests.forEach(curr => {
            let answer = process_recipe(curr['test']);

            console.log("test "+i, (JSON.stringify(answer) === JSON.stringify(curr['answer'])));
            i++;
        });
    } else {
        let answer = process_recipe(tests[test_to_run]['test']);
        console.log("test "+test_to_run, (JSON.stringify(answer) === JSON.stringify(tests[test_to_run]['answer'])));
    }
    
}

function make_singular(unit) {
    unit = unit.toLowerCase();
    return (unit.substring(unit.length-1) == "s") ? unit.substring(0, unit.length-1) : unit;
}
</script>
<div id="main">
    {#if test_mode}
        <p on:click|preventDefault={test_process_recipe}>test process_recipe</p>
        {#each Object.entries(tests) as [key, value]}
            <p on:click|preventDefault={() => {test_process_recipe(event, key)}}>test process_recipe set {key}</p>
        {/each}
    {/if}


    <div id="servings">
        <div class="seperated">
            <label for="recipe_servings">recipe servings</label>
            <input type="number" name="recipe_servings" id="recipe_servings" class="recipe_servings" value=1 on:input|preventDefault={forward_input} min=1>
        </div>
        <div class="seperated">
            <label for="desired_servings">desired servings</label>
            <input type="number" name="desired_servings" id="desired_servings" class="desired_servings" value=1 on:input|preventDefault={forward_input} min=1>
        </div>
    </div>
    <div id="title">
        <label for="recipe" id="label">{name}:</label>
        <textarea id="recipe" cols="30" rows="10" on:input|preventDefault={forward_input}></textarea>
    </div>
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

#servings {
    display: flex;
    margin: auto;
    padding: 5px 0;
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

#recipe {
    /* margin: auto;
    position: relative; */
    width:60%;
}
input[type="number"] {
    width: 30px;
}

</style>