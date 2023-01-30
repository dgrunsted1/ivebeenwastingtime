<script>
    import { construct_svelte_component, get_store_value } from "svelte/internal";


    let grocery_list = [];
    let input_count = 2;
    let number_string_converter = [ one => 1, two => 2, three => 3, four => 4, five => 5, six => 6, seven => 7, eight => 8, nine => 9];

    const add_text_box = () => {
        input_count++;
    }

    const process_recipes = () => {
        let ingredients = {};
        let recipe_list = document.getElementsByClassName('recipe');
        let index = 0;
        Array.from(recipe_list).forEach(function (element) {
            let ingredient_list_in = element.value.split("\n");
            let multiplier = document.getElementById("desired_servings_"+index).value / document.getElementById("recipe_servings_"+index).value;
            ingredient_list_in.forEach((element) => {
                if (is_ingredient(element)) {
                    ingredients[Object.keys(ingredients).length] = {
                        value: get_value(element.trim()) * multiplier,
                        unit: get_unit(element),
                        name: get_name(element)
                    };
                }
            });
            index++;
        });
        grocery_list = merge_ingredients(ingredients);
    }
    
    const merge_ingredients = (ingredients) => {
        let output = [];
        
        Object.keys(ingredients).forEach(function(i) {
            let found = false;
            Object.keys(ingredients).forEach(function(j) {
                if (i != j && (ingredients[i].name.includes(ingredients[j].name) || ingredients[j].name.includes(ingredients[i].name))){
                    console.log("combining "+ingredients[i].name+" and "+ingredients[j].name);
                    found = true;
                    if (ingredients[i].unit == ingredients[j].unit){
                        let temp = {
                            value: ingredients[i].value + ingredients[j].value,
                            unit: ingredients[i].unit,
                            name: (ingredients[i].name.includes(ingredients[j].name)) ? ingredients[i].name : ingredients[j].name
                        };
                        if (isNaN(temp.value)) {
                            console.log(temp);
                            console.log(ingredients[i]);
                        }
                        if (not_already_added(output, temp.name)){
                            output.push(temp);
                        }
                        
                    }else {
                        let temp = {
                            value: ingredients[i].value + " " +ingredients[i].unit + " and " + ingredients[j].value + " " +ingredients[j].unit,
                            unit: false,
                            name: (ingredients[i].name.includes(ingredients[j].name)) ? ingredients[i].name : ingredients[j].name
                        };
                        if (isNaN(temp.value)) {
                            console.log(temp);
                            console.log(ingredients[i]);
                        }
                        if (not_already_added(output, temp.name)){
                            output.push(temp);
                        }
                    }
                }
            });
            if (!found) {
                let temp = {
                    value: ingredients[i].value,
                    unit: ingredients[i].unit,
                    name: ingredients[i].name
                };
                if (isNaN(temp.value)) {
                    console.log(temp);
                    console.log(ingredients[i]);
                }
                if (not_already_added(output, temp.name)){
                    output.push(temp);
                }
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
        if (ingredient_string.trim().substring(0, 1).match(/\d/) || ingredient_string.includes("for serving") || ingredient_string.match(/^Half of [0-9]*/) ||
            ingredient_string.match(/^Quarter of [0-9]*/) || ingredient_string.match(/^Eighth of [0-9]*/)){
                return true;
        }
        if (ingredient_string) console.log("line skipped", ingredient_string);
        return false;
    }

    const get_value = (ingredient_string) => {
        if (ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/)){
            let low = parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")).trim());
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            let high = parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")));
            let temp = (low + high) / 2;
            temp = Math.round((temp + Number.EPSILON) * 100) / 100;
            return temp;

        }else if (ingredient_string.match(/[0-9] [0-9]\/[0-9] [A-Za-z]*/)){
            let temp = ingredient_string.substring(0, ingredient_string.indexOf(" ", (ingredient_string.indexOf(" ")+1)));
            temp = temp.split(" ");
            let whole_num = parseInt(temp[0]);
            temp = temp[1].split("/");
            let value = whole_num + (parseInt(temp[0]) / parseInt(temp[1]));
            value = Math.round((value + Number.EPSILON) * 100) / 100;
            return value;
        }else if (ingredient_string.substring(0, 1).match(/\d/)) {
            let temp = ingredient_string.substring(0, ingredient_string.indexOf(" "));
            if (temp.includes("/")){
                temp = temp.split("/");
                let value = parseInt(temp[0]) / parseInt(temp[1]);
                value = Math.round((value + Number.EPSILON) * 100) / 100;
                return value;
            }else {
                let value = parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")));
                value = Math.round((value + Number.EPSILON) * 100) / 100;
                return value;
            }
        } else if (ingredient_string.match(/^Half of [0-9]*/)){
            let temp = ingredient_string.split(" ");
            let value = parseInt(temp[2]) / 2;
            value = Math.round((value + Number.EPSILON) * 100) / 100;
            return value;
        }
        return false;
    }

    const get_unit = (ingredient_string) => {
        let non_units = ["medium", "large", "small", "recipe", "white", "yellow", "white or yellow", "soft"];
        let check = (ingredient_string.indexOf(",") > -1) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string;
        check = check.replace(/\([^()]*\)/g, '').trim();
        if (check.split(" ")[check.length - 1] == "seeds" && check.match(/[A-Za-z]*s$/)){
            return "none";
        }else if (ingredient_string.match(/[0-9] [0-9]\/[0-9] [A-Za-z]*/)){
            let unit = ingredient_string.substring(ingredient_string.indexOf(" ", (ingredient_string.indexOf(" ")+1))).trim();
            unit = unit.substring(0, unit.indexOf(" "));
            return unit;
        }else if (ingredient_string.trim().substring(0, 1).match(/\d/) && !ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/)) {
            ingredient_string = ingredient_string.trim().substring(ingredient_string.indexOf(" ")).trim();
            let unit = ingredient_string.substring(0, ingredient_string.indexOf(" "));
            if (!non_units.includes(unit)) {
                return unit;
            }else return "none";
        }
        return false;
    }

    const get_name = (ingredient_string) => {
        if (ingredient_string.match(/^[0-9] [0-9]\/[0-9] [A-Za-z]*/)){
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.replace(/\([^()]*\)/g, '').trim();
            let comma_index = ingredient_string.indexOf(",");
            let semi_colon_index = ingredient_string.indexOf(";");
            if (comma_index > 15 || semi_colon_index > 15){
                ingredient_string = (comma_index < semi_colon_index) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string.substring(0, ingredient_string.indexOf(";"));
            }
            return ingredient_string;
        }else if (ingredient_string.trim().substring(0, 1).match(/\d/) && ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/)){
            let check = (ingredient_string.indexOf(",") > -1) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string;
            check = check.replace(/\([^()]*\)/g, '').trim();
            if (check.split(" ")[check.length - 1] == "seeds" && check.match(/[A-Za-z]*s$/)){

            }else {
                ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            }
            
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            return (ingredient_string.indexOf(",") > 15) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string;
        }else if (ingredient_string.trim().substring(0, 1).match(/\d/)) {
            let check = (ingredient_string.indexOf(",") > -1) ? ingredient_string.substring(0, ingredient_string.indexOf(",")) : ingredient_string;
            check = check.replace(/\([^()]*\)/g, '').trim();
            if (check.split(" ")[check.length - 1] == "seeds" && check.match(/[A-Za-z]*s$/)){

            }else {
                ingredient_string = ingredient_string.trim();
                ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            }
            
            let name = (ingredient_string.indexOf(",") > 15) ? ingredient_string.substring(ingredient_string.indexOf(" "), ingredient_string.indexOf(",")).trim() : ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            
            return name.replace(/\([^()]*\)/g, '').trim();
        }else if (ingredient_string.match(/^Half of [0-9]*/)){
            let temp = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            temp = temp.substring(ingredient_string.indexOf(" ")).trim();
            temp = (temp.indexOf(",") > 15) ? temp.substring(temp.indexOf(" "), temp.indexOf(",")).trim() : temp.substring(temp.indexOf(" ")).trim();
            temp = temp.replace(/\([^()]*\)/g, '').trim();
            return temp;
        }
        return ingredient_string
    }

    const display = (ingredient) => {
        if ([false, "none"].includes(ingredient.unit) && [0, null].includes(ingredient.value)){
            return `${ingredient.name}`;
        }else if ([false, "none"].includes(ingredient.unit)){
            return `${ingredient.value} | ${ingredient.name}`;
        } else {
            return `${ingredient.value} | ${ingredient.unit} | ${ingredient.name}`;
        }
    }

    const copy_to_clipboard = () => {
        let copy_text = "";
        Object.keys(grocery_list).forEach(function(i) {
            copy_text += display(grocery_list[i]) + "\n";
        });
        navigator.clipboard.writeText(copy_text);
    }
