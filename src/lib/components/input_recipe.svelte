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
            {amount: false, unit: false, name: false, original: ["Yield: 8 to 10 servings"]},
            {amount: false, unit: false, name: false, original: ["For the Frosting"]},
            false,
            {amount: 0.75, unit: "cup", name: "heavy cream", original: ["¾ cup/180 milliliters heavy cream"]},
            {amount: 2, unit: "teaspoon", name: "loose Earl Grey tea", original: ["2 teaspoons loose Earl Grey tea"]},
            {amount: 0.25, unit: "cup", name: "confectioners’ sugar", original: ["¼ cup/30 grams confectioners’ sugar"]},
            {amount: 0.5, unit: "cup", name: "mascarpone or softened cream cheese", original: ["½ cup/115 grams mascarpone or softened cream cheese (see Tip)"]},
            {amount: false, unit: false, name: false, original: ["For the Cake"]},
            false,
            {amount: 0.5, unit: "cup", name: "unsalted butter", original: ["½ cup/115 grams unsalted butter (1 stick), at room temperature, plus more for greasing the pan"]},
            {amount: 1.5, unit: "cup", name: "all-purpose flour", original: ["1½ cups/190 grams all-purpose flour"]},
            {amount: 1, unit: "tablespoon", name: "loose Earl Grey tea", original: ["1 tablespoon loose Earl Grey tea"]},
            {amount: 1, unit: "teaspoon", name: "baking powder", original: ["1 teaspoon baking powder"]},
            {amount: 0.5, unit: "teaspoon", name: "kosher salt", original: ["½ teaspoon kosher salt"]},
            {amount: 1, unit: "cup", name: "granulated sugar", original: ["1 cup/200 grams granulated sugar"]},
            {amount: 2, unit: "teaspoon", name: "freshly grated orange zest", original: ["2 teaspoons freshly grated orange zest (from 1 large orange)"]},
            {amount: 2, unit: "large", name: "egg", original: ["2 large eggs, at room temperature"]},
            {amount: 0.5, unit: "cup", name: "whole milk", original: ["½ cup/120 milliliters whole milk, at room temperature"]},
            {amount: 0.25, unit: "cup", name: "chopped dark chocolate", original: ["¼ cup/45 grams chopped dark chocolate"]},
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
            {amount: 2, unit: "medium", name: "onion", original: ["2 medium onions, divided"]},
            {amount: 0.5, unit: "cup", name: "chopped fresh cilantro leaves and tender stems", original: ["1/2 cup (8g) chopped fresh cilantro leaves and tender stems"]},
            {amount: 3, unit: "pound", name: "boneless pork shoulder", original: ["3 pounds boneless pork shoulder, cut into 2-inch cubes"]},
            {amount: 1, unit: "tablespoon", name: "kosher salt", original: ["1 tablespoon (8g) kosher salt, plus more to taste; for table salt, use half of the volume or an equal amount by weight"]},
            {amount: 1, unit: "medium", name: "orange", original: ["1 medium orange"]},
            {amount: 6, unit: "clove", name: "garlic", original: ["6 cloves garlic, halved, divided"]},
            {amount: 2, unit: "whole", name: "bay leave", original: ["2 bay leaves"]},
            {amount: 1, unit: "whole", name: "cinnamon stick", original: ["1 cinnamon stick, broken into three or four pieces"]},
            {amount: 1.25, unit: "cup", name: "vegetable oil", original: ["1 1/4 cup (60ml) vegetable oil"]},
            {amount: 6, unit: "medium", name: "tomatillo", original: ["6 medium tomatillos (about 1 1/2 pounds, 0.7kg), husks removed and halved"]},
            {amount: 2, unit: "whole", name: "jalapeño pepper", original: ["2 jalapeño peppers, stem removed and halved lengthwise"]},
            {amount: 24, unit: "whole", name: "corn tortilla", original: ["24 corn tortillas"]},
            {amount: 1, unit: "cup", name: "crumbled queso fresco", original: ["1 cup (150g) crumbled queso fresco"]},
            {amount: 3, unit: "whole", name: "lime cut into wedge", original: ["3 limes, cut into wedges"]},
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
            {amount: 1, unit: "14 ounce block", name: "firm tofu", original: ["1 (14 ounce; 396g) block firm tofu, cut into 1- by 2- by 1/2-inch squares"]},
            {amount: 5, unit: "tablespoon", name: "extra-virgin olive oil", original: ["5 tablespoons (75ml) extra-virgin olive oil, divided"]},
            {amount: 0.75, unit: "ounce", name: "za'atar", original: ["3/4 ounce (3 tablespoons; 22g) za'atar, divided"]},
            {amount: 1, unit: "large", name: "grapefruit", original: ["1 large grapefruit (357g; 12.5 ounces), cut into segments, juice reserved separately"]},
            {amount: 2, unit: "tablespoon", name: "tahini", original: ["2 tablespoons (30ml) tahini"]},
            {amount: 1, unit: "tablespoon", name: "white or yellow miso paste", original: ["1 tablespoon (15ml) white or yellow miso paste"]},
            {amount: 1, unit: "tablespoon", name: "juice from 1 lemon", original: ["1 tablespoon (15ml) juice from 1 lemon"]},
            {amount: 1, unit: "teaspoon", name: "honey or agave nectar", original: ["1 teaspoon (5ml) honey or agave nectar"]},
            {amount: false, unit: false, name: false, original: ["Kosher salt and freshly ground black pepper"]},
            {amount: 1, unit: "large", name: "avocado", original: ["1 large avocado, cut into 1/2-inch chunks (about 1/2 cup)"]},
            {amount: 5, unit: "ounce", name: "green", original: ["5 ounces (about 5 cups; 142g) greens, such as baby kale, spinach, or arugula, see note"]},
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
            "Sea salt and freshly ground black pepper"
            ], 
        answer: [
            {amount: false, unit: false, name: false, original: ["FOR THE LEMON PEEL BROTH:"]},
            false,
            {amount: 4, unit: "whole", name: "celery stalks", original: ["4 celery stalks, including leaves"]},
            {amount: 2, unit: "whole", name: "garlic bulb", original: ["2 garlic bulbs, sliced in half horizontally"]},
            {amount: false, unit: false, name: false, original: ["Peels from 4 lemons"]},
            {amount: 2, unit: "teaspoon", name: "sea salt", original: ["2 teaspoons sea salt"]},
            {amount: 1, unit: "teaspoon", name: "black peppercorn", original: ["1 teaspoon black peppercorns"]},
            {amount: 10, unit: "cup", name: "water", original: ["10 cups water"]},
            {amount: false, unit: false, name: false, original: ["FOR THE TORTELLINI SOUP:"]},
            false,
            {amount: 9, unit: "ounce", name: "store-bought tortellini", original: ["9 ounces store-bought tortellini"]},
            {amount: 4, unit: "cup", name: "Lemon Peel Broth", original: ["4 cups Lemon Peel Broth"]},
            {amount: 2, unit: "cup", name: "fresh spinach", original: ["2 cups fresh spinach"]},
            {amount: 1, unit: "cup", name: "frozen pea", original: ["1 cup frozen peas, thawed"]},
            {amount: 1, unit: "tablespoon", name: "fresh lemon juice", original: ["1 tablespoon fresh lemon juice"]},
            {amount: 2, unit: "cup", name: "fresh basil leaves", original: ["2 cups fresh basil leaves"]},
            {amount: false, unit: false, name: false, original: ["Extra-virgin olive oil, for drizzling"]},
            {amount: false, unit: false, name: false, original: ["Pinch of red pepper flakes (optional)"]},
            {amount: false, unit: false, name: false, original: ["Sea salt and freshly ground black pepper"]},
            false
        ]},
        {test: [
            "For the Beef and Marinade:",
            "",
            "3/4 pound beef flank steak, sliced across the grain 1/8 inch thick",
            "1/2 teaspoon soy sauce",
            "1/2 teaspoon Shaoxing wine",
            "2 teaspoons vegetable or canola oil",
            "1/2 teaspoon cornstarch",
            "1/2 teaspoon kosher salt",
            "1/4 teaspoon sugar",
            "1/4 teaspoon ground white pepper",
            "For the Sauce:",
            "",
            "2 tablespoons water",
            "1 teaspoon sesame oil",
            "2 teaspoons oyster sauce",
            "1 teaspoon soy sauce",
            "1 teaspoon cornstarch",
            "For the Stir-Fry:",
            "",
            "1/2 pound Chinese broccoli (gai lan or baby gai lan), cut into 3 sections on the diagonal if regular gai lan or in half on the diagonal if baby gai lan",
            "2 tablespoons vegetable or canola oil, divided",
            "2 whole shallots, sliced",
            "8 cloves of garlic, chopped very coarsely",
            "Cooked white rice, for serving",
            ""
            ], 
        answer: [
            {amount: false, unit: false, name: false, original: ["For the Beef and Marinade:"]},
            false,
            {amount: 0.75, unit: "pound", name: "beef flank steak", original: ["3/4 pound beef flank steak, sliced across the grain 1/8 inch thick"]},
            {amount: 0.5, unit: "teaspoon", name: "soy sauce", original: ["1/2 teaspoon soy sauce"]},
            {amount: 0.5, unit: "teaspoon", name: "Shaoxing wine", original: ["1/2 teaspoon Shaoxing wine"]},
            {amount: 2, unit: "teaspoon", name: "vegetable or canola oil", original: ["2 teaspoons vegetable or canola oil"]},
            {amount: 0.5, unit: "teaspoon", name: "cornstarch", original: ["1/2 teaspoon cornstarch"]},
            {amount: 0.5, unit: "teaspoon", name: "kosher salt", original: ["1/2 teaspoon kosher salt"]},
            {amount: 0.25, unit: "teaspoon", name: "sugar", original: ["1/4 teaspoon sugar"]},
            {amount: 0.25, unit: "teaspoon", name: "ground white pepper", original: ["1/4 teaspoon ground white pepper"]},
            {amount: false, unit: false, name: false, original: ["For the Sauce:"]},
            false,
            {amount: 2, unit: "tablespoon", name: "water", original: ["2 tablespoons water"]},
            {amount: 1, unit: "teaspoon", name: "sesame oil", original: ["1 teaspoon sesame oil"]},
            {amount: 2, unit: "teaspoon", name: "oyster sauce", original: ["2 teaspoons oyster sauce"]},
            {amount: 1, unit: "teaspoon", name: "soy sauce", original: ["1 teaspoon soy sauce"]},
            {amount: 1, unit: "teaspoon", name: "cornstarch", original: ["1 teaspoon cornstarch"]},
            {amount: false, unit: false, name: false, original: ["For the Stir-Fry:"]},
            false,
            {amount: 0.5, unit: "pound", name: "Chinese broccoli", original: ["1/2 pound Chinese broccoli (gai lan or baby gai lan), cut into 3 sections on the diagonal if regular gai lan or in half on the diagonal if baby gai lan"]},
            {amount: 2, unit: "tablespoon", name: "vegetable or canola oil", original: ["2 tablespoons vegetable or canola oil, divided"]},
            {amount: 2, unit: "whole", name: "shallots", original: ["2 whole shallots, sliced"]},
            {amount: 8, unit: "clove", name: "of garlic", original: ["8 cloves of garlic, chopped very coarsely"]},
            {amount: false, unit: false, name: false, original: ["Cooked white rice, for serving"]},
            false,
            false
        ]},
        {test: [
            "4 medium cloves garlic, roughly chopped",
            "1 (1-inch) knob ginger, peeled, roughly chopped",
            "1 to 6 green Thai chiles (to taste), roughly chopped",
            "2 tablespoons (30ml) juice from 1 lemon, divided",
            "Kosher salt",
            "2 tablespoons (30ml) vegetable oil or ghee",
            "2 teaspoons (8g) black mustard seeds",
            "1 teaspoon (4g) whole cumin seeds",
            "1 large onion, finely diced (about 1 1/2 cups; 300g)",
            "1/4 teaspoon (1g) baking soda",
            "2 teaspoons (8g) ground coriander",
            "1/2 teaspoon (2g) freshly ground black pepper",
            "1/2 teaspoon (2g) ground turmeric",
            "1 1/2 teaspoons (6g) store-bought or homemade garam masala, divided",
            "1 (14-ounce) can whole peeled tomatoes",
            "2 (14-ounce) cans chickpeas, drained and rinsed",
            "1 cup cilantro leaves, roughly chopped (1 ounce; 25g)",
            ""
            ], 
        answer: [
            {amount: 4, unit: "medium", name: "cloves garlic", original: ["4 medium cloves garlic, roughly chopped"]},
            {amount: 1, unit: "whole", name: "1-inch knob ginger", original: ["1 (1-inch) knob ginger, peeled, roughly chopped"]},
            {amount: 1, unit: "whole", name: "to 6 green Thai chile", original: ["1 to 6 green Thai chiles (to taste), roughly chopped"]},
            {amount: 2, unit: "tablespoon", name: "juice from 1 lemon", original: ["2 tablespoons (30ml) juice from 1 lemon, divided"]},
            {amount: false, unit: false, name: false, original: ["Kosher salt"]},
            {amount: 2, unit: "tablespoon", name: "vegetable oil or ghee", original: ["2 tablespoons (30ml) vegetable oil or ghee"]},
            {amount: 2, unit: "teaspoon", name: "black mustard seeds", original: ["2 teaspoons (8g) black mustard seeds"]},
            {amount: 1, unit: "teaspoon", name: "whole cumin seeds", original: ["1 teaspoon (4g) whole cumin seeds"]},
            {amount: 1, unit: "large", name: "onion", original: ["1 large onion, finely diced (about 1 1/2 cups; 300g)"]},
            {amount: 0.25, unit: "teaspoon", name: "baking soda", original: ["1/4 teaspoon (1g) baking soda"]},
            {amount: 2, unit: "teaspoon", name: "ground coriander", original: ["2 teaspoons (8g) ground coriander"]},
            {amount: 0.5, unit: "teaspoon", name: "freshly ground black pepper", original: ["1/2 teaspoon (2g) freshly ground black pepper"]},
            {amount: 0.5, unit: "teaspoon", name: "ground turmeric", original: ["1/2 teaspoon (2g) ground turmeric"]},
            {amount: 1.5, unit: "teaspoon", name: "store-bought or homemade garam masala", original: ["1 1/2 teaspoons (6g) store-bought or homemade garam masala, divided"]},
            {amount: 1, unit: "14-ounce can", name: "whole peeled tomatoe", original: ["1 (14-ounce) can whole peeled tomatoes"]},
            {amount: 2, unit: "14-ounce can", name: "chickpea", original: ["2 (14-ounce) cans chickpeas, drained and rinsed"]},
            {amount: 1, unit: "cup", name: "cilantro leave", original: ["1 cup cilantro leaves, roughly chopped (1 ounce; 25g)"]},
            false,
            false
        ]}
];



