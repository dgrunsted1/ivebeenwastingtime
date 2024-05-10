<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import ThumbUp from "/src/lib/icons/ThumbUp.svelte";
    import Heart from "/src/lib/icons/Heart.svelte";
    import { onMount } from 'svelte';
    import { update_fave_made } from '/src/lib/save_recipe.js';
    import { update_made } from '/src/lib/groceries.js'


    
    /** @type {import('./$types').PageData} */
    export let data;
    const scroll_size = 425;
    let user_logged_in = false;
    let todays_menu;
    let recipe_ready = false;

    onMount(async () => {
        if ($currentUser.id == data.post.recipe.user) user_logged_in = true;

        const result_menu = await pb.collection('menus').getList(1, 1, {
            filter: `user="${$currentUser.id}" && today=True`,
        });
        todays_menu = result_menu.items[0];
        (todays_menu.sub_recipes, todays_menu.made);
        update_recipe_ready();
    });

    function toggle_made(e){
        const id = e.srcElement.id;
        if (todays_menu.made){
            todays_menu.made[id] = !todays_menu.made[id];
        } else {
            todays_menu.made = {};
            todays_menu.made[id] = true;
        }
        update_made(todays_menu.made, todays_menu.id);
    }

    const update_recipe_ready = function() {
        let curr_sub_recipes = [];
        if (todays_menu.sub_recipes){
            for (let j = 0; j < todays_menu.sub_recipes[data.post.recipe.id].length; j++) {
                curr_sub_recipes.push(todays_menu.sub_recipes[data.post.recipe.id][j].recipe_id);
            }
            curr_sub_recipes = curr_sub_recipes;
            if (curr_sub_recipes.length){
                let is_ready = true;
                for (let i in todays_menu.made){
                    if (curr_sub_recipes.includes(i) && !todays_menu.made[i]) {
                        is_ready = false;
                        break;
                    }
                }
                recipe_ready = is_ready;
            } else {
                recipe_ready = true;
            }
        } else {
            recipe_ready = true;
        }
    }

    const get_quantity = function(quantity){
        if (isNaN(data.post.recipe.servings) || isNaN(data.post.servings)){
            return quantity;
        }
        if (quantity){
            let output = quantity * (parseFloat(data.post.servings) / parseFloat(data.post.recipe.servings));
            return output.toFixed(2) * 1;
        } else {
            return "";
        }
    }

    async function update_fave_made_pre(){
        await update_fave_made([{id: data.post.recipe.id, favorite: data.post.recipe.favorite, made: data.post.recipe.made}]);
    }

