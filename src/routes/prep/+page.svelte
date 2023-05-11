<script>
    import { construct_svelte_component, get_store_value } from "svelte/internal";
    import { createEventDispatcher } from 'svelte';
    import Recipe from "/src/lib/components/recipe.svelte";
    import GroceryList from "/src/lib/components/grocery_list.svelte";

    let grocery_list = [];
    let skipped = [];
    // let modes = ["Freestyle", "Weekly Grocery Run"];
    let conversions = {"tablespoon/teaspoon": 1/3, "teaspoon/tablespoon": 3, "cup/teaspoon": 1/48, "teaspoon/cup": 48, "cup/tablespoon": 1/16, "tablespoon/cup": 16};
    // let curr_mode = modes[2];
    $: input_count = 2;
    let recipe_items = [];


    const tests = [
        {test: [[
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
                ],[
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
                ],[
                        {amount: false, unit: false, name: false, original: ["1 (14 ounce; 396g) block firm tofu, cut into 1- by 2- by 1/2-inch squares"]},
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
                ],[
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
                    ]], 
            answer: [
                {amount: 0.75, unit: "cup", name: "heavy cream", original: ["¾ cup/180 milliliters heavy cream"]},
                {amount: 0.25, unit: "cup", name: "confectioners’ sugar", original: ["¼ cup/30 grams confectioners’ sugar"]},
                {amount: 0.5, unit: "cup", name: "mascarpone or softened cream cheese", original: ["½ cup/115 grams mascarpone or softened cream cheese (see Tip)"]},
                {amount: 0.5, unit: "cup", name: "unsalted butter", original: ["½ cup/115 grams unsalted butter (1 stick), at room temperature, plus more for greasing the pan"]},
                {amount: 1.5, unit: "cup", name: "all-purpose flour", original: ["1½ cups/190 grams all-purpose flour"]},
                {amount: 1.6666666666666665, unit: "tablespoon", name: "loose Earl Grey tea", original: Array},
                {amount: 1, unit: "teaspoon", name: "baking powder", original: ["1 teaspoon baking powder"]},
                {amount: 1, unit: "cup", name: "granulated sugar", original: ["1 cup/200 grams granulated sugar"]},
                {amount: 2, unit: "teaspoon", name: "freshly grated orange zest", original: ["2 teaspoons freshly grated orange zest (from 1 large orange)"]},
                {amount: 2, unit: "large", name: "egg", original: ["2 large eggs, at room temperature"]},
                {amount: 0.5, unit: "cup", name: "whole milk", original: ["½ cup/120 milliliters whole milk, at room temperature"]},
                {amount: 0.25, unit: "cup", name: "chopped dark chocolate", original: ["¼ cup/45 grams chopped dark chocolate"]},
                {amount: 2, unit: "medium", name: "onions"},
                {amount: 0.5, unit: "cup", name: "chopped fresh cilantro leaves and tender stems"},
                {amount: 3, unit: "pound", name: "boneless pork shoulder"},
                {amount: 1.1666666666666667, unit: "tablespoon", name: "kosher salt", original: Array},
                {amount: 1, unit: "medium", name: "orange"},
                {amount: 6, unit: "clove", name: "garlic"},
                {amount: 2, unit: "whole", name: "bay leaves"},
                {amount: 1, unit: "whole", name: "cinnamon stick"},
                {amount: 1.25, unit: "cup", name: "vegetable oil"},
                {amount: 6, unit: "medium", name: "tomatillos"},
                {amount: 2, unit: "whole", name: "jalapeño peppers"},
                {amount: 24, unit: "whole", name: "corn tortillas"},
                {amount: 1, unit: "cup", name: "crumbled queso fresco"},
                {amount: 3, unit: "whole", name: "lime cut into wedges"},
                {amount: 5, unit: "tablespoon", name: "extra-virgin olive oil", original: ["5 tablespoons (75ml) extra-virgin olive oil, divided"]},
                {amount: 0.75, unit: "ounce", name: "za'atar", original: ["3/4 ounce (3 tablespoons; 22g) za'atar, divided"]},
                {amount: 1, unit: "large", name: "grapefruit", original: ["1 large grapefruit (357g; 12.5 ounces), cut into segments, juice reserved separately"]},
                {amount: 2, unit: "tablespoon", name: "tahini", original: ["2 tablespoons (30ml) tahini"]},
                {amount: 1, unit: "tablespoon", name: "white or yellow miso paste", original: ["1 tablespoon (15ml) white or yellow miso paste"]},
                {amount: 1, unit: "tablespoon", name: "juice from 1 lemon", original: ["1 tablespoon (15ml) juice from 1 lemon"]},
                {amount: 1, unit: "teaspoon", name: "honey or agave nectar", original: ["1 teaspoon (5ml) honey or agave nectar"]},
                {amount: 1, unit: "large", name: "avocado", original: ["1 large avocado, cut into 1/2-inch chunks (about 1/2 cup)"]},
                {amount: 5, unit: "ounce", name: "green", original: ["5 ounces (about 5 cups; 142g) greens, such as baby kale, spinach, or arugula, see note"]},
                {amount: 4, unit: "whole", name: "celery stalks", original: ["4 celery stalks, including leaves"]},
                {amount: 2, unit: "whole", name: "garlic bulb", original: ["2 garlic bulbs, sliced in half horizontally"]},
                {amount: 2, unit: "teaspoon", name: "sea salt", original: ["2 teaspoons sea salt"]},
                {amount: 1, unit: "teaspoon", name: "black peppercorn", original: ["1 teaspoon black peppercorns"]},
                {amount: 10, unit: "cup", name: "water", original: ["10 cups water"]},
                {amount: 9, unit: "ounce", name: "store-bought tortellini", original: ["9 ounces store-bought tortellini"]},
                {amount: 4, unit: "cup", name: "Lemon Peel Broth", original: ["4 cups Lemon Peel Broth"]},
                {amount: 2, unit: "cup", name: "fresh spinach", original: ["2 cups fresh spinach"]},
                {amount: 1, unit: "cup", name: "frozen pea", original: ["1 cup frozen peas, thawed"]},
                {amount: 1, unit: "tablespoon", name: "fresh lemon juice", original: ["1 tablespoon fresh lemon juice"]},
                {amount: 2, unit: "cup", name: "fresh basil leaves", original: ["2 cups fresh basil leaves"]}
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
                if ((!item.amount || !item.unit || !item.name) && item.original) {
                    skipped.push(item);
                    return;
                }
                let match = false;
                if (grocery_list) {
                    grocery_list.forEach(element => {
                        if (element.name === item.name || element.name.includes(item.name) || item.name.includes(element.name)){
                            match = element;
                            return;
                        }
                    });
                }
                if (match && !(["small", "medium", "large"].includes(match.unit) ^ ["small", "medium", "large"].includes(item.unit))
                                && !(match.unit == "clove" ^ item.unit == "clove")) {
                    let tmp = { amount: 0, unit: "", name: "", original: []};
                    tmp.original = tmp.original.concat(match.original, item.original);
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

    function test_merge() {
        console.log(tests[0].test);
        recipe_items = tests[0].test;
        merge();
        console.log("grocery_list", grocery_list);
        console.log("test merge", (JSON.stringify(grocery_list) === JSON.stringify(tests[0]['answer'])));
    }
</script>


<div id="main">
    <h1>Prep Page</h1>
    <p on:click={test_merge}>test_merge</p>
    <div id="content">
        <div id="recipes">
            {#each Array(input_count) as _, index (index)}
                <Recipe name="Recipe {index}" on:recipe_edited={update_list} {index}/>
            {/each}
            <div id="add_recipe" on:click={()=>{input_count++}}>Add Recipe</div>
        </div>
        <div id="right_column">
            <GroceryList {grocery_list} {skipped}/>
        </div>
    </div>
</div>










<style>
#content {
    /* border: 3px solid blue; */
    margin: 5px;
    display: flex;
}
#recipes {
    /* border: 3px solid black; */
    margin: 5px;
    width: 50%;
    /* align-items: center; */
}
#right_column {
    /* border: 3px solid green; */
    margin: 5px;
    width: 50%;
}

#add_recipe {
    margin: 10px auto;
    width: 40%;
    text-align: center;
    padding:10px;
    /* border: 3px solid blue; */
}
</style>