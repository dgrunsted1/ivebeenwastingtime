import { recipeScraper } from 'recipe-scraper';


/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        let data = await request.formData();
        let url = await data.get('url');
        // console.log({recipeScraper});
        console.log(url);
        return { url };
    }
};