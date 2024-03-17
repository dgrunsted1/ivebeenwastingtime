<script>
    import { createEventDispatcher, onMount, tick } from 'svelte';
    import DeleteIcon from "/src/lib/icons/DeleteIcon.svelte";
    import { page } from '$app/stores';

    export let grocery_list = [];
    export let status;
    let dispatch = createEventDispatcher();
    let delay_timer;
    let view_size = `max-h-[calc(64vh)]`;

    onMount(async () => {
        if ($page.url.pathname == "/today"){
            view_size = `max-h-[calc(70vh)]`;
        }
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

    const remove_item = (qty, unit, ingr) => {
        let delete_item = confirm("Are you sure you want to delete this item?");
        if (delete_item){
            let temp_arr = [];
            let found = false;
            for (let i = 0; i < grocery_list.length; i++){
                if (grocery_list[i].quantity != qty || grocery_list[i].unit != unit || grocery_list[i].ingredient != ingr || found){
                    temp_arr.push(grocery_list[i]);
                }else {
                    found = true;
                }
            }
            grocery_list = temp_arr;
            edit_item();
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

    const new_item = async () => {
        const new_item = {quantity: 0, unit: "unit", ingredient: "", checked: false, id: generate_id()};
        grocery_list.push(new_item);
        grocery_list = grocery_list;
        await tick();
        new_item.input.focus();
    }

    const enter_new_item = async (e) => {
        const items = document.getElementsByClassName("grocery_item");
        const items_array = Array.prototype.slice.call(items);
        if (e.key == "Enter" && items_array[items_array.length-1] == e.srcElement.parentNode){
            await new_item();
        }
    }

    const generate_id = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < 15; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
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
        <div class="grocery_list {view_size} overflow-y-auto">
            {#if grocery_list.length > 0}
                {#each grocery_list as item, i}
                        <div class="grocery_item flex relative my-1 tooltip space-x-2 justify-center items-center">
                            {#if status != "none"}<input type="checkbox" class="checkbox checkbox-xs" id="{item.ingredient}" bind:checked={item.checked} on:change={edit_item}>{/if}
                            <input type="text" class="amount input input-bordered input-xs px-1 mr-1 w-8 text-center h-fit" bind:value={item.quantity} on:keyup={edit_item}>
                            <input type="text" class="unit input input-bordered input-xs px-1 mr-1 w-20 text-center h-fit" bind:value={item.unit} on:keyup={edit_item}>
                            <input type="text" class="name input input-bordered input-xs px-1 mr-1 w-3/4 h-fit" bind:value={item.ingredient} on:keyup={edit_item} on:keypress={enter_new_item} bind:this={item.input}>
                            {#if status != "none"}<button class="btn btn-xs btn-accent" on:click={() => remove_item(item.quantity, item.unit, item.ingredient)}><DeleteIcon/></button>{/if}
                        </div>                        
                {/each} 
                {#if status != "none"}
                    <div class="flex relative my-1 tooltip space-x-2 justify-center items-center">
                        <button class="btn btn-xs btn-accent" on:click={new_item}>new item</button>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>