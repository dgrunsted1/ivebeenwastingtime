import { scrape } from '/src/lib/scraper.js';
import { parse_ingr } from '/src/lib/proomptgineer.js';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        let data = await request.formData();
        let url = await data.get('url');
        let results = await scrape(url);
        let new_list = await parse_ingr(results.expand.ingr_list);
        console.log(new_list);
        return results;
    }
};