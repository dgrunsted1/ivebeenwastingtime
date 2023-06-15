import { currentUser, pb } from '/src/lib/pocketbase';


/** @type {import('./$types').PageLoad} */
export async function load() {
    let response = await pb.collection('photos').getFullList({
        fields: 'album,id,file'
    });
    // console.log(response);
    let output = {message: "no photo found"};
    let photos = [];

    response.forEach(photo => {
        photos.push(`http://db.ivebeenwastingtime.com/api/files/photos/${photo.id}/${photo.file}?thumb=400x0`);
    });
    
    let random_photo_index = Math.floor(Math.random() * photos.length);

    return {hero_url: photos[random_photo_index]};
}