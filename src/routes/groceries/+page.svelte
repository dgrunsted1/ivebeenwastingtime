<script>
    import { construct_svelte_component, get_store_value } from "svelte/internal";


    let grocery_list = [];
    let recipe_items = [];
    let modes = ["Freestyle", "Meal Prep", "Weekly Grocery Run"];
    let curr_mode = modes[2];
    let input_count = (curr_mode == "Freestyle") ? 2 : {"dinner": 4, "lunch": 2, "breakfast": 2, "snack": 2, "dessert": 1};
    let number_string_converter = { One: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
    let fraction_converter = { '¼' : .25, '½' : .5, '⅕': .2, '⅙': .167, '⅛': .125, '⅔': .67, '¾': .75, '⅓': .33};
    let conversions = {"tablespoon/teaspoon": 1/3, "teaspoon/tablespoon": 3, "cup/teaspoon": 1/48, "teaspoon/cup": 48, "cup/tablespoon": 1/16, "tablespoon/cup": 16};
    let abreviation_converter = {"tbsp": "tablespoon", "tbsp.": "tablespoon", "tsp": "teaspoon", "tsp.": "teaspoon", "c.": "cup", "c": "cup", "lb.": "pound", "lb": "pound"};

    const add_text_box = () => {
        input_count++;
    }

    const process_recipes = () => {
        let ingredients = {};
        let recipe_list = document.getElementsByClassName('recipe');
        let index = 0;
        let value = null;
        Array.from(recipe_list).forEach(function (element) {
            recipe_items.push([]);
            let ingredient_list_in = element.value.split("\n");
            let multiplier = document.getElementById("desired_servings_"+index).value / document.getElementById("recipe_servings_"+index).value;
            ingredient_list_in.forEach((element) => {
                // console.log(26, element.substring(0, element.indexOf(" ")), element);
                if (element.match(/^[Aa]bout [0-9]* [A-Za-z ]*/)){
                    element = element.replace(/^[Aa]bout /, "");
                    console.log(element);
                }
                if (element.match(/^[0-9]+$/)){
                    value = element.trim();
                }else if (element.match(/^[0-9]+ to [0-9]+$/)){
                    let temp = element.split(" ");
                    let a = parseFloat(temp[0]);
                    let b = parseFloat(temp[2]);
                    value = a+b;
                    value = value / 2;
                }else if (Object.keys(fraction_converter).includes(element)){
                    value = fraction_converter[element];
                }else if (element.match(/^[0-9]/) && Object.keys(fraction_converter).includes(element[1])){
                    value = parseInt(element[0]) + fraction_converter[element[1]];
                }else if (value){
                    element = value + " " + element;
                    value = null;
                    element = element.trim();
                    if (is_ingredient(element)) {
                        let value = get_value(element.trim());
                        let unit = get_unit(element);
                        let temp = {
                            value: (!isNaN(value)) ? value * multiplier : value,
                            unit: unit,
                            name: get_name(element, unit)
                        };
                        ingredients[Object.keys(ingredients).length] = temp;
                        recipe_items[index].push(temp);
                    }
                }else {
                    element = element.trim();
                    if (is_ingredient(element)) {
                        let value = get_value(element.trim());
                        let unit = get_unit(element);
                        let temp = {
                            value: (!isNaN(value)) ? value * multiplier : value,
                            unit: unit,
                            name: get_name(element, unit)
                        };
                        ingredients[Object.keys(ingredients).length] = temp;
                        recipe_items[index].push(temp);
                    }
                }
                
            });
            index++;
        });
        grocery_list = merge_ingredients(ingredients);
    }
    
    const merge_ingredients = (ingredients) => {
        let output = [];
        
        Object.keys(ingredients).forEach(function(i) {
            let temp = ingredients[i];
            let found = false;
            Object.keys(ingredients).forEach(function(j) {
                if (i != j && (ingredients[i].name.includes(ingredients[j].name) || ingredients[j].name.includes(ingredients[i].name))){
                    console.log("combining "+ingredients[i].name+" and "+ingredients[j].name);
                    found = true;
                    if (ingredients[i].unit == ingredients[j].unit){
                        temp.value += ingredients[j].value;
                        temp.name = (ingredients[i].name.includes(ingredients[j].name)) ? ingredients[i].name : ingredients[j].name;
                    }else {
                        let conv_index_b = `${ingredients[i].unit}/${ingredients[j].unit}`;
                        temp.value += conversions[conv_index_b] * ingredients[j].value;
                        temp.name = (ingredients[i].name.includes(ingredients[j].name)) ? ingredients[i].name : ingredients[j].name
                    }
                }
            });
            if (not_already_added(output, temp.name)){
                output.push(temp);
            }
        });
        return output;
    }

    const not_already_added = (list_in, name_in) => {
        for (let i = 0; i < list_in.length; i++) {
            if (list_in[i].name == name_in) return false;
        }
        return true;
    }

    const is_ingredient = (ingredient_string) => {
        // console.log("is ingredient", ingredient_string.substring(0, ingredient_string.indexOf(" ")));
        if (ingredient_string.substring(0, 1).match(/\d/) || ingredient_string.includes("for serving") || ingredient_string.includes("for garnish") || ingredient_string.match(/^Half of [0-9]*/) ||
            ingredient_string.match(/^Quarter of [0-9]*/) || ingredient_string.match(/^Eighth of [0-9]*/) || Object.keys(number_string_converter).includes(ingredient_string.substring(0, ingredient_string.indexOf(" "))) ||
            Object.keys(fraction_converter).includes(ingredient_string.substring(0, ingredient_string.indexOf(" ")))){
                return true;
        }
        if (ingredient_string) console.log("line skipped", ingredient_string);
        return false;
    }

    const get_value = (ingredient_string) => {
        if (ingredient_string.includes("piece fresh ginger")){
            // console.log("value 1", ingredient_string);
            let temp = ingredient_string.match(/[0-9½]-[iI]nch/);
            return (fraction_converter[temp[0].split("-")[0]]) ? fraction_converter[temp[0].split("-")[0]] : temp[0].split("-")[0];
        }else if (ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/^[0-9]* to [0-9]*[A-Za-z]*/)){
            // console.log("value 2", ingredient_string);
            let low = parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")).trim());
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            let high = parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")));
            let temp = (low + high) / 2;
            temp = Math.round((temp + Number.EPSILON) * 100) / 100;
            return temp;

        }else if (ingredient_string.match(/^[0-9] [0-9]\/[0-9] [A-Za-z]*/)){
            // console.log("value 3", ingredient_string);
            let temp = ingredient_string.substring(0, ingredient_string.indexOf(" ", (ingredient_string.indexOf(" ")+1)));
            temp = temp.split(" ");
            let whole_num = parseInt(temp[0]);
            temp = temp[1].split("/");
            let value = whole_num + (parseInt(temp[0]) / parseInt(temp[1]));
            value = Math.round((value + Number.EPSILON) * 100) / 100;
            return value;
        }else if (ingredient_string.substring(0, 1).match(/\d/)) {
            // console.log("value 4", ingredient_string);
            let temp = ingredient_string.substring(0, ingredient_string.indexOf(" "));
            if (temp.includes("/")){
                temp = temp.split("/");
                let value = parseInt(temp[0]) / parseInt(temp[1]);
                value = Math.round((value + Number.EPSILON) * 100) / 100;
                return value;
            }else {
                let value = parseFloat(ingredient_string.substring(0, ingredient_string.indexOf(" "))).toFixed(2) * 1;
                return value;
            }
        } else if (ingredient_string.match(/^Half of [0-9]*/)){
            // console.log("value 5", ingredient_string);
            let temp = ingredient_string.split(" ");
            let value = parseInt(temp[2]) / 2;
            value = Math.round((value + Number.EPSILON) * 100) / 100;
            return value;
        }else if (Object.keys(number_string_converter).includes(ingredient_string.substring(0, ingredient_string.indexOf(" ")))){
            // console.log("value 6", ingredient_string);
            let temp = number_string_converter[ingredient_string.substring(0, ingredient_string.indexOf(" "))];
            return temp;
        }else if (Object.keys(fraction_converter).includes(ingredient_string.substring(0, ingredient_string.indexOf(" ")))){
            // console.log("value 7", ingredient_string);
            let temp = fraction_converter[ingredient_string.substring(0, ingredient_string.indexOf(" "))];
            return temp;
        }
        return false;
    }

    const get_unit = (ingredient_string) => {
        let non_units = ["medium", "large", "small", "recipe", "white", "yellow", "white or yellow", "soft", "skin-on"];
        let check = (ingredient_string.indexOf(",") > 10) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string;
        check = check.replace(/\([^()]*\)/g, '').trim();
        console.log(181, check);
        let checkarr = check.split(" ");
        if (checkarr[checkarr.length - 1] != "seeds" && checkarr[checkarr.length - 1] != "flakes" && check.substring(check.length - 1) == "s"){
            console.log(1, "unit");
            return "none";
        }else if (ingredient_string.match(/[0-9] [0-9]\/[0-9] [A-Za-z]*/)){
            console.log(2, "unit");
            let unit = ingredient_string.substring(ingredient_string.indexOf(" ", (ingredient_string.indexOf(" ")+1))).trim();
            unit = unit.substring(0, unit.indexOf(" "));
            if (!non_units.includes(unit)) {
                if (unit.substring(unit.length - 1) == "s") unit = unit.substring(0, unit.length - 1);
                if (abreviation_converter[unit.toLowerCase()]) unit = abreviation_converter[unit.toLowerCase()];
                return unit;
            }else return "none";
        }else if (ingredient_string.match(/^[0-9]* [A-Za-z]*, */)){
            console.log(3, "unit");
            return "none";
        }else if (ingredient_string.includes("piece fresh ginger") && ingredient_string.includes("inch")){
            return "inch";
        }else if(ingredient_string.includes("garlic") && ingredient_string.includes("clove")){
            return "none"
        }else if(ingredient_string.trim().substring(0, 1).match(/\d/) && !ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/) ||
                Object.keys(fraction_converter).includes(ingredient_string.split(" ")[0])) {
            console.log(4, "unit");
            ingredient_string = ingredient_string.trim().substring(ingredient_string.indexOf(" ")).trim();
            let unit = ingredient_string.substring(0, ingredient_string.indexOf(" "));
            if (!non_units.includes(unit)) {
                if (unit.substring(unit.length - 1) == "s") unit = unit.substring(0, unit.length - 1);
                if (abreviation_converter[unit.toLowerCase()]) unit = abreviation_converter[unit.toLowerCase()];
                return unit;

            }else return "none";
        }
        return false;
    }

    const get_name = (ingredient_string, unit) => {
        ingredient_string = ingredient_string.replace(/\([^()]*\)/g, '').trim();
        // console.log(215, ingredient_string);

        if (ingredient_string.includes("piece fresh ginger")){
            return "piece fresh ginger";
        }else if (ingredient_string.match(/^[0-9]* [A-Za-z]*, */)){
            let temp = ingredient_string.substring(ingredient_string.indexOf(" "), ingredient_string.indexOf(","));
            return temp;
        }else if (ingredient_string.match(/^[0-9] [0-9]\/[0-9] [A-Za-z]*/)){
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            let comma_index = ingredient_string.indexOf(",");
            let semi_colon_index = ingredient_string.indexOf(";");
            if (comma_index > 10 || semi_colon_index > 10){
                ingredient_string = (comma_index < semi_colon_index) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string.substring(0, ingredient_string.indexOf(";"));
            }
            return ingredient_string;
        }else if (ingredient_string.trim().substring(0, 1).match(/\d/) && ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/)){

            if (unit != "none") {
                ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            }
            
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            return (ingredient_string.indexOf(",") > 10) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string;
        }else if (ingredient_string.trim().substring(0, 1).match(/\d/) || Object.keys(fraction_converter).includes(ingredient_string.split(" ")[0])) {

            if (unit != "none") {
                ingredient_string = ingredient_string.trim();
                ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            }
            
            let name = (ingredient_string.indexOf(",") > 10) ? ingredient_string.substring(ingredient_string.indexOf(" "), ingredient_string.indexOf(",")).trim() : ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            
            return name.replace(/\([^()]*\)/g, '').trim();
        }else if (ingredient_string.match(/^Half of [0-9]*/)){
            let temp = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            temp = temp.substring(ingredient_string.indexOf(" ")).trim();
            temp = (temp.indexOf(",") > 10) ? temp.substring(temp.indexOf(" "), temp.indexOf(",")).trim() : temp.substring(temp.indexOf(" ")).trim();
            return temp;
        }
        return ingredient_string
    }

    const display = (ingredient) => {
        if ([false, "none"].includes(ingredient.unit) && [0, null, false].includes(ingredient.value)){
            return `${ingredient.name}`;
        }else if ([false, "none"].includes(ingredient.unit)){
            return `${ingredient.value} | ${ingredient.name}`;
        } else {
            return `${ingredient.value} | ${(ingredient.value > 1) ? ingredient.unit+"s" : ingredient.unit} | ${ingredient.name}`;
        }
    }

    const copy_to_clipboard = () => {
        let copy_text = "";
        let first = true;
        let copy_list = document.getElementsByClassName("list_items");
        Array.from(copy_list).forEach(function (element) {
            if (!element.getElementsByTagName("input")[0].checked){
                if (first) first = false;
                else copy_text += "\n";

                copy_text += element.getElementsByTagName('p')[0].innerHTML;
            }
        });
        navigator.clipboard.writeText(copy_text);
    }

    const combine = (i, j) => {
        let conv_index_a = `${j.unit}/${i.unit}`;
        let conv_index_b = `${i.unit}/${j.unit}`;
        let value = null;
        let unit = null;
        console.log(92, `${conv_index_a} < ${conv_index_b}`);
        if (conversions[conv_index_a] < conversions[conv_index_b]){
            let unit = j.unit;
            let value = conversions[conv_index_a] * i.unit + j.unit;
        }else {
            let unit = i.unit;
            let value = conversions[conv_index_b] * j.unit + i.unit;
        }
        return {'unit': unit, 'value': value};
    }
