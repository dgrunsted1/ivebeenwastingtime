<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { onMount } from 'svelte';
    import Menu from "/src/lib/components/menu.svelte";
    import { merge } from '/src/lib/merge_ingredients.js';
    import NavBtns from "/src/lib/components/nav_btns.svelte";
    import { page } from '$app/stores';
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";


    let user_menus = []
    $: modal_menu = [];

    onMount(async () => {
        const result_list = await pb.collection('menus').getList(1, 50, {
            filter: `user="${$currentUser.id}"`,
            expand: `recipes,recipes.ingr_list`
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
</script>

<NavBtns page={$page.url.pathname}/>
<div id="menus" class="max-h-[calc(100vh-130px)] overflow-y-auto">
    {#each user_menus as curr, i}
        <div id={user_menus[i].id} class="card card-side card-bordered bg-base-100 shadow-xl max-h-24 my-1.5 mx-1" on:click={show_menu_modal} on:keypress={show_menu_modal}>
            <figure class="w-2/3">
                {#each user_menus[i].expand.recipes as recipe}
                        <img class="w-44" src={recipe.image} alt={recipe.title}/>
                {/each}
            </figure>
            <div class="card-body flex flex-row justify-evenly content-center p-2">
                <div class="flex flex-col justify-center">
                    <p>{user_menus[i].expand.recipes.length} recipes</p>
                    <p>{merge(user_menus[i].expand.recipes).grocery_list.length} ingredients</p>
                </div>
                <div class="flex flex-col justify-center">
                    <p>{get_servings(user_menus[i].expand.recipes)} servings</p>
                    <p>{get_total_time(user_menus[i].expand.recipes)}</p>
                </div>
                <div class="flex conten-center items-center">
                        <button class="recipe_btn btn w-fit btn-xs bg-base-200" id={user_menus[i].id} on:click|stopPropagation={delete_menu}><DeleteIcon/></button>
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