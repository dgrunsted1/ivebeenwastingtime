<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { page } from '$app/stores';
    
    /** @type {import('./$types').PageData} */
    export let data;
    const scroll_size = 425;

    const get_quantity = function(quantity){
        if (quantity){
            let output = quantity * (parseFloat(data.post.servings) / parseFloat(data.post.recipe.servings));
            return output.toFixed(2) * 1;
        } else {
            return "";
        }
    }

</script>

    <div id="cook_recipe" class="flex flex-col md:m-2 pb-3 md:pb-10">
        <div class="img_info_container flex flex-col md:flex-row items-center justify-center">
            <div class="img_container w-full md:w-1/4">
                <img src={data.post.recipe.image} alt={data.post.recipe.title} class=""/>
            </div>
            <div class="info_container w-full md:w-1/2 flex flex-col m-1">
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
                <div class="w-full flex justify-center mt-1"><a class="btn btn-accent btn-sm" href={data.post.recipe.url} target="_blank">original recipe</a></div>
    
            </div>
        </div>
        <div class="ingr_directions_container flex flex-col md:flex-row m-2 md:m-2 items-center">
            <div id="ingredient_list" class="flex flex-col h-fit w-full md:w-2/5 m-2 max-h-[calc(25vh)] md:max-h-[calc(64vh)] overflow-y-auto border-2 border-accent rounded-md py-4">
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
        
            <div class="flex flex-col directions_list md:w-3/5 h-fit md:gap-y-8 p-1 md:p-2 max-h-[calc(25vh)] md:max-h-[calc(64vh)] overflow-y-auto border-2 border-accent rounded-md">
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
                    <textarea name="notes" class="textarea textarea-bordered h-24" placeholder="Notes" value={note.content}></textarea>
                {/each}
            {/if}
            <textarea name="notes" class="textarea textarea-bordered h-24" placeholder="Notes"></textarea>
        </div>
    </div>
