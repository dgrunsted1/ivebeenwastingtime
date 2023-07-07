<script>
    import { construct_svelte_component, get_store_value } from "svelte/internal";
    import { createEventDispatcher } from 'svelte';
    import InputRecipe from "/src/lib/components/input_recipe.svelte";
    import GroceryList from "/src/lib/components/grocery_list.svelte";

    let test_mode = false;
    $: input_count = (test_mode) ? 1 : 2;
    let recipes = [];
    
    function update_list(e) {
        let temp = {
            ingredients: e.detail.items,
            multiplier: e.detail.multiplier
        }
        recipes[e.detail.index] = temp;
    }

    function update_multiplier(e){
        recipes[e.detail.index].multiplier = e.detail.multiplier;
    }
</script>


<div id="main">
    <h1>PREP</h1>
    <div><a href="/menu">Create Menu</a></div>
    <div id="content">
        <div id="recipes">
            {#each Array(input_count) as _, index (index)}
                <InputRecipe name="Recipe {index}" on:recipe_edited={update_list} on:update_multiplier={update_multiplier} {index} {test_mode}/>
            {/each}
            <div id="add_recipe" on:click={()=>{input_count++}}>Add Recipe</div>
        </div>
        <div id="right_column">
            <GroceryList {recipes}/>
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
    cursor: pointer;
    border: 2px solid #555;
    background: hsla(35, 39%, 22%, 0.83);
    color: white;
    border-radius: 8px;
    padding: 5px;
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

h1 {
    font-variant: normal;
    margin: 30px 150px;
}
</style>