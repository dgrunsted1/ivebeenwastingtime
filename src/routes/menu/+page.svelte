<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import EditRecipe from "/src/lib/components/edit_recipe.svelte";
    import DisplayRecipe from "/src/lib/components/display_recipe.svelte";
    import RecipeList from "/src/lib/components/recipe_list.svelte";
    import Menu from "/src/lib/components/menu.svelte";
    import { page } from '$app/stores';


    $: user_recipes = {};
    let menu_recipes = [];
    let mults = {};
    let mode = "menu";
    let view_recipe;
    let edit_recipe;
    $: loading = true;


    onMount(async () => {
        if (!$currentUser) window.location.href = "/login";
        const result_list = await pb.collection('recipes').getList(1, 250, {
            filter: `user="${$currentUser.id}"`,
            expand: `notes, ingr_list`,
            sort: `-created`
        });
        user_recipes = result_list;
        loading = false;
    });

    function update_edit(e){
        view_recipe = null;
        if (e.detail.index != -1) {
            for (let curr of user_recipes.items){
                if (curr.id == e.detail.index){
                    edit_recipe = curr;
                    continue;
                }
            }
            mode = "edit";
        }else {
            edit_recipe = null;
            mode = "menu";
        }
    }

    function update_view(e){
        edit_recipe = null;
        if (e.detail.index != -1){
            for (let curr of user_recipes.items){
                if (curr.id == e.detail.index){
                    view_recipe = curr;
                    continue;
                }
            }
            mode = "view";
        }else {
            view_recipe = null;
            mode = "menu";
        }
    }

    function remove_from_menu(e){
        let remove = -1;
        let cnt = 0;
        for (let recipe of menu_recipes){
            if (recipe.id == e.detail.index){
                remove = cnt;
            }
            cnt++;
        }
        if (remove > -1){
            let tmp_mults = {};
            for (let key of Object.keys(mults)){
                if (key != e.detail.index) tmp_mults[key] = mults[key];
            }
            mults = tmp_mults;
            menu_recipes.splice(remove, 1);
            menu_recipes = menu_recipes;
        }
    }

    function add_to_menu(e){
        for (let recipe of user_recipes.items){
            if (recipe.id == e.detail.index){
                recipe.checked = true;
                menu_recipes.push(recipe);
                mults[recipe.id] = recipe.servings;
            }
        }
        menu_recipes = menu_recipes;
    }

    function reset_mode(){
        mode = "menu";
        view_recipe = null;
        edit_recipe = null;
    }
</script>
<div id="main">
        {#if (user_recipes.items && user_recipes.items.length > 0) || loading}
            <div id="content" class="flex flex-col-reverse md:flex-row m-2 mt-0">
                <div id="left_column" class="md:w-1/2">
                    {#if user_recipes.items}
                        <RecipeList recipes={user_recipes.items} 
                            on:update_view={update_view} on:update_edit={update_edit}
                            on:remove_from_menu={remove_from_menu}
                            on:add_to_menu={add_to_menu} on:reset_mode={reset_mode}/>
                    {:else}
                        <div class="text-center flex flex-col justify-center items-center space-y-5 mx-2 md:mx-auto   md:text-4xl mt-[30vh] max-w-5xl"><span class="loading loading-bars loading-lg"></span></div>
                    {/if}
                </div>
                <details class="collapse bg-base-200 md:bg-base-100 collapse-arrow mb-2 w-full md:w-1/2">
                    <summary class="collapse-title text-lg p-2 h-5 flex ">Your Menu</summary>
                    <div id="right_column" class="collapse-content w-full">
                        {#if menu_recipes && mode == "menu"}
                            <Menu title="New Menu" menu={menu_recipes} {mults} {page}/>
                        {:else if view_recipe && mode == "view"}
                            <DisplayRecipe recipe={view_recipe}/>
                        {:else if edit_recipe && mode == "edit"}
                            <EditRecipe recipe={edit_recipe}/>
                        {:else}
                            <h2>select recipes to add to your menu</h2>
                        {/if}
                    </div>
                </details>
            </div>
        {:else}
            <div class="flex flex-col justify-center items-center space-y-5 bg-base-200 mx-2 md:mx-auto p-16 border-2 border-base-300 rounded-md shadow-md  md:text-4xl mt-[30vh] max-w-5xl">
                <h2>You have no recipes yet</h2>
                <div class="flex flex-row items-center space-x-1">
                    <h3>Click </h3><a href="/add_recipe" class="btn btn-primary btn-sm p-2 flex content-center">here</a><h3> to add a new recipe</h3>
                </div>
            </div>
        {/if}
</div>


