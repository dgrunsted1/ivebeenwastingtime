<script>
    import { createEventDispatcher } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase';
    import EditIcon from "/src/lib/icons/EditIcon.svelte";
    import ViewIcon from "/src/lib/icons/ViewIcon.svelte";
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";
    import { onMount, afterUpdate } from "svelte";
    import ThumbUp from "/src/lib/icons/ThumbUp.svelte";
    import Heart from "/src/lib/icons/Heart.svelte";
    import { update_fave_made } from '/src/lib/save_recipe.js';

    const dispatch = createEventDispatcher();
    export let recipes;
    let display_recipes = recipes;
    let curr_recipe_id = -1;
    let categories = {cuisines:[], countries:[], cats:[]};
    let display_cats = {cuisines:[], countries:[], cats:[]};
    let sort_opts = ["Least Ingredients", "Most Ingredients", "Least Servings", "Most Servings", "Least Time", "Most Time", "Most Recent", "Least Recent"];
    $: sort_val = null;
    let update_fave_made_list = [];
    let delay_timer;

    onMount(async () => {
        for (let i = 0; i < recipes.length; i++){
            if (!categories.cuisines.includes(recipes[i].cuisine) && recipes[i].cuisine) categories.cuisines.push(recipes[i].cuisine);
            if (!categories.countries.includes(recipes[i].country) && recipes[i].country) categories.countries.push(recipes[i].country);
            if (!categories.cats.includes(recipes[i].category) && recipes[i].category) categories.cats.push(recipes[i].category);
        }

        categories = categories;
    });

    function check_item(e){
        let index = 0;
        let check_box;
        if (e.srcElement.parentNode.getElementsByTagName("p")[0]){
            index = e.srcElement.parentNode.getElementsByTagName("p")[0].id;
            check_box = e.target.firstChild;
            if (check_box.checked) {
                check_box.checked = false;
                dispatch("remove_from_menu", {index: index});
            } else {
                dispatch("add_to_menu", {index: index});
                check_box.checked = true;
            }
        }else {
            index = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("p")[0].id;
            check_box = e.srcElement;
            if (check_box.checked) {
                dispatch("add_to_menu", {index: index});
            } else {
                dispatch("remove_from_menu", {index: index});
            }
        }
        for (let recipe of recipes){
            if (recipe.id == index) recipe.checked = false;
        }
       
    }

    function view(e) {
        let index = e.currentTarget.getElementsByTagName("h2")[0].id;
        for (let i = 0; i < display_recipes.length; i++){
            if (display_recipes[i].id == index){
                display_recipes[i].mode = `edit`;
                dispatch(`update_edit`, {index: index});
            } else {
                display_recipes[i].mode = null;
            }
        }
    }

    async function delete_recipe(e){
        let delete_recipe = confirm("Are you sure you want to delete this recipe?");
        if (delete_recipe){
            await pb.collection('recipes').delete(e.srcElement.id);
            let tmp = []
            for (let recipe of recipes){
                if (recipe.id != e.srcElement.id) tmp.push(recipe);
            }
            recipes = tmp;
            filter_recipes(recipes);
        }
    }

    function update_display_cats(selected_cat, clicked, type_cat){
        if (clicked){
            if (!display_cats[type_cat].includes(selected_cat) || ["thumb_up", "heart"].includes(selected_cat)) display_cats[type_cat].push(selected_cat);
        } else {
            let tmp_cats = [];
            for (let [key, value] of Object.entries(display_cats)){
                if (key == type_cat){
                    for (let curr_cat of value){
                        if (curr_cat != selected_cat){
                            tmp_cats.push(curr_cat);
                        }
                    }
                    display_cats[key] = tmp_cats;
                }
            }
        }
    }

    function filter_recipes(recipes_in){
        if (display_cats.cats.length || display_cats.countries.length || display_cats.cuisines.length){
            let new_display = [];
            // update new display array
            for (let curr_recipe of recipes_in){
                for (let [key, value] of Object.entries(display_cats)){
                    // cats handled after this loop
                    if (key == 'cats') continue;
                    for (let curr_cat of value){
                        if (key == 'cuisines') {
                            key = 'cuisine';
                        } else if (key == 'countries') {
                            key = 'country';
                        }
                        if (curr_recipe[key] == curr_cat){
                            if (!new_display.includes(curr_recipe)){
                                let cat_found = (!display_cats.cats.length) ? true : false;
                                for (let cat of display_cats.cats){
                                    if (cat == curr_recipe.category){
                                        cat_found = true;
                                    }
                                }
                                if (cat_found) new_display.push(curr_recipe);
                            }
                        }
                    }
                }
            }

            if (!new_display.length){
                for (let recipe of recipes_in){
                    for (let cat of display_cats.cats){
                        if (recipe.category == cat){
                            if (display_cats.cats.includes("heart") || display_cats.cats.includes("thumb_up")){
                                if ((display_cats.cats.includes("heart") && recipe.favorite) || (display_cats.cats.includes("thumb_up") && recipe.made)) {
                                    if (!new_display.includes(recipe)) new_display.push(recipe);
                                }
                            }else if (!new_display.includes(recipe)) {
                                if (!new_display.includes(recipe)) new_display.push(recipe);
                            }
                            
                        }else if (cat =="heart"){
                            if (display_cats.cats.length == 1 && display_cats.cats[0] == "heart"){
                                if (recipe.favorite && !new_display.includes(recipe)) new_display.push(recipe);
                            }else if (display_cats.cats.length == 2 && (display_cats.cats.includes("heart") && display_cats.cats.includes("thumb_up"))){
                                if (recipe.favorite && !new_display.includes(recipe)) new_display.push(recipe);
                            }
                        }else if (cat == "thumb_up"){
                            if (display_cats.cats.length == 1 && display_cats.cats[0] == "thumb_up"){
                                if (recipe.made && !new_display.includes(recipe)) new_display.push(recipe);
                            }else if (display_cats.cats.length == 2 && (display_cats.cats.includes("heart") && display_cats.cats.includes("thumb_up"))){
                                if (recipe.made && !new_display.includes(recipe)) new_display.push(recipe);
                            }
                        }
                    }
                }
            }


            display_recipes = new_display;
        }else{
            display_recipes = recipes_in;
        }
    }

    function update_filter_style(clicked, e){
        if (clicked){
            e.srcElement.classList.remove('btn-primary');
            e.srcElement.classList.add('btn-secondary');
        } else {
            e.srcElement.classList.add('btn-primary');
            e.srcElement.classList.remove('btn-secondary');
        }
    }

    function get_cat_name(classes){
        console.log({classes});
        let type_cat;
        if (classes.includes('cuisine')){
            type_cat = 'cuisines';
        }else if (classes.includes('country')){
            type_cat = 'countries';
        }else if (classes.includes('category')){
            type_cat = 'cats';
        }
        return type_cat;
    }

    function select_cat(e){
        let delay_time = (e.srcElement.tagName != "INPUT") ? 0 : 1000;
        clearTimeout(delay_timer);
        delay_timer = setTimeout(() => {
            document.getElementById("menu_loading").classList.remove('hidden');
            console.log("search", e.srcElement.value);
            let search_recipes = search(e.srcElement.value);

            if (e.srcElement.tagName != "INPUT"){
                    //get info
                    let classes = Array.from(e.srcElement.classList);
                    let clicked = (classes.includes('btn-primary')) ? true : false;
            
                    //update btn style
                    update_filter_style(clicked, e);
                    
                    //select type of category selected
                    let selected_cat = (e.srcElement.id) ? e.srcElement.id : e.srcElement.textContent;
                    let type_cat = get_cat_name(classes);
                    
                    
                    console.log({selected_cat, clicked, type_cat});
                    console.log(e.srcElement);
                    update_display_cats(selected_cat, clicked, type_cat);
            }
            filter_recipes(search_recipes);

            dispatch(`reset_mode`, {index: -1});
            document.getElementById("menu_loading").classList.add('hidden');
        }, delay_time);
        
    }

    function search(search_text){
        let recipes_with_ingr = [];
        for (let i = 0; i < recipes.length; i ++){
            for (let j = 0; j < recipes[i].expand.ingr_list.length; j++){
                // console.log(recipes[i].title);
                if (recipes[i].expand.ingr_list[j].ingredient.toUpperCase().includes(search_text.toUpperCase()) ||
                    recipes[i].title.toUpperCase().includes(search_text.toUpperCase())) {
                    recipes_with_ingr.push(recipes[i]);
                    break;
                }
            }
        }
        console.log("search done");
        return recipes_with_ingr;
    }

    function sort_recipes(e){
        sort_val = e.srcElement.innerHTML;
        switch (e.srcElement.innerHTML) {
            case "Least Ingredients":
                display_recipes = display_recipes.sort(compare_ingr_amounts_asc);
                break;
            case "Most Ingredients":
                display_recipes = display_recipes.sort(compare_ingr_amounts_dsc);
                break;
            case "Least Time":
                display_recipes = display_recipes.sort(compare_time_amounts_asc);        
                break;
            case "Most Time":
                display_recipes = display_recipes.sort(compare_time_amounts_dsc);
                break;
            case "Least Servings":
                display_recipes = display_recipes.sort(compare_serving_amounts_asc);
                break;
            case "Most Servings":
                display_recipes = display_recipes.sort(compare_serving_amounts_dsc);
                break;
            case "Least Recent":
                display_recipes = display_recipes.sort(compare_recent_asc);
                break;
            case "Most Recent":
                display_recipes = display_recipes.sort(compare_recent_dsc);
                break;
            default:
                break;
        }
        document.activeElement.blur();
    }

    function compare_ingr_amounts_asc(a, b){
        if ( a.expand.ingr_list.length < b.expand.ingr_list.length ){
            return -1;
        }
        if ( a.expand.ingr_list.length > b.expand.ingr_list.length ){
            return 1;
        }
        return 0;
    }

    function compare_ingr_amounts_dsc(a, b){
        if ( a.expand.ingr_list.length > b.expand.ingr_list.length ){
            return -1;
        }
        if ( a.expand.ingr_list.length < b.expand.ingr_list.length ){
            return 1;
        }
        return 0;
    }

    function compare_time_amounts_asc(a, b){
        if ( get_total_time(a).val > 0 && get_total_time(a).val < get_total_time(b).val ){
            return -1;
        }
        if ( get_total_time(a).val > get_total_time(b).val && get_total_time(b).val > 0 ){
            return 1;
        }
        return 0;
    }

    function compare_time_amounts_dsc(a, b){
        if ( get_total_time(a).val > get_total_time(b).val ){
            return -1;
        }
        if ( get_total_time(a).val < get_total_time(b).val ){
            return 1;
        }
        return 0;
    }

    function get_total_time(recipe){
        let total_time = 0;
        let mins = 0;
        let min_result = recipe.time.match(/(\d+) [mins|minutes]/);
        if (min_result){
            mins += parseInt(min_result[1]);
        }

        let hr_result = recipe.time.match(/(\d+) [hrs|hours|hour|hr]/);
        if (hr_result){
            mins += parseInt(hr_result[1]) * 60;
        }
        let total_mins = mins;
        let hours = parseInt(mins/60);
        mins = mins % 60;
        total_time = hours + " hrs " + mins + " mins";
        return {display: total_time, val: total_mins};
    }

    function compare_serving_amounts_asc(a, b){
        if ( parseInt(a.servings) < parseInt(b.servings) ){
            return -1;
        }
        if ( parseInt(a.servings) > parseInt(b.servings) ){
            return 1;
        }
        return 0;
    }

    function compare_serving_amounts_dsc(a, b){
        if ( parseInt(a.servings) > parseInt(b.servings) ){
            return -1;
        }
        if ( parseInt(a.servings) < parseInt(b.servings) ){
            return 1;
        }
        return 0;
    }

    function compare_recent_asc(a, b){
        if ( a.created < b.created ){
            return -1;
        }
        if ( a.created > b.created ){
            return 1;
        }
        return 0;
    }

    function compare_recent_dsc(a, b){
        if ( a.created > b.created ){
            return -1;
        }
        if ( a.created < b.created ){
            return 1;
        }
        return 0;
    }

    function update_fave_made_queue(e){
        update_fave_made_list.push(e.srcElement.id);
        clearTimeout(delay_timer);
        delay_timer = setTimeout(async () => {
            let id_update_list = [];
            for (let i = 0; i < recipes.length; i++){
                if (update_fave_made_list.includes(recipes[i].id)){
                    id_update_list.push({id: recipes[i].id, favorite: recipes[i].favorite, made: recipes[i].made});
                }
            }
            await update_fave_made(id_update_list);
            update_fave_made_list = [];

        }, 1000);
    }

    function check_time(curr){
        let result = curr.time.match(/^(\d+ (hrs|hr|hours|hour) \d+ (min|mins|minutes|minute)|\d+ (min|mins|minutes|minute)|\d+ (hrs|hr|hours|hour))$/);
        return (result) ? true : false;
    }
    
