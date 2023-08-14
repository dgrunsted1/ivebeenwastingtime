<script>
    import { createEventDispatcher } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase';
    import EditIcon from "/src/lib/icons/EditIcon.svelte";
    import ViewIcon from "/src/lib/icons/ViewIcon.svelte";
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";
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
            index = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("p")[0].id;
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
        let index = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("p")[0].id;
        let element = e.srcElement;
        let mode_in = (e.srcElement.classList.contains("view")) ? "view" : "edit";
        if (element.classList.contains("bg-base-200")){
            
            
            update_btn_style(curr_recipe_id, index, mode_in);

            curr_recipe_id = index;
            dispatch(`update_${mode_in}`, {index: index});
        }else {
            update_btn_style(curr_recipe_id, index, mode);
            dispatch(`update_${mode_in}`, {index: -1});
        }
    }

    function update_btn_style(old_index, new_index, mode_in) {
        let btn;
        if (mode_in == "view") btn = 0;
        else btn = 1;

        let btns = document.getElementsByClassName(`recipe_btn ${new_index}`);

        if (old_index > -1){
            let old_btns = document.getElementsByClassName(`recipe_btn ${old_index}`);
            
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
</script>

<div id="recipes" class="max-h-[calc(100vh-130px)] overflow-y-auto">
        {#each recipes as curr, i}
            <div class="card card-bordered sm:card-side bg-base-100 shadow-xl max-h-24 my-1.5 mx-1">
                <figure class="w-2/5"><img src={curr.image} alt={curr.title}/></figure>
                <div class="card-body max-h-full flex flex-row p-2 items-center w-3/5">
                    <p id={i} class="w-3/4">{curr.title}</p>
                    <div class="card-actions flex w-14 justify-self-end justify-center">
                        <div class="flex w-fit space-x-1">
                            <button class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 {i} view" on:click={view}><ViewIcon/></button>
                            <button class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 {i} edit" on:click={view}><EditIcon/></button>
                        </div>
                        <div class="flex space-x-1">
                            <input type="checkbox" on:click|self={check_item} class="checkbox checkbox-accent" id="{curr.id}">
                            <button class="recipe_btn btn w-fit p-1 btn-xs {i} " on:click={delete_recipe} id="{curr.id}"><DeleteIcon/></button>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
</div>
