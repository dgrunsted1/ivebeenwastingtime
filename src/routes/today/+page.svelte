<script>
    import { onMount, afterUpdate } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import GroceryList from "/src/lib/components/grocery_list.svelte";
    import { page } from '$app/stores';
    import { get_grocery_list } from '/src/lib/merge_ingredients.js'
    import { update_grocery_list, create_grocery_list } from '/src/lib/groceries.js'



    let todays_menu = {};
    let grocery_list = [];
    let grocery_list_id = "";
    let grocery_list_status = "saved";
    let mode = "menu";
    $: loading = true;

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
                grocery_list = todays_menu.expand.grocery_list.list;
                grocery_list_id = todays_menu.expand.grocery_list.id;

            }
            
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
                    <a href={`/cook_recipe/${curr.url_id}/${todays_menu.servings[curr.id]}`}>
                        <div class="card card-bordered sm:card-side bg-base-200 shadow-xl max-h-24 my-1.5 mx-1">
                            <figure class="md:w-3/5"><img src={curr.image} alt={curr.title}/></figure>
                            <div class="card-body max-h-full flex flex-row p-2 items-center w-full">
                                <p id={i} class="md:w-2/3 text-xs">{curr.title}</p>
                            </div>
                        </div>
                    </a>
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