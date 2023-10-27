<script>
import { deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
import { currentUser, pb } from '/src/lib/pocketbase.js';
import { process_recipe, process_recipe_old } from '/src/lib/process_recipe.js';
  import { json } from '@sveltejs/kit';




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
// $: process_recipe_results = [];
$: process_recipe_results = [{"passed":false,"title":"Light and Fluffy Buttermilk Pancakes Recipe","url":"https://www.seriouseats.com/light-and-fluffy-pancakes-recipe","data":[{"key":"title","val":"Light and Fluffy Buttermilk Pancakes","test":false},{"key":"author","val":"J. Kenji López-Alt","test":true},{"key":"description","val":"These pancakes are extra light and fluffy with a classic buttery flavor and golden brown, crisp tops and bottoms","test":true},{"key":"image","test":false},{"key":"time","val":"35 mins","test":true},{"key":"servings","val":4,"test":true},{"key":"expand","val":{"quantity":1,"unit":"teaspoon","unitPlural":"teaspoons","symbol":"tsp","ingredient":"baking powder","minQty":1,"maxQty":1,"original":"1 teaspoon baking powder"},"test":true},{"key":"expand","val":{"quantity":0.5,"unit":"teaspoon","unitPlural":"teaspoons","symbol":"tsp","ingredient":"baking soda","minQty":0.5,"maxQty":0.5,"original":"1/2 teaspoon baking soda"},"test":true},{"key":"expand","val":{"quantity":1,"unit":"teaspoon","unitPlural":"teaspoons","symbol":"tsp","ingredient":"kosher salt","minQty":1,"maxQty":1,"original":"1 teaspoon kosher salt"},"test":true},{"key":"expand","val":{"quantity":1,"unit":"tablespoon","unitPlural":"tablespoons","symbol":"tbs","ingredient":"sugar","minQty":1,"maxQty":1,"original":"1 tablespoon sugar"},"test":true},{"key":"expand","val":{"quantity":2,"unit":"large","unitPlural":null,"symbol":null,"ingredient":"eggs, separated","minQty":2,"maxQty":2,"original":"2 large eggs, separated"},"test":true},{"key":"expand","val":{"quantity":4,"unit":"tablespoon","unitPlural":"tablespoons","symbol":"tbs","ingredient":"unsalted butter, melted, plus more for serving","minQty":4,"maxQty":4,"original":"4 tablespoons unsalted butter, melted, plus more for serving"},"test":true},{"key":"expand","val":{"quantity":0,"unit":"q.b.","unitPlural":"q.b.","symbol":null,"ingredient":"warm maple syrup","minQty":0,"maxQty":0,"original":"Warm maple syrup"},"test":true},{"key":"directions","val":["For the Dry Pancake Mix: Combine flour, baking powder, baking soda, salt, and sugar in a medium bowl and whisk until homogenous. Transfer to an airtight container. The mix will stay good for 3 months. (See notes.)","For each Batch of Pancakes: Place one batch of dry mix in a large bowl. In a medium clean bowl, whisk the egg whites until stiff peaks form. In a large bowl, whisk the egg yolks, buttermilk, and sour cream until homogenous. Slowly drizzle in the melted butter while whisking. Carefully fold in the egg whites with a rubber spatula until just combined. Pour the mixture over the dry mix and fold until just combined (there should still be plenty of lumps).","Heat a large heavy-bottomed nonstick skillet over medium heat for 5 minutes (or use an electric griddle). Add a small amount of butter or oil to the griddle and spread with a paper towel until no visible butter or oil remains. Use a 1⁄4-cup dry measure to place 4 pancakes in the skillet and cook until bubbles start to appear on top and the bottoms are golden brown, about 2 minutes. Carefully flip the pancakes and cook on the second side until golden brown and completely set, about 2 minutes longer. Serve the pancakes immediately, or keep warm on a wire rack set on a rimmed baking sheet in a warm oven while you cook the remaining 3 batches. Serve with warm maple syrup and butter."],"test":true}]},{"passed":false,"title":"Broccoli Bolognese with Orecchiette","url":"https://www.bonappetit.com/recipe/broccoli-bolognese-with-orecchiette","data":[{"key":"title","val":"Broccoli Bolognese with Orecchiette","test":true},{"key":"author","val":"Adam Rapoport","test":true},{"key":"description","val":"Broccoli and sausage pair up for an indulgent veg-heavy pasta dinner","test":true},{"key":"image","val":"https://assets.bonappetit.com/photos/5d76c38a1fbcac0008d45d8a/1:1/w_2560%2Cc_limit/BA-Broccoli-Bolognese-16x9.jpg","test":true},{"key":"servings","val":4,"test":true},{"key":"expand","val":{"quantity":4,"unit":"whole","unitPlural":null,"symbol":null,"ingredient":"serving ","minQty":4,"maxQty":4,"original":"4 servings"},"test":false},{"key":"expand","val":{"quantity":1,"unit":"large","unitPlural":"cloves","symbol":null,"ingredient":"head of broccoli (1¼–1½ pounds), cut into florets, stalk peeled and chopped into ½\" piecesKosher salt2tablespoons extra-virgin olive oil, plus more for drizzling4garlic cloves, smashed12ounces fresh Italian sausage ( 3 links), casings removedCrushed red pepper flakes12ounces orecchiette3tablespoons unsalted butter, cut into pieces1½ounces Parmesan, finely grated (about ½ cup), plus more for serving","minQty":1,"maxQty":1,"original":"1 large head of broccoli (1¼–1½ pounds), cut into florets, stalk peeled and chopped into ½\" piecesKosher salt2tablespoons extra-virgin olive oil, plus more for drizzling4garlic cloves, smashed12ounces fresh Italian sausage ( 3 links), casings removedCrushed red pepper flakes12ounces orecchiette3tablespoons unsalted butter, cut into pieces1½ounces Parmesan, finely grated (about ½ cup), plus more for serving"},"test":false},{"key":"expand","val":{"quantity":0,"unit":"q.b.","unitPlural":"q.b.","symbol":null,"ingredient":"kosher salt","minQty":0,"maxQty":0,"original":"Kosher salt"},"test":false},{"key":"expand","val":{"quantity":2,"unit":"tablespoon","unitPlural":"tablespoons","symbol":"tbs","ingredient":"extra-virgin olive oil, plus more for drizzling","minQty":2,"maxQty":2,"original":"2 tablespoons extra-virgin olive oil, plus more for drizzling"},"test":false},{"key":"expand","val":{"quantity":0,"unit":"q.b.","unitPlural":"q.b.","symbol":null,"ingredient":"crushed red pepper flakes","minQty":0,"maxQty":0,"original":"Crushed red pepper flakes"},"test":false},{"key":"expand","val":{"quantity":12,"unit":"ounce","unitPlural":"ounces","symbol":"oz","ingredient":"orecchiette","minQty":12,"maxQty":12,"original":"12 ounces orecchiette"},"test":false},{"key":"directions","val":["Cook broccoli in a large pot of salted boiling water until crisp-tender, about 3 minutes. Using a slotted spoon, transfer broccoli to a colander and let cool (save pot of water for cooking pasta). Chop broccoli into small pieces; set aside.","Heat 2 Tbsp. oil in a large skillet over medium. Cook garlic, shaking skillet occasionally, until it starts to turn golden, about 2 minutes. Transfer garlic to a small bowl. Cook sausage and a generous pinch of red pepper flakes, breaking up meat into smaller pieces with a wooden spoon and stirring occasionally, until browned and cooked through, 6–8 minutes.","Bring reserved pot of water to a boil and cook pasta until barely al dente, about 9 minutes (set a timer for 3 minutes less than the package instructions; it will cook more in the skillet).","Meanwhile, ladle about ½ cup pasta cooking liquid from pot into skillet with sausage and add garlic and blanched broccoli. Keep mixture at a low simmer, stirring often and mashing with a potato masher to break up sausage even more, until pasta is finished cooking.","Using a spider or slotted spoon, transfer pasta to skillet, then ladle in ½ cup pasta water. Cook, stirring, until pasta absorbs most of the liquid and is just al dente, about 4 minutes. Add butter and stir until melted, then transfer pasta to a large bowl. Gradually add 1½ oz. Parmesan, tossing constantly until you have a glossy, emulsified sauce.","Serve pasta topped with more Parmesan and red pepper flakes and a drizzle of oil."],"test":true}]}];
// $: process_recipe_results = [{"lengths":{"val":"npm: 15 - mine: 15","pass":true},"ingr":[{"quantity":{"npm":500,"mine":500,"pass":true},"unit":{"npm":"gram","mine":"g","pass":false},"ingredient":{"npm":"bread flour (17.5 ounces;  3 1/2 cups)","mine":"bread flour (17.5 ounces;  3 1/2 cups)","pass":true},"original":["500 g bread flour (17.5 ounces;  3 1/2 cups)"]},{"quantity":{"npm":0,"mine":14,"pass":true},"unit":{"npm":"q.b.","mine":"g","pass":true},"ingredient":{"npm":"kosher salt","mine":"kosher salt (0.5 ounce;  1 tablespoon); for table salt use same weight or half as much by volume","pass":false},"original":["14 g kosher salt (0.5 ounce;  1 tablespoon); for table salt use same weight or half as much by volume"]},{"quantity":{"npm":6,"mine":6,"pass":true},"unit":{"npm":"gram","mine":"g","pass":false},"ingredient":{"npm":"instant or rapid-rise yeast (0.25 ounce; about 1 1/2 teaspoons)","mine":"instant or rapid-rise yeast (0.25 ounce;  1 1/2 teaspoons)","pass":false},"original":["6 g instant or rapid-rise yeast (0.25 ounce;  1 1/2 teaspoons)"]},{"quantity":{"npm":20,"mine":60,"pass":false},"unit":{"npm":"gram","mine":"g","pass":false},"ingredient":{"npm":"extra-virgin olive oil (0.70 ounce; about 2 tablespoons)","mine":"extra-virgin olive oil (2.1 ounces), divided","pass":false},"original":["60 g extra-virgin olive oil (2.1 ounces), divided"]},{"quantity":{"npm":325,"mine":325,"pass":true},"unit":{"npm":"gram","mine":"g","pass":false},"ingredient":{"npm":"room-temperature water (11.5 ounces; about 1 cup plus 7 tablespoons)","mine":"room-temperature water (11.5 ounces;  1 cup plus 7 tablespoons)","pass":false},"original":["325 g room-temperature water (11.5 ounces;  1 cup plus 7 tablespoons)"]},{"quantity":{"npm":60,"mine":20,"pass":false},"unit":{"npm":"gram","mine":"g","pass":false},"ingredient":{"npm":"extra-virgin olive oil , divided (2.1 ounces)","mine":"extra-virgin olive oil (0.70 ounce;  2 tablespoons)","pass":false},"original":["20 g extra-virgin olive oil (0.70 ounce;  2 tablespoons)"]},{"quantity":{"npm":20,"mine":20,"pass":true},"unit":{"npm":"gram","mine":"g","pass":false},"ingredient":{"npm":"extra-virgin olive oil (0.70 ounce; about 2 tablespoons)","mine":"extra-virgin olive oil (0.70 ounce;  2 tablespoons)","pass":false},"original":["20 g extra-virgin olive oil (0.70 ounce;  2 tablespoons)"]},{"quantity":{"npm":"none","mine":9,"pass":true},"unit":{"npm":"none","mine":"medium","pass":true},"ingredient":{"npm":"none","mine":"cloves garlic (45g), roughly chopped","pass":true},"original":["9 medium cloves garlic (45g), roughly chopped"]},{"quantity":{"npm":1,"mine":1,"pass":true},"unit":{"npm":"tablespoon","mine":"tablespoon","pass":true},"ingredient":{"npm":"dried oregano","mine":"dried oregano","pass":true},"original":["1 tablespoon dried oregano"]},{"quantity":{"npm":"none","mine":2,"pass":true},"unit":{"npm":"none","mine":"teaspoon","pass":true},"ingredient":{"npm":"none","mine":"red pepper flakes, or more to taste","pass":true},"original":["2 teaspoons red pepper flakes, or more to taste"]},{"quantity":{"npm":"none","mine":false,"pass":false},"unit":{"npm":"none","mine":false,"pass":false},"ingredient":{"npm":"none","mine":"One 28-ounce (800g) can whole peeled tomatoes","pass":true},"original":["One 28-ounce (800g) can whole peeled tomatoes"]},{"quantity":{"npm":1,"mine":1,"pass":true},"unit":{"npm":"teaspoon","mine":"teaspoon","pass":true},"ingredient":{"npm":"sugar","mine":"sugar","pass":true},"original":["1 teaspoon sugar"]},{"quantity":{"npm":"none","mine":false,"pass":false},"unit":{"npm":"none","mine":false,"pass":false},"ingredient":{"npm":"none","mine":"Kosher salt","pass":true},"original":["Kosher salt"]},{"quantity":{"npm":1,"mine":1,"pass":true},"unit":{"npm":"pound","mine":"pound","pass":true},"ingredient":{"npm":"sliced deli-style mozzarella cheese (450g)","mine":"sliced deli-style mozzarella cheese","pass":false},"original":["1 pound (450g) sliced deli-style mozzarella cheese"]},{"quantity":{"npm":"none","mine":12,"pass":true},"unit":{"npm":"none","mine":"ounce","pass":true},"ingredient":{"npm":"none","mine":"(325g) natural-casing pepperoni, cut into 1/8-inch-thick slices","pass":true},"original":["12 ounces (325g) natural-casing pepperoni, cut into 1/8-inch-thick slices"]},{"quantity":{"npm":"none","mine":4,"pass":true},"unit":{"npm":"none","mine":"ounce","pass":true},"ingredient":{"npm":"none","mine":"ground Pecorino Romano cheese","pass":true},"original":["4 ounces (115g) ground Pecorino Romano cheese"]}]},{"lengths":{"val":"npm: 10 - mine: 10","pass":true},"ingr":[{"quantity":{"npm":10,"mine":10,"pass":true},"unit":{"npm":"ounce","mine":"ounce","pass":true},"ingredient":{"npm":"all-purpose flour ( 2 cups)","mine":"( 2 cups) all-purpose flour","pass":false},"original":["10 ounces ( 2 cups) all-purpose flour"]},{"quantity":{"npm":1,"mine":1,"pass":true},"unit":{"npm":"teaspoon","mine":"teaspoon","pass":true},"ingredient":{"npm":"baking powder","mine":"baking powder","pass":true},"original":["1 teaspoon baking powder"]},{"quantity":{"npm":0.5,"mine":0.5,"pass":true},"unit":{"npm":"teaspoon","mine":"teaspoon","pass":true},"ingredient":{"npm":"baking soda","mine":"baking soda","pass":true},"original":["1/2 teaspoon baking soda"]},{"quantity":{"npm":1,"mine":1,"pass":true},"unit":{"npm":"teaspoon","mine":"teaspoon","pass":true},"ingredient":{"npm":"kosher salt","mine":"kosher salt","pass":true},"original":["1 teaspoon kosher salt"]},{"quantity":{"npm":1,"mine":1,"pass":true},"unit":{"npm":"tablespoon","mine":"tablespoon","pass":true},"ingredient":{"npm":"sugar","mine":"sugar","pass":true},"original":["1 tablespoon sugar"]},{"quantity":{"npm":2,"mine":2,"pass":true},"unit":{"npm":"large","mine":"large","pass":true},"ingredient":{"npm":"eggs, separated","mine":"eggs, separated","pass":true},"original":["2 large eggs, separated"]},{"quantity":{"npm":1.5,"mine":1.5,"pass":true},"unit":{"npm":"cup","mine":"cup","pass":true},"ingredient":{"npm":"buttermilk (about 12 ounces)","mine":"( 12 ounces) buttermilk","pass":false},"original":["1 1/2 cups ( 12 ounces) buttermilk"]},{"quantity":{"npm":1,"mine":1,"pass":true},"unit":{"npm":"cup","mine":"cup","pass":true},"ingredient":{"npm":"sour cream (see notes) (about 8 ounces)","mine":"( 8 ounces) sour cream (see notes)","pass":false},"original":["1 cup ( 8 ounces) sour cream (see notes)"]},{"quantity":{"npm":4,"mine":4,"pass":true},"unit":{"npm":"tablespoon","mine":"tablespoon","pass":true},"ingredient":{"npm":"unsalted butter, melted, plus more for serving","mine":"unsalted butter, melted, plus more for serving","pass":true},"original":["4 tablespoons unsalted butter, melted, plus more for serving"]},{"quantity":{"npm":"none","mine":false,"pass":false},"unit":{"npm":"none","mine":false,"pass":false},"ingredient":{"npm":"none","mine":"Warm maple syrup","pass":true},"original":["Warm maple syrup"]}]}];
$: compare_result = [];
$: cuisines = [];
$: countries = [];


onMount(() => {
    if (!$currentUser) window.location.href = "/login";
    let categories = pb.collection('recipes').getList(1, 100, {fields: `cuisine`});
});

async function fetch_recipe(e){
    document.getElementById("scrape_loading").classList.remove("hidden");
    const data = new FormData(this);

    const response = await fetch(this.action, {
        method: 'POST',
        body: data
    });

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
    let num_tests = 2;
    e.srcElement.innerHTML = `<progress id="progress" class="progress progress-secondary w-56" value="5" max="100"></progress>`;
    const recipe_links = await pb.collection('recipes').getList(1, num_tests, {expand:`ingr_list`});
    e.srcElement.firstChild.value = `10`;
    process_recipe_results = [];
    console.log({recipe_links});
    for (let i = 0; i < recipe_links.items.length; i++){
        console.log(i, recipe_links.items[i]);
        const data = new FormData(this);
        data.append("recipe", JSON.stringify(recipe_links.items[i]));
        console.log("recipe data", data);
        let scraped_ingr = [];
        const response = await fetch(this.action, {
            method: 'POST',
            body: data,
            recipe: recipe_links.items[i]
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());
        if (result.data.err) {
            alert(result.data.err);
        } else if (result.type === 'success') {
            let scraped_recipe = result.data;
            scraped_recipe.expand.ingr_list = process_recipe_old(scraped_recipe.expand.ingr_list);
            // let npm_result = process_recipe(scraped_ingrs);
            // process_recipe_results = [compare(my_result, npm_result)].concat(process_recipe_results);  
            process_recipe_results  = [test_recipe(scraped_recipe, recipe_links.items[i])].concat(process_recipe_results);    
            console.log("data", process_recipe_results);
        }
        let progress = ((i+1)/num_tests)*100;
        e.srcElement.firstChild.value = `${progress}`;
    }
    e.srcElement.innerHTML = `Compare Parsers`;
    console.log(JSON.stringify(process_recipe_results));
}

function test_attr(truth, attr_in){
    if (!truth || !attr_in) return false;
    if (typeof truth == "number" || typeof attr_in == "number"){
        return (parseInt(truth) == parseInt(attr_in));
    } else if (typeof truth == "object" || typeof attr_in == "object"){
        for (let [key, value] of Object.entries(attr_in)){
            if (truth[key] != attr_in[key]) return false;
        }
        return true;
    } else {
        return (truth.toLowerCase().trim() == attr_in.toLowerCase().trim())
    }
}

function test_ingr(truth, ingr_in){
    // console.log("test_ingr", ingr_in, truth);
    let output = "";
    // console.log(!truth ^ !ingr_in);
    if (!truth ^ !ingr_in) return false;
    if (truth.ingredient != ingr_in.ingredient) output += `Ingredient mismatch: ${truth?.ingredient} vs ${ingr_in.ingredient}\n`;
    if (truth.quantity != ingr_in.quantity) output += `Quantity mismatch: ${truth?.quantity} vs ${ingr_in.quantity}\n`;
    if (truth.unit != ingr_in.unit) output += `Unit mismatch: ${truth?.unit} vs ${ingr_in.unit}\n`;

    if (output) console.log("errors", output);
    return (output == "") ? true : false;
}

function test_recipe(my_result, truth){
    // console.log({my_result});
    let output = [];
    for (let [key, value] of Object.entries(my_result)) {
        // console.log(key, value);
        if (!value && !truth[key]) continue;
        if (key == "expand"){
            for (let j = 0; j < value.ingr_list.length; j++){
                if (!value.ingr_list[j]) continue;
                // console.log(value.ingr_list[j]);
                for (let i = 0; i < truth.expand.ingr_list.length; i++){
                    // console.log(truth.expand.ingr_list[i].ingredient, value.ingr_list[j].ingredient);
                    if (truth.expand.ingr_list[i].ingredient.includes(value.ingr_list[j].ingredient) || value.ingr_list[j].ingredient.includes(truth.expand.ingr_list[i].ingredient)){
                        // console.log(truth.expand.ingr_list[i].ingredient, value.ingr_list[j].ingredient);
                        output.push({key: key, val: value.ingr_list[j], test: test_ingr(truth.expand.ingr_list[j], my_result.expand.ingr_list[j])});
                        break;
                    }
                }
            }
        }else if (key != "tags" && key != "timing"){
            output.push({key: key, val: value, test: test_attr(truth[key], value)});
        }
        // console.log(my_result[key]);
    } 
    return {
        passed: passed(output),
        title:truth.title,
        url:truth.url,
        data: output
    };
}

function passed(data){
    for (let [key, value] of Object.entries(data)) {
        if (!value && !truth[key]) continue;
        if (key == "expand"){
            for (let j = 0; j < value.ingr_list.length; j++){
               if (!data.expand.ingr_list[j].test) return false;
            }
        }else if (key != "tags" && key != "timing"){
            if (!value.test) return false;
        }
    }  
    return true;
}

function compare(my_result, npm_result){
    let compare = {};
    compare.lengths = {val: `npm: ${npm_result.length} - mine: ${my_result.length}`, pass: npm_result.length == my_result.length};
    compare.ingr = [];
    for (let i = 0; i < my_result.length; i++){
        // console.log("my result i", my_result[i]);
        let npm_match = null
        for (let j = 0; j < npm_result.length; j++){
            if (my_result[i].ingredient && (npm_result[j].ingredient.toLowerCase().includes(my_result[i].ingredient.toLowerCase().replace(/ *\([^)]*\) */g, "").trim()) || 
                my_result[i].ingredient.toLowerCase().includes(npm_result[j].ingredient.toLowerCase().replace(/ *\([^)]*\) */g, "").trim()))){
                npm_match = npm_result[j];
            }
        }
        if (!npm_match){
            npm_match = npm_result[i];
        }
        let quantity = {
            npm: npm_match.quantity,
            mine: my_result[i].quantity,
            pass: (npm_match.quantity == my_result[i].quantity || (my_result[i].quantity && (!npm_match.quantity)) || (!my_result[i].quantity && !npm_match.quantity))
        }
        let unit = {
            npm: npm_match.unit,
            mine: my_result[i].unit,
            pass: (npm_match.unit == my_result[i].unit || (my_result[i].unit && (!npm_match.unit || npm_match.unit == "q.b.")) || (!my_result[i].unit && !npm_match.unit) || ((my_result[i].unit == "g" || my_result[i].unit == "gram") && (npm_match.unit == "g" || npm_match.unit == "gram")))
        }
        let ingredient = {
            npm: npm_match.ingredient,
            mine: my_result[i].ingredient,
            pass: (npm_match.ingredient == my_result[i].ingredient || (npm_match.ingredient.toLowerCase().replace(/ *\([^)]*\) */g, "").trim() == my_result[i].ingredient.toLowerCase().replace(/ *\([^)]*\) */g, "").trim()) || (my_result[i].ingredient && !npm_match.ingredient))
        }
        compare.ingr.push({quantity, unit, ingredient, original: my_result[i].original});
        
    }
    return compare;
}

