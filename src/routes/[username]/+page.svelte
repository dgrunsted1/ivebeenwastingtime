<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import ThumbUp from "/src/lib/icons/ThumbUp.svelte";
    import Heart from "/src/lib/icons/Heart.svelte";
    import Edit from "/src/lib/icons/EditIcon.svelte";
    import { afterUpdate, onMount } from 'svelte';
    import { update_fave_made, update_notes } from '/src/lib/save_recipe.js';
    import { update_made } from '/src/lib/groceries.js'
    import { update_image_upload, update_recipe_image } from '/src/lib/save_recipe.js';
    import EditRecipe from "/src/lib/components/edit_recipe.svelte";
    import RecipeList from "/src/lib/components/recipe_list.svelte";
    import Timer from "/src/lib/components/timer.svelte";
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";
    import { get_servings, format_date, delete_menu, get_total_time_menu } from '/src/lib/recipe_util.js';
    import { merge } from '/src/lib/merge_ingredients.js';



    
    /** @type {import('./$types').PageData} */
    export let data;
    let user_logged_in = false;
    const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    onMount(() => {
        if ($currentUser.id == data.post.page_id) user_logged_in = true;
    });

    function get_last_update_date(){
        let latest_date;
        data.post.recipes.forEach(recipe => {
            if(!latest_date){
                latest_date = new Date(recipe.updated);
            } else {
                let date = new Date(recipe.updated);
                if(date > latest_date) latest_date = date;
            }
        });

        data.post.menus.forEach(menu => {
            let date = new Date(menu.updated);
                if(date > latest_date) latest_date = date;
        });

        return format_date(latest_date);
    }

    function menus_per_week(){
        //last 6 months
        let menus_in_last_6_months = data.post.menus.filter(menu => {
            let date = new Date(menu.created);
            return date > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6);
        });
        console.log(menus_in_last_6_months.length);
        let menus_per_week = menus_in_last_6_months.length / 26;
        return menus_per_week.toFixed(1);
    }

    function recipes_added_per_week(){
        let recipes_in_last_6_months = data.post.recipes.filter(recipe => {
            let date = new Date(recipe.created);
            return date > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6);
        });
        console.log(recipes_in_last_6_months.length);
        let recipes_per_week = recipes_in_last_6_months.length / 26;
        return recipes_per_week.toFixed(1);
    }

    function most_used_recipe(){
        let recipe_counts = {};
        for (let i = 0; i < data.post.menus.length; i++) {
            for (let j = 0; j < data.post.menus[i].expand.recipes.length; j++) {
                if (recipe_counts[data.post.menus[i].expand.recipes[j].id]){
                    recipe_counts[data.post.menus[i].expand.recipes[j].id]++;
                } else {
                    recipe_counts[data.post.menus[i].expand.recipes[j].id] = 1;
                }
            }
        }
        let max;
        console.log(recipe_counts);
        for (let i = 0; recipe_counts.length; i ++){
            if(!max || recipe_counts[recipe_counts[i]] > max){
                max = recipe_counts[i];
            }
        }
        console.log(max);
    }
</script>
<div class="flex flex-col items-center">
    <div>
        <h1 class="flex">{data.post.user.name}'s Chef Notebook</h1>
        <div class="flex space-x-5 content-center">
            <div>
                @{data.post.user.username}
            </div>
            <div>
                joined: {format_date(data.post.user.created)}
            </div>
            <div>
                last update: {get_last_update_date()}
            </div>
            <div>
                {data.post.recipes.length} recipes
            </div>
            <div>
                {data.post.menus.length} menus
            </div>
            <div>
                {#if data.post.user.avatar}
                    <img src={data.post.user.avatar} alt="user avatar"/>
                {:else}
                    <div class="max-w-56 relative h-fit w-fit">
                        <input type="file" name="photo" id="photo" class="w-8 md:w-10 absolute  self-center md:h-10 opacity-0 z-10" on:change={async(e) => {recipe.image = await update_image_upload(e)}}/>
                        <button class="btn btn-xs md:btn-sm btn-secondary w-8 md:w-16 absolute  self-center">add photo</button>
                    </div>
                {/if}
            </div>
        </div>
        <div class="flex space-x-5 content-center w-full">
            <div>
                {menus_per_week()} menu{(menus_per_week() != 1 )? "s" : ""} / week
            </div>
            <div>
                {recipes_added_per_week()} recipe{(recipes_added_per_week() != 1 )? "s" : ""} / week
            </div>
            <div>
                you love {most_used_recipe()}
            </div>
        </div>
    </div>
    <div class="w-full flex p-2 space-x-2">
        <div class="w-1/2">
            {#if data}
                <RecipeList recipes={data.post.recipes}/>
            {/if}
        </div>
        <div class="w-1/2 h-[81vh] md:h-[calc(100svh-55px)] overflow-y-auto">
            {#if data}
                {#each data.post.menus as curr, i}
                    <div id={data.post.menus[i].id} class="card md:card-side card-bordered bg-base-200 shadow-xl max-h-24 my-1.5 mx-1 cursor-pointer">
                        <figure class="md:w-2/3">
                            {#each data.post.menus[i].expand.recipes as recipe, j}
                                    <img class="w-16 md:w-20" src={data.post.menus[i].expand.recipes[j].image} alt={data.post.menus[i].expand.recipes[j].title}/>
                            {/each}
                        </figure>
                        <div class="card-body flex flex-row justify-evenly content-center p-1 w-full">
                            <div class="flex flex-col w-full justify-between content-center h-full">
                                <div class="flex flex-row justify-center text-xs md:text-md">
                                    <p class="text-center">{data.post.menus[i].title}</p>
                                    <p class="text-center md:w-20">{format_date(data.post.menus[i].created)}</p>
                                </div>
                                <div class="flex flex-row justify-evenly w-full">
                                    <p class="text-center text-[10px] xl:text-[12px] border border-primary px-1 text-ellipsis whitespace-nowrap text-nowrap overflow-hidden rounded-tl rounded-bl">{data.post.menus[i].expand.recipes.length} recipes</p>
                                    <p class="text-center text-[10px] xl:text-[12px] border border-primary px-1 text-ellipsis whitespace-nowrap text-nowrap overflow-hidden">{merge(data.post.menus[i].expand.recipes).grocery_list.length} ingredients</p>
                                    <p class="text-center text-[10px] xl:text-[12px] border border-primary px-1 text-ellipsis whitespace-nowrap text-nowrap overflow-hidden">{get_servings(data.post.menus[i].expand.recipes, data.post.menus[i].sub_recipes)} servings</p>
                                    <p class="text-center text-[10px] xl:text-[12px] border border-primary px-1 text-ellipsis whitespace-nowrap text-nowrap overflow-hidden rounded-tr rounded-br">{get_total_time_menu(data.post.menus[i].expand.recipes).display}</p>
                                </div>
                            </div>
                            <div class="flex conten-center items-center">
                                <button id={data.post.menus[i].id} class="btn btn-sm p-1 btn-accent"  on:click|stopPropagation={async (e) => {data.post.menus = await delete_menu(e, data.post.menus);}}><DeleteIcon/></button>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>