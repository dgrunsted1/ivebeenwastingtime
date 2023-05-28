
import PocketBase from 'pocketbase';


export async function load() {
  const pb = new PocketBase('http://db.ivebeenwastingtime.com');
  const records = await pb.collection('photos').getList(1, 50, {
    fields: 'album'
  });
  let albums = [];
  for (let item of records.items) {
    if (albums.indexOf(item.album) == -1) albums.push(item.album);
  }
  return {albums};
}

