import { soda_rank } from '../../lib/scraper';

/** @type {import('./$types').Actions} */
export const actions = {
    default:  async ({ request }) => {
        let data = await request.formData();
        let name = await data.get('name');
        console.log(name);
        let results = await soda_rank(name);
        console.log("action", results);
        return results;
    }
};