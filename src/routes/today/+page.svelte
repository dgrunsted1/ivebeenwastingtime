<script>
    import { onMount, afterUpdate } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import GroceryList from "/src/lib/components/grocery_list.svelte";
    import { page } from '$app/stores';
    import { get_grocery_list, groupBySimilarity } from '/src/lib/merge_ingredients.js'
    import { update_grocery_list, create_grocery_list, update_made } from '/src/lib/groceries.js'
    import Heart from "/src/lib/icons/Heart.svelte";
    import { update_fave } from '/src/lib/save_recipe.js';


    let todays_menu = {};
    let grocery_list = [];
    let grocery_list_id = "";
    let grocery_list_status = "saved";
    let mode = "menu";
    $: loading = true;
    let delay_timer;
    let update_fave_list = [];

    onMount(async () => {
        if (!$currentUser) window.location.href = "/login";
        const result_list = await pb.collection('menus').getList(1, 50, {
            filter: `user="${$currentUser.id}" && today=True`,
            expand: `recipes,recipes.notes,recipes.ingr_list, grocery_list`
        });
        if (result_list.items[0]){
            todays_menu = result_list.items[0];
            if (!todays_menu.expand.grocery_list || !todays_menu.expand.grocery_list.list){
                grocery_list = get_grocery_list(todays_menu);
                grocery_list_id = create_grocery_list(grocery_list, todays_menu.id);
            } else {
                grocery_list = groupBySimilarity(todays_menu.expand.grocery_list.list);
                grocery_list_id = todays_menu.expand.grocery_list.id;
            }
            let checked = [];
            let unchecked = [];
            for (let i = 0; i < grocery_list.length; i++){
                if (grocery_list[i].checked){
                    checked.push(grocery_list[i]);
                } else {
                    unchecked.push(grocery_list[i]);
                }
            }
            grocery_list = unchecked.concat(checked);
        }
        loading = false;
    });

    async function update_groceries(e){
        grocery_list_status = "updating";
        await update_grocery_list(e.detail.grocery_list, grocery_list_id);
        grocery_list = e.detail.grocery_list;
        grocery_list_status = "saved";
    }

    async function reset_list(){
        grocery_list = get_grocery_list(todays_menu);
        await update_grocery_list(grocery_list, grocery_list_id);
    }

    function toggle_made(e){
        const id = e.srcElement.id;
        if (todays_menu.made){
            todays_menu.made[id] = !todays_menu.made[id];
        } else {
            todays_menu.made = {};
            todays_menu.made[id] = true;
        }
        clearTimeout(delay_timer);
        delay_timer = setTimeout(function() {
            update_made(todays_menu.made, todays_menu.id);
        }, 2000);
    }

    function update_fave_queue(e){
        update_fave_list.push(e.srcElement.id);
        clearTimeout(delay_timer);
        delay_timer = setTimeout(async () => {
            let id_update_list = [];
            for (let i = 0; i < todays_menu.expand.recipes.length; i++){
                if (update_fave_list.includes(todays_menu.expand.recipes[i].id)){
                    id_update_list.push({id: todays_menu.expand.recipes[i].id, favorite: todays_menu.expand.recipes[i].favorite});
                }
            }
            await update_fave(id_update_list);
            update_fave_list = [];

        }, 2000);
    }
</script>

{#if todays_menu.id}
    <div id="main">
        <div class="flex justify-center p-1">
            <h1 class="text-2xl">{todays_menu.title}</h1>
        </div>
        <div id="content" class="flex flex-col md:flex-row m-2 mt-0 space-y-24 md:space-y-0">
            <div id="left_column" class="md:w-1/2 md:max-h-[calc(100vh-150px)] md:overflow-y-auto">
                <div id="recipes" class="">
                    {#each todays_menu.expand.recipes as curr, i}
                    <div on:click={window.location = `/cook_recipe/${curr.url_id}/${todays_menu.servings[curr.id]}`}>
                        <div class="card card-bordered sm:card-side bg-base-200 shadow-xl max-h-24 my-1.5 mx-1">
                            <figure class="md:w-3/5 {(todays_menu.made && todays_menu.made[curr.id]) ? "blur-sm" : ""}"><img src={curr.image} alt={curr.title}/></figure>
                            <div class="card-body max-h-full flex flex-row p-2 items-center w-full">
                                <p id={i} class="w-1/2 text-xs">{curr.title}</p>
                                <div class="card-actions flex flex-row justify-evenly items-center">
                                    <button class="btn-primary btn w-fit btn-sm" id={curr.id} on:click|stopPropagation={toggle_made}>{(todays_menu.made && todays_menu.made[curr.id]) ? "not made" : "made"}</button>
                                    <button id={curr.id} class="recipe_btn btn w-fit btn-xs bg-base-200 p-1 favorite {curr.favorite ? "bg-secondary" : ""}" on:click|stopPropagation={(e)=>{curr.favorite = !curr.favorite; update_fave_queue(e);}}><Heart/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
            <div id="right_column" class="md:w-1/2">
                {#if todays_menu && mode == "menu"}
                    <GroceryList bind:grocery_list={grocery_list} on:update_grocery_list={update_groceries} bind:status={grocery_list_status}  on:reset_grocery_list={reset_list}/>
                {:else}
                    <h2>select recipes to add to your menu</h2>
                {/if}
            </div>
        </div>
    </div>
{:else if loading}
    <div class="text-center flex flex-col justify-center items-center space-y-5 mx-2 md:mx-auto   md:text-4xl mt-[30vh] max-w-5xl"><span class="loading loading-bars loading-lg"></span></div>
{:else}
    <div class="flex flex-col justify-center items-center space-y-5 bg-base-200 mx-2 md:mx-auto p-16 border-2 border-base-300 rounded-md shadow-md  md:text-4xl mt-[30vh] max-w-5xl">
        <h2>You have no menu selected</h2>
        <div class="flex flex-row items-center space-x-1">
            <h3>Click </h3><a href="/my_menus" class="btn btn-primary btn-sm p-2 flex content-center">here</a><h3>to add a menu</h3>
        </div>
    </div>
{/if}