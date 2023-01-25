<script>
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
                if (is_ingredient(element)) ingredients[ingredients.size] = element;
            });
        });
        console.log(ingredients);
    }

    const is_ingredient = (ingredient) => {
        return (ingredient.match(/^\d/) || ingredient.includes("for serving"));
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
        {#each grocery_list as curr}
            <p class="list_item">{curr}</p>
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
        flex-direction: row;
        width: 45%;
    }

    form {
        display: flex;
        flex-direction: column;
        margin:auto;
    }

    textarea {
        /* height: 100px; */
        width: 350px;
        margin: auto;
    }
    label {
        margin-top: 20px;
    }
    input {
        width: 150px;
        margin-top: 20px;
        margin: auto;
    }

    label {
        margin:auto;
    }
</style>