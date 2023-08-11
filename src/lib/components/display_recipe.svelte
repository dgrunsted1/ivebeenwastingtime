<script>

export let recipe;

function get_local_time(utc_code){
        const event = new Date(utc_code);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        return event.toLocaleDateString(undefined, options);
    }

</script>

<div id="recipe" class="flex flex-col m-auto py-2">
    <div class="img_info_container flex items-center justify-center">
        <div class="img_container w-1/2">
            <img src={recipe.image} alt={recipe.title} class="w-full"/>
        </div>
        <div class="info_container w-1/2 flex flex-col m-1">
            <div class="title_container flex justify-around">
                <div class="title w-4/5 text-xl">{recipe.title}</div>
            </div>
            <div class="description_container">
                <div class="desc text-sm" >{recipe.description}</div>
            </div>
            <div class="misc flex justify-evenly">
                <div class="author_container text-center w-1/3">
                    <label for="auth">Author</label>
                    <div class="auth">{recipe.author}</div>
                </div>
                <div class="time_container text-center w-1/3">
                    <label for="time">Time</label>
                    <div class="time">{recipe.time}</div>
                </div>
                <div class="servings text-center w-1/3">
                    servings
                    <div>{recipe.servings}</div>
                </div>
            </div>
            <div class="w-full flex justify-center mt-1"><a class="btn btn-accent btn-sm" href={recipe.url}>original recipe</a></div>

        </div>
    </div>
    <div class="ingr_directions_container flex flex-col w-4/5 m-auto">
        <div>Ingredients</div>
        <div id="ingredient_list" class="flex flex-col w-full m-2">
            {#each recipe.ingredients as ingr}
                {#if ingr}
                    <div class="ingr_row flex w-full ml-2.5">
                        <div class="ingr_amount text-sm my-1 text-center w-9">{ingr.amount ? ingr.amount : ""}</div>
                        <div class="ingr_unit w-24 text-center text-sm my-1">{ingr.unit ? ingr.unit : ""}</div>
                        <div class="ingr_name w-7/10 text-sm">{ingr.name ? ingr.name : ingr.original}</div>
                    </div>
                {/if}
            {/each}
        </div>
    
        <div>Directions</div>
        <div class="directions_list">
            {#each recipe.directions as curr, i}
                <div class="step flex items-center justify-center">
                    <label for="directions" class="flex text-right">Step {i+1}</label>
                    <p class="directions flex grow m-1 w-4/5 h-fit text-sm">{curr}</p>
                </div>
            {/each}
        </div>
        {#if recipe.expand.notes}
            <div>Notes</div>
            {#each recipe.expand.notes as note, i}
                <div class="notes_container flex items-center justify-center">
                    <div class="notes flex grow m-1 w-4/5 h-fit text-sm">{get_local_time(note.updated)}</div>
                    <div class="notes flex grow m-1 w-4/5 h-fit text-sm">{note.content}</div>
                </div>
            {/each}
        {/if}
    </div>
</div>