</script>

    <div id="cook_recipe" class="flex flex-col md:m-2 pb-3 md:pb-10">
        <div class="img_info_container flex flex-col md:flex-row items-center justify-center">
            <div class="img_container w-full md:w-1/4">
                <img src={data.post.recipe.image} alt={data.post.recipe.title} class=""/>
            </div>
            <div class="info_container w-full md:w-1/2 flex flex-col m-1 space-y-1">
                <div class="title_container mx-auto my-2">
                    <div class="title w-full text-sm md:text-xl">{data.post.recipe.title}</div>
                </div>
                <div class="description_container m-auto w-5/6">
                    <div class="desc text-xs md:text-sm" >{data.post.recipe.description}</div>
                </div>
                <div class="misc flex justify-evenly">
                    <div class="author_container text-center w-1/3 text-xs md:text-sm">
                        <label for="auth">Author</label>
                        <div class="auth">{data.post.recipe.author}</div>
                    </div>
                    <div class="time_container text-center w-1/3 text-xs md:text-sm">
                        <label for="time">Time</label>
                        <div class="time">{data.post.recipe.time}</div>
                    </div>
                    <div class="servings text-center w-1/3 text-xs md:text-sm">
                        servings
                        <div>{data.post.servings}</div>
                    </div>
                </div>
                <div class="flex justify-evenly items-center">
                    {#if data.post.recipe.url}
                        <div class=" flex justify-center mt-1"><a class="btn btn-accent btn-sm" href={data.post.recipe.url} target="_blank">original recipe</a></div>
                    {/if}    
                    {#if user_logged_in}
                        <!-- <div class="w-1/3 flex justify-evenly"> -->
                            {#if recipe_ready}
                                <input type="checkbox" class="checkbox checkbox-lg md:checkbox-sm" id={data.post.recipe.id} bind:checked={todays_menu.made[data.post.recipe.id]} on:click|stopPropagation={toggle_made}>
                            {:else}
                                not ready
                            {/if}
                            <!-- <button id={display_recipes[i].id} class="btn btn-xs md:btn-sm p-1 made" on:click|stopPropagation={(e)=>{display_recipes[i].made = !display_recipes[i].made; update_fave_made_queue(e);}}><ThumbUp color={(display_recipes[i].made) ? "fill-primary" : "fill-neutral"}/></button> -->
                            <button class="btn btn-xs md:btn-sm p-1 btn-ghost made flex content-center" on:click={()=>{data.post.recipe.made = !data.post.recipe.made; update_fave_made_pre();}}><ThumbUp color={(data.post.recipe.made) ? "fill-primary" : "fill-neutral"}/></button>
                            <button class="btn btn-xs md:btn-sm p-1 btn-ghost favorite flex content-center" on:click={()=>{data.post.recipe.favorite = !data.post.recipe.favorite; update_fave_made_pre();}}><Heart color={(data.post.recipe.favorite) ? "fill-primary" : "fill-neutral"}/></button>
                        <!-- </div> -->
                    {/if}
                </div>    
            </div>
        </div>
        <div class="ingr_directions_container flex flex-col md:flex-row m-2 md:m-2 items-center">
            <div id="ingredient_list" class="flex flex-col h-fit w-full md:w-2/5 m-2 max-h-[calc(25vh)] md:max-h-[calc(64vh)] overflow-y-auto border-2 border-primary rounded-md py-1 md:py-4">
                {#each data.post.recipe.expand.ingr_list as ingr}
                    {#if ingr}
                        <div class="ingr_row flex items-center mx-1 md:m-2 gap-x-1 md:gap-x-2">
                            <div class="ingr_amount text-xs md:text-sm text-center">{get_quantity(ingr.quantity)}</div>
                            <div class="ingr_unit text-center text-xs md:text-sm">{ingr.unit ? ingr.unit : ""}</div>
                            <div class="ingr_name text-center text-xs md:text-sm">{ingr.ingredient}</div>
                        </div>
                        {#if data.post.recipe.expand.ingr_list[data.post.recipe.expand.ingr_list.length-1] != ingr}
                            <div class="divider my-px md:my-1 "></div>
                        {/if}
                    {/if}
                {/each}
            </div>
        
            <div class="flex flex-col directions_list md:w-3/5 h-fit md:gap-y-8 p-1 md:p-2 max-h-[calc(25vh)] md:max-h-[calc(64vh)] overflow-y-auto border-2 border-primary rounded-md">
                {#each data.post.recipe.directions as curr, i}
                    <div class="step flex items-center justify-center gap-x-1 md:gap-x-3 md:mx-2">
                        <label for="directions" class="flex md:text-right text-xs md:text-sm">Step {i+1}</label>
                        <p class="directions flex grow m-1 md:w-4/5 h-fit text-xs md:text-sm">{curr}</p>
                    </div>
                    {#if data.post.recipe.directions[data.post.recipe.directions.length-1] != curr}
                            <div class="divider my-px md:my-1 "></div>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="notes_container form-control mt-5 md:mx-5">
            <label for="notes" class="label">
                <span class="label-text">Notes</span>
            </label>
            {#if data.post.recipe.expand.notes}
                {#each data.post.recipe.expand.notes as note, i}
                    <textarea name="notes" class="textarea textarea-bordered border-primary h-24" placeholder="Notes" value={note.content}></textarea>
                {/each}
            {/if}
            <textarea name="notes" class="textarea textarea-bordered border-primary h-24" placeholder="Notes"></textarea>
        </div>
    </div>
