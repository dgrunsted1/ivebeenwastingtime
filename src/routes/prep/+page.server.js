import puppeteer from 'puppeteer';

const selectors = {
    title: '.heading__title',
    author: '.mntl-attribution__item-name',
    description: '.heading__subtitle',
    time: '.total-time >>> span.meta-text__data',
    servings: '.recipe-serving >>> span.meta-text__data',
    ingredients: '.section-content >>> ul',
    directions: 'ol'
};

async function get_element(page, selector){
    let elementSelector = await page.waitForSelector(
        selector
    );
    let result = await elementSelector?.evaluate(el => el.textContent);
    return result;
}

function trim(input){
    let result = [];
    input.forEach(curr => {
        if (curr && !curr.includes('=') && !curr.includes('<img') && !curr.includes('/>') && !curr.includes('Serious Eats')){
            result.push(curr);
        }
    });
    return result;
}

function format_servings(input){
    if (input.includes('servings')) return parseInt(input.replace("servings", "").trim());
    else return input;
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        const start = Date.now();
        let data = await request.formData();
        let url = await data.get('url');
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();

        await page.goto(url);

        await page.setViewport({width: 1080, height: 1024});

        let results = {};

        for (const k in selectors){
            results[k] = await get_element(page, selectors[k]);
        };
        
        results.directions = trim(results.directions.split('\n'));

        results.ingredients = trim(results.ingredients.split('\n'));

        results.servings = format_servings(results.servings);
        
        await browser.close();
        const end = Date.now();
        results.execution_time = `${(end-start)/1000}s`;
        return results;
    }
};