export const get_servings = function(recipes, mults){
    let total_serv = 0;
    for (let i = 0; i < recipes.length; i++){
        total_serv += parseInt(mults[recipes[i].id]);
    }
    return total_serv;
}

export const get_total_time = function(recipes){
    let total_time = 0;
    let mins = 0;
    for (let i = 0; i < recipes.length; i++){
        let min_result = recipes[i].time.match(/(\d+) [mins|minutes]/);
        if (min_result){
            mins += parseInt(min_result[1]);
        }

        let hr_result = recipes[i].time.match(/(\d+) [hrs|hours|hour|hr]/);
        if (hr_result){
            mins += parseInt(hr_result[1]) * 60;
        }
    }
    let hours = parseInt(mins/60);
    mins = mins % 60;
    total_time = hours + "hrs " + mins + "mins";
    return total_time;
}