<script>
    import EditRecipe from "/src/lib/components/edit_recipe.svelte";
    import { process_recipe } from '/src/lib/process_recipe.js';
    import { deserialize } from '$app/forms';

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
        expand: {},
        id: "",
        image: "",
        ingredients: [
            {
                amount: 1,
                name: "",
                original: [""],
                unit: ""
            }
        ],
        notes: [],
        servings: "",
        time: "",
        title: "",
        updated: "",
        url: "",
        user: ""
    }

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
            // e.srcElement.value = "";
        } else if (result.type === 'success') {
            result.data.ingredients = process_recipe(result.data.ingredients);
            result.data.url = e.srcElement.value;
            recipe = result.data;
            // dispatch('recipe_edited', {
            //     items: result.data.ingredients, 
            //     multiplier: multiplier,
            //     index: index
            // });
            // // re-run all `load` functions, following the successful update
            // await invalidateAll();
        }
        
        
        // applyAction(result);
    }

    function update_recipe(){

    }
</script>
<div>
    <a href="/menu" class="btn btn-primary mx-6">Create Menu</a>
    <a class="btn btn-primary mx-6 mb-1" href="/prep">prep</a>
    <a class="btn btn-primary mx-6 mb-1" href="/my_menus">my menus</a>
    <a class="btn btn-primary mx-6 mb-1" href="/today">today</a>
</div>
<div class="flex flex-col max-w-5xl m-auto space-y-5">
    
    <div class="link">
        <form method='POST' on:input|preventDefault={fetch_recipe}>
            <input placeholder="Link to recipe" name="url" type="text" class="input input-bordered input-xs w-full text-center input-accent"/>
        </form>
    </div>
    <EditRecipe {recipe} index=0 on:update_recipe={update_recipe}/>
</div>