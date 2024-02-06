const conversions = {"tablespoon/teaspoon": 1/3, "teaspoon/tablespoon": 3, "cup/teaspoon": 1/48, "teaspoon/cup": 48, "cup/tablespoon": 1/16, "tablespoon/cup": 16};

const weight_volume_conv = {"gram/tablespoon": 14, "tablespoon/gram": 1/14, "gram/teaspoon": 14/3, "teaspoon/gram": 3/14, "gram/cup": 224/1, "cup/gram": 1/224}

export const merge = function(recipes) {
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
                    let qty = round_amount(item.quantity, recipe.multiplier);
                    let conv = combine(match, item);
                    tmp.quantity = conv.amount;
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
            }else {
                let tmp = { ingredient: item.ingredient,
                            maxQty: item.maxQty,
                            minQty: item.minQty,
                            quantity: item.quantity,
                            symbol: item.symbol,
                            unit: item.unit,
                            unitPlural: item.unitPlural
                        };
                tmp.quantity = round_amount(item.quantity, recipe.multiplier);
                grocery_list.push(tmp);
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
    if (!mult) return Math.round((in_amount + Number.EPSILON) * 100) / 100
    let result = 0;
    if (typeof in_amount != "string"){
        result = in_amount * mult;
    } else {
        result = parseFloat(in_amount) * mult;
    }
    return Math.round((result + Number.EPSILON) * 100) / 100;
}
  
  function removePunctuationSymbolsParentheses(text) {

    // Remove punctuation
    text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  
    // Remove symbols
    const symbols = "!@#$%^&*()_+`-={}|[]\:';\"<>,.?/`";
    for (let i = 0; i < symbols.length; i++) {
      text = text.replace(new RegExp("\\" + symbols[i], 'g'), ''); 
    }
  
    // Remove parentheses and their contents
    text = text.replace(/\([^)]*\)/g, '');
  
    return text;
  }



  export const groupBySimilarity = function(strings) {

    // Split each string into words
    strings = strings.sort((a, b) => b.length - a.length);
    let stringWords = strings.map(s => removePunctuationSymbolsParentheses(s.ingredient).split(' '));
    console.log(stringWords);
    // Initialize a map to hold the groups
    // const groups = new Map();
    let groups = [];
    for (let i = 0; i < strings.length; i++) {
    //   console.log("-----------------------------------------------");
    const str1Words = stringWords[i];
    //   console.log({str1Words});
    //   // Check if this string belongs in an existing group
      let maxSimilarity = 0;
      let maxGroup;
      let maxIndex;
      for (let j = 0; j < groups.length; j++) {
            for (let k = 0; k < groups[j].length; k++) {
                let intersection = 0;
                const str2Words = removePunctuationSymbolsParentheses(groups[j][k].ingredient).split(' ');
                str1Words.forEach(word => {
                if (str2Words.includes(word)) {
                    intersection++;
                }
                });
                // const min_length = (str1Words.length > str2Words.length) ? str2Words.length : str1Words.length ;
                const similarity = intersection / str1Words.length;
                if (intersection > 0) console.log({length});
                if (intersection > 0) console.log({intersection});
                if (intersection > 0) console.log({similarity});
                if (intersection > 0) console.log({str2Words});
                if (intersection > 0) console.log({str1Words});
                if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                maxGroup = j;
                maxIndex = k;
                }
            }
        }
      
        // If no suitable group, create a new one
        if (maxGroup && maxSimilarity > .25) {
            console.log({groups});
            console.log({maxGroup});
            // groups[maxGroup].push(strings[i]); 
            groups[maxGroup] = [...groups[maxGroup].slice(0, maxIndex), strings[i], ...groups[maxGroup].slice(maxIndex)];
        } else {
            groups.push([strings[i]]);
        }
        console.log({groups});
        // if (i > 3) return;
    }


    let flattened = [];
    console.log(Array.from(groups.values()).sort((a, b) => b.length - a.length));
    Array.from(groups.values()).sort((a, b) => b.length - a.length).forEach(subarr => {
        flattened.push(...subarr);
    });

    return flattened;
  }

  function insertItemAtIndex(arr, item, index) {
  return [...arr.slice(0, index), item, ...arr.slice(index)];
}
