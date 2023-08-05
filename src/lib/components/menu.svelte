<script>
    import { onMount, afterUpdate, tick } from 'svelte';
    import GroceryList from "/src/lib/components/grocery_list.svelte";
    import { currentUser, pb } from '/src/lib/pocketbase';
    import { page } from '$app/stores';

    export let menu;
    console.log({menu});
    let tab = "recipe_list";
    let grocery_list = [];
    afterUpdate(async () => {
        if (!menu.id) return;
        menu.expand.recipes.forEach((recipe, i) => {
            let mult = (document.getElementsByClassName("servings")[i]) ? document.getElementsByClassName("servings")[i].value : recipe.servings;
            grocery_list[i] = {
                ingredients: recipe.ingredients,
                multiplier: mult / recipe.servings
            };  
        });
        
        console.log({grocery_list});
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
        for (let i = 0; i < menu.expand.recipes.length; i++){
            recipe_ids.push(menu.expand.recipes[i].id);
        }
        const data = {
            "recipes": recipe_ids,
            "user": $currentUser.id,
            "today": false
        };

        const record = await pb.collection('menus').create(data);
    }
    
    async function set_todays_menu(e){
        console.log(`user = ${$currentUser.id} && today = True`);
        const resultList = await pb.collection('menus').getList(1, 50, {
            filter: `user = '${$currentUser.id}' && today = True`,
        });
        console.log({resultList});
        return;
        const data = {
            "today": true
        };
        const record = await pb.collection('menus').update(menu.id, data);
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
            {#if menu.id}
                {#each menu.expand.recipes as recipe}
                    <div class="img_serv_container card card-bordered sm:card-side flex flex-row w-auto items-center my-3.5 mx-3 shadow-xl">
                        <figure class="image w-1/3">
                            <img class="" src={recipe.image} alt={recipe.title}/>
                        </figure>
                        <div class="servings_time_container w-2/3 ml-2.5">
                            <p class="title text-xl">{recipe.title}</p>
                            <p class="time">{recipe.time}</p>
                            <div class="servings_container">
                                servings:<input type="text" class="servings w-2" id={recipe.id} value={recipe.servings}>
                            </div>
                            <p class="description">{recipe.description}</p>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    {:else if tab == "grocery_list"}
        <GroceryList recipes={grocery_list}/>
    {/if}
</div>