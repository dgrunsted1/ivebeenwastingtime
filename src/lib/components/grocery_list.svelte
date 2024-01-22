<script>
    import { each } from "svelte/internal";
    import { afterUpdate } from 'svelte';
    import { merge, groupBySimilarity } from '/src/lib/merge_ingredients.js'
    import { page } from '$app/stores';

    export let recipes;
    let grocery_list = [];
    let skipped = [];
    let scroll_size = 0;
    if ($page.url.pathname == "/today"){
        scroll_size = 130;
    } else if ($page.url.pathname == "/prep") {
        scroll_size = 270;
    } else if ($page.url.pathname == "/menu"){
        scroll_size = 150;
    } else if ($page.url.pathname == "/my_menus"){
        scroll_size = 250;
    }

    afterUpdate(async () => {
        // let result = merge(recipes);
        let ingr_list = [];
        recipes.forEach(obj => {
            console.log({obj});
            if (obj.ingredients) {
                ingr_list.push(...obj.ingredients);
            }
        });
        console.log({ingr_list});
        let result = groupBySimilarity(ingr_list);
        console.log({result});
        grocery_list = result;
        skipped = result.skipped;
    });

    const copy_to_clipboard = () => {
        let copy_text = "";
        let first = true;
        let copy_list = document.getElementsByClassName("grocery_item");
        Array.from(copy_list).forEach(function (element) {
            if (!element.getElementsByTagName('input')[0].checked){
                if (first) first = false;
                else copy_text += "\n";
                let first_of_sent = true;
                Array.from(element.getElementsByTagName('input')).forEach(curr => {
                    if (curr.type == "checkbox") return;
                    if (!first_of_sent) copy_text += " ";
                    else first_of_sent = false;
                    copy_text += curr.value;
                });
            }
        });
        navigator.clipboard.writeText(copy_text);
    }

    function add_to_list(e) {
        grocery_list.push(e.detail.items);
        skipped = skipped.filter((curr) => {
            return curr.original[0] != e.detail.items.original[0];
        });
        skipped = skipped;
        grocery_list = grocery_list;
    }
</script>

<div id="list" class="flex flex-col w-full">
    <div id="header" class="flex justify-evenly items-center m-2.5 mt-0">
        {#if grocery_list.length > 0}
            <div id="count" class="text-xs">{grocery_list.length} Items</div><button id="copy" class="btn btn-xs md:btn-sm btn-accent cursor-copy" on:click={copy_to_clipboard}>copy</button>
        {/if}
    </div>
    <div class="">
        <div class="grocery_list max-h-[calc(100vh-{scroll_size}px)] overflow-y-auto">
            {#each grocery_list as item}
                    <div class="grocery_item flex relative my-1 tooltip space-x-2 justify-center">
                        <input type="checkbox" class="checkbox checkbox-xs" id="{item.ingredient}">
                        <input type="text" class="amount input input-bordered input-xs px-1 mr-1 w-8 text-center h-fit" value={item.quantity}>
                        <input type="text" class="unit input input-bordered input-xs px-1 mr-1 w-20 text-center h-fit" value={item.unit}>
                        <input type="text" class="name input input-bordered input-xs px-1 mr-1 w-3/4 h-fit" value={item.ingredient}> 
                    </div>                        
            {/each}
        </div>
        {#if skipped.length > 0}
            <div id="skipped" class="flex flex-col">
                <div id="skip_head" class="w-1/3">Skipped:</div>
                {#each skipped as skip}
                    <div class="skip_row flex items-center"><div class="add_skip btn btn-secondary btn-xs m-1 text-xs" on:click={add_to_list}>add to list</div><div class="skip_item text-xs">{skip.original}</div></div>
                {/each}
            </div>
        {:else if grocery_list.length > 0}
            <div id="skipped">No items skipped</div>
        {/if}
    </div>
</div>