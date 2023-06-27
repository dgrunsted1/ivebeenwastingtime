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
            author: '.pantry--ui',
            description: '.pantry--body >>> p',
            time: '.pantry--ui',
            servings: '.pantry--ui.ingredients_fontOverride__WoKY5',
            ingredients: '.ingredients_ingredients__qAcSs >>>> ul',
            directions: '.recipebody_prep-block__cpC8w'
        }
    };

async function get_element(page, selector){
    let elementSelector = await page.waitForSelector(
        selector
    );
    let result = await elementSelector?.evaluate(el => el.textContent);
    return result;
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

async function get_length(page, selector){
    // console.log({selector});
    let list_length = await page.evaluate((sel) => {
        // console.log({sel});
        return document.getElementsByClassName(sel).length;
      }, selector);
      return list_length;
}

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
        // console.log("results", results);
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