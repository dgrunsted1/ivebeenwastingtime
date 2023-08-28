const conversions = {"tablespoon/teaspoon": 1/3, "teaspoon/tablespoon": 3, "cup/teaspoon": 1/48, "teaspoon/cup": 48, "cup/tablespoon": 1/16, "tablespoon/cup": 16};

const weight_volume_conv = {"gram/tablespoon": 14, "tablespoon/gram": 1/14, "gram/teaspoon": 14/3, "teaspoon/gram": 3/14, "gram/cup": 224/1, "cup/gram": 1/224}

export const merge = function(recipes) {
    console.log({recipes});
    let grocery_list = [];
    let skipped = [];
    for(let recipe of recipes){
        let ingrs = (recipe.ingredients) ? recipe.ingredients : recipe.expand.ingr_list;
        for(let item of ingrs){
            if (!item) continue;
            let match = false;
            if (grocery_list) {
                grocery_list.forEach(element => {
                    if (element.ingredient === item.ingredient || element.ingredient.includes(item.ingredient) || item.ingredient.includes(element.ingredient)){
                        match = element;
                        return;
                    }
                });
            }
            if (match && !(["small", "medium", "large"].includes(match.unit) ^ ["small", "medium", "large"].includes(item.unit))
                            && !(match.unit == "clove" ^ item.unit == "clove") && !(match.unit == "whole" ^ item.unit == "whole")) {
                
                
                let tmp = { ingredient: "",
                            maxQty: 0,
                            minQty: 0,
                            quantity: 0,
                            symbol: null,
                            unit: null,
                            unitPlural: null
                        };
                if (match.unit != item.unit) {
                    let conv = combine(match, item);
                    tmp.quantity = round_amount(conv.quantity, recipe.multiplier);
                    tmp.unit = conv.unit;
                } else {
                    tmp.quantity = match.quantity + round_amount(item.quantity, recipe.multiplier);
                    tmp.unit = match.unit;
                }
                if (match.ingredient != item.ingredient){
                    tmp.ingredient = match.ingredient+" and/or "+item.ingredient;
                }else {
                    tmp.ingredient = match.ingredient;
                }
                grocery_list.splice(grocery_list.indexOf(match), 1);
                grocery_list.push(tmp);
                console.log(`merge${match.quantity} ${match.unit} ${match.ingredient} ${item.quantity} ${item.unit} ${item.ingredient}`, tmp);
            }else {
                item.quantity = round_amount(item.quantity, recipe.multiplier);
                grocery_list.push(item);
            }
        }
    }
    return {
        grocery_list: grocery_list,
        skipped: skipped
    }
}

const combine = (i, j) => {
    let conv_index_a = `${j.unit}/${i.unit}`;
    let conv_index_b = `${i.unit}/${j.unit}`;
    let amount = null;
    let unit = null;
    let conv_a;
    let conv_b;
    if ((!conversions[conv_index_a] || !conversions[conv_index_a]) && ((j.ingredient.includes('salt') && j.ingredient.includes('salt')) || (i.ingredient.includes('sugar') || i.ingredient.includes('sugar')) || (i.ingredient.includes('oil') || i.ingredient.includes('oil')))){
        conv_a = weight_volume_conv[conv_index_a];
        conv_b = weight_volume_conv[conv_index_b];
    } else {
        conv_a = conversions[conv_index_a];
        conv_b = conversions[conv_index_b];
    }
    if (conv_a < conv_b){
        unit = j.unit;
        amount = conv_a * i.quantity + j.quantity;
    }else {
        unit = i.unit;
        amount = conv_b * j.quantity + i.quantity;
    }
    return {unit: unit, amount: amount};
}

function round_amount(in_amount, mult){
    let result = 0;
    if (typeof in_amount != "string"){
        result = in_amount * mult;
    } else {
        result = parseFloat(in_amount) * mult;
    }
    return Math.round((result + Number.EPSILON) * 100) / 100;
}