</script>
<div class="hidden md:flex flex-col">
    <div class="w-full carousel carousel-center rounded-box space-x-1 border border-accent rounded-md p-1">
        <button id="thumb_up" class="btn btn-primary btn-xs category" on:click={select_cat}><ThumbUp/></button> 
        <button id="heart" class="btn btn-primary btn-xs category" on:click={select_cat}><Heart/></button> 
        {#each categories.cats as cat}
            <button class="btn btn-primary btn-xs category" on:click={select_cat}>{cat}</button> 
        {/each}
        {#each categories.cuisines as cuisine}
            <button class="btn btn-primary btn-xs cuisine" on:click={select_cat}>{cuisine}</button> 
        {/each}
        {#each categories.countries as country}
            <button class="btn btn-primary btn-xs country" on:click={select_cat}>{country}</button> 
        {/each}
    </div>
    <div class="form-control flex flex-row justify-between w-full items-center">
        <input type="text" id="search" placeholder="Search Ingredients" class="input input-bordered input-primary w-full max-w-xs input-xs md:input-sm" on:keydown={select_cat}/>
        <p class="mx-5 text-xs md:text-sm">{display_recipes.length} Recipes</p>
        <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn m-1 btn-primary btn-xs md:btn-sm">Sort</label>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-max bg-primary">
                {#each sort_opts as opt}
                    {#if opt == sort_val}
                    <li class="btn btn-xs btn-secondary"><a on:click={sort_recipes}>{opt}</a></li>
                    {:else}
                    <li class="btn btn-xs btn-primary"><a on:click={sort_recipes}>{opt}</a></li>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
</div>

<div id="recipes" class="h-[61vh] md:h-[calc(100vh-160px)] overflow-y-auto space-y-2">
    <div id="menu_loading" class="hidden w-full flex justify-center">
        <span class="loading loading-ring loading-lg"></span>
    </div>
    {#each display_recipes as curr, i}
        <!-- <div class="flex flex-row card card-bordered card-side bg-base-200 shadow-xl max-h-24 my-1.5 mx-1 {(curr.checked) ? "bg-success" : ""}" on:click={view} on:keydown={view}> 
            <figure class="w-1/5 md:w-2/5 h-20 md:h-24"><img src={curr.image} alt={curr.title} class="h-full"/></figure>
            <div class="card-body max-h-full flex flex-row p-2 items-center w-4/5 md:w-3/5">
                <div class="flex flex-col w-full content-center h-full">
                    <p id={curr.id} class="text-xs cursor-pointer">{curr.title}</p>
                    <div class="flex flex-row justify-stretch w-full">
                        <div class="text-center text-[10px] xl:text-[12px] border border-color w-1/3 px-1 text-ellipsis whitespace-nowrap text-nowrap overflow-hidden rounded-tl rounded-bl">
                            {#if isNaN(curr.servings)}
                                {curr.servings}
                            {:else}
                                {curr.servings} serv
                            {/if}
                        </div>
                        <div class="text-center text-[10px] xl:text-[12px] border border-color w-1/3 px-1 text-ellipsis whitespace-nowrap text-nowrap overflow-hidden">
                            {#if curr.time}
                                {curr.time}
                            {:else}
                                no time
                            {/if}
                        </div>
                        <div class="text-center text-[10px] xl:text-[12px] border border-color w-1/3 px-1 text-ellipsis whitespace-nowrap text-nowrap overflow-hidden rounded-tr rounded-br">{curr.expand.ingr_list.length} ingr</div>
                    </div>
                </div>
                <div class="card-actions flex w-14 justify-self-end justify-center">
                    <div class="flex w-fit space-x-1">
                        <button id={curr.id} class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 made {curr.made ? "bg-secondary" : ""}" on:click|stopPropagation={(e)=>{curr.made = !curr.made; update_fave_made_queue(e);}}><ThumbUp/></button>
                        <button id={curr.id} class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 favorite {curr.favorite ? "bg-secondary" : ""}" on:click|stopPropagation={(e)=>{curr.favorite = !curr.favorite; update_fave_made_queue(e);}}><Heart/></button>
                    </div>
                    <div class="flex space-x-1">
                        <input type="checkbox" on:click|self|stopPropagation={check_item} class="checkbox checkbox-accent checkbox-sm" id={curr.id} bind:checked={curr.checked}>
                        <button class="recipe_btn btn w-fit p-1 btn-xs {curr.id} " on:click|stopPropagation={delete_recipe} id="{curr.id}"><DeleteIcon/></button>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="card card-side bg-base-100 shadow-xl h-32 card-bordered" on:click={view} on:keydown={view}>
            <figure class="w-1/4 bg-cover bg-no-repeat bg-center" style="background-image: url('{curr.image}')"></figure>
            <div class="card-body h-full flex flex-row p-1 w-3/4 justify-between">
                <div class="flex flex-col justify-between p-1 w-3/4">
                    <h2 id={curr.id} class="card-title text-sm">{curr.title}</h2>
                    <div class="flex w-full">
                        <div class="text-[10px] md:text-[12px] border border-color text-ellipsis whitespace-nowrap overflow-hidden h-fit px-1 text-nowrap text-center basis-12 grow rounded-tl rounded-bl">
                            {#if isNaN(curr.servings)}
                                {curr.servings}
                            {:else}
                                {curr.servings} serv
                            {/if}
                        </div>
                        <div class="text-[10px] md:text-[12px] border border-color text-ellipsis whitespace-nowrap overflow-hidden h-fit px-1 text-nowrap text-center basis-12 grow">
                            {#if curr.time}
                                {curr.time}
                            {:else}
                                no time
                            {/if}
                        </div>
                        <div class="text-[10px] md:text-[12px] border border-color text-ellipsis whitespace-nowrap overflow-hidden h-fit px-1 text-nowrap text-center basis-12 grow rounded-tr rounded-br">
                            {curr.expand.ingr_list.length} ingr
                        </div>
                    </div>
                </div>
                <div class="card-actions flex flex-col justify-center items-end content-center w-1/4">
                    <div class="flex w-fit space-x-1">
                        <button id={curr.id} class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 made {curr.made ? 'bg-secondary' : ''}" on:click|stopPropagation={(e)=>{curr.made = !curr.made; update_fave_made_queue(e);}}><ThumbUp/></button>
                        <button id={curr.id} class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 favorite {curr.favorite ? 'bg-secondary' : ''}" on:click|stopPropagation={(e)=>{curr.favorite = !curr.favorite; update_fave_made_queue(e);}}><Heart/></button>
                    </div>
                    <div class="flex w-fit space-x-2">
                        <input type="checkbox" on:click|self|stopPropagation={check_item} class="checkbox checkbox-accent checkbox-sm p-1" id={curr.id} bind:checked={curr.checked}>
                        <button class="recipe_btn btn w-fit p-1 btn-xs {curr.id} " on:click|stopPropagation={delete_recipe} id="{curr.id}"><DeleteIcon/></button>
                    </div>
                </div>
            </div>
        </div>
    {/each}
    <div class="flex justify-center m-3">
        <a class="btn btn-primary btn-xs" href="/add_recipe">Add New Recipes</a>
    </div>
</div>

<div class="flex flex-col md:hidden">
    <div class="form-control flex flex-row justify-between w-full items-center">
        <input type="text" id="search" placeholder="Search Ingredients" class="input input-bordered input-primary w-full max-w-xs input-xs md:input-sm" on:keydown={select_cat}/>
        <p class="mx-5 text-xs md:text-sm">{display_recipes.length} Recipes</p>
        <div class="dropdown dropdown-top md:dropdown-bottom dropdown-end">
            <label tabindex="0" class="btn m-1 btn-primary btn-xs md:btn-sm">Sort</label>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-max bg-primary">
                {#each sort_opts as opt}
                    {#if opt == sort_val}
                    <li class="btn btn-xs btn-secondary"><a on:click={sort_recipes} on:keydown={sort_recipes}>{opt}</a></li>
                    {:else}
                    <li class="btn btn-xs btn-primary"><a on:click={sort_recipes} on:keydown={sort_recipes}>{opt}</a></li>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
    <div class="w-full carousel carousel-center rounded-box space-x-1 border border-accent rounded-md p-1">
        <button id="thumb_up" class="btn btn-primary btn-xs category" on:click={select_cat}><ThumbUp/></button> 
        <button id="heart" class="btn btn-primary btn-xs category" on:click={select_cat}><Heart/></button> 
        {#each categories.cats as cat}
            <button class="btn btn-primary btn-xs category" on:click={select_cat}>{cat}</button> 
        {/each}
        {#each categories.cuisines as cuisine}
            <button class="btn btn-primary btn-xs cuisine" on:click={select_cat}>{cuisine}</button> 
        {/each}
        {#each categories.countries as country}
            <button class="btn btn-primary btn-xs country" on:click={select_cat}>{country}</button> 
        {/each}
    </div>
</div>