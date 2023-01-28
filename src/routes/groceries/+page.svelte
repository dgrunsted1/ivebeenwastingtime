<script>
    import { get_store_value } from "svelte/internal";


    let grocery_list = [];
    let input_count = 2;

    const add_text_box = () => {
        input_count++;
    }

    const process_recipes = () => {
        let ingredients = {};
        let recipe_list = document.getElementsByClassName('recipe');
        Array.from(recipe_list).forEach(function (element) {
            let ingredient_list_in = element.value.split("\n");
            ingredient_list_in.forEach((element) => {
                if (is_ingredient(element)) {
                    ingredients[Object.keys(ingredients).length] = {
                        value: get_value(element.trim()),
                        unit: get_unit(element),
                        name: get_name(element)
                    };
                }
            });
        });
        grocery_list = merge_ingredients(ingredients);
    }
    
    const merge_ingredients = (ingredients) => {
        let output = [];
        
        Object.keys(ingredients).forEach(function(i) {
            let found = false;
            Object.keys(ingredients).forEach(function(j) {
                if (i != j && (ingredients[i].name.includes(ingredients[j].name) || ingredients[j].name.includes(ingredients[i].name))){
                    found = true;
                    if (ingredients[i].unit == ingredients[j].unit){
                        let temp = {
                            value: ingredients[i].value + ingredients[j].value,
                            unit: ingredients[i].unit,
                            name: (ingredients[i].name.includes(ingredients[j].name)) ? ingredients[i].name : ingredients[j].name
                        };
                        if (not_already_added(output, temp.name)){
                            output.push(temp);
                        }
                        
                    }else {
                        let temp = {
                            value: ingredients[i].value + " " +ingredients[i].unit + " and " + ingredients[j].value + " " +ingredients[j].unit,
                            unit: false,
                            name: (ingredients[i].name.includes(ingredients[j].name)) ? ingredients[i].name : ingredients[j].name
                        };
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
        return (ingredient_string.trim().substring(0, 1).match(/\d/) || ingredient_string.includes("for serving"));
    }

    const get_value = (ingredient_string) => {
        if (ingredient_string.substring(0, 1).match(/\d/) && ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/)){
            let low = parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")).trim());
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            let high = parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")));
            let temp = (low + high) / 2;
            return temp;

        }else if (ingredient_string.substring(0, 1).match(/\d/)) {
            let temp = ingredient_string.substring(0, ingredient_string.indexOf(" "));
            if (temp.includes("/")){
                temp = temp.split("/");
                let value = parseInt(temp[0]) / parseInt(temp[1]);
                return value;
            }else {
                return parseInt(ingredient_string.substring(0, ingredient_string.indexOf(" ")));
            }
        }
        return false;
    }

    const get_unit = (ingredient_string) => {
        let non_units = ["medium", "large", "small", "recipe", "white", "yellow", "white or yellow", "soft"];
        if (ingredient_string.trim().substring(0, 1).match(/\d/) && !ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/)) {
            ingredient_string = ingredient_string.trim().substring(ingredient_string.indexOf(" ")).trim();
            let unit = ingredient_string.substring(0, ingredient_string.indexOf(" "));
            if (!non_units.includes(unit)) {
                return unit;
            }else return "none";
        }
        return false;
    }

    const get_name = (ingredient_string) => {
        if (ingredient_string.trim().substring(0, 1).match(/\d/) && ingredient_string.substring(0, ingredient_string.indexOf(",")).match(/[0-9]* to [0-9]*[A-Za-z]*/)){
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            return ingredient_string.substring(0, ingredient_string.indexOf(","));
        }else if (ingredient_string.trim().substring(0, 1).match(/\d/)) {
            ingredient_string = ingredient_string.trim();
            ingredient_string = ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            let name = (ingredient_string.indexOf(",") > -1) ? ingredient_string.substring(ingredient_string.indexOf(" "), ingredient_string.indexOf(",")).trim() : ingredient_string.substring(ingredient_string.indexOf(" ")).trim();
            
            return name.replace(/\([^()]*\)/g, '').trim();
        }
        return ingredient_string
    }

    const display = (ingredient) => {
        if ([false, "none"].includes(ingredient.unit) && [0, null].includes(ingredient.value)){
            return `${ingredient.name}`;
        }else if ([false, "none"].includes(ingredient.unit)){
            return `${ingredient.value} ${ingredient.name}`;
        } else {
            return `${ingredient.value} ${ingredient.unit} ${ingredient.name}`;
        }
    }
</script>

<div id="main">
    <div id="recipes" class="column">
        <form action="">
            {#each Array(input_count) as _, index (index)}
                <label for="recipe_{index}">Recipe {index}:</label>
                <textarea class="recipe" name="recipe_{index}" id="index" cols="30" rows="10" on:change={process_recipes} on:paste={process_recipes}></textarea>
            {/each}
            <input type="button" value="add recipe" on:click={add_text_box}>
        </form>
    </div>
    <div id="grocery_list" class="column">
        {#if grocery_list.length > 0}<h3>{grocery_list.length} items</h3>{/if}
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
    }

    .column {
        display: flex;
        flex-direction: column;
        width: 45%;
        margin-top: 20px;
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
        padding-top: 10px;
        padding-bottom: 3px;
        margin: auto;
    }

    input {
        width: 150px;
        margin: auto;
        margin-top: 10px;
    }
</style>