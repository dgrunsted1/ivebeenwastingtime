import { currentUser, pb } from '/src/lib/pocketbase.js';


/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    console.log(params.recipe);
    console.log(params.servings);
    const result_list = await pb.collection('recipes').getOne(params.recipe, {
        expand: `notes,ingr_list`
    });
    console.log(result_list.expand.ingr_list.length);
    console.log(result_list.expand);
    return {
        post: {
            recipe: result_list,
            servings: params.servings
        }
    };
}