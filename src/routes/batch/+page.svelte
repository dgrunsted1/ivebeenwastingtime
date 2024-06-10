<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';

    $: results = [];
    $: passed = 0;
    $: failed = 0;

const update_recipe_url_ids = async function (){
    return;
    const recipes = await pb.collection('recipes').getFullList({sort: `-created`});
    for (let i = 0; i < recipes.length; i++){
        const url_id = await get_url_id(recipes[i]);
        const data = { "url_id": url_id };
        const updated_record = await pb.collection('recipes').update(recipes[i].id, data);
    }

        
}

const get_url_id = async function (recipe){
    let url_id = recipe.title.trim();
    url_id = url_id.replaceAll(" ", "_");
    let new_url_id = "";
    try {
        new_url_id = url_id;
        let same_url_id = await pb.collection('recipes').getFirstListItem(`url_id="${new_url_id}"`);
        let cnt = 1;
        while (true){
            new_url_id = url_id+`_${cnt}`;
            same_url_id = await pb.collection('recipes').getFirstListItem(`url_id="${new_url_id}"`);
            cnt++;
        }
    } catch (e){
        return new_url_id;
    }
}

const time_to_minutes = async function (){
    return;
    const recipes = await pb.collection('recipes').getFullList({sort: `-created`});
    for (let i = 0; i < recipes.length; i++){
        let mins = 0;
        let min_result = recipes[i].time.match(/(\d+) [mins|minutes]/);
        if (min_result){
            mins += parseInt(min_result[1]);
        }

        let hr_result = recipes[i].time.match(/(\d+) [hrs|hours|hour|hr]/);
        if (hr_result){
            mins += parseInt(hr_result[1]) * 60;
        }
        const data = { "time_new": mins };
        const updated_record = await pb.collection('recipes').update(recipes[i].id, data);
        results.push(updated_record.title+" "+updated_record.time+" "+updated_record.time_new);
        results = results;
    }
}

const fill_ingr_num = async function (){
    return;
    const recipes = await pb.collection('recipes').getFullList({sort: `-created`});
    for (let i = 0; i < recipes.length; i++){

        const data = { "ingr_num": recipes[i].ingr_list.length };
        
        const updated_record = await pb.collection('recipes').update(recipes[i].id, data);
        console.log(updated_record);
        results.push(recipes[i].ingr_list.length);
        results = results;
    }
}

const compare_ingr_recipes = async function (){
    const recipes = await pb.collection('recipes').getFullList({expand: 'ingr_list'});
    console.log(recipes);
    for (let i = 0; i < recipes.length; i++){
        let recipe_id = recipes[i].id;
        for (let j = 0; j < recipes[i].ingr_list.length; j++){
            let ingr = recipes[i].ingr_list[j];
            const update_result = await pb.collection('ingredients').update(ingr, {recipe_id: `+${recipe_id}`});
            console.log(ingr == update_result.id, recipe_id == update_result.recipe);
            if (ingr == update_result.id && recipe_id == update_result.recipe) {
                passed++;
            } else {
                failed++;
            }
            // console.log(`Ingredient ${ingr} linked to recipe ${recipe_id}`);
        }
    }
}

</script>







<div>
    <div class="flex justify-center space-x-10 content-center w-full">
            <!-- <button id="compare_parsers_btn" class="btn btn-primary w-56" on:click={update_recipe_url_ids} disabled>
                update url_ids
            </button> -->

            <!-- <button id="compare_parsers_btn" class="btn btn-primary w-56" on:click={time_to_minutes}>
                time to minutes
            </button> -->

            <!-- <button id="compare_parsers_btn" class="btn btn-primary w-56" on:click={fill_ingr_num}>
                fill ingr_num
            </button> -->

            <button id="compare_parsers_btn" class="btn btn-primary w-56" on:click={compare_ingr_recipes}>
                compare ingr recipes to recipes
            </button>
            <div>
                {#each results as curr}
                    <p>{curr}</p>
                {/each}
            </div>
            <div>
                passed: {passed}
            </div>
            <div>
                failed: {failed}
            </div>
    </div>
</div>