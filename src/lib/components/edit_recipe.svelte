<script>
    import { currentUser, pb } from '/src/lib/pocketbase';
    import { createEventDispatcher } from 'svelte';
 

    export let recipe;
    let removed = [];
    let dispatch = createEventDispatcher();

    async function save_recipe(e) {
        let temp = [];
        for (let i = 0; i < recipe.ingredients.length; i++){
            if (!recipe.ingredients[i].removed) temp.push(recipe.ingredients[i]);
        }
        recipe.ingredients = temp;
        reset_checks();
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
        if (recipe.id){
            const record = await pb.collection('recipes').update(recipe.id, data);
        }else {
            data.user = $currentUser.id;
            data.url = e.srcElement.parentElement.previousElementSibling.getElementsByClassName("link_input")[0].value;
            const record = await pb.collection('recipes').create(data);
            recipe = record;
        }
        dispatch("update_recipe", {recipe: recipe});
    }

    function reset_checks(){
        Array.from(document.querySelectorAll(".removed input[type='checkbox']")).forEach(curr => {
            curr.checked = false;
        });
    }

    function check_item(e){
        let original;
        let is_removed = false;
        if (e.srcElement.type != "checkbox"){
            original = e.target.firstChild.id;
            if (e.target.firstChild.checked){
                e.target.firstChild.checked = false;
            }else{
                e.target.firstChild.checked = true;
                is_removed = true;
            }
        }else{
            original = e.srcElement.id;
            is_removed = e.srcElement.checked;
        }
        let temp = [];
        for (let i = 0; i < recipe.ingredients.length; i++){
            if (recipe.ingredients[i].original == original){
                recipe.ingredients[i].removed = is_removed;
            }
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
                <div class="ingr_row" class:removed={ingr.removed}>
                    <input type="text" class="ingr_amount" bind:value={recipe.ingredients[i].amount}>
                    <input type="text" class="ingr_unit" bind:value={recipe.ingredients[i].unit}>
                    {#if ingr.name}
                        <input type="text" class="ingr_name" bind:value={recipe.ingredients[i].name}>
                    {:else}
                        <input type="text" class="ingr_name" bind:value={recipe.ingredients[i].original[0]}>
                    {/if}
                    <div class="checks" on:click={check_item}><input on:click={check_item} type="checkbox" class="checkbox" id="{recipe.ingredients[i].original}"></div>
                </div>
            {/if}
        {/each}
    </div>
    <div>Directions</div>
    <div class="directions_list">
        {#each recipe.directions as curr, i}
            <div class="step">
                <label for="directions">Step {i+1}</label>
                <textarea class="directions" bind:value={recipe.directions[i]}/>
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

    .checks{
        background-color: #fbe4cb;
        border: 2px solid hsla(35, 39%, 22%, 0.83);
        border-radius: 30px;
        box-shadow: hsla(35, 39%, 22%, 0.83) 4px 4px 0 0;
        color: hsla(35, 39%, 22%, 0.83);
        cursor: initial;
        display: inline-block;
        font-weight: 600;
        font-size: 18px;
        padding: 0 10px;
        line-height: 30px;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        padding: 2px;
        border-radius: 50%;
        margin: 2px 0;
        cursor: pointer;
    }

    input[type=checkbox] {
        margin: 0px;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fbe4cb;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    input[type="checkbox"]::before {
        content: "";
        width: .8em;
        height: .8em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        background-color: black;
        transform-origin: bottom left;
        clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
    }

    input[type="checkbox"]:checked::before {
        transform: scale(1);

    }

    .removed {
        text-decoration: line-through;
    }
</style>