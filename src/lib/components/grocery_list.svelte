<script>
    import { each } from "svelte/internal";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let grocery_list;
    export let skipped;

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
        dispatch("update_grocery_list", {items: {amount: 0, unit: "", name: e.srcElement.nextElementSibling.innerHTML, original: [e.srcElement.nextElementSibling.innerHTML]}});
    }
    
    function check_item(){
        if (event.target.firstChild.checked) event.target.firstChild.checked = false;
        else event.target.firstChild.checked = true;
    }
</script>

<div id="list">
    <div id="header">
        {#if grocery_list.length > 0}
            <div id="count">{grocery_list.length} Items</div><div id="copy" on:click={copy_to_clipboard}>copy</div>
        {:else}
            <div id="add_recipe">Paste your recipes on the left.</div>
        {/if}
    </div>
    <div class="grocery_list">
        {#each grocery_list as item}
                    <div class="grocery_item">
                        
                        <div class="checks" on:click|self={check_item}><input type="checkbox" class="checkbox" id="{item.name}"></div>
                        <input type="text" class="amount" value={Math.round((item.amount + Number.EPSILON) * 100) / 100}>
                        <input type="text" class="unit" value={item.unit}>
                        <input type="text" class="name" value={item.name}> 
                        <span class="original">
                            {#each item.original as curr_original}
                                {#if item.original.indexOf(curr_original) > 0}
                                    <br>
                                {/if}
                                {curr_original}
                            {/each}
                        </span>
                    </div>
        {/each}
    </div>
    {#if skipped.length > 0}
        <div id="skipped">
            <div id="skip_head">Skipped:</div>
            {#each skipped as skip}
                <div class="skip_row"><div class="add_skip" on:click={add_to_list}>add to list</div><div class="skip_item">{skip.original}</div></div>
            {/each}
        </div>
    {:else if grocery_list.length > 0}
        <div id="skipped">No items skipped</div>
    {/if}
</div>





<style>
    #list {
        display: flex;
        flex-direction: column;
    }

    #header {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        margin: 10px;
        align-items: center;
    }

    #copy {
        cursor: copy;
        border: 2px solid #555;
        background:  hsla(35, 39%, 22%, 0.83);
        color: white;
        margin: 5px;
        border-radius: 8px;
        padding: 5px;
    }

    .grocery_item {
        display: flex;
    }

    .amount {
        width: 30px;
        margin: auto;
        text-align: center;
    }

    .unit {
        width: 80px;
        margin: auto;
        text-align: center;
    }

    .name {
        width: 75%;
        margin: auto;

    }

    .original {
        font-size: 9px;
    }

    .grocery_item {
        position: relative;
    }

    .grocery_item .original {
        visibility: hidden;
        background-color:  hsla(35, 39%, 22%, 0.83);
        color: #fff;
        text-align: center;
        padding: 5px 5px;
        border-radius: 6px;

        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;

        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 0.3s;
    }

    .grocery_item .original::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .grocery_item:hover .original {
        visibility: visible;
        opacity: 1;
    }

    #skipped {
        display: flex;
        flex-direction: column;
    }

    #skip_head {
        width: 30%;
        /* margin: auto; */
    }

    .skip_item {
        font-size: 12px;
    }

    .skip_row {
        display: flex;
        align-items: center;
    }

    .add_skip {
        border: 2px solid #555;
        background:  hsla(35, 39%, 22%, 0.83);
        color: white;
        cursor: pointer;
        font-size: 10px;
        /* line-height: 8px; */
        margin: 4px 5px;
        border-radius: 5px;
        padding: 0 5px;
    }

     .checks{
        background-color: #fbe4cb;
        border: 2px solid hsla(35, 39%, 22%, 0.83);
        border-radius: 30px;
        box-shadow: hsla(35, 39%, 22%, 0.83) 4px 4px 0 0;
        color: hsla(35, 39%, 22%, 0.83);
        cursor: initial;
        display: inline-block;
        font-weight: 600;
        font-size: 18px;
        padding: 0 10px;
        line-height: 30px;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        padding: 2px;
        border-radius: 50%;
        margin: 2px 0;
        cursor: pointer;
    }

    input[type=checkbox] {
        margin: 2px;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fbe4cb;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    input[type="checkbox"]::before {
        content: "";
        width: .5em;
        height: .5em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        background-color: black;
        transform-origin: bottom left;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }

    input[type="checkbox"]:checked::before {
        transform: scale(1);

    }
</style>

