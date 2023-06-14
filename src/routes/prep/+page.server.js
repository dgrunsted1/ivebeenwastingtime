import puppeteer from 'puppeteer';


/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        let data = await request.formData();
        let url = await data.get('url');
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();

        await page.goto('https://www.seriouseats.com/chicken-scarpariello-sweet-and-sour-chicken-italian-recipe');

        // Set screen size
        await page.setViewport({width: 1080, height: 1024});

        const titleSelector = await page.waitForSelector(
            '.heading__title'
        );
        const title = await titleSelector?.evaluate(el => el.textContent);

        const authorSelector = await page.waitForSelector(
            '.mntl-attribution__item-name'
        );
        const author = await authorSelector?.evaluate(el => el.textContent);

        const descSelector = await page.waitForSelector(
            '.heading__subtitle'
        );
        const description = await descSelector?.evaluate(el => el.textContent);

        const timeSelector = await page.waitForSelector(
            '.total-time >>> span.meta-text__data'
        );
        const time = await timeSelector?.evaluate(el => el.textContent);

        const servSelector = await page.waitForSelector(
            '.recipe-serving >>> span.meta-text__data'
        );
        const servings = await servSelector?.evaluate(el => el.textContent);

        const ingrSelector = await page.waitForSelector(
            '.structured-ingredients__list'
        );
        const ingredients = await ingrSelector?.evaluate(el => el.textContent);

        const directionSelector = await page.waitForSelector(
            'ol >>> p'
        );
        const directions = await directionSelector?.evaluate(el => el.textContent);

        // Print the full title
        console.log({directions});

        await browser.close();
        console.log(url);
        return { url };
    }
};