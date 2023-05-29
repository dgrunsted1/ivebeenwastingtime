import PocketBase from 'pocketbase';


/** @type {import('./$types').PageLoad} */
export async function load() {
    const pb = new PocketBase('http://db.ivebeenwastingtime.com');

    let photos = await pb.collection('photos').getFullList({
        fields: 'album,id,file'
    }); 
    let output = [];
    for (let photo of photos){
        output.push(`http://db.ivebeenwastingtime.com/api/files/photos/${photo.id}/${photo.file}?thumb=400x0`);
    }
    console.log(photos);
    if (output){
        return {photos: shuffle(output)};
    }else {
        return {error: "no photos found"};
    }
  }


  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }