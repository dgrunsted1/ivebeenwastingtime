<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import EditRecipe from "/src/lib/components/edit_recipe.svelte";
    import DisplayRecipe from "/src/lib/components/display_recipe.svelte";
    import RecipeList from "/src/lib/components/recipe_list.svelte";
    import Menu from "/src/lib/components/menu.svelte";


    let user_recipes;
    let menu_recipes = [];
    let mode = "menu";
    let view_recipe;
    let edit_recipe;


    onMount(async () => {
        const result_list = await pb.collection('recipes').getList(1, 50, {
            filter: `user="${$currentUser.id}"`,
            expand: `notes, ingr_list`
        });
        user_recipes = result_list;
        console.log({user_recipes});
    });

    function update_edit(e){
        view_recipe = null;
        if (e.detail.index != -1) {
            for (let curr of user_recipes.items){
                // console.log({curr});
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
        console.log("index", e.detail.index);
        edit_recipe = null;
        if (e.detail.index != -1){
            for (let curr of user_recipes.items){
                // console.log({curr});
                if (curr.id == e.detail.index){
                    console.log({curr});
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
            menu_recipes.splice(remove, 1);
            menu_recipes = menu_recipes;
        }
    }

    function add_to_menu(e){
        for (let recipe of user_recipes.items){
            if (recipe.id == e.detail.index){
                recipe.checked = true;
                menu_recipes.push(recipe);
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
    <div id="content" class="flex flex-row m-2">
        <div id="left_column" class="w-1/2">
            <div>
                <a class="btn btn-primary mx-6 mb-1" href="/prep">prep</a>
                <a class="btn btn-primary mx-6 mb-1" href="/my_menus">my menus</a>
                <a class="btn btn-primary mx-6 mb-1" href="/today">today</a>
                <a class="btn btn-primary mx-6 mb-1" href="/add_recipe">add recipe</a>
            </div>
            {#if user_recipes}
                <RecipeList recipes={user_recipes.items} 
                    on:update_view={update_view} on:update_edit={update_edit}
                    on:remove_from_menu={remove_from_menu}
                    on:add_to_menu={add_to_menu} on:reset_mode={reset_mode}/>
            {/if}
        </div>
        <div id="right_column" class="w-1/2 m-2 max-h-[calc(100vh-90px)] overflow-y-auto">
            {#if menu_recipes && mode == "menu"}
                <Menu menu={menu_recipes}/>
            {:else if view_recipe && mode == "view"}
                <DisplayRecipe recipe={view_recipe}/>
            {:else if edit_recipe && mode == "edit"}
                <EditRecipe recipe={edit_recipe}/>
            {:else}
                <h2>select recipes to add to your menu</h2>
            {/if}
        </div>
    </div>
</div>


