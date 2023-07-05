<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let recipes;
    let curr_recipe_id = -1;

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
            index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;
            check_box = e.srcElement;
            if (check_box.checked) {
                dispatch("add_to_menu", {index: index});
            } else {
                dispatch("remove_from_menu", {index: index});
            }
        }
       
    }

    function view(e) {
        let index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;

        if (e.srcElement.style.background == "rgba(78, 60, 34, 0.83)" || e.srcElement.style.background == ""){
            
            let mode = "view";
            update_btn_style(curr_recipe_id, index, mode);
            curr_recipe_id = index;
            dispatch('update_view', {index: index});
        }else {
            dispatch("update_view", {index: -1});
            let mode = "menu";
            update_btn_style(curr_recipe_id, index, mode);
        }
    }

    function edit(e) {
        let index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;

        if (e.srcElement.style.background == "rgba(78, 60, 34, 0.83)" || e.srcElement.style.background == ""){
            let mode = "edit";
            update_btn_style(curr_recipe_id, index, mode);
            curr_recipe_id = index;
            dispatch("update_edit", {index: index});
        }else {
            let mode = "menu";
            update_btn_style(curr_recipe_id, index, mode);
            dispatch("update_edit", {index: -1});

        }
    }

    function update_btn_style(old_index, new_index, mode_in) {
        let btns = document.getElementsByClassName("recipe_btns");
        if (old_index > -1){
            btns[old_index].children[1].style.background = "rgba(78, 60, 34, 0.83)";
            btns[old_index].children[1].style.color = "#fcf8f4";
            btns[old_index].children[0].style.background = "rgba(78, 60, 34, 0.83)";
            btns[old_index].children[0].style.color = "#fcf8f4";
        }
        let btn;
        if (mode_in == "view") btn = 0;
        else btn = 1;
        if (mode_in != "menu"){
            btns[new_index].children[btn].style.background = "#fcf8f4";
            btns[new_index].children[btn].style.color = "rgba(78, 60, 34, 0.83)";
        }
        
    }
</script>

<div id="recipes">
        {#each recipes as curr, i}
            <div class="recipe">
                <div class="checks" on:click|self={check_item}>
                    <input type="checkbox" on:click|self={check_item} class="checkbox" id="{curr.id}">
                </div>
                <div class="list_item">
                    <img class="image" src={curr.image} alt={curr.title}/>
                    <p id={i}>{curr.title}</p>
                </div>
                <div class="recipe_btns">
                    <div class="recipe_btn" on:click={view}>view</div>
                    <div class="recipe_btn" on:click={edit}>edit</div>
                </div>
            </div>
        {/each}
</div>

<style>
    #recipes {
        /* border: 3px solid black; */
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

    .image {
        width: 20%;
        margin: 5px;
    }

    .list_item {
        display: flex;
        justify-content: left;
        margin: 0 15px;
        align-items: middle;
        width: 100%;
    }

    p {
        display: flex;
    }
</style>