import { pb } from '/src/lib/pocketbase.js';


export const get_servings = function(recipes, sub_recipes, mults){
    let sub_recipe_id_list = [];
    for (let k in sub_recipes){
        for (let i = 0; i < sub_recipes[k].length; i++){
            if (sub_recipes[k][i].recipe_id && !sub_recipe_id_list.includes(sub_recipes[k][i].recipe_id)) sub_recipe_id_list.push(sub_recipes[k][i].recipe_id);
        }
    }
    let total_serv = 0;
    for (let i = 0; i < recipes.length; i++){
        if (!sub_recipe_id_list.includes(recipes[i].id)) total_serv += parseInt(recipes[i].servings);
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

export const format_date = function(in_date){
    const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let output = "";
    let menu_date = new Date(in_date);
    let menu_day = menu_date.getDate();
    let menu_month = menu_date.getMonth();
    let menu_year = menu_date.getFullYear();
    let today = new Date();
    if (menu_year == today.getFullYear()){
        if (menu_month == today.getMonth()){
            if (menu_day == today.getDate()){
                output = "Today";
            } else if (today.getDate() - menu_day < 7){
                output = day_names[menu_date.getDay()];
            } else {
                output = menu_date.toLocaleDateString(undefined, {month: 'short', day: 'numeric' });
            }
        } else {
            output = menu_date.toLocaleDateString(undefined, {month: 'short', day: 'numeric' });
        } 
    } else {
        output = menu_date.toLocaleDateString(undefined, {year: '2-digit', month: 'short', day: 'numeric' });
    }
    return output;
}

export const delete_menu = async function(e, user_menus){
    let tmp_menus = [];
    for (let i = 0; i < user_menus.length; i++){
        if (user_menus[i].id != e.srcElement.id) {
            tmp_menus.push(user_menus[i]);
        } else {
            if (confirm(`Are you sure you want to delete your ${user_menus[i].title} menu?`)) {
                await pb.collection('menus').delete(e.srcElement.id);
            } else {
                return user_menus;
            }
        }
    }

    return tmp_menus;
}

export const get_total_time_menu = function(recipes){
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
    let total_mins = mins;
    let hours = parseInt(mins/60);
    mins = mins % 60;
    total_time = hours + " hrs " + mins + " mins";
    return {display: total_time, val: total_mins};
}