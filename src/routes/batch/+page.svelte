<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';

const update_recipe_url_ids = async function (){
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
</script>







<div>
    <div class="flex justify-center space-x-10 content-center w-full">
        <!-- <form method="POST" action="?/scrape_ingr" class="w-52"  on:click|preventDefault={process_recipe_test}> -->
            <button id="compare_parsers_btn" class="btn btn-primary w-56" on:click={update_recipe_url_ids}>
                update url_ids
            </button>
        <!-- </form> -->
    </div>
</div>