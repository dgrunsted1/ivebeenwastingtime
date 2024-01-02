<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import NavBtns from "/src/lib/components/nav_btns.svelte";
    import { page } from '$app/stores';
    
    /** @type {import('./$types').PageData} */
    export let data;

    const get_quantity = function(quantity){
        if (quantity){
            let output = quantity * (parseFloat(data.post.servings) / parseFloat(data.post.recipe.servings));
            return output.toFixed(2);
        } else {
            return "";
        }
    }

</script>

<NavBtns page={$page.url.pathname}/>
    <div id="cook_recipe" class="flex flex-col m-2 pb-10">
        <div class="img_info_container flex items-center justify-center">
            <div class="img_container w-1/4">
                <img src={data.post.recipe.image} alt={data.post.recipe.title} class=""/>
            </div>
            <div class="info_container w-1/2 flex flex-col m-1">
                <div class="title_container flex justify-around">
                    <div class="title w-4/5 text-xl">{data.post.recipe.title}</div>
                </div>
                <div class="description_container">
                    <div class="desc text-sm" >{data.post.recipe.description}</div>
                </div>
                <div class="misc flex justify-evenly">
                    <div class="author_container text-center w-1/3">
                        <label for="auth">Author</label>
                        <div class="auth">{data.post.recipe.author}</div>
                    </div>
                    <div class="time_container text-center w-1/3">
                        <label for="time">Time</label>
                        <div class="time">{data.post.recipe.time}</div>
                    </div>
                    <div class="servings text-center w-1/3">
                        servings
                        <div>{data.post.servings}</div>
                    </div>
                </div>
                <div class="w-full flex justify-center mt-1"><a class="btn btn-accent btn-sm" href={data.post.recipe.url} target="_blank">original recipe</a></div>
    
            </div>
        </div>
        <div class="ingr_directions_container flex m-2 items-center">
            <div id="ingredient_list" class="flex flex-col h-fit w-2/5 m-2 max-h-[calc(100vh-250px)] overflow-y-auto border-2 border-accent rounded-md py-4">
                {#each data.post.recipe.expand.ingr_list as ingr}
                    {#if ingr}
                        <div class="ingr_row flex items-center m-2 gap-x-2">
                            <div class="ingr_amount text-sm text-center">{get_quantity(ingr.quantity)}</div>
                            <div class="ingr_unit text-center text-sm">{ingr.unit ? ingr.unit : ""}</div>
                            <div class="ingr_name text-center text-sm">{ingr.ingredient}</div>
                        </div>
                        {#if data.post.recipe.expand.ingr_list[data.post.recipe.expand.ingr_list.length-1] != ingr}
                            <div class="divider my-1 "></div>
                        {/if}
                    {/if}
                {/each}
            </div>
        
            <div class="flex flex-col directions_list w-3/5 h-fit gap-y-8 m-2 p-2 max-h-[calc(100vh-250px)] overflow-y-auto border-2 border-accent rounded-md">
                {#each data.post.recipe.directions as curr, i}
                    <div class="step flex items-center justify-center gap-x-3 mx-2">
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
            {#if data.post.recipe.expand.notes}
                {#each data.post.recipe.expand.notes as note, i}
                    <textarea name="notes" class="textarea textarea-bordered h-24" placeholder="Notes" value={note.content}></textarea>
                {/each}
            {/if}
            <textarea name="notes" class="textarea textarea-bordered h-24" placeholder="Notes"></textarea>
        </div>
    </div>
