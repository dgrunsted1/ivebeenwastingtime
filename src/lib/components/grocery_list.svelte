<script>
    import { each } from "svelte/internal";
    import { afterUpdate } from 'svelte';
    import { merge } from '/src/lib/merge_ingredients.js'

    export let recipes;
    let grocery_list = [];
    let skipped = [];

    afterUpdate(async () => {
        let result = merge(recipes);

        grocery_list = result.grocery_list;
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
            <div id="count">{grocery_list.length} Items</div><button id="copy" class="btn btn-sm btn-accent cursor-copy" on:click={copy_to_clipboard}>copy</button>
        {/if}
    </div>
    <div class="max-h-[calc(100vh-200px)] overflow-y-auto">
        <div class="grocery_list">
            {#each grocery_list as item}
                    <div class="grocery_item flex relative my-1 tooltip">
                        <input type="checkbox" class="checkbox checkbox-sm" id="{item.ingredient}">
                        <input type="text" class="amount w-8 text-center m-auto text-sm" value={item.quantity}>
                        <input type="text" class="unit w-20 m-auto text-center text-sm" value={item.unit}>
                        <input type="text" class="name w-3/4 m-auto text-sm" value={item.ingredient}> 
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