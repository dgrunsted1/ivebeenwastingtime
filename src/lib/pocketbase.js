import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
export const pb = new PocketBase('http://db.ivebeenwastingtime.com'); 

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    currentUser.set(pb.authStore.model);
});

export const signOut = function() {
    pb.authStore.clear();
}