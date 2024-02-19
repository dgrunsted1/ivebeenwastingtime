<script>
    import { createEventDispatcher, afterUpdate } from 'svelte';

    export let grocery_list = [];
    export let status;
    let dispatch = createEventDispatcher();
    let delay_timer;

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

    const remove_item = (ingr) => {
        let delete_item = confirm("Are you sure you want to delete this item?");
        if (delete_item){
            grocery_list = grocery_list.filter(curr => curr.ingredient != ingr);
            dispatch("update_grocery_list", {grocery_list: grocery_list});
        }
    }

    const edit_item = () => {
        if (status == "edited") return;
        status = "edited";
        clearTimeout(delay_timer);
        delay_timer = setTimeout(function() {
            dispatch("update_grocery_list", {grocery_list: grocery_list});
        }, 2000);
    }

    const reset_list = () => {
        let reset_list = confirm("Are you sure you want to reset your grocery list?");
        if (reset_list){
            dispatch("reset_grocery_list");
        }
    }

    const uncheck_list = () => {
        for (let i = 0; i < grocery_list.length; i++){
            grocery_list[i].checked = false;
        }
        edit_item();
    }
</script>

<div id="list" class="flex flex-col w-full">
    <div id="header" class="flex justify-evenly items-center m-2.5 mt-0">
        {#if grocery_list.length > 0}
            {#if status != "none"}<div id="update_status" class="text-xs">{status}</div>{/if}
            <div id="count" class="text-xs">{grocery_list.length} Items</div>
            <button id="copy" class="btn btn-xs md:btn-sm btn-accent cursor-copy" on:click={copy_to_clipboard}>copy</button>
            {#if status != "none"}<button id="uncheck" class="btn btn-xs md:btn-sm btn-accent" on:click={uncheck_list}>uncheck</button>{/if}
            {#if status != "none"}<button id="reset" class="btn btn-xs md:btn-sm btn-accent" on:click={reset_list}>reset</button>{/if}
        {/if}
    </div>
    <div class="">
        <div class="grocery_list {`max-h-[calc(60vh)]`} overflow-y-auto">
            {#if grocery_list.length > 0}
            {#each grocery_list as item}
                    <div class="grocery_item flex relative my-1 tooltip space-x-2 justify-center items-center">
                        {#if status != "none"}<input type="checkbox" class="checkbox checkbox-xs" id="{item.ingredient}" bind:checked={item.checked} on:change={edit_item}>{/if}
                        <input type="text" class="amount input input-bordered input-xs px-1 mr-1 w-8 text-center h-fit" bind:value={item.quantity} on:keyup={edit_item}>
                        <input type="text" class="unit input input-bordered input-xs px-1 mr-1 w-20 text-center h-fit" bind:value={item.unit} on:keyup={edit_item}>
                        <input type="text" class="name input input-bordered input-xs px-1 mr-1 w-3/4 h-fit" bind:value={item.ingredient} on:keyup={edit_item}>
                        {#if status != "none"}<button class="btn btn-xs btn-accent" on:click={remove_item(item.ingredient)}>dlt</button>{/if}
                    </div>                        
            {/each}
            {/if}
        </div>
    </div>
</div>