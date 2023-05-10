<script>
    import { construct_svelte_component, get_store_value } from "svelte/internal";
    import { createEventDispatcher } from 'svelte';
    import Recipe from "/src/lib/components/recipe.svelte";
    import GroceryList from "/src/lib/components/grocery_list.svelte";

    let grocery_list = [];
    let skipped = [];
    let modes = ["Freestyle", "Weekly Grocery Run"];
    let conversions = {"tablespoon/teaspoon": 1/3, "teaspoon/tablespoon": 3, "cup/teaspoon": 1/48, "teaspoon/cup": 48, "cup/tablespoon": 1/16, "tablespoon/cup": 16};
    let curr_mode = modes[2];
    $: input_count = 2;
    let recipe_items = [];


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
                {"amount":"¾","unit":"cup","name":"heavy cream"},
                {"amount":"2","unit":"teaspoon","name":"loose Earl Grey tea"},
                {"amount":"¼","unit":"cup","name":"confectioners’ sugar"},
                {"amount":"½","unit":"cup","name":"mascarpone or softened cream cheese (see Tip)"},
                false,
                false,
                {"amount":"½","unit":"cup","name":"unsalted butter (1 stick), at room temperature, plus more for greasing the pan"},
                {"amount":"1½","unit":"cup","name":"all-purpose flour"},
                {"amount":"1","unit":"tablespoon","name":"loose Earl Grey tea"},
                {"amount":"1","unit":"teaspoon","name":"baking powder"},
                {"amount":"½","unit":"teaspoon","name":"kosher salt"},
                {"amount":"1","unit":"cup","name":"granulated sugar"},
                {"amount":"2","unit":"teaspoon","name":"freshly grated orange zest (from 1 large orange)"},
                {"amount":"2","unit":"large","name":"eggs, at room temperature"},
                {"amount":"½","unit":"cup","name":"whole milk, at room temperature"},
                {"amount":"¼","unit":"cup","name":"chopped dark chocolate"},
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
                "1/4 cup (60ml) vegetable oil",
                "6 medium tomatillos (about 1 1/2 pounds, 0.7kg), husks removed and halved",
                "2 jalapeño peppers, stem removed and halved lengthwise",
                "24 corn tortillas",
                "1 cup (150g) crumbled queso fresco",
                "3 limes, cut into wedges"
                ], 
            answer: [
                {"amount":"2","unit":"medium","name":"onions, divided"},
                {"amount":"1/2","unit":"cup","name":"chopped fresh cilantro leaves and tender stems"},
                {"amount":"3","unit":"pound","name":"boneless pork shoulder, cut into 2-inch cubes"},
                {"amount":"1","unit":"tablespoon","name":"kosher salt, plus more to taste; for table salt, use half of the volume or an equal amount by weight"},
                {"amount":"1","unit":"medium","name":"orange"},
                {"amount":"6","unit":"clove","name":"garlic, halved, divided"},
                {"amount":"2","unit":"whole","name":"bay leaves"},
                {"amount":"1","unit":"whole","name":"cinnamon stick, broken into three or four pieces"},
                {"amount":"1/4","unit":"cup","name":"vegetable oil"},
                {"amount":"6","unit":"medium","name":"tomatillos (about 1 1/2 pounds, 0.7kg), husks removed and halved"},
                {"amount":"2","unit":"whole","name":"jalapeño peppers, stem removed and halved lengthwise"},
                {"amount":"24","unit":"whole","name":"corn tortillas"},
                {"amount":"1","unit":"cup","name":"crumbled queso fresco"},
                {"amount":"3","unit":"whole","name":"lime cut into wedges"},
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
                {amount: "5", unit: "tablespoon", name: "extra-virgin olive oil, divided"},
                {amount: "3/4", unit: "ounce", name: "(3 tablespoons; 22g) za'atar, divided"},
                {amount: "1", unit: "large", name: "grapefruit (357g; 12.5 ounces), cut into segments, juice reserved separately"},
                {amount: "2", unit: "tablespoon", name: "tahini"},
                {amount: "1", unit: "tablespoon", name: "white or yellow miso paste"},
                {amount: "1", unit: "tablespoon", name: "juice from 1 lemon"},
                {amount: "1", unit: "teaspoon", name: "honey or agave nectar"},
                false,
                {amount: "1", unit: "large", name: "avocado, cut into 1/2-inch chunks (about 1/2 cup)"},
                {amount: "5", unit: "ounce", name: "(about 5 cups; 142g) greens, such as baby kale, spinach, or arugula, see note"},
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
                {amount: "4", unit: "whole", name: "celery stalks, including leaves"},
                {amount: "2", unit: "whole", name: "garlic bulbs, sliced in half horizontally"},
                false,
                {amount: "2", unit: "teaspoon", name: "sea salt"},
                {amount: "1", unit: "teaspoon", name: "black peppercorns"},
                {amount: "10", unit: "cup", name: "water"},
                false,
                false,
                {amount: "9", unit: "ounce", name: "store-bought tortellini"},
                {amount: "4", unit: "cup", name: "Lemon Peel Broth"},
                {amount: "2", unit: "cup", name: "fresh spinach"},
                {amount: "1", unit: "cup", name: "frozen peas, thawed"},
                {amount: "1", unit: "tablespoon", name: "fresh lemon juice"},
                {amount: "2", unit: "cup", name: "fresh basil leaves"},
                false,
                false,
                false,
                false
            ]}
    ];
    
    function update_list(e) {
        recipe_items[e.detail.index] = e.detail.items;
        merge();
    }

    function merge() {
        grocery_list = [];
        recipe_items.forEach(recipe => {
            recipe.forEach(item => {
                if (!item) return;
                let match = false;
                if (grocery_list) {
                    grocery_list.forEach(element => {
                        if (element.name === item.name || element.name.includes(item.name) || item.name.includes(element.name)){
                            match = element;
                            return;
                        }
                    });
                }
                // let match = grocery_list.find( i => i.name === item.name || i.name.contains(item.name) || item.name.contains(i.name));
                if (match && (["small", "medium", "large"].includes(match.unit) ^ ["small", "medium", "large"].includes(match.unit))) {
                    let tmp = { amount: 0, unit: "", name: "" };
                    if (match.unit != item.unit) {
                        let conv = combine(match, item);
                        tmp.amount = conv.amount;
                        tmp.unit = conv.unit;
                    } else {
                        tmp.amount = match.amount + item.amount;
                        tmp.unit = match.unit;
                    }
                    if (match.name != item.name){
                        tmp.name = match.name+" and/or "+item.name;
                    }else {
                        tmp.name = match.name;
                    }
                    grocery_list.splice(grocery_list.indexOf(match), 1);
                    grocery_list.push(tmp);
                }else {
                    grocery_list.push(item);
                }
            });
        });

    }

    const combine = (i, j) => {
        let conv_index_a = `${j.unit}/${i.unit}`;
        let conv_index_b = `${i.unit}/${j.unit}`;
        let amount = null;
        let unit = null;
        if (conversions[conv_index_a] < conversions[conv_index_b]){
            unit = j.unit;
            amount = conversions[conv_index_a] * i.amount + j.amount;
        }else {
            unit = i.unit;
            amount = conversions[conv_index_b] * j.amount + i.amount;
        }
        return {unit: unit, amount: amount};
    }

    function test() {

    }
</script>


<div id="main">
    <h1>Prep Page</h1>
    <p on:click={test}>test 1</p>
    <div id="content">
        <div id="recipes">
            {#each Array(input_count) as _, index (index)}
                <Recipe name="Recipe {index}" on:recipe_edited={update_list} {index}/>
            {/each}
        </div>
        <div id="right_column">
            <GroceryList {grocery_list}/>
        </div>
    </div>
</div>










<style>
#content {
    border: 1px solid blue;
    margin: 5px;
    display: flex;
}
#recipes {
    border: 1px solid black;
    margin: 5px;
    width: 50%;

}
#right_column {
    border: 1px solid green;
    margin: 5px;
    width: 50%;

}
</style>