function reupload_recipes(){
    // get all recipes saved
    //check which format 
    // 
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
         <div class="flex w-full m-5 w-1/2">
            <div class="w-full justify-center">
                <div class="flex justify-center space-x-10 content-center">
                    <form method="POST" action="?/scrape_ingr"  on:click|preventDefault={process_recipe_test}>
                        <button class="btn btn-primary w-56">
                            compare parsers
                        </button>
                    </form>
                </div>
                
                <div class="flex flex-col w-full space-y-2 mt-5 justify-center">
                    {#if process_recipe_results}
                    <!-- <h3 class="text-center">NPM : MINE</h3> -->
                        {#each process_recipe_results as recipe}
                            {#if recipe.passed}
                                <div class="bg-error-content text-success rounded text-center col-span-3"><p>{recipe.title}</p><a href={recipe.url}>{recipe.url}</a></div>
                            {:else}
                                <div class="bg-error-content text-error rounded text-center col-span-3"><p>{recipe.title}</p><a href={recipe.url}>{recipe.url}</a></div>
                            {/if}
                            {#each recipe.data as curr}
                                <div class="grid grid-rows-1">
                                    
                                    {#if curr.test == true}
                                        <!-- <p class="bg-success-content text-success rounded text-center col-span-3 m-3">{curr.key} passed</p> -->
                                    {:else}
                                        <p class="bg-error-content text-error rounded text-center col-span-3">{curr.key} failed</p>
                                    {/if}
                                    
                                    <!-- <div class="grid grid-cols-1 gap-2 content-start">
                                        {#each curr.ingr as ingr}
                                            <div class="text-center">{ingr.original}</div>
                                            <div class="flex justify-start space-x-2">
                                                {#if ingr.quantity.pass}
                                                    <div class="flex shrink-0 whitespace-nowrap p-1 rounded text-center bg-success-content text-success w-24 items-center"><div class="w-1/2">{ingr.quantity.npm}</div> : <div class="w-1/2">{ingr.quantity.mine}</div></div>
                                                {:else}
                                                    <div class="flex shrink-0 whitespace-nowrap p-1 rounded text-center bg-error-content text-error w-24 items-center"><div class="w-1/2">{ingr.quantity.npm}</div> : <div class="w-1/2">{ingr.quantity.mine}</div></div>
                                                {/if}

                                                {#if ingr.unit.pass}
                                                    <div class="flex shrink-0 whitespace-nowrap p-1 rounded text-center bg-success-content text-success w-52 items-center"><div class="w-1/2">{ingr.unit.npm}</div> : <div class="w-1/2">{ingr.unit.mine}</div></div>
                                                {:else}
                                                    <div class="flex shrink-0 whitespace-nowrap p-1 rounded text-center bg-error-content text-error w-52 items-center"><div class="w-1/2">{ingr.unit.npm}</div> : <div class="w-1/2">{ingr.unit.mine}</div></div>
                                                {/if}

                                                {#if ingr.ingredient.pass}
                                                    <div class="flex px-1 rounded text-left bg-success-content text-success items-center w-full"><div class="w-1/2 text-center">{ingr.ingredient.npm}</div> : <div class="w-1/2 text-center">{ingr.ingredient.mine}</div></div>
                                                {:else}
                                                    <div class="flex px-1 rounded text-left bg-error-content text-error items-center w-full"><div class="w-1/2 text-center">{ingr.ingredient.npm}</div> : <div class="w-1/2 text-center">{ingr.ingredient.mine}</div></div>
                                                {/if}
                                            </div>
                                        {/each}
                                    </div> -->
                                </div>
                                
                            {/each}
                        {/each}
                    {/if}
                </div>
            </div>
         </div>
         <!-- pull old recipes and upload with new format -->
         <!-- <div class="flex w-full m-5">
            <div class="w-fit justify-center">
                <div class="flex justify-center space-x-10 content-center">
                        <button class="btn btn-primary" on:click|preventDefault={reupload_recipes}>
                            upload recipes with new format
                        </button>
                    <div class="w-5 content-center"><span id="scrape_loading" class="loading loading-ring loading-lg hidden text-primary"></span></div>
                </div>
                
                <div class="flex flex-col w-full space-y-2 m-5 justify-center"> -->
                    <!-- {#if process_recipe_results}
                        {#each process_recipe_results as curr}
                            {curr}<br><br>
                        {/each}
                    {/if} -->
                <!-- </div>
            </div>
         </div> -->
     </div>
     <div class="flex">
        {#each compare_result as curr}
            <p>{curr}</p>
        {/each}
     </div>
     
</div>