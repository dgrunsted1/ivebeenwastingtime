


/** @type {import('./$types').PageLoad} */
export function load() {
  let albums = [
      {name: "guadalupe_sand_dunes", display: "Guadalupe Sand Dunes", photos: [
              "0069.jpg",
              "0070.jpg",
              "0071.jpg",
              "0072.jpg",
              "0073.jpg",
              "0074.jpg",
              "0075.jpg",
              "0076.jpg",
              "0077.jpg",
              "0078.jpg",
              "0079.jpg",
              "0080.jpg",
              "0081.jpg",
              "0082.jpg",
              "0083.jpg"
          ]
      },
      {name: "2021_fall", display: "Fall 2021", photos: [
              "00040.jpg",
              "00041.jpg",
              "00042.jpg",
              "00043.jpg",
              "00047.jpg",
              "00051.jpg",
              "00052.jpg",
              "00054.jpg",
              "00057.jpg",
              "00058.jpg",
              "00059.jpg",
              "00061.jpg",
              "00064.jpg",
              "00070.jpg",
              "00072.jpg",
              "00074.jpg",
              "00075.jpg",
              "00078.jpg",
              "00080.jpg",
              "00081.jpg",
              "00083.jpg",
              "00085.jpg",
              "01.jpg",
              "010.jpg",
              "011.jpg",
              "012.jpg",
              "014.jpg",
              "015.jpg",
              "016.jpg",
              "02.jpg",
              "03.jpg",
              "04.jpg",
              "05.jpg",
              "06.jpg",
              "07.jpg",
              "08.jpg",
              "09.jpg"
          ]
      }
  ]
  let output = {message: "no photo found"};
      let photo_count = 0;
      albums.forEach(album => {
         photo_count += album.photos.length;
      });
      let album_index = Math.floor(Math.random() * photo_count);
      console.log({album_index});
      let total_count = 0;
      albums.forEach(album => {
          if (total_count + album.photos.length >= album_index && album_index >= total_count){
              let photo_index = album_index - total_count;
              console.log({photo: album.photos[photo_index], album: album.display, s3_album: album.name});
              output = {photo: album.photos[photo_index], album: album.display, s3_album: album.name, url: `https://ivebeenwastingtime.us-east-1.linodeobjects.com/${album.name}/${album.photos[photo_index]}`};
          }
          total_count += album.photos.length;
      });

      return output;
}