function forward_input(e) {
    multiplier = get_multiplier(e);
    let items = process_recipe(e.srcElement.value.split("\n"));
	dispatch('recipe_edited', {
        items: items, 
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
    if (in_amount.match(/^[\u00BC-\u00BE\u2150-\u215E]/)){
        return conv_frac[in_amount] * multiplier;
    } else if (in_amount.match(/\d[\u00BC-\u00BE\u2150-\u215E]/)) {
        return (parseInt(in_amount.charAt(0)) + conv_frac[in_amount.charAt(1)]) * multiplier;
    } else if (in_amount.match(/^\d\/\d/)) {
        return eval(in_amount) * multiplier;
    } else if (in_amount.match(/\d \d\/\d/)) {
        let tmp = in_amount.split(" ");
        return parseInt(tmp[0]) + eval(tmp[1]) * multiplier;
    } else {
        return parseFloat(in_amount) * multiplier;
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
            let ans_len = answer.length;
            let test_ans_len = curr['answer'].length;
            if (ans_len != test_ans_len) console.log("test "+i+" lengths do not match", (ans_len - test_ans_len));
            for (let j = 0; j < ans_len; j++){
                if (answer[j].amount !== curr['answer'][j].amount) console.log("test "+i+" amounts do not match", `answer[j].amount -> ${answer[j].amount} | curr['answer']${j}.amount -> ${curr['answer'][j].amount}`);
                if (answer[j].unjt !== curr['answer'][j].unjt) console.log("test "+i+" unjts do not match", `answer[j].unjt -> ${answer[j].unjt} | curr['answer'][${j}].unjt -> ${curr['answer'][j].unjt}`);
                if (answer[j].name !== curr['answer'][j].name) console.log("test "+i+" names do not match", `answer[j].name -> ${answer[j].name} | curr['answer']${j}.name -> ${curr['answer'][j].name}`);
            }
            console.log("test "+i, (JSON.stringify(answer) === JSON.stringify(curr['answer'])));
            i++;
        });
    } else {
        let answer = process_recipe(tests[test_to_run]['test']);
        // console.log("answer", answer);
        console.log("test "+test_to_run, (JSON.stringify(answer) === JSON.stringify(tests[test_to_run]['answer'])));
    }
    
}

