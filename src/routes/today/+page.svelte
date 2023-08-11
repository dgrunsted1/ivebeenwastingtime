<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import DisplayRecipe from "/src/lib/components/display_recipe.svelte";

    let todays_menu = {};
    let cook_recipe = {};
    let mode = "recipes";

    onMount(async () => {
        const result_list = await pb.collection('menus').getList(1, 50, {
            filter: `user="${$currentUser.id}" && today=True`,
            expand: `recipes,recipes.notes`
        });
        todays_menu = result_list.items[0];
    });

    function cook_this_recipe(e){
        for (let i = 0; i < todays_menu.expand.recipes.length; i++){
            if (todays_menu.expand.recipes[i].id == e.srcElement.id){
                cook_recipe = todays_menu.expand.recipes[i];
            }
        }
        document.body.scrollIntoView();
        mode = "cook";
    }

    function back_to_recipes(e){
        mode = "recipes";
    }
</script>

<div>
    <a class="btn btn-primary mx-6 mb-1" href="/prep">prep</a>
    <a class="btn btn-primary mx-6 mb-1" href="/my_menus">my menus</a>
    <a class="btn btn-primary mx-6 mb-1" href="/menu">create menu</a>
</div>
{#if mode == "recipes" && todays_menu.id}
    <h2>which recipe are you making today?</h2>
    <div id="recipes" class="">
        {#each todays_menu.expand.recipes as curr, i}
            <div class="card card-bordered sm:card-side bg-base-100 shadow-xl max-h-24 my-1.5 mx-1">
                <figure class="w-3/5"><img src={curr.image} alt={curr.title}/></figure>
                <div class="card-body max-h-full flex flex-row p-2 items-center w-full">
                    <!-- <h2 class="card-title">New album is released!</h2> -->
                    <p id={i} class="w-1/3">{curr.title}</p>
                    <div class="card-actions justify-self-end justify-end">
                        <button id={curr.id} class="recipe_btn btn btn-primary btn-xs {i}" on:click={cook_this_recipe}>cook this recipe</button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{:else if mode == "cook" && cook_recipe.id}
<button class="btn btn-accent btn-xs m-3" on:click={back_to_recipes}>back to today's recipes</button>
    <div id="cook_recipe" class="flex flex-col m-2 pb-10">
        <div class="img_info_container flex items-center justify-center">
            <div class="img_container w-1/4">
                <img src={cook_recipe.image} alt={cook_recipe.title} class=""/>
            </div>
            <div class="info_container w-1/2 flex flex-col m-1">
                <div class="title_container flex justify-around">
                    <div class="title w-4/5 text-xl">{cook_recipe.title}</div>
                </div>
                <div class="description_container">
                    <div class="desc text-sm" >{cook_recipe.description}</div>
                </div>
                <div class="misc flex justify-evenly">
                    <div class="author_container text-center w-1/3">
                        <label for="auth">Author</label>
                        <div class="auth">{cook_recipe.author}</div>
                    </div>
                    <div class="time_container text-center w-1/3">
                        <label for="time">Time</label>
                        <div class="time">{cook_recipe.time}</div>
                    </div>
                    <div class="servings text-center w-1/3">
                        servings
                        <div>{cook_recipe.servings}</div>
                    </div>
                </div>
                <div class="w-full flex justify-center mt-1"><a class="btn btn-accent btn-sm" href={cook_recipe.url}>original cook_recipe</a></div>
    
            </div>
        </div>
        <div class="ingr_directions_container flex m-2 items-center">
            <div id="ingredient_list" class="flex flex-col h-fit w-2/5 m-2 max-h-[calc(100vh-250px)] overflow-y-auto border-2 border-accent rounded-md p-1">
                {#each cook_recipe.ingredients as ingr}
                    {#if ingr}
                        <div class="ingr_row flex w-full gap-x-2 items-center">
                            <div class="ingr_amount text-sm text-center">{ingr.amount ? ingr.amount : ""}</div>
                            <div class="ingr_unit text-center text-sm">{ingr.unit ? ingr.unit : ""}</div>
                            <div class="ingr_name text-center text-sm">{ingr.name ? ingr.name : ingr.original}</div>
                        </div>
                        {#if cook_recipe.ingredients[cook_recipe.ingredients.length-1] != ingr}
                            <div class="divider my-1 "></div>
                        {/if}
                    {/if}
                {/each}
            </div>
        
            <div class="flex flex-col directions_list w-3/5 h-fit gap-y-8 m-2 p-1 max-h-[calc(100vh-250px)] overflow-y-auto border-2 border-accent rounded-md">
                {#each cook_recipe.directions as curr, i}
                    <div class="step flex items-center justify-center">
                        <label for="directions" class="flex text-right">Step {i+1}</label>
                        <p class="directions flex grow m-1 w-4/5 h-fit text-sm">{curr}</p>
                    </div>
                {/each}
            </div>
        </div>
        <div class="notes_container form-control mx-5">
            <label for="notes" class="label">
                <span class="label-text">Notes</span>
            </label>
            {#if cook_recipe.expand.notes}
                {#each cook_recipe.expand.notes as note, i}
                    <textarea name="notes" class="textarea textarea-bordered h-24" placeholder="Notes" value={note.content}></textarea>
                {/each}
            {/if}
            <textarea name="notes" class="textarea textarea-bordered h-24" placeholder="Notes"></textarea>
        </div>
    </div>
{/if}