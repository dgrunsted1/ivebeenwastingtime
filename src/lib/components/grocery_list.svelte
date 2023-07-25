<script>
    import { each } from "svelte/internal";
    import { createEventDispatcher } from 'svelte';
    import { afterUpdate } from 'svelte';

    const conversions = {"tablespoon/teaspoon": 1/3, "teaspoon/tablespoon": 3, "cup/teaspoon": 1/48, "teaspoon/cup": 48, "cup/tablespoon": 1/16, "tablespoon/cup": 16};
    const dispatch = createEventDispatcher();
    export let recipes;
    let grocery_list = [];
    let skipped = [];

    afterUpdate(async () => {
        merge();
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
    
    function check_item(){
        if (event.target.firstChild.checked) event.target.firstChild.checked = false;
        else event.target.firstChild.checked = true;
    }

    function merge() {
        grocery_list = [];
        skipped = [];
        recipes.forEach(recipe => {
            recipe.ingredients.forEach(item => {
                if (!item) return;
                if ((!item.amount || !item.unit || !item.name) && item.original) {
                    skipped.push(item);
                    skipped = skipped;
                    return;
                }
                let match = false;
                if (grocery_list) {
                    grocery_list.forEach(element => {
                        if (element.name === item.name || element.name.includes(item.name) || item.name.includes(element.name)){
                            match = element;
                            return;
                        }
                    });
                }
                if (match && !(["small", "medium", "large"].includes(match.unit) ^ ["small", "medium", "large"].includes(item.unit))
                                && !(match.unit == "clove" ^ item.unit == "clove") && !(match.unit == "whole" ^ item.unit == "whole")) {
                    
                    
                    let tmp = { amount: 0, unit: "", name: "", original: []};
                    tmp.original = tmp.original.concat(match.original, item.original);
                    if (match.unit != item.unit) {
                        let conv = combine(match, round_amount(item.amount, recipe.multiplier));
                        tmp.amount = conv.amount;
                        tmp.unit = conv.unit;
                    } else {
                        tmp.amount = match.amount + round_amount(item.amount, recipe.multiplier);
                        tmp.unit = match.unit;
                    }
                    if (match.name != item.name){
                        tmp.name = match.name+" and/or "+item.name;
                    }else {
                        tmp.name = match.name;
                    }
                    grocery_list.splice(grocery_list.indexOf(match), 1);
                    grocery_list.push(tmp);
                    console.log("merging", `${match.amount} ${match.unit} ${match.name} ${item.amount} ${item.unit} ${item.name}`);
                    console.log("merged item", tmp);
                }else {
                    grocery_list.push({
                        amount: round_amount(item.amount, recipe.multiplier),
                        unit: item.unit,
                        name: item.name,
                        original: item.original
                    });
                }
            });
        });
    }

    const combine = (i, j) => {
        let conv_index_a = `${j.unit}/${i.unit}`;
        let conv_index_b = `${i.unit}/${j.unit}`;
        let amount = null;
        let unit = null;
        if (conversions[conv_index_a] < conversions[conv_index_b]){
            unit = j.unit;
            amount = conversions[conv_index_a] * i.amount + j.amount;
        }else {
            unit = i.unit;
            amount = conversions[conv_index_b] * j.amount + i.amount;
        }
        return {unit: unit, amount: amount};
    }

    function round_amount(in_amount, mult){
        let result = 0;
        if (typeof in_amount != "string"){
            result = in_amount * mult;
        } else {
            result = parseFloat(in_amount) * mult;
        }

        return Math.round((result + Number.EPSILON) * 100) / 100
    }

    function tooltip_originals(originals){
        let output = "";
        originals.forEach((curr, i) => {
            if (i > 0) output += "<br>";
            output += curr;
        });
        return output;
    }
</script>

<div id="list" class="flex flex-col">
    <div id="header" class="flex justify-evenly items-center m-2.5">
        {#if grocery_list.length > 0}
            <div id="count">{grocery_list.length} Items</div><div id="copy" class="btn btn-accent cursor-copy" on:click={copy_to_clipboard}>copy</div>
        {/if}
    </div>
    <div class="max-h-[calc(100vh-200px)] overflow-y-auto">
        <div class="grocery_list">
            {#each grocery_list as item}
                    <div class="grocery_item flex relative my-1 tooltip" data-tip={tooltip_originals(item.original)}>
                        <input type="checkbox" class="checkbox checkbox-sm" id="{item.name}">
                        <input type="text" class="amount w-8 text-center m-auto text-sm" value={item.amount}>
                        <input type="text" class="unit w-20 m-auto text-center text-sm" value={item.unit}>
                        <input type="text" class="name w-3/4 m-auto text-sm" value={item.name}> 
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