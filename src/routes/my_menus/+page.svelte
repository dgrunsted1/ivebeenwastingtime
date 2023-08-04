<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { onMount } from 'svelte';

    let user_menus = []
    $: modal_menu = {};


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
            console.log(user_menus[i]);
            if (user_menus[i].id == id){
                modal_menu = user_menus[i];
                console.log({modal_menu});
            }
        }
        my_modal_2.showModal();
    }
</script>

<div>
    <a class="btn btn-primary mx-6 mb-1" href="/prep">prep</a>
    <a class="btn btn-primary mx-6 mb-1" href="/menu">menu</a>
</div>
<div id="menus" class="max-h-[calc(100vh-130px)] overflow-y-auto">
    {#each user_menus as curr, i}
        <div id={curr.id} class="card sm:card-side bg-base-100 shadow-xl max-h-24 my-1.5 mx-1" on:click={show_menu_modal}>
            <figure class="w-full">
                {#each curr.expand.recipes as recipe}
                    <!-- {#if recipe[j]} -->
                        <img class="w-44" src={recipe.image} alt={recipe.title}/>
                    <!-- {/if} -->
                {/each}
            </figure>
        </div>
    {/each}
</div>
    <dialog id="my_modal_2" class="modal">
        {#if modal_menu.id}
            <form method="dialog" class="modal-box max-w-full w-2/3">
                {#each modal_menu.expand.recipes as recipe, i}
                    <div class="card sm:card-side bg-base-100 shadow-xl max-h-44 my-1.5 mx-1">
                        <figure class="w-3/5"><img src={modal_menu.expand.recipes[i].image} alt={modal_menu.expand.recipes[i].title}/></figure>
                        <div class="card-body flex flex-row p-2 items-center w-full h-fit">
                            <div class="w-1/3 h-fit">
                                <p id={i} class="h-fit">{modal_menu.expand.recipes[i].title}</p>
                                <p id={i} class="h-fit">{modal_menu.expand.recipes[i].time}</p>
                                <p id={i} class="h-fit">{modal_menu.expand.recipes[i].cuisine}</p>
                            </div>
                            <div class="w-2/3">
                                <p id={i} class="">{modal_menu.expand.recipes[i].description}</p>
                            </div>
                        </div>
                    </div>
                {/each}
            </form>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        {/if}
    </dialog>