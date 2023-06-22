<script>

export let recipe;



</script>

<div id="recipe">
    <div class="title_container">
        <label for="title">Title</label>
        <div class="title" >{recipe.title}</div>
    </div>
    <div class="decription_container">
        <label for="desc">Description</label>
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
    </div>
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
    <div>Notes</div>
    <div class="notes_container">
        <div class="notes">{recipe.notes}</div>
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
        justify-content: center;
    }

    #recipe {
        width: 70%;
        flex-direction: column;
    }

    .ingr_amount {
        width: 2.25em;
        text-align: center;
        font-size: .7em;
    }

    .ingr_unit {
        width: 6em;
        text-align: center;
        font-size: .7em;
    }

    .ingr_name {
        width: 70%;
        font-size: .7em;
    }


    .title, .desc {
        width: 80%;
        font-size: 1em;
    }

    .title_container, .decription_container, .misc {
        display: flex;
        justify-content: space-around;
    }

    .step, .notes_container {
        display: flex;
        align-items: center;
        justify-content: center;
        /* width: 80%;
        margin: auto; */
    }

    [for="directions"] {
        display: flex;
        /* flex-grow: 1; */
        text-align: right;
    }

    .directions, .notes {
        display: flex;
        flex-grow: 1;
        margin: 5px;
        max-width: 80%;
        height: fit-content;
        font-size: .7em;
    }

    .notes {
        width: 80%;
    }
</style>