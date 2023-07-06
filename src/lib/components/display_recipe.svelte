<script>

export let recipe;



</script>

<div id="recipe">
    <div class="img_info_container">
        <div class="img_container">
            <img src={recipe.image} alt={recipe.title}/>
        </div>
        <div class="info_container">
            <div class="title_container">
                <div class="title" >{recipe.title}</div>
            </div>
            <div class="description_container">
                <div class="desc" >{recipe.description}</div>
            </div>
            <div class="misc">
                <div class="author_container">
                    <label for="auth">Author</label>
                    <div class="auth">{recipe.author}</div>
                </div>
                <div class="time_container">
                    <label for="time">Time</label>
                    <div class="time">{recipe.time}</div>
                </div>
                <div class="servings">
                    servings
                    <div>{recipe.servings}</div>
                </div>

            </div>
        </div>
    </div>
    <div class="ingr_directions_container">
        <div>Ingredients</div>
        <div id="ingredient_list">
            {#each recipe.ingredients as ingr}
                {#if ingr}
                    <div class="ingr_row">
                        <div class="ingr_amount">{ingr.amount ? ingr.amount : ""}</div>
                        <div class="ingr_unit">{ingr.unit ? ingr.unit : ""}</div>
                        <div class="ingr_name">{ingr.name ? ingr.name : ingr.original}</div>
                    </div>
                {/if}
            {/each}
        </div>
    
        <div>Directions</div>
        <div class="directions_list">
            {#each recipe.directions as curr, i}
                <div class="step">
                    <label for="directions">Step {i+1}</label>
                    <p class="directions">{curr}</p>
                </div>
            {/each}
        </div>
        {#if recipe.notes}
            <div>Notes</div>
            <div class="notes_container">
                <div class="notes">{recipe.notes}</div>
            </div>
        {/if}
    </div>
</div>





<style>
    #recipe {
        display: flex;
        margin: auto;
        padding: 5px 0;
    }

    #ingredient_list {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 5px;
    }

    .ingr_row {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-left: 10px;
    }

    #recipe {
        flex-direction: column;
    }

    .ingr_amount {
        width: 2.25em;
        text-align: center;
        font-size: 1em;
        margin: 0 5px;
    }

    .ingr_unit {
        width: 6em;
        text-align: center;
        font-size: 1em;
        margin: 0 5px;
    }

    .ingr_name {
        width: 70%;
        font-size: 1em;
    }


    .title{
        width: 80%;
        font-size: 1.75em;
    }

    .desc {
        font-size: 1em;
    }

    .title_container, .description_container {
        display: flex;
        justify-content: space-around;
    }

    .misc {
        display: flex;
        justify-content: space-evenly;
    }

    .step, .notes_container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    [for="directions"] {
        display: flex;
        text-align: right;
    }

    .directions, .notes {
        display: flex;
        flex-grow: 1;
        margin: 5px;
        max-width: 80%;
        height: fit-content;
        font-size: 1em;
    }

    .notes {
        width: 80%;
    }

    .info_container {
        width: 50%;
        display: flex;
        flex-direction: column;
        margin: 5px;
    }

    .img_info_container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    img {
        width: 100%;
        max-width: 20em;
    }

    .ingr_directions_container {
        display: flex;
        flex-direction: column;
        width: 80%;
        margin: auto;
    }

    .author_container, .time_container, .servings {
        text-align: center;
    }
</style>