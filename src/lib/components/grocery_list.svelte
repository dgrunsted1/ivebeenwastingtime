<script>
    import { each } from "svelte/internal";

    export let grocery_list;
    export let skipped;
    
    function check_item(e) {
        e.srcElement.innerHTML = (e.srcElement.innerHTML == "0") ? "O" : "0";
    }

    const copy_to_clipboard = () => {
        let copy_text = "";
        let first = true;
        let copy_list = document.getElementsByClassName("grocery_item");
        Array.from(copy_list).forEach(function (element) {
            if (element.getElementsByTagName("div")[0].innerHTML == "O"){
                if (first) first = false;
                else copy_text += "\n";
                let first_of_sent = true;
                Array.from(element.getElementsByTagName('input')).forEach(curr => {
                    if (!first_of_sent) copy_text += " ";
                    else first_of_sent = false;
                    copy_text += curr.value;
                });
            }
        });
        navigator.clipboard.writeText(copy_text);
    }

    function add_to_list(e) {
        console.log(e.srcElement.nextElementSibling.innerHTML);
        grocery_list.push({amount: 0, unit: "", name: e.srcElement.nextElementSibling.innerHTML, origianl: e.srcElement.nextElementSibling.innerHTML});
        grocery_list = grocery_list;
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
                        
                        <div class="checkmark" on:click={check_item}>O</div>
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
    }

    #copy {
        cursor: pointer;
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
    .checkmark {
        width: 5px;
        margin: auto;
        cursor: pointer;
    }

    .original {
        font-size: 9px;
    }

    .grocery_item {
        position: relative;
    }

    .grocery_item .original {
        visibility: hidden;
        background-color: #555;
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
        background: #555;
        color: white;
        cursor: pointer;
        font-size: 8px;
        /* line-height: 8px; */
        margin: 5px;
        border-radius: 5px;
        padding: 3px;
    }
</style>