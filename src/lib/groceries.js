import { pb } from '/src/lib/pocketbase';

export const create_grocery_list = async function(grocery_list, menu_id){
    
    const data = {
        "list": grocery_list,
        "active": true,
        "menu": menu_id
    };
    const record = await pb.collection('groceries').create(data);
    const menu_data = {
        "grocery_list": record.id
    };
    
    const record_menu = await pb.collection('menus').update(menu_id, menu_data);
    return record.id;
}

export const update_grocery_list = async function(grocery_list, id){
    console.log("called update_grocery_list");
    console.log(grocery_list);
    const data = {
        "list": grocery_list
    };
    
    const record = await pb.collection('groceries').update(id, data);
}