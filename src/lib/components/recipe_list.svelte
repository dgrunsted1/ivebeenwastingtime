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
        let mode = "menu";
        let index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;
        if (e.srcElement.classList.contains("btn-primary")){
            
            mode = "view";
            update_btn_style(curr_recipe_id, index, mode);

            curr_recipe_id = index;
            dispatch('update_view', {index: index});
        }else {
            update_btn_style(curr_recipe_id, index, mode);
            dispatch("update_view", {index: -1});
        }
    }

    function edit(e) {
        let mode = "menu";
        let index = e.srcElement.parentNode.parentNode.getElementsByTagName("p")[0].id;

        if (e.srcElement.classList.contains("btn-primary")){
            mode = "edit";
            update_btn_style(curr_recipe_id, index, mode);
            curr_recipe_id = index;
            dispatch("update_edit", {index: index});
        }else {
            update_btn_style(curr_recipe_id, index, mode);
            dispatch("update_edit", {index: -1});
        }
    }

    function update_btn_style(old_index, new_index, mode_in) {
        let btn;
        if (mode_in == "view") btn = 0;
        else btn = 1;

        let btns = document.getElementsByClassName(`recipe_btn ${new_index}`);

        if (old_index > -1){
            let old_btns = document.getElementsByClassName(`recipe_btn ${old_index}`);
                old_btns[1].classList.remove("btn-secondary");
                old_btns[1].classList.add("btn-primary");
                old_btns[0].classList.remove("btn-secondary");
                old_btns[0].classList.add("btn-primary");
        }
        
        if (mode_in != "menu"){
            btns[btn].classList.add("btn-secondary");
            btns[btn].classList.remove("btn-primary");
        }
    }
</script>

<div id="recipes" class="max-h-[calc(100vh-130px)] overflow-y-auto">
        {#each recipes as curr, i}
            <div class="card card-bordered sm:card-side bg-base-100 shadow-xl max-h-24 my-1.5 mx-1">
                <figure class="w-3/5"><img src={curr.image} alt={curr.title}/></figure>
                <div class="card-body max-h-full flex flex-row p-2 items-center w-full">
                    <!-- <h2 class="card-title">New album is released!</h2> -->
                    <p id={i} class="w-1/3">{curr.title}</p>
                    <div class="card-actions justify-self-end justify-end">
                        <input type="checkbox" on:click|self={check_item} class="checkbox checkbox-accent" id="{curr.id}">
                        <button class="recipe_btn btn btn-primary btn-xs {i}" on:click={view}>view</button>
                        <button class="recipe_btn btn btn-primary btn-xs {i}" on:click={edit}>edit</button>
                    </div>
                </div>
            </div>
        {/each}
</div>
