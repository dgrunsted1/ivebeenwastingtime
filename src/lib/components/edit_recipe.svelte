<script>
    import { currentUser, pb } from '/src/lib/pocketbase';
    import { createEventDispatcher,afterUpdate, onMount } from 'svelte';
    import { page } from '$app/stores';
    import { parse } from 'recipe-ingredient-parser-v3';
    import { process_recipe_old } from '/src/lib/process_recipe.js'
    import { save_recipe } from '/src/lib/save_recipe.js' 

    export let recipe;
    export let index;
    export let save = false;
    let dispatch = createEventDispatcher();
    $: categories = [];
    $: display_categories = [];
    $: cuisines = [];
    $: display_cuisines = [];
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
        "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
        "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", 
        "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", 
        "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", 
        "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", 
        "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", 
        "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", 
        "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", 
        "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
        "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
        "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
        "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
        "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", 
        "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", 
        "North Macedonia (formerly Macedonia)", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", 
        "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", 
        "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", 
        "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
        "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", 
        "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", 
        "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
        "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", 
        "Zimbabwe"
    ];
    $: display_countries = countries;

    onMount(async () => {
        let cuisines_result = await pb.collection('recipes').getList(1, 1000, {field: `cuisine`});
        for (let i = 0; i < cuisines_result.items.length; i++) if (!cuisines.includes(cuisines_result.items[i].cuisine)) cuisines.push(cuisines_result.items[i].cuisine);
        cuisines = cuisines;
        display_cuisines = cuisines;

        let categories_result = await pb.collection('recipes').getList(1, 1000, {field: `category`});
        for (let i = 0; i < categories_result.items.length; i++) if (!categories.includes(categories_result.items[i].category)) categories.push(categories_result.items[i].category);
        categories = categories;
        display_categories = categories;
    })

    afterUpdate(() => {
        let textareas = document.getElementsByTagName("textarea");
        for (let i = 0; i < textareas.length; i++) {
            resizeIt(textareas[i]);
        }
        if (save && recipe.title){
            let save_btns = document.getElementsByClassName("save_btn");
            for (let i = 0; i < save_btns.length; i++) {
                save_btns[i].disabled = false;
            }
        }
    });

    async function save_recipe_v2(e){
        save = false;
        reset_checks();
        document.getElementById("new_note").value = "";
        dispatch("update_recipe", {recipe: save_recipe(e, recipe, $currentUser, document.getElementById("new_note").value)});
    }

    function reset_checks(){
        Array.from(document.querySelectorAll(".removed input[type='checkbox']")).forEach(curr => {
            curr.checked = false;
        });
    }

    function check_item(e){
        enable_save();
        let id;
        let is_removed = false;
        if (e.srcElement.type != "checkbox"){
            original = e.target.firstChild.id;
            if (e.target.firstChild.checked){
                e.target.firstChild.checked = false;
            }else{
                e.target.firstChild.checked = true;
                is_removed = true;
            }
        }else{
            id = e.srcElement.id;
            is_removed = e.srcElement.checked;
        }
        let temp = [];
        for (let i = 0; i < recipe.expand.ingr_list.length; i++){
            if (recipe.expand.ingr_list[i].id == id){
                recipe.expand.ingr_list[i].removed = is_removed;
            }
        }
    }

    function enable_save(){
        if (!index) index = 0;
        document.getElementsByClassName("save_btn")[index].disabled = false;
        document.getElementsByClassName("save_btn")[index].innerHTML = "save recipe";
        save = true;
    }

    function update_multiplier(e){
        const servings_in_recipe = e.srcElement.parentElement.parentElement.getElementsByClassName("recipe_servings")[0].value;
        let desired_servings = servings_in_recipe;
        if (e.srcElement.parentElement.parentElement.getElementsByClassName("desired_servings")[0]){
            desired_servings = e.srcElement.parentElement.parentElement.getElementsByClassName("desired_servings")[0].value;
        }
        // multiplier = desired_servings / servings_in_recipe;
        enable_save();
        dispatch("update_multiplier", {
            multiplier: desired_servings / servings_in_recipe,
            index: index
        });
    }


    function add_ingr(){
        recipe.expand.ingr_list[recipe.expand.ingr_list.length] = {amount: 1, unit: "", name: "", original:[""]};
    }

    function add_dir(){
        recipe.directions[recipe.directions.length] = "";
    }

    function remove_dir(e){
        let output = [];
        for (let i = 0; i < recipe.directions.length; i++){
            if (i != e.srcElement.id) output.push(recipe.directions[i]);
        }
        recipe.directions = output;
    }

    function remove_note(e){
        let note_id = e.srcElement.id;
        let output = [];
        for (let note of recipe.expand.notes){
            if (note.id != note_id) output.push(note);
        }
        recipe.expand.notes = output;
    }

    const update_image_upload = async () => {
        const fileList = event.target.files;
        let too_big = [];
        let success_cnt = 0;
        for (let file of fileList) {
            if (file.size > 5242880){
                too_big.push(file.name);
            }else {
                document.getElementById("status").innerHTML += `<p class="m-auto w-4/5 text-center">uploading ${file.name}</p>`;
                let result = await uploadImage(file);
                if (result.id) success_cnt++;
            }
        }
        document.getElementById("status").innerHTML = `<p class="m-auto w-4/5 text-center">uploaded ${success_cnt}/${fileList.length} successfully</p>`;
        let first = true;
        for (let curr of too_big){
            if (first){
                document.getElementById("status").innerHTML += `<p class="m-auto w-4/5 text-center">These files were too big:</p>`;
                first = false;
            }
            document.getElementById("status").innerHTML += `<p class="m-auto w-4/5 text-center">${curr}</p>`;
        }
    }

    async function uploadImage(file) {
        let formData = new FormData();
        formData.append('file', file);
        formData.append("album", curr_album);
        const record = await pb.collection('photos').create(formData);
        return record;
    }

    function get_local_time(utc_code){
        const event = new Date(utc_code);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        return event.toLocaleDateString(undefined, options);
    }

    function resizeIt(element) {
        let str = element.value;
        if (!str) return;
        let cols = ($page.url.pathname == "/add_recipe") ? element.cols * 10 : element.cols * 2.8;
        element.rows = Math.ceil( str.length / cols ) + 1;
    };

    function filter_cuisines(e){
        display_cuisines = [];
        for (let i = 0; i < cuisines.length; i++){
            if (!display_cuisines.includes(cuisines[i]) && cuisines[i].toLowerCase().includes(recipe.cuisine.toLowerCase())){
                display_cuisines.push(cuisines[i]);
            }
        }
        display_cuisines = display_cuisines;
        enable_save();
    }

    function filter_countries(e){
        display_countries = [];
        for (let i = 0; i < countries.length; i++){
            if (!display_countries.includes(countries[i]) && countries[i].toLowerCase().includes(recipe.country.toLowerCase())){
                display_countries.push(countries[i]);
            }
        }
        display_countries = display_countries;
        enable_save();
    }

    async function filter_categories(e){
        display_categories = [];
        for (let i = 0; i < categories.length; i++){
            if (!display_categories.includes(categories[i]) && categories[i].toLowerCase().includes(recipe.category.toLowerCase())){
                display_categories.push(categories[i]);
            }
        }
        display_categories = display_categories;
        enable_save();
    }
