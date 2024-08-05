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

const migrate_recipes = async function(){
    const recipes = await pb.collection('recipes').getFullList({expand: 'ingr_list'});
    console.log("recipes in", recipes.length, {recipes});
    for (let i = 0; i < recipes.length; i++){
        // const recipe_was_uploaded = await pb.collection('recipes_strict').getFirstListItem(`title="${recipes[i].title}" && author="${recipes[i].author}"`);
        // if (recipe_was_uploaded.items && recipe_was_uploaded.items.length > 0){
        //     console.log("recipe was uploaded");
        //     continue;
        // }
        const data = {
            "title": recipes[i].title,
            "description": recipes[i].description,
            "original_web_page": recipes[i].url,
            "author": recipes[i].author,
            "time_in_min": recipes[i].time_new,
            "directions": recipes[i].directions,
            "user": recipes[i].user,
            "main_image": recipes[i].image,
            "servings": recipes[i].servings_new,
            "cuisine_country": (recipes[i].cuisine) ? recipes[i].cuisine : (recipes[i].country) ? recipes[i].country : "",
            "url_id": recipes[i].url_id,
            "made": recipes[i].made,
            "favorite": recipes[i].favorite,
            "active": true
        };
        console.log({data})
        const new_strict_recipe = await pb.collection('recipes_strict').create(data);
        console.log(new_strict_recipe);
        if (new_strict_recipe.code > 200){
            console.log("error uploading recipe");
        } else {
            let ingr_ids = [];
            for (let j = 0; j < recipes[i].expand.ingr_list.length; j++){
                const ingr = recipes[i].expand.ingr_list[j];
                if (ingr.ingredient == ""){
                    continue;
                }
                const ingr_data = {
                    "name": ingr.ingredient,
                    "qty": ingr.quantity,
                    "unit": ingr.unit,
                    "active": true,
                    "recipe": new_strict_recipe.id
                };
                console.log({ingr_data})
                const new_ingr = await pb.collection('ingredients_strict').create(ingr_data);
                if (new_ingr.code > 200){
                    console.log("error uploading ingr");
                } else {
                    ingr_ids.push(new_ingr.id);
                }
            }

            if (ingr_ids.length > 0){
                const ingr_id_data = {
                    "ingr_list": ingr_ids
                };
                console.log({ingr_id_data})
                const updated_ingr_ids_in_recipe = await pb.collection('recipes_strict').update(new_strict_recipe.id, ingr_id_data);
                console.log(updated_ingr_ids_in_recipe);
            }
        }
    }
}

const migrate_menus = async function(){
    const menus = await pb.collection('menus').getFullList({expand: 'grocery_list, recipes, recipes.ingr_list'});
    console.log("menus in", menus.length, {menus});
    for (let i = 0; i < menus.length; i++){
        let made = {};
        console.log(menus[i].made);
        if (menus[i].made){
            made = menus.made;
        } else {
            let filter = "";
            for (let j = 0; j < menus[i].expand.recipes.length; j++){
                if (filter != "") {
                    filter += " || ";
                }
                if (menus[i].expand.recipes[j].title) {
                    filter += `title="${menus[i].expand.recipes[j].title}"`;
                }
            }
            const strict_recipes = await pb.collection('recipes_strict').getFirstListItem(filter);
            made[`${strict_recipes.id}`] = false;
        }
        console.log({made});
        const data = {
            "title": menus[i].title ? menus[i].title : "new menu",
            "owner": menus[i].user,
            "shared_users": [],
            "active": true,
            "todays_menu": menus[i].today,
            "servings": menus[i].servings,
            "description": menus[i].description,
            "notes": menus[i].notes,
            "made": made,
        };
        console.log({new_strict_menu})
        const new_strict_menu = await pb.collection('menus_strict').create(data);
        if (new_strict_menu.code > 200){
            console.log("error uploading recipe");
        } else {
            let ingr_ids = [];
            for (let k = 0; k < menus[i].expand.recipes; k++)
            for (let j = 0; j < recipes[i].expand.ingr_list.length; j++){
                const ingr = recipes[i].expand.ingr_list[j];
                if (ingr.ingredient == ""){
                    continue;
                }
                const ingr_data = {
                    "name": ingr.ingredient,
                    "qty": ingr.quantity,
                    "unit": ingr.unit,
                    "active": true,
                    "recipe": new_strict_menu.id
                };
                console.log({ingr_data})
                const new_ingr = await pb.collection('ingredients_strict').create(ingr_data);
                if (new_ingr.code > 200){
                    console.log("error uploading ingr");
                } else {
                    ingr_ids.push(new_ingr.id);
                }
            }

            if (ingr_ids.length > 0){
                const ingr_id_data = {
                    "ingr_list": ingr_ids
                };
                console.log({ingr_id_data})
                const updated_ingr_ids_in_recipe = await pb.collection('recipes_strict').update(new_strict_menu.id, ingr_id_data);
                console.log(updated_ingr_ids_in_recipe);
            }
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

            <button id="compare_parsers_btn" class="btn btn-primary w-56" on:click={migrate_menus}>
                migrate menus
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