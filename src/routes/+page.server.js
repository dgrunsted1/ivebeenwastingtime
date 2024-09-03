import { currentUser, pb } from '/src/lib/pocketbase';


/** @type {import('./$types').PageLoad} */
export async function load() {
    let photos = await pb.collection('photos').getList(1, 200, {
        filter: `album != 'recipes' && album != 'landing _page'`,
        fields: 'album,id,file'
    }); 
    let output = [];
    for (let photo of photos.items){
        output.push(`https://db.ivebeenwastingtime.com/api/files/photos/${photo.id}/${photo.file}?thumb=400x0`);
    }
    
    let random_photo_index = Math.floor(Math.random() * output.length);

    return {hero_url: output[random_photo_index]};
}