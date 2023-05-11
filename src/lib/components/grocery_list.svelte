<script>
    import { each } from "svelte/internal";

    export let grocery_list;
    
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
                                {curr_original}
                            {/each}
                        </span>
                    </div>
        {/each}
    </div>
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

    /* .original {
        font-size: 9px;
    } */

    .grocery_list .original {
        position: relative;
        top: 0;
        /* font-size: 14px; */
        background: #ffffff;
        /* color: #ffffff; */
        /* padding: 5px 8px; */
        /* border-radius: 5px; */
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .grocery_list .original::before {
        position: relative;
        content: "";
        /* height: 8px; */
        /* width: 8px; */
        background: #ffffff;
        /* bottom: -3px; */
        /* left: 50%; */
        transform: translate(-50%) rotate(45deg);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .grocery_list .grocery_item:hover .original {
        top: -45px;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    .grocery_list .grocery_item:hover span, .grocery_list .grocery_item:hover .original {
        text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
    }
</style>