<script>
    import { construct_svelte_component, get_store_value } from "svelte/internal";
    import { createEventDispatcher } from 'svelte';
    import InputRecipe from "/src/lib/components/input_recipe.svelte";
    import GroceryList from "/src/lib/components/grocery_list.svelte";

    let test_mode = false;
    $: input_count = 2;
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
    <div class="btn btn-primary mx-6"><a href="/menu">Create Menu</a></div>
    <div id="content" class="flex flex-row m-3">
        <div id="recipes" class="flex flex-col basis-1/2">
            {#each Array(input_count) as _, index (index)}
                <InputRecipe name="Recipe {index}" on:recipe_edited={update_list} on:update_multiplier={update_multiplier} {index} {test_mode}/>
                {#if index < input_count}
                    <div class="divider"></div>
                {/if}
            {/each}
            <div id="add_recipe" class="btn btn-secondary mx-6" on:click={()=>{input_count++}}>Add Recipe</div>
        </div>
        <div id="right_column" class="flex basis-1/2">
            <GroceryList {recipes}/>
        </div>
    </div>
</div>


