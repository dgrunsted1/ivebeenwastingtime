import Replicate from "replicate";


export const parse_ingr = async function(list) {
    const replicate = new Replicate({
        auth: `r8_VF9TRRzTjJayPRb4y7mvPs7LNn0F1Lg1QBi2x`,
        userAgent: 'https://www.npmjs.com/package/create-replicate'
      });
    console.log(list)
    console.log("Running the model...");
    const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
        input: {
        prompt: `can you turn this prep list into a list of {qty, unit, name} objects for use as a grocery list.

        '1 large egg white',
        '2 tablespoons dark soy sauce',
        '2 tablespoons Shaoxing wine (see notes)',
        '2 tablespoons 80-proof vodka',
        '1/4 teaspoon baking soda',
        '3 tablespoons cornstarch',
        '1 pound boneless, skinless chicken thighs, cut into 1/2- to 3/4-inch chunks (see notes)',
        '1/2 cup flour',
        '1/2 cup cornstarch',
        '1/2 teaspoon baking powder',
        '1/2 teaspoon kosher salt',
        '1 tablespoon dark soy sauce',
        '2 tablespoons Shaoxing wine (see notes)',
        '2 tablespoons Chinese rice vinegar or distilled white vinegar',
        '3 tablespoons homemade or store-bought low-sodium chicken stock',
        '4 tablespoons sugar',
        '1 teaspoon roasted sesame seed oil',
        '2 teaspoons grated zest and 1/4 cup juice from 1 orange',
        '1 tablespoon cornstarch',
        '4 (2-inch) strips dried orange peel (see notes)',
        '2 teaspoons peanut, vegetable, or canola oil',
        '2 teaspoons minced garlic (about 2 medium cloves)',
        '2 teaspoons minced fresh ginger (about one 1-inch piece)',
        '2 teaspoons thinly sliced scallion bottoms (about 1 scallion)',
        '2 quarts of peanut, canola, or vegetable oil for deep frying',
        'Steamed white rice and steamed broccoli for serving'`,
        },
    }
    );
    console.log(output);
}