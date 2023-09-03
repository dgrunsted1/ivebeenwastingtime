<script>
    import { onMount, afterUpdate, tick } from 'svelte';
    import GroceryList from "/src/lib/components/grocery_list.svelte";
    import { currentUser, pb } from '/src/lib/pocketbase';
    import { page } from '$app/stores';

    export let menu;
    export let id = null;
    export let mults;
    let tab = "recipe_list";
    let grocery_list = [];


    afterUpdate(() => {
        grocery_list = [];
        if (!menu.length) return;
        menu.forEach((recipe, i) => {
            grocery_list[i] = {
                ingredients: recipe.expand.ingr_list,
                multiplier: parseFloat(mults[recipe.id]) / parseFloat(recipe.servings)
            };  
        });

    });

    function switch_tab(e){
        let siblings = e.srcElement.parentNode.children;
        for (let curr of siblings){
            if (curr != e.srcElement && curr.classList.contains("tab-active")) {
                curr.classList.remove("tab-active");
            }
        }
        e.srcElement.classList.add("tab-active");
        tab = e.srcElement.id;
    }

    async function save_menu(e){
        let recipe_ids = [];
        for (let i = 0; i < menu.length; i++){
            recipe_ids.push(menu[i].id);
        }
        const data = {
            "recipes": recipe_ids,
            "user": $currentUser.id,
            "today": false,
            "servings": mults
        };

        const record = await pb.collection('menus').create(data);
    }
    
    async function set_todays_menu(e){
        const resultList = await pb.collection('menus').getList(1, 50, {
            filter: `user = '${$currentUser.id}' && today = True`,
        });
        if (resultList.items.length){
            const false_record = await pb.collection('menus').update(resultList.items[0].id, { "today": false });
        }
        const true_record = await pb.collection('menus').update(id, { "today": true });
    }

</script>

<div id="menu">
    <div class="flex content-center">
        <div class="tabs tabs-boxed w-fit mx-auto">
            <a id="recipe_list" class="tab tab-active" on:click={switch_tab}>Recipes</a> 
            <a id="grocery_list" class="tab" on:click={switch_tab}>Grocery List</a>
        </div>
        {#if $page.url.pathname == "/menu"}
            <button class="btn btn-secondary self-end btn-sm" on:click={save_menu}>save menu</button>
        {:else if $page.url.pathname == "/my_menus"}
            <button class="btn btn-secondary self-end btn-sm" on:click={set_todays_menu}>make todays menu</button>
        {/if}
    </div>
    
    
    {#if tab == "recipe_list"}
        <div class="max-h-[calc(100vh-130px)] overflow-y-auto">
                {#each menu as recipe}
                    <div class="img_serv_container card card-bordered sm:card-side flex flex-row w-auto items-center my-3.5 mx-3 shadow-xl">
                        <figure class="image w-1/3">
                            <img class="" src={recipe.image} alt={recipe.title}/>
                        </figure>
                        <div class="servings_time_container w-2/3 ml-2.5">
                            <p class="title text-xl">{recipe.title}</p>
                            <p class="time">{recipe.time}</p>
                            <div class="servings_container">
                                servings:<input type="text" class="servings w-4" id={recipe.id} bind:value={mults[recipe.id]}>
                            </div>
                            <p class="description">{recipe.description}</p>
                        </div>
                    </div>
                {/each}
        </div>
    {:else if tab == "grocery_list"}
        <GroceryList recipes={grocery_list}/>
    {/if}
</div>