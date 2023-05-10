<script>
    import { each } from "svelte/internal";

    export let grocery_list;
    
    // console.log("grocery list". grocery_list);

    function check_item(e) {
        // console.log(e.srcElement.innerHTML);
        e.srcElement.innerHTML = (e.srcElement.innerHTML == "0") ? "O" : "0";
    }
</script>

<div id="main">
        {#each grocery_list as item}
                    <div class="grocery_item">
                        <div class="checkmark" on:click={check_item}>O</div>
                        <input type="text" class="amount" value={item.amount}>
                        <input type="text" class="unit" value={item.unit}>
                        <input type="text" class="name" value={item.name}>
                    </div>
        {/each}
</div>





<style>
    #main {
        display: flex;
        flex-direction: column;
    }

    .grocery_item {
        display: flex;
    }

    .amount {
        width: 30px;
        margin: auto;

    }

    .unit {
        width: 80px;
        margin: auto;

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
</style>