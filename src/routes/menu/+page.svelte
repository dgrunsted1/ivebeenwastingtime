<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { each } from 'svelte/internal';

    let user_recipes;
    let menu_recipes = [];
    let mode = "menu";
    let view_recipe;
    let edit_recipe;


    onMount(async () => {
        const result_list = await pb.collection('recipes').getList(1, 50, {
            filter: `user="${$currentUser.id}"`
        });
        user_recipes = result_list;
        // console.log(user_recipes);
    });

    function check_item(e){
        let index = 0;
        let check_box;
        if (e.srcElement.parentNode.getElementsByTagName("p")[0]){
            index = e.srcElement.parentNode.getElementsByTagName("p")[0].id;
            check_box = e.target.firstChild;
            if (check_box.checked) {
                check_box.checked = false;
                let temp = [];
                for (let i = 0; i < menu_recipes.length; i++) {
                    if (menu_recipes[i].id != user_recipes.items[index].id) {
                        temp.push(menu_recipes[i]);
                    }
                }
                menu_recipes = temp;
            } else {
                check_box.checked = true;
                menu_recipes.push(user_recipes.items[index]);
                menu_recipes = menu_recipes;
            }
        }else {
            index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;
            check_box = e.srcElement;
            if (check_box.checked) {
                menu_recipes.push(user_recipes.items[index]);
                menu_recipes = menu_recipes;
            } else {
                let temp = [];
                for (let i = 0; i < menu_recipes.length; i++) {
                    if (menu_recipes[i].id != user_recipes.items[index].id) {
                        temp.push(menu_recipes[i]);
                    }
                }
                menu_recipes = temp;
            }
        }
       
    }

    function view(e) {
        let index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;
        let prev_id = get_prev_id();

        if (e.srcElement.style.background == "rgba(78, 60, 34, 0.83)" || e.srcElement.style.background == ""){
            
            mode = "view";
            update_btn_style(prev_id, index, mode);
            
            edit_recipe = null;
            view_recipe = user_recipes.items[index];
            view_recipe.recipe_id = index;
            view_recipe = view_recipe;
        }else {
            view_recipe = null;
            mode = "menu";
            update_btn_style(prev_id, index, mode);
        }
    }

    function edit(e) {
        let index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;
        let prev_id = get_prev_id();

        if (e.srcElement.style.background == "rgba(78, 60, 34, 0.83)" || e.srcElement.style.background == ""){
            mode = "edit";
            update_btn_style(prev_id, index, mode);
            view_recipe = null;
            edit_recipe = user_recipes.items[index];
            edit_recipe.recipe_id = index;
            edit_recipe = edit_recipe;
        }else {
            
            edit_recipe = null;
            mode = "menu";
            update_btn_style(prev_id, index, mode);

        }
    }

    function update_btn_style(old_index, new_index, mode_in) {
        let btns = document.getElementsByClassName("recipe_btns");
        if (old_index){
            btns[old_index].children[1].style.background = "rgba(78, 60, 34, 0.83)";
            btns[old_index].children[1].style.color = "#fcf8f4";
            btns[old_index].children[0].style.background = "rgba(78, 60, 34, 0.83)";
            btns[old_index].children[0].style.color = "#fcf8f4";
        }
        let btn;
        if (mode_in == "view") btn = 0;
        else btn = 1;
        if (mode != "menu"){
            btns[new_index].children[btn].style.background = "#fcf8f4";
            btns[new_index].children[btn].style.color = "rgba(78, 60, 34, 0.83)";
        }
        
    }

    function get_prev_id(){
        if (edit_recipe) {
            return edit_recipe.recipe_id;
        } else if (view_recipe){
            return view_recipe.recipe_id;
        }else {
            return null;
        }
    }
</script>

