import { currentUser, pb } from '/src/lib/pocketbase.js';


/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const result_user = await pb.collection('users').getFirstListItem(`username="${params.username}"`, {
       
    });

    const result_recipes = await pb.collection('recipes').getFullList({
        filter: `user="${result_user.id}"`,
        sort: '-created',
        expand: `ingr_list`
    });
    const result_menus = await pb.collection('menus').getFullList({
        filter: `user="${result_user.id}"`,
        sort: '-created',
        expand: `recipes, recipes.ingr_list`
    });
    return {
        post: {
            user: result_user,
            recipes: result_recipes,
            menus: result_menus
        }
    };
}