</script>

<div id="recipe" class="flex flex-col w-full">
    <div class="save_btn_container flex flex-col items-center mb-5">
        <button class="save_btn btn btn-secondary w-1/3" disabled="true" on:click={save_recipe_v2}>
            save recipe
        </button>
    </div>
    <div class="img_info_container flex flex-row w-full content-center justify-around">
        <div class="img_container mr-3 flex w-1/2 content-center">
            {#if recipe.image}
                <img src={recipe.image} alt={recipe.title} class="self-center"/>
            {:else}
            <div class="w-full flex flex-col space-y-2">
                <div class="w-full flex flex-col"><input type="file" name="photo" id="photo" class="absolute max-w-[605px] w-23/25 h-[225px] opacity-0" on:change={update_image_upload} multiple><p class="h-52 text-center text-xl border-dashed border-2 border-primary">Drag your files here or click to browse</p></div>
                <input placeholder="Link to image" name="url" type="text" class="input input-bordered input-xs w-full text-center input-accent"  on:input|preventDefault={enable_save} bind:value={recipe.image}/>
            </div>
            {/if}
        </div>
        <div class="info_container w-1/2 mx-1">
            <div class="title_container form-control">
                <label for="title" class="label p-0"><span class="label-text-alt p-0">Title</span></label>
                <input type="text" class="title input input-bordered input-xs" bind:value={recipe.title} on:input|preventDefault={enable_save}/>
            </div>
            <div class="decription_container form-control w-full">
                <label for="desc" class="label p-0"><span class="label-text-alt p-0">Description</span></label>
                <textarea class="desc textarea textarea-bordered" type="text" bind:value={recipe.description} on:input|preventDefault={enable_save}></textarea>
            </div>
            <div class="misc w-full">
                <div class="flex flex-row">
                    <div class="author_container form-control w-1/2">
                        <label for="auth" class="label p-0"><span class="label-text-alt p-0">Author</span></label>
                        <input class="auth input input-bordered input-xs px-1 mr-1" type="text" bind:value={recipe.author} on:input|preventDefault={enable_save}>
                    </div>
                    <div class="time_container form-control w-1/2">
                        <label for="time" class="label p-0"><span class="label-text-alt p-0">Time</span></label>
                        <input class="time input input-bordered input-xs px-1" type="text" bind:value={recipe.time} on:input|preventDefault={enable_save}>
                    </div>
                </div>
                <div>
                    <div id="servings" class="flex flex-row justify-center content-center">
                        <div class="mr-1 form-control w-1/2">
                            <label for="recipe_servings" class="mx-1 label p-0"><span class="label-text-alt p-0">servings</span></label>
                            <input type="text" name="recipe_servings" id="recipe_servings" class="recipe_servings input input-bordered p-1 input-xs" bind:value={recipe.servings} on:input|preventDefault={update_multiplier} on:delete|preventDefault={update_multiplier} min=1>
                        </div>
                        {#if $page.url.pathname == "/prep"}
                            <div class="form-control w-1/2">
                                <label for="recipe_servings" class="mx-1 label p-0"><span class="label-text-alt p-0">desired servings</span></label>
                                <input type="text" name="desired_servings" id="desired_servings" class="desired_servings input input-bordered p-1 input-xs" bind:value={recipe.servings} on:input|preventDefault={update_multiplier} on:delete|preventDefault={update_multiplier} min=1 >
                            </div>
                        {/if}
                    </div>
                    <div class="flex justify-evenly content-center w-full my-1 space-x-1 flex-wrap">
                        <div class="flex w-full space-x-2">
                            <div class="dropdown w-1/2">
                                <input type="text" id="cuisine" placeholder="cuisine" tabindex="0" class="input input-bordered m-1 w-full cursor-text" bind:value={recipe.cuisine} on:input={filter_cuisines}/>
                                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
                                    {#each display_cuisines as cuisine}
                                        <li class="cursor-pointer" on:click={()=>{recipe.cuisine = cuisine; document.activeElement.blur(); enable_save();}}>{cuisine}</li>
                                    {/each}
                                </ul>
                            </div>
                            <div class="dropdown w-1/2">
                                <input type="text" id="country" placeholder="country" tabindex="0" class="input input-bordered m-1 cursor-text w-full" bind:value={recipe.country} on:input={filter_countries}/>
                                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    {#each display_countries as country}
                                        <li class="cursor-pointer" on:click={()=>{recipe.country = country; document.activeElement.blur(); enable_save();}}>{country}</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                        <div class="dropdown w-1/2">
                            <input type="text" id="category" placeholder="category" tabindex="0" class="input input-bordered m-1 cursor-text w-full" bind:value={recipe.category} on:input={filter_categories}/>
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {#each display_categories as category}
                                    <li class="cursor-pointer" on:click={()=>{recipe.category = category; document.activeElement.blur(); enable_save();}}>{category}</li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="w-full flex justify-center mt-1"><a class="btn btn-accent btn-sm" href={recipe.url} target="_blank">original recipe</a></div>
            </div>
        </div>
    </div>
    <div class="ingr_directions_container">
        <div class="badge badge-primary ml-14 mt-3">Ingredients</div>
        <div id="ingredient_list">
            {#each recipe.expand.ingr_list as ingr, i}
                {#if ingr}
                    <div class="ingr_row flex flex-row justify-center items-center mt-1 " class:removed={ingr.removed}>
                        <input type="text" class="ingr_amount input input-bordered input-xs px-1 mr-1 w-10 text-center" bind:value={recipe.expand.ingr_list[i].quantity} on:input|preventDefault={enable_save}>
                        <input type="text" class="ingr_unit input input-bordered input-xs px-1 mr-1 w-16 text-center" id="{recipe.expand.ingr_list[i].id}" bind:value={recipe.expand.ingr_list[i].unit} on:input|preventDefault={enable_save}>
                        <input type="text" class="ingr_name input input-bordered input-xs px-1 mr-1 w-80 h-fit" bind:value={recipe.expand.ingr_list[i].ingredient} on:input|preventDefault={enable_save}>
                        <input on:click={check_item} type="checkbox" class="checkbox checkbox-accent checkbox-sme" id="{recipe.expand.ingr_list[i].id}">
                    </div>
                {/if}
            {/each}
            <div class="flex justify-center mt-2">
                <button class="btn btn-secondary btn-xs" on:click={add_ingr}>add ingredient</button>
            </div>
        </div>

        <div class="directions_list w-full flex flex-col items-center">
            <div class="badge badge-primary mt-3 self-start">Directions</div>
            {#each recipe.directions as curr, i}
                <div class="step w-4/5">
                    <label for="directions" class="mx-1 label p-0 "><span class="label-text-alt p-0">Step {i+1}</span><button id={i} class="btn btn-xs my-1" on:click={remove_dir}>remove</button></label>
                    <textarea class="directions w-full textarea textarea-bordered" bind:value={recipe.directions[i]} on:input|preventDefault={enable_save}/>
                </div>
            {/each}
            <div class="flex justify-center mt-2">
                <button class="btn btn-secondary btn-xs" on:click={add_dir}>add direction</button>
            </div>
        </div>

        <div class="notes_container m-1 w-full flex flex-col items-center">
            <div class="badge badge-primary mt-3 self-start">Notes</div>
            {#if recipe.expand && recipe.expand.notes}
                {#each recipe.expand.notes as note, i}
                    <div class="w-4/5">
                        <label for="directions" class="mx-1 label p-0 "><span class="label-text-alt p-0">{get_local_time(recipe.expand.notes[i].updated)}</span><button id={recipe.expand.notes[i].id} class="btn btn-xs my-1" on:click={remove_note}>remove</button></label>
                        <textarea class="notes textarea w-full textarea-bordered" bind:value={recipe.expand.notes[i].content} on:input|preventDefault={enable_save}/>
                    </div>
                {/each}
            {/if}
            <div class="w-4/5">
                <label for="directions" class="mx-1 label p-0 "><span class="label-text-alt p-0">New</span></label>
                <textarea id="new_note" class="notes textarea w-full textarea-bordered" on:input|preventDefault={enable_save}></textarea>
            </div>
        </div>
        <div class="save_btn_container flex flex-col items-center">
            <button class="save_btn btn btn-secondary w-1/3" disabled="true" on:click={save_recipe_v2}>
                save recipe
            </button>
        </div>
    </div>
</div>