const conversions = {"tablespoon/teaspoon": 1/3, "teaspoon/tablespoon": 3, "cup/teaspoon": 1/48, "teaspoon/cup": 48, "cup/tablespoon": 1/16, "tablespoon/cup": 16};

export const merge = function(recipes) {
    let grocery_list = [];
    let skipped = [];
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(item => {
            if (!item) return;
            if ((!item.amount || !item.unit || !item.name) && item.original) {
                skipped.push(item);
                skipped = skipped;
                return;
            }
            let match = false;
            if (grocery_list) {
                grocery_list.forEach(element => {
                    if (element.name === item.name || element.name.includes(item.name) || item.name.includes(element.name)){
                        match = element;
                        return;
                    }
                });
            }
            if (match && !(["small", "medium", "large"].includes(match.unit) ^ ["small", "medium", "large"].includes(item.unit))
                            && !(match.unit == "clove" ^ item.unit == "clove") && !(match.unit == "whole" ^ item.unit == "whole")) {
                
                
                let tmp = { amount: 0, unit: "", name: "", original: []};
                tmp.original = tmp.original.concat(match.original, item.original);
                if (match.unit != item.unit) {
                    let conv = combine(match, round_amount(item.amount, recipe.multiplier));
                    tmp.amount = conv.amount;
                    tmp.unit = conv.unit;
                } else {
                    tmp.amount = match.amount + round_amount(item.amount, recipe.multiplier);
                    tmp.unit = match.unit;
                }
                if (match.name != item.name){
                    tmp.name = match.name+" and/or "+item.name;
                }else {
                    tmp.name = match.name;
                }
                grocery_list.splice(grocery_list.indexOf(match), 1);
                grocery_list.push(tmp);
                // console.log("merging", `${match.amount} ${match.unit} ${match.name} ${item.amount} ${item.unit} ${item.name}`);
                // console.log("merged item", tmp);
            }else {
                grocery_list.push({
                    amount: round_amount(item.amount, recipe.multiplier),
                    unit: item.unit,
                    name: item.name,
                    original: item.original
                });
            }
        });
    });
    return {
        grocery_list: grocery_list,
        skipped: skipped,
    }
}

const combine = (i, j) => {
    let conv_index_a = `${j.unit}/${i.unit}`;
    let conv_index_b = `${i.unit}/${j.unit}`;
    let amount = null;
    let unit = null;
    if (conversions[conv_index_a] < conversions[conv_index_b]){
        unit = j.unit;
        amount = conversions[conv_index_a] * i.amount + j.amount;
    }else {
        unit = i.unit;
        amount = conversions[conv_index_b] * j.amount + i.amount;
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

    return Math.round((result + Number.EPSILON) * 100) / 100
}