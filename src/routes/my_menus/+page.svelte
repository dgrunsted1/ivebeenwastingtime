<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { onMount } from 'svelte';
    import Menu from "/src/lib/components/menu.svelte";
    import { merge } from '/src/lib/merge_ingredients.js';



    let user_menus = []
    $: modal_menu = [];


    onMount(async () => {
        const result_list = await pb.collection('menus').getList(1, 50, {
            filter: `user="${$currentUser.id}"`,
            expand: `recipes`
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
        total_time = hours + "hrs " + mins + "mins";
        return total_time;
    }
</script>

<div>
    <a class="btn btn-primary mx-6 mb-1" href="/prep">prep</a>
    <a href="/menu" class="btn btn-primary mx-6">Create Menu</a>
    <a class="btn btn-primary mx-6 mb-1" href="/today">today</a>
    <a class="btn btn-primary mx-6 mb-1" href="/add_recipe">add recipe</a>
</div>
<div id="menus" class="max-h-[calc(100vh-130px)] overflow-y-auto">
    {#each user_menus as curr, i}
        <div id={curr.id} class="card card-side card-bordered bg-base-100 shadow-xl max-h-24 my-1.5 mx-1" on:click={show_menu_modal} on:keypress={show_menu_modal}>
            <figure class="w-2/3">
                {#each curr.expand.recipes as recipe}
                        <img class="w-44" src={recipe.image} alt={recipe.title}/>
                {/each}
            </figure>
            <div class="card-body flex flex-row justify-evenly content-center">
                <div class="flex flex-col justify-center">
                    <p>{curr.expand.recipes.length} recipes</p>
                    <p>{merge(curr.expand.recipes).grocery_list.length} ingredients</p>
                </div>
                <div class="flex flex-col justify-center">
                    <p>{get_servings(curr.expand.recipes)} servings</p>
                    <p>{get_total_time(curr.expand.recipes)}</p>
                </div>
              </div>
        </div>
    {/each}
</div>
    <dialog id="my_modal_2" class="modal">
        {#if modal_menu.id}
            <form method="dialog" class="modal-box max-w-full w-2/3 p-1">
                <Menu menu={modal_menu.expand.recipes} id={modal_menu.id}/>
            </form>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        {/if}
    </dialog>