</script>

<div id="main">
    <div id="recipes" class="column">
        <form action="">
            {#each Array(input_count) as _, index (index)}
                <div class="recipe_label">
                    <div>
                        <label for="recipe_{index}">Recipe {index}:</label>
                    </div>
                    <div>
                        <label for="recipe_servings_{index}">recipe servings</label>
                        <input type="number" name="recipe_servings_{index}" id="recipe_servings_{index}" class="recipe_servings" value=1 on:input|preventDefault={process_recipes} min=1>
                    </div>
                    <div>
                        <label for="desired_servings_{index}">desired servings</label>
                        <input type="number" name="desired_servings_{index}" id="desired_servings_{index}" class="desired_servings" value=1 on:input|preventDefault={process_recipes} min=1>
                    </div>
                </div>
                <textarea class="recipe" name="recipe_{index}" id="index" cols="30" rows="10" on:input|preventDefault={process_recipes}></textarea>
            {/each}
            <div class="btn" id="add_recipe" value="add recipe" on:click={add_text_box}>add recipe</div>
        </form>
    </div>
    <div id="grocery_list" class="column">
        {#if grocery_list.length > 0}<div id="column_header"><div id="item_count">{grocery_list.length} items</div><div class="btn" on:click={copy_to_clipboard}>copy</div></div>{/if}
        {#each grocery_list as curr}
            <p class="list_item">{display(curr)}</p>
        {/each}
    </div>
</div>


<style>
    #main {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        font-variant: small-caps;
        background-color: #fcf8f4;
        padding-bottom: 100px;
    }

    .column {
        display: flex;
        flex-direction: column;
        width: 45%;
    }

    p {
        margin:2px;
    }

    form {
        display: flex;
        flex-direction: column;
        margin:auto;
    }

    textarea {
        width: 350px;
        margin: auto;
    }

    label {
        padding-bottom: 3px;
        margin: auto;
    }

    input {
        width: 150px;
        margin: auto;
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
    }

    .btn, input[type=number] {
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
    }
    
    #item_count {
        font-size: 25px;
        padding-right: 25px;
    }

    input[type=number] {
        font-size: large;
        width: 3em;
        margin: 0;
        line-height: 20px;
        padding: 0 4px;
        margin: 5px 0;
    }

    @media (min-width: 768px) {
        #copy_btn {
        min-width: 90px;
        padding: 0 10px;
    }
}
</style>