<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import GroceryList from "/src/lib/components/grocery_list.svelte";
    import { page } from '$app/stores';


    let todays_menu = {};
    let grocery_list = []; 
    let mode = "menu";

    onMount(async () => {
        if (!$currentUser) window.location.href = "/login";
        const result_list = await pb.collection('menus').getList(1, 50, {
            filter: `user="${$currentUser.id}" && today=True`,
            expand: `recipes,recipes.notes,recipes.ingr_list`
        })
        todays_menu = result_list.items[0];
        todays_menu.expand.recipes.forEach((recipe, i) => {
            grocery_list[i] = {
                ingredients: recipe.expand.ingr_list,
                multiplier: parseFloat(todays_menu.servings[recipe.id]) / parseFloat(recipe.servings)
            };  
        });
    });
</script>

{#if todays_menu.id}
    <div id="main">
        <div class="flex justify-center p-1">
            <h1 class="text-2xl">{todays_menu.title}</h1>
        </div>
        <div id="content" class="flex flex-col md:flex-row m-2 mt-0 space-y-24 md:space-y-0">
            <div id="left_column" class="md:w-1/2 md:max-h-[calc(100vh-150px)] md:overflow-y-auto">
                <div id="recipes" class="">
                    {#each todays_menu.expand.recipes as curr, i}
                    <a href={`/cook_recipe/${curr.url_id}/${todays_menu.servings[curr.id]}`}>
                        <div class="card card-bordered sm:card-side bg-base-100 shadow-xl max-h-24 my-1.5 mx-1">
                            <figure class="md:w-3/5"><img src={curr.image} alt={curr.title}/></figure>
                            <div class="card-body max-h-full flex flex-row p-2 items-center w-full">
                                <p id={i} class="md:w-2/3 text-xs">{curr.title}</p>
                            </div>
                        </div>
                    </a>
                    {/each}
                </div>
            </div>
            <div id="right_column" class="md:w-1/2">
                {#if todays_menu && mode == "menu"}
                    <GroceryList recipes={grocery_list} />
                {:else}
                    <h2>select recipes to add to your menu</h2>
                {/if}
            </div>
        </div>
    </div>
{/if}