<script>
    import { currentUser, pb } from '/src/lib/pocketbase';


    export let recipe;

    async function save_recipe(e) {
        if (recipe.id){
            const data = {
                "title": recipe.title,
                "description": recipe.description,
                "author": recipe.author,
                "time": recipe.time,
                "ingredients": JSON.stringify(recipe.ingredients),
                "directions": JSON.stringify(recipe.directions),
                "notes": recipe.notes,
                "servings": recipe.servings
            };
            const record = await pb.collection('recipes').update(recipe.id, data);
        }else {
            const data = {
                "title": recipe.title,
                "description": recipe.description,
                "url": e.srcElement.parentElement.previousElementSibling.getElementsByClassName("link_input")[0].value,
                "author": recipe.author,
                "time": recipe.time,
                "ingredients": JSON.stringify(recipe.ingredients),
                "directions": JSON.stringify(recipe.directions),
                "notes": e.srcElement.parentElement.getElementsByClassName("notes")[0].value,
                "user": currentUser.id,
                "servings": recipe.servings
            }
            const record = await pb.collection('recipes').create(data);
        }
    }
</script>

<div id="recipe">
    <div class="title_container">
        <label for="title">Title</label>
        <input class="title" type="text" bind:value={recipe.title}>
    </div>
    <div class="decription_container">
        <label for="desc">Description</label>
        <input class="desc" type="text" bind:value={recipe.description}>
    </div>
    <div class="misc">
        <div class="author_container">
            <label for="auth">Author</label>
            <input class="auth" type="text" bind:value={recipe.author}>
        </div>
        <div class="time_container">
            <label for="time">Time</label>
            <input class="time" type="text" bind:value={recipe.time}>
        </div>
    </div>
    <div>Ingredients</div>
    <div id="ingredient_list">
        {#each recipe.ingredients as ingr, i}
            {#if ingr}
                <div class="ingr_row">
                    <input type="text" class="ingr_amount" bind:value={recipe.ingredients[i].amount}>
                    <input type="text" class="ingr_unit" bind:value={recipe.ingredients[i].unit}>
                    {#if ingr.name}
                        <input type="text" class="ingr_name" bind:value={recipe.ingredients[i].name}>
                    {:else}
                        <input type="text" class="ingr_name" bind:value={recipe.ingredients[i].original[0]}>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
    <div>Directions</div>
    <div class="directions_list">
        {#each recipe.directions as curr, i}
            <div class="step">
                <label for="directions">Step {i+1}</label>
                <textarea class="directions" bind:value={curr}/>
            </div>
        {/each}
    </div>
    <div>Notes</div>
    <div class="notes_container">
        <textarea class="notes" bind:value={recipe.notes}></textarea>
    </div>
    <div class="save_btn" on:click={save_recipe}>
        save recipe
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

    .save_btn {
        margin: 10px auto;
        width: 40%;
        text-align: center;
        padding:10px;
        cursor: pointer;
        border: 2px solid #555;
        background: hsla(35, 39%, 22%, 0.83);
        color: white;
        border-radius: 8px;
        padding: 5px;
    }
</style>