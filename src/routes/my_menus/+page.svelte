<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { onMount } from 'svelte';
    import Menu from "/src/lib/components/menu.svelte";
    import { merge } from '/src/lib/merge_ingredients.js';
    import NavBtns from "/src/lib/components/nav_btns.svelte";
    import { page } from '$app/stores';
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";
    import { invalidateAll } from '$app/navigation';
  import { debug } from 'svelte/internal';


    let user_menus = []
    $: modal_menu = [];

    onMount(async () => {
        const result_list = await pb.collection('menus').getList(1, 50, {
            filter: `user="${$currentUser.id}"`,
            expand: `recipes,recipes.ingr_list`
        });
        user_menus = result_list.items;
        console.log({user_menus});
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
        let hours = parseInt(mins/60);
        mins = mins % 60;
        total_time = hours + " hrs " + mins + " mins";
        return total_time;
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
    }
</script>

<NavBtns page={$page.url.pathname}/>
<div class="form-control w-full max-w-xs">
    <input type="text" placeholder="Search" class="input input-bordered w-full max-w-xs" on:change|preventDefault={search}/>
  </div>
<div id="menus" class="max-h-[calc(100vh-130px)] overflow-y-auto">
    
    {#each user_menus as curr, i}
            <div id={user_menus[i].id} class="card card-side card-bordered bg-base-100 shadow-xl max-h-24 my-1.5 mx-1" on:click={show_menu_modal} on:keypress={show_menu_modal}>
                <figure class="w-2/3">
                    {#each user_menus[i].expand.recipes as recipe, j}
                            <img class="w-44" src={user_menus[i].expand.recipes[j].image} alt={user_menus[i].expand.recipes[j].title}/>
                    {/each}
                </figure>
                <div class="card-body flex flex-row justify-evenly content-center p-2">
                    <div class="flex flex-col justify-center">
                        <p class="text-center">{user_menus[i].title}</p>
                        <p class="text-center w-20">{format_date(user_menus[i].created)}</p>
                    </div>
                    <div class="flex flex-col justify-center">
                        <p class="text-center">{user_menus[i].expand.recipes.length} recipes</p>
                        <p class="text-center">{merge(user_menus[i].expand.recipes).grocery_list.length} ingredients</p>
                    </div>
                    <div class="flex flex-col justify-center">
                        <p class="text-center">{get_servings(user_menus[i].expand.recipes)} servings</p>
                        <p class="text-center">{get_total_time(user_menus[i].expand.recipes)}</p>
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
            <form method="dialog" class="modal-box max-w-full w-2/3 p-1">
                <Menu menu={modal_menu.expand.recipes} mults={modal_menu.servings} id={modal_menu.id}/>
            </form>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        {/if}
    </dialog>