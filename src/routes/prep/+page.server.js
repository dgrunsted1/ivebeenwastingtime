import puppeteer from 'puppeteer';
import { currentUser, pb } from '/src/lib/pocketbase.js';

const selectors = {
        serious_eats: {
            title: 'h1',
            author: '.mntl-attribution__item-name',
            description: '.heading__subtitle',
            time: '.total-time >>> span.meta-text__data',
            servings: '.recipe-serving >>> span.meta-text__data',
            ingredients: '.section-content',
            directions: 'ol'
        },
        nyt: {
            title: 'h1',
            author: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipeintro_header-block__LWcDS.recipeintro_hasImage__5ekpP > header > div > h2:nth-child(1) > a',
            description: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipeintro_topnote-block__hFFPr > div > div > div > p',
            time: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipeintro_stats-block__YgbqJ > dl > dd:nth-child(2)',
            servings: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > div.ingredients_recipeYield__Ljm9O > span.pantry--ui.ingredients_fontOverride__WoKY5',
            // ingredients: '.ingredients_ingredients__qAcSs >>>> ul',
            ingredients: {  
                            group: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > ul > li',
                            item: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > ul > li:nth-child(ITEM_INDEX)'
                        },
            directions: {
                            group: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_prep-block__cpC8w > div > ol > li',
                            item: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_prep-block__cpC8w > div > ol > li:nth-child(ITEM_INDEX) > p'
                        }
        }
    };

async function get_element(page, selector){
    if (typeof selector !== 'string'){
        let length = await page.evaluate((selector) => {
                    return Array.from(document.querySelectorAll(selector)).length;
                }, selector.group);
        let output = [];
        for (let i = 0; i < length; i++){
            let sel = selector.item.replace("ITEM_INDEX", i);
            console.log({sel})
            output.push(await page.evaluate((sel) => {
                return Array.from(document.querySelectorAll(sel)).map(x => x.textContent);
            }, sel));
        }
        console.log({output});
        return output;
    }else {
        console.log("selector", selector.group);
        const text = await page.evaluate((selector) => {
            return Array.from(document.querySelectorAll(selector)).map(x => x.textContent);
        }, selector);
        console.log({text});
        return text;
    }
}

function trim(input){
    if (!input.includes("\n")){
        let matches = input.match(/([\w ]+\w)(\d+)(\w[\w ]+)/);
        console.log({matches});
        input = input.replace(/([\w ]+\w)(\d+)(\w[\w ]+)/, "$1\n$2 $3");
        console.log("regex replace", input);
    }
    input = input.split("\n");

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

// async function get_length(page, selector){
//     // console.log({selector});
//     let list_length = await page.evaluate((sel) => {
//         return document.getElementsByClassName(sel).length;
//       }, sele);
//       return list_length;
// }

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        const start = Date.now();
        let data = await request.formData();
        let url = await data.get('url');
        // let url = "https://www.seriouseats.com/obe-ata-nigerian-red-pepper-sauce";
        let site_selectors;
        if (url.includes("www.seriouseats.com")){
            site_selectors = selectors.serious_eats;
        }else if(url.includes("cooking.nytimes.com")){
            site_selectors = selectors.nyt;
        }else{
            return {err: "website not supported"};
        }
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();

        await page.goto(url);

        await page.setViewport({width: 1080, height: 1024});

        let results = {};

        for (const k in site_selectors){
            // let length = await get_length(page, site_selectors[k]);
            // console.log({length});
            try{
                results[k] = await get_element(page, site_selectors[k]);
            }catch (e){
                data = {
                    data: JSON.stringify({message: e.message, url: url}),
                    function: "prep scrape"
                };
                console.log("error", data);
                const result = await pb.collection('errors').create(data);
            }
        };
        console.log("results", results);
        // console.log("ingredients", results.ingredients);
        results.directions = trim(results.directions);
        results.ingredients = trim(results.ingredients);

        results.servings = format_servings(results.servings);
        console.log("results", results);
        await browser.close();
        const end = Date.now();
        results.execution_time = `${(end-start)/1000}s`;
        console.log("results", results);
        return results;
    }
};