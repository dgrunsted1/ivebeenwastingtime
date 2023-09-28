<script>
import { deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
import { currentUser, pb } from '/src/lib/pocketbase.js';
import { process_recipe } from '/src/lib/process_recipe.js';
import { parse } from 'recipe-ingredient-parser-v3';




const process_recipe_tests = {
    input:[
        [
            'One 5.4-ounce (150g) can unsweetened coconut cream',
            '2 tablespoons (1 ounce; 30g) freshly squeezed lime juice (from about 1 lime)',
            '3 Thai chiles, finely minced (about 1 tablespoon; 15g)',
            '1 tablespoon (15g) coconut aminos (see note)',
            '2 teaspoons fish sauce',
            '10 (8-inch) rice summer roll wrappers',
            '1/2 bunch (1 ounce; 30g) fresh cilantro',
            '1/2 bunch (1 ounce; 30g) fresh mint',
            '1/2 bunch (1 ounce; 30g) fresh basil',
            '1 pound (454g) jicama, peeled and cut into 1/4-inch matchsticks',
            '1 pound (454g) watermelon, peeled and cut into 1/4-inch matchsticks',
            '3/4 cup (3 1/2 ounces; 100g) toasted and salted peanuts, roughly chopped',
            '3-inch piece ginger, cut into 1/8-inch matchsticks (about 1 ounce; 30g)',
            '2 limes, cut into wedges',
            'Kosher salt'
        ],
        [
            '12 ounces fava beans in their pods or 4 ounces shucked fava beans (120g shucked beans)',
            '12 ounces English peas in their pods or 4 ounces shucked peas (120g shucked peas)',
            'Kosher salt',
            '8 ounces asparagus, woody ends removed, stalks cut on a sharp bias at 1-inch intervals pieces (225g)',
            '6 ounces snap peas, strings removed, sliced on a sharp bias into 1/2-inch slices (170g)',
            '8 ounces broccolini, woody ends removed, cut on a sharp bias at 1-inch intervals pieces (170g)',
            '6 ounces stale hearty bread, crusts removed (170g)',
            '3 tablespoons unsalted butter (25g)',
            '2 tablespoons minced shallot, divided (about 1 small; 30g)',
            '2 tablespoons minced fresh parsley leaves',
            '2 tablespoons minced fresh chives',
            'Freshly ground black pepper',
            '1 tablespoon (15ml) juice and 2 teaspoons (5g) zest from 1 lemon',
            '3 tablespoons extra-virgin olive oil (45ml)',
            '4 poached eggs'
        ],
        [
            '2cups all-purpose flour',
            '2teaspoons baking powder',
            '¼teaspoon salt',
            '1tablespoon sugar, optional',
            '2eggs',
            '1½ to 2cups milk',
            '2tablespoons melted and cooled butter (optional), plus unmelted butter for cooking, or use neutral oil'
        ],
        [
            '1pound yellow onions, peeled and coarsely chopped',
            '½stick unsalted butter, melted',
            '15-pound duck, rinsed and patted dry',
            'Salt',
            'Freshly ground pepper',
            '2large rosemary sprigs',
            '2cups fresh orange juice',
            '1cup dry sherry',
            '½cup soy sauce',
            '2medium carrots, peeled and julienned',
            '4ounces cremini or white button mushrooms, trimmed and sliced thin',
            '2tablespoons unsalted butter',
            '17-ounce jar roasted red peppers, rinsed, drained and cut into strips',
            '2fresh chives, cut into 1-inch lengths',
            'Hash browns (see recipe)'
        ]
    ],
    ouput:[[
        {"amount":false,"unit":false,"name":"One 5.4-ounce (150g) can unsweetened coconut cream","original":["One 5.4-ounce (150g) can unsweetened coconut cream"]},
        {"amount":2,"unit":"tablespoon","name":"(1 ounce; 30g) freshly squeezed lime juice (from 1 lime)","original":["2 tablespoons (1 ounce; 30g) freshly squeezed lime juice (from 1 lime)"]},
        {"amount":3,"unit":"whole","name":"thai chiles, finely minced ( 1 tablespoon; 15g)","original":["3 Thai chiles, finely minced ( 1 tablespoon; 15g)"]},
        {"amount":1,"unit":"tablespoon","name":"coconut aminos (see note)","original":["1 tablespoon (15g) coconut aminos (see note)"]},
        {"amount":2,"unit":"teaspoon","name":"fish sauce","original":["2 teaspoons fish sauce"]},
        {"amount":false,"unit":false,"name":"10 (8-inch) rice summer roll wrappers","original":["10 (8-inch) rice summer roll wrappers"]},
        {"amount":0.5,"unit":"bunch","name":"(1 ounce; 30g) fresh cilantro","original":["1/2 bunch (1 ounce; 30g) fresh cilantro"]},
        {"amount":0.5,"unit":"bunch","name":"(1 ounce; 30g) fresh mint","original":["1/2 bunch (1 ounce; 30g) fresh mint"]},
        {"amount":0.5,"unit":"bunch","name":"(1 ounce; 30g) fresh basil","original":["1/2 bunch (1 ounce; 30g) fresh basil"]},
        {"amount":1,"unit":"pound","name":"jicama, peeled and cut into 1/4-inch matchsticks","original":["1 pound (454g) jicama, peeled and cut into 1/4-inch matchsticks"]},
        {"amount":1,"unit":"pound","name":"watermelon, peeled and cut into 1/4-inch matchsticks","original":["1 pound (454g) watermelon, peeled and cut into 1/4-inch matchsticks"]},
        {"amount":0.75,"unit":"cup","name":"(3 1/2 ounces; 100g) toasted and salted peanuts, roughly chopped","original":["3/4 cup (3 1/2 ounces; 100g) toasted and salted peanuts, roughly chopped"]},
        {"amount":false,"unit":false,"name":"3-inch piece ginger, cut into 1/8-inch matchsticks ( 1 ounce; 30g)","original":["3-inch piece ginger, cut into 1/8-inch matchsticks ( 1 ounce; 30g)"]},
        {"amount":2,"unit":"whole","name":"lime , cut into wedges","original":["2 limes, cut into wedges"]},{"amount":false,"unit":false,"name":"Kosher salt","original":["Kosher salt"]}
    ],[
        {"amount":12,"unit":"ounce","name":"fava beans in their pods or 4 ounces shucked fava beans (120g shucked beans)","original":["12 ounces fava beans in their pods or 4 ounces shucked fava beans (120g shucked beans)"]},
        {"amount":12,"unit":"ounce","name":"English peas in their pods or 4 ounces shucked peas (120g shucked peas)","original":["12 ounces English peas in their pods or 4 ounces shucked peas (120g shucked peas)"]},
        {"amount":false,"unit":false,"name":"Kosher salt","original":["Kosher salt"]},
        {"amount":8,"unit":"ounce","name":"asparagus, woody ends removed, stalks cut on a sharp bias at 1-inch intervals pieces (225g)","original":["8 ounces asparagus, woody ends removed, stalks cut on a sharp bias at 1-inch intervals pieces (225g)"]},
        {"amount":6,"unit":"ounce","name":"snap peas, strings removed, sliced on a sharp bias into 1/2-inch slices (170g)","original":["6 ounces snap peas, strings removed, sliced on a sharp bias into 1/2-inch slices (170g)"]},
        {"amount":8,"unit":"ounce","name":"broccolini, woody ends removed, cut on a sharp bias at 1-inch intervals pieces (170g)","original":["8 ounces broccolini, woody ends removed, cut on a sharp bias at 1-inch intervals pieces (170g)"]},
        {"amount":6,"unit":"ounce","name":"stale hearty bread, crusts removed (170g)","original":["6 ounces stale hearty bread, crusts removed (170g)"]},
        {"amount":3,"unit":"tablespoon","name":"unsalted butter (25g)","original":["3 tablespoons unsalted butter (25g)"]},
        {"amount":2,"unit":"tablespoon","name":"minced shallot, divided ( 1 small; 30g)","original":["2 tablespoons minced shallot, divided ( 1 small; 30g)"]},
        {"amount":2,"unit":"tablespoon","name":"minced fresh parsley leaves","original":["2 tablespoons minced fresh parsley leaves"]},
        {"amount":2,"unit":"tablespoon","name":"minced fresh chives","original":["2 tablespoons minced fresh chives"]},
        {"amount":false,"unit":false,"name":"Freshly ground black pepper","original":["Freshly ground black pepper"]},
        {"amount":1,"unit":"tablespoon","name":"juice and 2 teaspoons (5g) zest from 1 lemon","original":["1 tablespoon (15ml) juice and 2 teaspoons (5g) zest from 1 lemon"]},
        {"amount":3,"unit":"tablespoon","name":"extra-virgin olive oil (45ml)","original":["3 tablespoons extra-virgin olive oil (45ml)"]},
        {"amount":4,"unit":"whole","name":"poached eggs","original":["4 poached eggs"]}
    ],[
        {"amount":2,"unit":"cup","name":"all-purpose flour","original":["2 cups all-purpose flour"]},
        {"amount":2,"unit":"teaspoon","name":"baking powder","original":["2 teaspoons baking powder"]},
        {"amount":0.25,"unit":"teaspoon","name":"salt","original":["¼ teaspoon salt"]},
        {"amount":1,"unit":"tablespoon","name":"sugar, optional","original":["1 tablespoon sugar, optional"]},
        {"amount":2,"unit":"whole","name":"egg ","original":["2 eggs"]},
        {"amount":2,"unit":"cup","name":"milk","original":["2 cups milk"]},
        {"amount":2,"unit":"tablespoon","name":"melted and cooled butter (optional), plus unmelted butter for cooking, or use neutral oil","original":["2 tablespoons melted and cooled butter (optional), plus unmelted butter for cooking, or use neutral oil"]}
    ],[
        {"amount":1,"unit":"pound","name":"yellow onions, peeled and coarsely chopped","original":["1 pound yellow onions, peeled and coarsely chopped"]},
        {"amount":0.5,"unit":"whole","name":"stick unsalted butter, melted","original":["½ stick unsalted butter, melted"]},
        {"amount":false,"unit":false,"name":"15-pound duck, rinsed and patted dry","original":["15-pound duck, rinsed and patted dry"]},
        {"amount":false,"unit":false,"name":"Salt","original":["Salt"]},
        {"amount":false,"unit":false,"name":"Freshly ground pepper","original":["Freshly ground pepper"]},
        {"amount":2,"unit":"large","name":"rosemary sprigs","original":["2 large rosemary sprigs"]},
        {"amount":2,"unit":"cup","name":"fresh orange juice","original":["2 cups fresh orange juice"]},
        {"amount":1,"unit":"cup","name":"dry sherry","original":["1 cup dry sherry"]},
        {"amount":0.5,"unit":"cup","name":"soy sauce","original":["½ cup soy sauce"]},
        {"amount":2,"unit":"medium","name":"carrots, peeled and julienned","original":["2 medium carrots, peeled and julienned"]},
        {"amount":4,"unit":"ounce","name":"cremini or white button mushrooms, trimmed and sliced thin","original":["4 ounces cremini or white button mushrooms, trimmed and sliced thin"]},
        {"amount":2,"unit":"tablespoon","name":"unsalted butter","original":["2 tablespoons unsalted butter"]},
        {"amount":false,"unit":false,"name":"17-ounce jar roasted red peppers, rinsed, drained and cut into strips","original":["17-ounce jar roasted red peppers, rinsed, drained and cut into strips"]},
        {"amount":2,"unit":"whole","name":"fresh chives, cut into 1-inch lengths","original":["2 fresh chives, cut into 1-inch lengths"]},{"amount":false,"unit":false,"name":"Hash browns (see recipe)","original":["Hash browns (see recipe)"]}
    ]]
}
$: scraper_test_result = [];
$: process_recipe_results = [];
$: compare_result = [];


onMount(() => {
        if (!$currentUser) window.location.href = "/login";
});

async function fetch_recipe(e){
    document.getElementById("scrape_loading").classList.remove("hidden");
    const data = new FormData(this);

    const response = await fetch(this.action, {
        method: 'POST',
        body: data
    });ewf

    /** @type {import('@sveltejs/kit').ActionResult} */
    const result = deserialize(await response.text());
    document.getElementById("scrape_loading").classList.add("hidden");
    console.log(result.data);
    if (result.data.err) {
        alert(result.data.err);
    } else if (result.type === 'success') {
        scraper_test_result = result.data;
        console.log({scraper_test_result});
    }
}

async function process_recipe_test(e){
    const recipe_links = await pb.collection('recipes').getList(1, 1, {field:`url`});
    process_recipe_results = [];
    console.log({recipe_links});
    for (let i = 0; i < recipe_links.items.length; i++){
        const data = new FormData(this);
        let scraped_ingr = [];
        const response = await fetch(this.action, {
            method: 'POST',
            body: data,
            url: recipe_links.items[i].url
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());
        console.log(result.data);
        if (result.data.err) {
            alert(result.data.err);
        } else if (result.type === 'success') {
            let scraped_ingrs = result.data;
            console.log({scraped_ingr});
            let my_result = process_recipe(scraped_ingrs);
            let npm_result = [];
            for (let i = 0; i < scraped_ingrs.length; i++){
                let tmp = parse(scraped_ingrs[i], 'eng');
                npm_result.push(tmp);
            }
            // test for differenes
            let compare = {};
            compare.lengths = {val: `npm: ${npm_result.length} - mine: ${my_result.length}`, pass: npm_result.length == my_result.length};
            let loops = (npm_result.length > my_result.length) ? npm_result.length : my_result.length;
            compare.ingr = [];
            for (let i = 0; i < loops; i++){
                let quantity = {val: `npm: ${npm_result[i].quantity} - mine: ${my_result[i].amount}`, pass: (npm_result.quantity == my_result.amount) || (npm_result.quantity == "" && my_result.amount == "")};
                let unit = {val: `npm: ${npm_result[i].unit} - mine: ${my_result[i].unit}`, pass: (npm_result.unit == my_result.unit) || (npm_result.unit == "" && my_result.unit == "")};
                let ingredient = {val: `npm: ${npm_result[i].ingredient} - mine: ${my_result[i].name}`, pass: (npm_result.ingredient == my_result.name) || (npm_result.ingredient == "" && my_result.name == "")};
                compare.ingr.push({quantity, unit, ingredient});
            }
            process_recipe_results.push(compare);
            process_recipe_results = process_recipe_results;        
        }
        
    }
}

function reupload_recipes(){
    // get all recipes saved
    //check which format 
    // 
}

function compare_process_recipe(){

}

</script>



<div class="flex flex-col">
    <!-- 
        scraper for each website
            
        process_recipe
        merge?
     -->
     <div class="flex">
        <div class="flex w-full m-5">
            <div class="w-fit justify-center">
                <div class="flex justify-center space-x-10 content-center">
                    <form method="POST" action="?/scrape"  on:click|preventDefault={fetch_recipe}>
                        <button class="btn btn-primary">
                            test scraper
                        </button>
                    </form>
                    <div class="w-5 content-center"><span id="scrape_loading" class="loading loading-ring loading-lg hidden text-primary"></span></div>
                </div>
                
                <div class="flex flex-col w-full space-y-2 m-5 justify-center">
                    {#if scraper_test_result}
                        {#each scraper_test_result as curr}
                            {#if !curr.message.includes("failed")}
                                <p class="alert alert-success p-2 m-auto w-fit text-center">{curr.message}</p>
                            {:else}
                                <p class="alert alert-error p-2">{curr.message}</p><a href={curr.url} target="_blank" class="btn btn-warning btn-sm">link</a>
                                <div class="flex flex-col ml-5 space-y-1">
                                    {#each Object.entries(curr) as [key, value]}
                                        {#if key == "directions" || key == "ingredients"}
                                            {#if value.status}
                                                <p class="alert alert-success text-sm p-1">{key}</p>
                                            {:else}
                                                <p class="alert alert-error text-sm p-1">{key}</p>
                                                <div class="flex flex-col m-5">
                                                    {#each value.message as message}
                                                        <p class="alert alert-error text-sm p-1">{message}</p>
                                                    {/each}
                                                </div>
                                            {/if}
                                        {:else if key != "message" && key != "url"}
                                            {#if value}
                                                <p class="alert alert-success text-sm p-1">{key}</p>
                                            {:else}
                                                <p class="alert alert-error text-sm p-1">{key}</p>
                                            {/if}
                                        {/if}
                                    {/each}
                                </div>
                            {/if}
                        {/each}
                    {/if}
                </div>
            </div>
         </div>
    
         <!-- process recipe vs npm ingredient parser-->
         <div class="flex w-full m-5">
            <div class="w-fit justify-center">
                <div class="flex justify-center space-x-10 content-center">
                    <form method="post"action="?/scrape_ingr">
                        <button class="btn btn-primary" on:click|preventDefault={process_recipe_test}>
                            test process recipe
                        </button>
                    </form>
                        
                    <div class="w-5 content-center"><span id="scrape_loading" class="loading loading-ring loading-lg hidden text-primary"></span></div>
                </div>
                
                <div class="flex flex-col w-full space-y-2 m-5 justify-center">
                    {#if process_recipe_results}
                        {#each process_recipe_results as curr}
                            {#if curr.length.pass}
                                <p class="bg-success">{curr.length.val}</p>
                            {:else}
                                <p class="bg-error">{curr.length.val}</p>
                            {/if}
                            {#each curr.ingr as ingr}
                                {#if ingr.quantity.pass}
                                    <p class="bg-success">{ingr.quantity.val}</p>
                                {:else}
                                    <p class="bg-error">{ingr.quantity.val}</p>
                                {/if}

                                {#if ingr.unit.pass}
                                    <p class="bg-success">{ingr.unit.val}</p>
                                {:else}
                                    <p class="bg-error">{ingr.unit.val}</p>
                                {/if}

                                {#if ingr.ingredient.pass}
                                    <p class="bg-success">{ingr.ingredient.val}</p>
                                {:else}
                                    <p class="bg-error">{ingr.ingredient.val}</p>
                                {/if}
                            {/each}
                        {/each}
                    {/if}
                </div>
            </div>
         </div>
         <!-- pull old recipes and upload with new format -->
         <div class="flex w-full m-5">
            <div class="w-fit justify-center">
                <div class="flex justify-center space-x-10 content-center">
                        <button class="btn btn-primary" on:click|preventDefault={reupload_recipes}>
                            upload recipes with new format
                        </button>
                    <div class="w-5 content-center"><span id="scrape_loading" class="loading loading-ring loading-lg hidden text-primary"></span></div>
                </div>
                
                <div class="flex flex-col w-full space-y-2 m-5 justify-center">
                    {#if process_recipe_results}
                        {#each process_recipe_results as curr}
                            {curr}<br><br>
                        {/each}
                    {/if}
                </div>
            </div>
         </div>
     </div>
     <div class="flex">
        {#each compare_result as curr}
            <p>{curr}</p>
        {/each}
     </div>
     
</div>