<script>
    import { createEventDispatcher } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase';
    import EditIcon from "/src/lib/icons/EditIcon.svelte";
    import ViewIcon from "/src/lib/icons/ViewIcon.svelte";
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";
    import { onMount, afterUpdate } from "svelte";
    const dispatch = createEventDispatcher();
    export let recipes;
    let display_recipes = recipes;
    let curr_recipe_id = -1;
    let categories = {cuisines:[], countries:[], cats:[]};
    let display_cats = {cuisines:[], countries:[], cats:[]};

    onMount(async () => {
        for (let i = 0; i < recipes.length; i++){
            if (!categories.cuisines.includes(recipes[i].cuisine) && recipes[i].cuisine) categories.cuisines.push(recipes[i].cuisine);
            if (!categories.countries.includes(recipes[i].country) && recipes[i].country) categories.countries.push(recipes[i].country);
            if (!categories.cats.includes(recipes[i].category) && recipes[i].category) categories.cats.push(recipes[i].category);
        }
        console.log({categories});
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
        let mode = "menu";
        let index = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("p")[0].id;
        let element = e.srcElement;
        let mode_in = (e.srcElement.classList.contains("view")) ? "view" : "edit";
        if (element.classList.contains("bg-base-200")){
            update_btn_style(curr_recipe_id, index, mode_in);
            curr_recipe_id = index;
            dispatch(`update_${mode_in}`, {index: index});
        }else {
            update_btn_style(curr_recipe_id, -1, mode);
            dispatch(`update_${mode_in}`, {index: -1});
        }
    }

    function update_btn_style(old_index, new_index, mode_in) {
        let btn;
        if (mode_in == "view") btn = 0;
        else btn = 1;

        let btns = document.getElementsByClassName(`recipe_btn ${new_index}`);
        let old_btns = document.getElementsByClassName(`recipe_btn ${old_index}`);
        if (old_index != -1){
                old_btns[1].classList.remove("bg-secondary");
                old_btns[1].classList.add("bg-base-200");
                old_btns[0].classList.remove("bg-secondary");
                old_btns[0].classList.add("bg-base-200");
        }
        
        if (mode_in != "menu"){
            btns[btn].classList.add("bg-secondary");
            btns[btn].classList.remove("bg-base-200");
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
        }
    }

    function update_display_cats(selected_cat, clicked, type_cat){
        if (clicked){
            if (!display_cats[type_cat].includes(selected_cat)) display_cats[type_cat].push(selected_cat);
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
                                console.log({curr_recipe});
                                console.log({display_cats});
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
                            new_display.push(recipe);
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
        document.getElementById("menu_loading").classList.remove('hidden');

        let search_recipes = search();

        if (e.srcElement.tagName != "INPUT"){
            //get info
            let classes = Array.from(e.srcElement.classList);
            let clicked = (classes.includes('btn-primary')) ? true : false;
    
            //update btn style
            update_filter_style(clicked, e);
            
            //select type of category selected
            let selected_cat = e.srcElement.textContent;
            let type_cat = get_cat_name(classes);
            
            

            update_display_cats(selected_cat, clicked, type_cat);
        }
        
        filter_recipes(search_recipes);

        update_btn_style(curr_recipe_id, -1, "menu");
        dispatch(`reset_mode`, {index: -1});
        document.getElementById("menu_loading").classList.add('hidden');
    }

    function search(){
        let recipes_with_ingr = [];
        for (let i = 0; i < recipes.length; i ++){
            for (let j = 0; j < recipes[i].expand.ingr_list.length; j++){
                if (recipes[i].expand.ingr_list[j].ingredient.includes(document.getElementById("search").value)){
                    recipes_with_ingr.push(recipes[i]);
                    break;
                }
            }
        }
        return recipes_with_ingr;
    }
</script>
<div class="flex flex-col space-y-1">
    <div class="w-full carousel carousel-center rounded-box space-x-1 border border-accent rounded-md py-1">
        {#each categories.cuisines as cuisine}
            <button class="btn btn-primary btn-xs cuisine" on:click={select_cat}>{cuisine}</button> 
        {/each}
        {#each categories.countries as country}
            <button class="btn btn-primary btn-xs country" on:click={select_cat}>{country}</button> 
        {/each}
        {#each categories.cats as cat}
            <button class="btn btn-primary btn-xs category" on:click={select_cat}>{cat}</button> 
        {/each}
    </div>
    <div class="form-control flex flex-row justify-around w-full items-center">
        <input type="text" id="search" placeholder="Search Ingredients" class="input input-bordered input-primary w-full max-w-xs" on:change={select_cat}/>
        <p class="mx-5">{display_recipes.length}</p>
    </div>
</div>

<div id="recipes" class="max-h-[calc(100vh-130px)] overflow-y-auto">
    <div id="menu_loading" class="hidden w-full flex justify-center">
        <span class="loading loading-ring loading-lg"></span>
    </div>
    {#each display_recipes as curr, i}
        <div class="card card-bordered sm:card-side bg-base-100 shadow-xl max-h-24 my-1.5 mx-1">
            <figure class="w-2/5"><img src={curr.image} alt={curr.title}/></figure>
            <div class="card-body max-h-full flex flex-row p-2 items-center w-3/5">
                <p id={curr.id} class="w-3/4">{curr.title}</p>
                <div class="card-actions flex w-14 justify-self-end justify-center">
                    <div class="flex w-fit space-x-1">
                        <button class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 {curr.id} view" on:click={view}><ViewIcon/></button>
                        <button class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 {curr.id} edit" on:click={view}><EditIcon/></button>
                    </div>
                    <div class="flex space-x-1">
                        <input type="checkbox" on:click|self={check_item} class="checkbox checkbox-accent" id={curr.id} bind:checked={curr.checked}>
                        <button class="recipe_btn btn w-fit p-1 btn-xs {curr.id} " on:click={delete_recipe} id="{curr.id}"><DeleteIcon/></button>
                    </div>
                </div>
            </div>
        </div>
    {/each}
    <div class="flex justify-center m-5">
        <a class="btn btn-primary" href="/add_recipe">Add New Recipes</a>
    </div>
</div>
