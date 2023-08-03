<script>
    import { currentUser, pb } from '/src/lib/pocketbase';
    import { createEventDispatcher,afterUpdate } from 'svelte';
    import { page } from '$app/stores';  

    export let recipe;
    export let index;
    let dispatch = createEventDispatcher();
    let categories = ["Beverage", "Bread", "Dessert", "Main", "Salad", "Soup", "Side"];
    
    afterUpdate( () => {
        if (!recipe.category) recipe.category = "Category";
    });

    async function save_recipe(e) {
        console.log(recipe.id);
        // return;
        // console.log(e.srcElement.parentElement.parentElement.previousElementSibling.getElementsByClassName("link_input")[0].value);
        e.srcElement.disabled = true;
        e.srcElement.innerHTML = "uploading";
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
            "servings": recipe.servings,
            "image": recipe.image,
            "category": recipe.category,
            "cuisine": recipe.cuisine,
            "country": recipe.country
        };
        console.log({data});
        if (recipe.id){
            const record = await pb.collection('recipes').update(recipe.id, data);
        }else {
            data.user = $currentUser.id;
            data.url = recipe.url;
            const record = await pb.collection('recipes').create(data);
            recipe = record;
        }
        dispatch("update_recipe", {recipe: recipe});
        e.srcElement.innerHTML = "saved";
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

    function enable_save(){
        if (!index) index = 0;
        document.getElementsByClassName("save_btn")[index].disabled = false;
        document.getElementsByClassName("save_btn")[index].innerHTML = "save recipe";
    }

    function update_multiplier(e){
    console.log(e.srcElement.parentElement.parentElement.parentElement);
    let desired_servings = e.srcElement.parentElement.parentElement.getElementsByClassName("desired_servings")[0].value;
    let servings_in_recipe = e.srcElement.parentElement.parentElement.getElementsByClassName("recipe_servings")[0].value;
    multiplier = desired_servings / servings_in_recipe;
    dispatch("update_multiplier", {
        multiplier: multiplier,
        index: index
    });
}

function select_category(e){
    recipe.category = e.srcElement.innerHTML;
    e.srcElement.parentElement.parentElement.parentElement.firstChild.innerHTML = e.srcElement.innerHTML;
    const elem = document.activeElement;
    if(elem){
      elem?.blur();
    }
    enable_save();
}
</script>

