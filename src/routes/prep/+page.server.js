import puppeteer from 'puppeteer';
import { currentUser, pb } from '/src/lib/pocketbase.js';

const selectors = {
        serious_eats: {
            title: 'h1',
            author: '#mntl-bylines__item_4-0 > div > a',
            description: '#heading_1-0 > p',
            image: '#primary-image_1-0 > div > div > img',
            time: '#meta-text_1-0 > span.meta-text__data',
            servings: '#meta-text_6-0 > span.meta-text__data',
            ingredients: [{
                            group: '#structured-ingredients_1-0 > *',
                            list: '#structured-ingredients_1-0 > ul:nth-child(LIST_INDEX) > li',
                            item: '#structured-ingredients_1-0 > ul:nth-child(LIST_INDEX) > li:nth-child(ITEM_INDEX)'
                        },
                        {
                            group: '#ingredient-list_1-0 > li',
                            item: '#ingredient-list_1-0 > li:nth-child(ITEM_INDEX)'
                        },
                        {
                            group: '#structured-ingredients_1-0 > ul > li',
                            item: '#structured-ingredients_1-0 > ul > li:nth-child(ITEM_INDEX)'
                        }],
            directions: {
                            group: '#mntl-sc-block_3-0 > li',
                            item: '#mntl-sc-block_3-0 > li:nth-child(ITEM_INDEX) > p'
                        }
        },
        nyt: {
            title: 'h1',
            author: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipeintro_header-block__LWcDS.recipeintro_hasImage__5ekpP > header > div > h2:nth-child(1) > a',
            description: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipeintro_topnote-block__hFFPr > div > div > div > p',
            image: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipeintro_image-block__8T89f.recipeintro_prints-image-hidden__3wv8_ > figure > div > img',
            time: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipeintro_stats-block__YgbqJ > dl > dd:nth-child(2)',
            servings: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > div.ingredients_recipeYield__Ljm9O > span.pantry--ui.ingredients_fontOverride__WoKY5',
            ingredients: [{  
                            group: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > ul > *',
                            list: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > ul > ul:nth-child(LIST_INDEX) > li',
                            item: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > ul > ul:nth-child(LIST_INDEX) > li:nth-child(ITEM_INDEX)'
                        },
                        {
                            group: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > ul > li',
                            item: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_ingredients-block__lYSzh > div > ul > li:nth-child(ITEM_INDEX)'
                        }],
            directions: {
                            group: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_prep-block__cpC8w > div > ol > li',
                            item: '#__next > main > div > div.recipe.pagecontent_recipe-wrap__Pq_yd > div.recipebody_prep-block__cpC8w > div > ol > li:nth-child(ITEM_INDEX) > p'
                        }
        }
    };

async function get_ingredients(page, selectors){
    console.log("get ingredients");
    console.log({selectors});
    for (let k = 0; k < selectors.length; k++) {
        console.log(selectors[k]);
        let sel_len = selectors[k].group
        console.log({sel_len});
        let length = await page.evaluate((selector) => {
                        return Array.from(document.querySelectorAll(selector)).length;
                    }, sel_len);
        console.log({length});
        let output = [];
        for (let i = 0; i <= length; i++){
            if (selectors[k].list){
                let sel = selectors[k].list.replace("LIST_INDEX", i);
                console.log({sel});
                let list_length = await page.evaluate((selector) => {
                                    return Array.from(document.querySelectorAll(selector)).length;
                                }, sel);
                console.log({list_length});
                for (let j = 0; j <= list_length; j++){
                    let sel_item = selectors[k].item.replace("ITEM_INDEX", j);
                    sel_item = sel_item.replace("LIST_INDEX", i);
                    console.log({sel_item});
    
                    let temp = await page.evaluate((sel) => {
                        return document.querySelector(sel)?.textContent;
                    }, sel_item);
                    console.log({temp});
                    if (temp) output.push(temp.trim());
                }
            }else{
                let sel_item = selectors[k].item.replace("ITEM_INDEX", i);
                let temp = await page.evaluate((sel) => {
                    return document.querySelector(sel)?.textContent;
                }, sel_item);
                if (temp) output.push(temp.trim());
            }
        }
        if (output.length) return output;
    }
    return false;
}

async function get_directions(page, selector){
    // console.log("get directions");

    let length = await page.evaluate((selector) => {
                    return Array.from(document.querySelectorAll(selector)).length;
                }, selector.group);
    // console.log({selector});
    // console.log({length});
    let output = [];
    for (let i = 0; i <= length; i++){
        let sel = selector.item.replace("ITEM_INDEX", i);
        let temp = await page.evaluate((sel) => {
            return document.querySelector(sel)?.textContent;
        }, sel);
        if (temp) output.push(temp.trim());
    }
    
    return output;
}

async function get_img(page, selector){
    let temp = await page.evaluate((sel) => {
        return document.querySelector(sel)?.src;
    }, selector);
    console.log("img", temp);
    return temp;
}

async function get_element(page, selector){
    // console.log("get element");

    let elementSelector = await page.waitForSelector(
        selector
    );
    let result = await elementSelector?.evaluate(el => el.textContent);
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
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();
        const init_time = Date.now();
        let data = await request.formData();
        let url = await data.get('url');
        const await_data = Date.now();
        // let url = "https://www.seriouseats.com/obe-ata-nigerian-red-pepper-sauce";
        let site_selectors;
        if (url.includes("www.seriouseats.com")){
            site_selectors = selectors.serious_eats;
        }else if(url.includes("cooking.nytimes.com")){
            site_selectors = selectors.nyt;
        }else{
            return {err: "website not supported"};
        }
        const selector_time = Date.now();

        await page.goto(url);
        const go_to_time = Date.now();

        await page.setViewport({width: 1080, height: 1024});
        const set_view_time = Date.now();

        let results = {};

        for (const k in site_selectors){
            try{
                if(k == "ingredients"){
                    results[k] = await get_ingredients(page, site_selectors[k]);
                }else if(k == "directions"){
                    results[k] = await get_directions(page, site_selectors[k]);
                }else if(k == "image"){
                    results[k] = await get_img(page, site_selectors[k]);
                }else {
                    results[k] = await get_element(page, site_selectors[k]);
                }
            }catch (e){
                data = {
                    data: JSON.stringify({message: e.message, url: url}),
                    function: "prep scrape"
                };
                console.log("error", data);
                const result = await pb.collection('errors').create(data);
            }
        };
        results.description = results.description.split(".")[0];
        results.servings = format_servings(results.servings);
        // console.log("results", results);
        await browser.close();
        const end = Date.now();
        results.execution_time = `${(end-start)/1000}s`;
        results.logic_time = `${(end-set_view_time)/1000}s`;
        results.init_time = `${(init_time-start)/1000}s`;
        results.await_data_time = `${(await_data-init_time)/1000}s`;
        results.selector_time = `${(selector_time-await_data)/1000}s`;
        results.got_to_time = `${(go_to_time-selector_time)/1000}s`;
        results.set_view_time = `${(set_view_time-go_to_time)/1000}s`;
        results.compare_time = `${((set_view_time-go_to_time)+(end-set_view_time)+(go_to_time-selector_time)+(selector_time-await_data)+(await_data-init_time)+(init_time-start))/1000}s`;
        console.log("results", results);
        return results;
    }
};