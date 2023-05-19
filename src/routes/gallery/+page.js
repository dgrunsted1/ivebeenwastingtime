// import { Photos } from '/src/lib/components/photos.js';


// let albums = {
//     "guadalupe_sand_dunes":{display: "Guadalupe Sand Dunes", photos: [
//             "0069.jpg",
//             "0070.jpg",
//             "0071.jpg",
//             "0072.jpg",
//             "0073.jpg",
//             "0074.jpg",
//             "0075.jpg",
//             "0076.jpg",
//             "0077.jpg",
//             "0078.jpg",
//             "0079.jpg",
//             "0080.jpg",
//             "0081.jpg",
//             "0082.jpg",
//             "0083.jpg"
//         ]
//     },
//     "2021_fall":{display: "Fall 2021", photos: [
//             "00040.jpg",
//             "00041.jpg",
//             "00042.jpg",
//             "00043.jpg",
//             "00047.jpg",
//             "00051.jpg",
//             "00052.jpg",
//             "00054.jpg",
//             "00057.jpg",
//             "00058.jpg",
//             "00059.jpg",
//             "00061.jpg",
//             "00064.jpg",
//             "00070.jpg",
//             "00072.jpg",
//             "00074.jpg",
//             "00075.jpg",
//             "00078.jpg",
//             "00080.jpg",
//             "00081.jpg",
//             "00083.jpg",
//             "00085.jpg",
//             "01.jpg",
//             "010.jpg",
//             "011.jpg",
//             "012.jpg",
//             "014.jpg",
//             "015.jpg",
//             "016.jpg",
//             "02.jpg",
//             "03.jpg",
//             "04.jpg",
//             "05.jpg",
//             "06.jpg",
//             "07.jpg",
//             "08.jpg",
//             "09.jpg"
//         ]
//     }
// }



/** @type {import('./$types').PageLoad} */
export async function load() {
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
    let output = [];
    albums.forEach(album => {
        album.photos.forEach(photo => {
            output.push(`https://ivebeenwastingtime.us-east-1.linodeobjects.com/${album.name}/${photo}`)
        });
    });
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