<div id="recipe" class="flex flex-col w-full">
    <div class="img_info_container flex flex-row w-full content-center justify-around">
        <div class="img_container mr-3 flex w-1/2 content-center">
            <img src={recipe.image} alt={recipe.title} class="self-center"/>
        </div>
        <div class="info_container w-1/2 mx-1">
            <div class="title_container form-control">
                <label for="title" class="label p-0"><span class="label-text-alt p-0">Title</span></label>
                <input type="text" class="title input input-bordered input-xs" bind:value={recipe.title} on:input|preventDefault={enable_save}/>
            </div>
            <div class="decription_container form-control w-full">
                <label for="desc" class="label p-0"><span class="label-text-alt p-0">Description</span></label>
                <textarea class="desc textarea textarea-bordered" type="text" bind:value={recipe.description} on:input|preventDefault={enable_save}></textarea>
            </div>
            <div class="misc w-full">
                <div class="flex flex-row">
                    <div class="author_container form-control w-1/2">
                        <label for="auth" class="label p-0"><span class="label-text-alt p-0">Author</span></label>
                        <input class="auth input input-bordered input-xs px-1 mr-1" type="text" bind:value={recipe.author} on:input|preventDefault={enable_save}>
                    </div>
                    <div class="time_container form-control w-1/2">
                        <label for="time" class="label p-0"><span class="label-text-alt p-0">Time</span></label>
                        <input class="time input input-bordered input-xs px-1" type="text" bind:value={recipe.time} on:input|preventDefault={enable_save}>
                    </div>
                </div>
                <div>
                    <div id="servings" class="flex flex-row justify-center content-center">
                        <div class="mr-1 form-control w-1/2">
                            <label for="recipe_servings" class="mx-1 label p-0"><span class="label-text-alt p-0">recipe servings</span></label>
                            <input type="text" name="recipe_servings" id="recipe_servings" class="recipe_servings input input-bordered p-1 input-xs" value={recipe ? recipe.servings : 1} on:input|preventDefault={update_multiplier} on:delete|preventDefault={update_multiplier} min=1>
                        </div>
                        {#if $page.url.pathname == "/prep"}
                            <div class="form-control w-1/2">
                                <label for="recipe_servings" class="mx-1 label p-0"><span class="label-text-alt p-0">desired servings</span></label>
                                <input type="text" name="desired_servings" id="desired_servings" class="desired_servings input input-bordered p-1 input-xs" value={recipe ? recipe.servings : 1} on:input|preventDefault={update_multiplier} on:delete|preventDefault={update_multiplier} min=1 >
                            </div>
                        {/if}
                    </div>
                    <div class="flex justify-evenly content-center w-full space-x-1 flex-wrap">
                        <div class="form-control w-3/7">
                            <label for="cuisine" class="mx-1 label p-0"><span class="label-text-alt p-0">cuisine</span></label>
                            <input type="text" name="cuisine"class="input input-bordered p-1 input-xs" bind:value={recipe.cuisine} on:input|preventDefault={enable_save}>
                        </div>
                        <div class="form-control w-3/7">
                            <label for="country" class="mx-1 label p-0"><span class="label-text-alt p-0">country</span></label>
                            <input type="text" name="country"class="input input-bordered p-1 input-xs" bind:value={recipe.country} on:input|preventDefault={enable_save}>
                        </div>
                        <div class="dropdown w-full flex justify-center">
                            <label tabindex="0" class="btn btn-xs m-1" bind:innerHTML={recipe.category} contenteditable="true"></label>
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {#each categories as cat}
                                <li on:click={select_category}><a>{cat}</a></li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="w-full flex justify-center mt-1"><a class="btn btn-accent btn-sm" href={recipe.url} target="_blank">original recipe</a></div>
            </div>
        </div>
    </div>
    <div class="ingr_directions_container">
        <div class="badge badge-primary ml-14 mt-3">Ingredients</div>
        <div id="ingredient_list">
            {#each recipe.ingredients as ingr, i}
                {#if ingr}
                    <div class="ingr_row flex flex-row justify-center items-center mt-1 " class:removed={ingr.removed}>
                        <input type="text" class="ingr_amount input input-bordered input-xs px-1 mr-1 w-10 text-center" bind:value={recipe.ingredients[i].amount} on:input|preventDefault={enable_save}>
                        <input type="text" class="ingr_unit input input-bordered input-xs px-1 mr-1 w-16 text-center" bind:value={recipe.ingredients[i].unit} on:input|preventDefault={enable_save}>
                        {#if recipe.ingredients[i].name}
                            <input type="text" class="ingr_name input input-bordered input-xs px-1 mr-1 w-80 h-fit" bind:value={recipe.ingredients[i].name} on:input|preventDefault={enable_save}>
                        {:else}
                            <input type="text" class="ingr_name input input-bordered input-xs px-1 mr-1 w-80" bind:value={recipe.ingredients[i].original[0]} on:input|preventDefault={enable_save}>
                        {/if}
                        <!-- <div class="checkbox checkbox-xs" on:click={check_item}> -->
                            <input on:click={check_item} type="checkbox" class="checkbox checkbox-accent checkbox-sme" id="{recipe.ingredients[i].original}">
                        <!-- </div> -->
                    </div>
                {/if}
            {/each}
        </div>

        <div class="directions_list w-full flex flex-col items-center">
            <div class="badge badge-primary mt-3 self-start">Directions</div>
            {#each recipe.directions as curr, i}
                <div class="step w-4/5">
                    <label for="directions" class="labelmx-1 label p-0 "><span class="label-text-alt p-0">Step {i+1}</span></label>
                    <textarea class="directions w-full textarea textarea-bordered" bind:value={recipe.directions[i]} on:input|preventDefault={enable_save}/>
                </div>
            {/each}
        </div>

        <div class="notes_container m-1 w-full flex flex-col items-center">
            <div class="badge badge-primary mt-3 self-start">Notes</div>
            <textarea class="notes textarea w-4/5 textarea-bordered" bind:value={recipe.notes} on:input|preventDefault={enable_save}></textarea>
        </div>
        <div class="save_btn_container flex flex-col items-center">
            <button class="save_btn btn btn-secondary w-1/3" on:click={save_recipe}>
                save recipe
            </button>
        </div>
    </div>
</div>