<div id="main">
    <h1>Menu</h1>
    <div><a href="/prep">prep</a></div>
    <div id="content">
        <div id="recipes">
            {#if user_recipes}
                {#each user_recipes.items as curr, i}
                    <div class="recipe">
                        <div class="checks" on:click|self={check_item}>
                            <input type="checkbox" on:click|self={check_item} class="checkbox" id="{curr.id}">
                        </div>
                        <p id={i}>{curr.title}</p>
                        <div class="recipe_btns">
                            <div class="recipe_btn" on:click={view}>view</div>
                            <div class="recipe_btn" on:click={edit}>edit</div>
                        </div>
                    </div>
                {/each}
            {/if}
            <!-- <div id="add_recipe" on:click={()=>{input_count++}}>Add Recipe</div> -->
        </div>
        <div id="right_column">
            {#if menu_recipes.length && mode == "menu"}
                <div id="menu">
                    {#each menu_recipes as recipe}
                        <div class="menu_recipe">
                            <p>{recipe.title}</p>
                            <p>{recipe.description}</p>
                            <!-- <p>{recipe.author}</p> -->
                            <p>{recipe.time}</p>
                            <!-- <p>{recipe.title}</p> -->
                        </div>
                    {/each}
                </div>
            {:else if view_recipe && mode == "view"}
                <div class="recipe_header">
                    <div class="title">{view_recipe.title}</div>
                </div>
            {:else if edit_recipe && mode == "edit"}
                <div id="recipe">
                    <div class="title_container">
                        <label for="title">Title</label>
                        <input class="title" type="text" bind:value={edit_recipe.title}>
                    </div>
                    <div class="decription_container">
                        <label for="desc">Description</label>
                        <input class="desc" type="text" bind:value={edit_recipe.description}>
                    </div>
                    <div class="misc">
                        <div class="author_container">
                            <label for="auth">Author</label>
                            <input class="auth" type="text" bind:value={edit_recipe.author}>
                        </div>
                        <div class="time_container">
                            <label for="time">Time</label>
                            <input class="time" type="text" bind:value={edit_recipe.time}>
                        </div>
                    </div>
                    <div>Ingredients</div>
                    <div id="ingredient_list">
                        {#each edit_recipe.ingredients as ingr}
                            {#if ingr}
                                <div class="ingr_row">
                                    <input type="text" class="ingr_amount" value={ingr.amount ? ingr.amount : ""}>
                                    <input type="text" class="ingr_unit" value={ingr.unit ? ingr.unit : ""}>
                                    <input type="text" class="ingr_name" value={ingr.name ? ingr.name : ingr.original}>
                                </div>
                            {/if}
                        {/each}
                    </div>
                    <div>Directions</div>
                    <div class="directions_list">
                        {#each edit_recipe.directions as curr, i}
                            <div class="step">
                                <label for="directions">Step {i+1}</label>
                                <textarea class="directions" value={curr}/>
                            </div>
                        {/each}
                    </div>
                    <div>Notes</div>
                    <div class="notes_container">
                        <textarea class="notes">{edit_recipe.notes}</textarea>
                    </div>
                </div>
            {:else}
                <h2>select recipes to add to your menu</h2>
            {/if}
        </div>
    </div>
</div>




<style>
    h1 {
        font-variant: normal;
        margin: 30px 150px;
    }

    #content {
        /* border: 3px solid blue; */
        margin: 5px;
        display: flex;
    }
    #recipes {
        /* border: 3px solid black; */
        margin: 5px;
        width: 50%;
    }
    #right_column {
        /* border: 3px solid green; */
        margin: 5px;
        width: 50%;
    }

    .recipe {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .checks{
        background-color: #fbe4cb;
        border: 2px solid hsla(35, 39%, 22%, 0.83);
        border-radius: 30px;
        box-shadow: hsla(35, 39%, 22%, 0.83) 3px 3px 0 0;
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
        margin: 2px;
        cursor: pointer;
    }

    input[type=checkbox] {
        margin: 2px;
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
        width: .75em;
        height: .75em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        background-color: black;
        transform-origin: bottom left;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }

    input[type="checkbox"]:checked::before {
        transform: scale(1);

    }

    .recipe_btn {
        margin: 2px 3px;
        text-align: center;
        padding:10px;
        cursor: pointer;
        border: 2px solid #555;
        background: rgba(78, 60, 34, 0.83);
        color: #fcf8f4;
        border-radius: 8px;
        padding: 1px 3px;
    }

    .recipe_btns {
        display: flex;
        margin: 3px;
    }

    p {
        margin: 3px;
    }
</style>