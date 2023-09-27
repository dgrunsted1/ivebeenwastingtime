<script>
    import EditRecipe from "/src/lib/components/edit_recipe.svelte";
    import NavBtns from "/src/lib/components/nav_btns.svelte";
    import { page } from '$app/stores';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { process_recipe } from '/src/lib/process_recipe.js';
    import { deserialize } from '$app/forms';
    import { onMount } from "svelte";

    let recipe = {
        author: "",
        category: "",
        collectionId: "",
        collectionName: "",
        country: "",
        created: "",
        cuisine: "",
        description: "",
        directions: [""],
        expand: {ingr_list:[{quantity: 1, unit: "", ingredient: ""}]},
        id: "",
        image: "",
        notes: [],
        servings: "",
        time: "",
        title: "",
        updated: "",
        url: "",
        user: ""
    }

    onMount(() => {
        if (!$currentUser) window.location.href = "/login";
    });

    async function fetch_recipe(e){
        const data = new FormData(this);

        const response = await fetch(this.action, {
            method: 'POST',
            body: data
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());
        if (result.data.err) {
            alert(result.data.err);
            e.srcElement.value = "";
        } else if (result.type === 'success') {
            result.data.expand.ingr_list = process_recipe(result.data.expand.ingr_list);
            result.data.url = e.srcElement.value;
            recipe = result.data;
        }
        
        
        // applyAction(result);
    }

    function update_recipe(){

    }
</script>
<NavBtns page={$page.url.pathname}/>
<div class="flex flex-col max-w-5xl m-auto space-y-5 mb-5">
    
    <div class="link">
        <form method='POST' on:input|preventDefault={fetch_recipe}>
            <input placeholder="Link to recipe" name="url" type="text" class="input input-bordered input-xs w-full text-center input-accent"/>
        </form>
    </div>
    <EditRecipe {recipe} index=0 on:update_recipe={update_recipe} save={true}/>
</div>