<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { onMount } from 'svelte';
    import Menu from "/src/lib/components/menu.svelte";
    import { merge } from '/src/lib/merge_ingredients.js';
    import { page } from '$app/stores';
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";
    import { invalidateAll } from '$app/navigation';
  import { debug } from 'svelte/internal';

    
    let user_menus = [];
    $: modal_menu = [];
    $: sort_val = null;
    let sort_opts = ["Least Recipes", "Most Recipes", "Least Ingredients", "Most Ingredients", "Least Servings", "Most Servings", "Least Time", "Most Time", "Most Recent", "Least Recent"];

    onMount(async () => {
        if (!$currentUser) window.location.href = "/login";
        const result_list = await pb.collection('menus').getList(1, 50, {
            filter: `user="${$currentUser.id}"`,
            expand: `recipes,recipes.ingr_list`,
            sort: `-created`
        });
        user_menus = result_list.items;
    });

    function show_menu_modal(e){
        let id = "";
        if (e.srcElement.id){
            id = e.srcElement.id;
        }else if (e.srcElement.parentElement.id){
            id = e.srcElement.parentElement.id;
        }else if (e.srcElement.parentElement.parentElement.id){
            id = e.srcElement.parentElement.parentElement.id;
        }
        for (let i = 0; i < user_menus.length; i++){
            if (user_menus[i].id == id){
                modal_menu = user_menus[i];
            }
        }
        my_modal_2.showModal();
    }

    function get_servings(recipes){
        let total_serv = 0;
        for (let i = 0; i < recipes.length; i++){
            total_serv += parseInt(recipes[i].servings);
        }
        return total_serv;
    }

    function get_total_time(recipes){
        let total_time = 0;
        let mins = 0;
        for (let i = 0; i < recipes.length; i++){
            let min_result = recipes[i].time.match(/(\d+) [mins|minutes]/);
            if (min_result){
                mins += parseInt(min_result[1]);
            }

            let hr_result = recipes[i].time.match(/(\d+) [hrs|hours|hour|hr]/);
            if (hr_result){
                mins += parseInt(hr_result[1]) * 60;
            }
        }
        let total_mins = mins;
        let hours = parseInt(mins/60);
        mins = mins % 60;
        total_time = hours + " hrs " + mins + " mins";
        return {display: total_time, val: total_mins};
    }

    async function delete_menu(e){
        if (confirm("Are you sure you want to delete this recipe?")) {
            await pb.collection('menus').delete(e.srcElement.id);
            let tmp_menus = [];
            for (let i = 0; i < user_menus.length; i++){
                if (user_menus[i].id != e.srcElement.id) tmp_menus.push(user_menus[i]);
            }
            user_menus = tmp_menus;
        }
    }

    function format_date(in_date){
        const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let output = "";
        let menu_date = new Date(in_date);
        let menu_day = menu_date.getDate();
        let menu_month = menu_date.getMonth();
        let menu_year = menu_date.getFullYear();
        let today = new Date();
        if (menu_year == today.getFullYear()){
            if (menu_month == today.getMonth()){
                if (menu_day == today.getDate()){
                    output = "Today";
                } else if (today.getDate() - menu_day < 7){
                    output = day_names[menu_date.getDay()];
                } else {
                    output = menu_date.toLocaleDateString(undefined, {month: 'short', day: 'numeric' });
                }
            } else {
                output = menu_date.toLocaleDateString(undefined, {month: 'short', day: 'numeric' });
            } 
        } else {
            output = menu_date.toLocaleDateString(undefined, {year: '2-digit', month: 'short', day: 'numeric' });
        }
        return output;
    }

    async function search(e){
        document.getElementById("user_menus_length").innerHTML = `<span class="loading loading-dots loading-xs"></span>`;
        let search_str = e.srcElement.value;
        let recipe_ids = [];
        if (search_str == ""){
            const result_list = await pb.collection('menus').getList(1, 50, {
                filter: `user="${$currentUser.id}"`,
                expand: `recipes,recipes.ingr_list`
            });
            user_menus = result_list.items;
            return;
        }
        const result_ingr = await pb.collection('ingredients').getList(1, 50, {
            filter: `ingredient ~ '${search_str}'`,
            expand: `recipe`
        });
        for (let i = 0; i < result_ingr.items.length; i++){
            for (let j = 0; j < result_ingr.items[i].recipe.length; j++){
                if (!recipe_ids.includes(result_ingr.items[i].recipe[j])) recipe_ids.push(result_ingr.items[i].recipe[j]);
            }
        }
        const result_recipe = await pb.collection('recipes').getList(1, 50, {
            filter: `title ~ '${search_str}'`,
        });
        for (let i = 0; i < result_recipe.items.length; i++){
            if (!recipe_ids.includes(result_recipe.items[i].id)) recipe_ids.push(result_recipe.items[i].id);
        }
        let recipe_id_string = "";
        for (let i = 0; i < recipe_ids.length; i++){
            recipe_id_string += ` || recipes ~ '${recipe_ids[i]}'`;
        }
        const result_menu = await pb.collection('menus').getList(1, 50, {
            filter: `title ~ '${search_str}'${recipe_id_string}`,
            expand: `recipes,recipes.ingr_list`
        });
        user_menus = result_menu.items;
        document.getElementById("user_menus_length").innerHTML = user_menus.length;
    }

    function sort_menus(e){
        sort_val = e.srcElement.innerHTML;
        switch (e.srcElement.innerHTML) {
            case "Least Recipes":
                user_menus = user_menus.sort(compare_recipe_amounts_asc);
                break;
            case "Most Recipes":
                user_menus = user_menus.sort(compare_recipe_amounts_dsc);
                break;
            case "Least Ingredients":
                user_menus = user_menus.sort(compare_ingr_amounts_asc);
                break;
            case "Most Ingredients":
                user_menus = user_menus.sort(compare_ingr_amounts_dsc);
                break;
            case "Least Time":
                user_menus = user_menus.sort(compare_time_amounts_asc);        
                break;
            case "Most Time":
                user_menus = user_menus.sort(compare_time_amounts_dsc);
                break;
            case "Least Servings":
                user_menus = user_menus.sort(compare_serving_amounts_asc);
                break;
            case "Most Servings":
                user_menus = user_menus.sort(compare_serving_amounts_dsc);
                break;
            case "Least Recent":
                user_menus = user_menus.sort(compare_recent_asc);
                break;
            case "Most Recent":
                user_menus = user_menus.sort(compare_recent_dsc);
                break;
            default:
                break;
        }
        document.activeElement.blur();

    }

    function compare_recipe_amounts_asc(a, b){
        if ( a.expand.recipes.length < b.expand.recipes.length ){
            return -1;
        }
        if ( a.expand.recipes.length > b.expand.recipes.length ){
            return 1;
        }
        return 0;
    }

    function compare_recipe_amounts_dsc(a, b){
        if ( a.expand.recipes.length > b.expand.recipes.length ){
            return -1;
        }
        if ( a.expand.recipes.length < b.expand.recipes.length ){
            return 1;
        }
        return 0;
    }

    function compare_ingr_amounts_asc(a, b){
        if ( merge(a.expand.recipes).grocery_list.length < merge(b.expand.recipes).grocery_list.length ){
            return -1;
        }
        if ( merge(a.expand.recipes).grocery_list.length > merge(b.expand.recipes).grocery_list.length ){
            return 1;
        }
        return 0;
    }

    function compare_ingr_amounts_dsc(a, b){
        if ( merge(a.expand.recipes).grocery_list.length > merge(b.expand.recipes).grocery_list.length ){
            return -1;
        }
        if ( merge(a.expand.recipes).grocery_list.length < merge(b.expand.recipes).grocery_list.length ){
            return 1;
        }
        return 0;
    }

    function compare_serving_amounts_asc(a, b){
        if ( get_servings(a.expand.recipes) < get_servings(b.expand.recipes) ){
            return -1;
        }
        if ( get_servings(a.expand.recipes) > get_servings(b.expand.recipes) ){
            return 1;
        }
        return 0;
    }

    function compare_serving_amounts_dsc(a, b){
        if ( get_servings(a.expand.recipes) > get_servings(b.expand.recipes) ){
            return -1;
        }
        if ( get_servings(a.expand.recipes) < get_servings(b.expand.recipes) ){
            return 1;
        }
        return 0;
    }

    function compare_time_amounts_asc(a, b){
        if ( get_total_time(a.expand.recipes).val < get_total_time(b.expand.recipes).val ){
            return -1;
        }
        if ( get_total_time(a.expand.recipes).val > get_total_time(b.expand.recipes).val ){
            return 1;
        }
        return 0;
    }

    function compare_time_amounts_dsc(a, b){
        if ( get_total_time(a.expand.recipes).val > get_total_time(b.expand.recipes).val ){
            return -1;
        }
        if ( get_total_time(a.expand.recipes).val < get_total_time(b.expand.recipes).val ){
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
</script>

<div class="flex justify-between mx-4">
    <div class="flex w-fit space-x-6 items-center">
        <div class="form-control w-full max-w-xs">
            <input type="text" placeholder="Search" class="input input-bordered input-xs md:input-md w-36 md:w-52 max-w-xs" on:change|preventDefault={search}/>
        </div>
        <div class="w-full flex space-x-1 text-xs"><div id="user_menus_length">{user_menus.length}</div><div>Menus</div></div>
    </div>
    
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn m-1 btn-primary btn-xs md:btn-md">Sort</label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-max bg-primary">
            {#each sort_opts as opt}
                {#if opt == sort_val}
                <li class="btn btn-xs btn-secondary"><a on:click={sort_menus}>{opt}</a></li>
                {:else}
                <li class="btn btn-xs btn-primary"><a on:click={sort_menus}>{opt}</a></li>
                {/if}
            {/each}
        </ul>
    </div>
</div>

<div id="menus" class="max-h-[calc(100vh-120px)] overflow-y-auto">
    
    {#each user_menus as curr, i}
            <div id={user_menus[i].id} class="card md:card-side card-bordered bg-base-100 shadow-xl max-h-24 my-1.5 mx-1" on:click={show_menu_modal} on:keypress={show_menu_modal}>
                <figure class="md:w-2/3">
                    {#each user_menus[i].expand.recipes as recipe, j}
                            <img class="w-16 md:w-20" src={user_menus[i].expand.recipes[j].image} alt={user_menus[i].expand.recipes[j].title}/>
                    {/each}
                </figure>
                <div class="card-body flex flex-row justify-evenly content-center p-2 md:w-3/4">
                    <div class="flex flex-col justify-center text-xs md:text-md">
                        <p class="text-center">{user_menus[i].title}</p>
                        <p class="text-center md:w-20">{format_date(user_menus[i].created)}</p>
                    </div>
                    <div class="flex flex-col justify-center text-xs md:text-md">
                        <p class="text-center">{user_menus[i].expand.recipes.length} recipes</p>
                        <p class="text-center">{merge(user_menus[i].expand.recipes).grocery_list.length} ingredients</p>
                    </div>
                    <div class="flex flex-col justify-center text-xs md:text-md">
                        <p class="text-center">{get_servings(user_menus[i].expand.recipes)} servings</p>
                        <p class="text-center">{get_total_time(user_menus[i].expand.recipes).display}</p>
                    </div>
                    <div class="flex conten-center items-center">
                            <button class="recipe_btn btn w-fit btn-xs btn-primary" id={user_menus[i].id} on:click|stopPropagation={delete_menu}><DeleteIcon/></button>
                    </div>
                </div>
            </div>
    {/each}
</div>
    <dialog id="my_modal_2" class="modal">
        {#if modal_menu.id}
            <form method="dialog" class="modal-box max-w-full md:w-2/3 p-1">
                <Menu menu={modal_menu.expand.recipes} mults={modal_menu.servings} id={modal_menu.id}/>
            </form>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        {/if}
    </dialog>