</script>

<div id="main">
    <div id="recipes" class="column">
        <form action="">
            {#if curr_mode =="Freestyle"}
                {#each Array(input_count) as _, index (index)}
                    <div class="recipe_label">
                        <div>
                            <label for="recipe_{index}" class="label_main">Recipe {index + 1}:</label>
                        </div>
                        <div class="seperated">
                            <label for="recipe_servings_{index}">recipe servings</label>
                            <input type="number" name="recipe_servings_{index}" id="recipe_servings_{index}" class="recipe_servings" value=1 on:input|preventDefault={process_recipes} min=1>
                        </div>
                        <div class="seperated">
                            <label for="desired_servings_{index}">desired servings</label>
                            <input type="number" name="desired_servings_{index}" id="desired_servings_{index}" class="desired_servings" value=1 on:input|preventDefault={process_recipes} min=1>
                        </div>
                    </div>
                    <textarea class="recipe" name="recipe_{index}" id="index" cols="30" rows="10" on:input|preventDefault={process_recipes}></textarea>
                {/each}
            {:else if curr_mode =="Weekly Grocery Run"}
                {#each Object.entries(input_count) as [key, value]}
                    <div class="recipe_group">
                        <!-- <div class="recipe_group_title">{key}</div> -->
                        <div>
                        {#each  Array(value) as _, index (index)}
                            <div class="recipe_label">
                                <div class="seperated">
                                    <label for="recipe_servings_{index}">recipe servings</label>
                                    <input type="number" name="recipe_servings_{index}" id="recipe_servings_{index}" class="recipe_servings" value=1 on:input|preventDefault={process_recipes} min=1>
                                </div>
                                <div class="seperated">
                                    <label for="desired_servings_{index}">desired servings</label>
                                    <input type="number" name="desired_servings_{index}" id="desired_servings_{index}" class="desired_servings" value=1 on:input|preventDefault={process_recipes} min=1>
                                </div>
                            </div>
                            <div class="text_title">
                                <label for="recipe_{index}" class="label_main">{key} {index + 1}:</label>
                                <textarea class="recipe" name="recipe_{index}" id="index" cols="30" rows="10" on:input|preventDefault={process_recipes}></textarea>
                            </div>
                        {/each}
                        </div>
                    </div>    
                {/each}
            {/if}
            <div class="btn" id="add_recipe" value="add recipe" on:click={add_text_box}>add recipe</div>
        </form>
    </div>
    <div id="grocery_list" class="column">
        {#if grocery_list.length > 0}<div id="column_header"><div id="item_count">{grocery_list.length} items</div><div class="btn" on:click={copy_to_clipboard}>copy</div></div>{/if}
        {#each grocery_list as curr}
            <div class="list_items">
                <div class="checks"><input type="checkbox" id="{display(curr)}"></div><p class="list_item">{display(curr)}</p>
            </div>
        {/each}
    </div>
</div>


<style>
    #main {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        font-variant: small-caps;
        padding-bottom: 100px;
    }

    .column {
        display: flex;
        flex-direction: column;
        width: 45%;
    }

    p {
        margin: 2px 18px;
    }

    form {
        display: flex;
        flex-direction: column;
        margin: 20px auto;
        font-variant: small-caps;
    }

    textarea {
        width: 350px;
        margin: auto;
    }

    .label_main {
        font-weight: 900;
        transform: rotate(-90deg);
        height: 50px;

    }

    .text_title{
        display: flex;
        align-items: center;
    }

    label {
        padding-bottom: 3px;
    }

    input[type=number] {
        font-size: large;
        width: 3em;
        margin: 0;
    }

    #add_recipe {
        width: 150px;
        margin: auto;   
        margin-top: 10px;
    }

    #recipe_label {
        display: flex;
        flex-direction: column;
        align-items: left;
    }

    .recipe_label {
        margin-top: 10px;
        padding-bottom: 8px;
    }

    .btn, input[type=number], .checks{
        background-color: #fbe4cb;
        border: 2px solid #422800;
        border-radius: 30px;
        box-shadow: #422800 4px 4px 0 0;
        color: #422800;
        cursor: pointer;
        display: inline-block;
        font-weight: 600;
        font-size: 18px;
        padding: 0 10px;
        line-height: 30px;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .checks {
        padding: 2px;
        border-radius: 50%;
    }

    .btn:hover,  input[type=number]:hover {
        background-color: #fff;
    }

    .btn:active,  input[type=number]:active {
        box-shadow: #422800 2px 2px 0 0;
        transform: translate(2px, 2px);
    }

    #column_header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px;
    }
    
    #item_count {
        font-size: 25px;
        padding-right: 25px;
    }

    .seperated {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    input[type=number] {
        font-size: large;
        width: 3em;
        margin: 0;
        line-height: 20px;
        padding: 0 4px;
        margin: 5px 0;
    }

    .list_items {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 5px;
    }

    input[type=checkbox] {
        margin: 2px;
        /* Add if not using autoprefixer */
        -webkit-appearance: none;
        appearance: none;
        /* For iOS < 15 to remove gradient background */
        background-color: #fbe4cb;
        /* Not removed via appearance */
        /* margin: 0; */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    input[type="checkbox"]::before {
        content: "";
        width: 2em;
        height: 2em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        background-color: black;
        transform-origin: bottom left;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        /* clip-path: url('src/lib/style/check_mark.svg');; */
        /* box-shadow: inset 1em 1em var(--form-control-color); */
        /* background: url('src/lib/style/check_mark.svg'); */
    }
    
    input[type="checkbox"]:checked::before {
        transform: scale(1);
        /* background: url('src/lib/style/check_mark.svg'); */

    }

    #grocery_list {
        margin: 0 auto;
    }

    .recipe_group {
        display: flex;
        align-items: flex-start;
    }
    .recipe_group_title {
        transform: rotate(-90deg);
        letter-spacing: 30px;
        font-size: 32px;
        width: 2em;
        position: relative;
        top: 280px;
        /* justify-content: center;
        align-items: center; */
    }

    @media (min-width: 768px) {
        #copy_btn {
        min-width: 90px;
        padding: 0 10px;
    }
}
</style>