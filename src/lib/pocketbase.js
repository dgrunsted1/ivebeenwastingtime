console.log("pocketbase 1");
import PocketBase from 'pocketbase';
console.log({PocketBase});
import { writable } from 'svelte/store';
console.log({writable});
export const pb = new PocketBase('http://db.ivebeenwastingtime.com'); 
console.log({pb});

export const currentUser = writable(pb.authStore.model);
console.log({currentUser});

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});