function make_singular(unit) {
    unit = unit.toLowerCase();
    return (unit.substring(unit.length-1) == "s") ? unit.substring(0, unit.length-1) : unit;
}

function get_multiplier(e){
    console.log(e.target.parentElement.previousElementSibling.previousElementSibling.children[0]);
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
        //todo fix multiplier
        // multiplier = get_multiplier(e);
        result.data.ingredients = process_recipe(result.data.ingredients);
        recipe = result.data;
        dispatch('recipe_edited', {
            items: result.data.ingredients, 
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
            <input type="number" name="recipe_servings" id="recipe_servings" class="recipe_servings" value={recipe ? recipe.servings : 1} on:input|preventDefault={forward_input} on:delete|preventDefault={forward_input} min=1>
        </div>
        <div class="seperated">
            <label for="desired_servings">desired servings</label>
            <input type="number" name="desired_servings" id="desired_servings" class="desired_servings" value={recipe ? recipe.servings : 1} on:input|preventDefault={forward_input} on:delete|preventDefault={forward_input} min=1>
        </div>
    </div>
    <div class="link">
        <form method='POST' on:input|preventDefault={fetch_recipe}>
            <label for="url" class="link_label">Link to recipe</label>
            <input name="url" type="text" class="link_input"/>
        </form>
    </div>
    {#if recipe}
        <EditRecipe {recipe}/>
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