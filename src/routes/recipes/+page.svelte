<script>
	import {onMount} from "svelte";
    import { pb } from '/src/lib/pocketbase.js';
    import InfiniteScroll from "/src/lib/components/infinite_scroll.svelte";
	
	// if the api (like in this example) just have a simple numeric pagination
    let page = 0;
	// but most likely, you'll have to store a token to fetch the next page
	let nextUrl = '';

    let page_size = 30
	// store all the data here.
	let data = [];
	// store the new batch of data here.
	let newBatch = [];
    let categories = [];
    let countries = [];
    let cuisines = [];
    let authors = [];
    let web_sites = [];
    let delay_timer;


    $: selected_category = null;
    $: selected_country = null;
    $: selected_cuisine = null;
    $: selected_author = null;

    $: loading = true;
    
    let total_recipes_num = 0;
	
	async function fetchData() {
        let filter = "";
        if (selected_category) filter += `category="${selected_category}"`;
        if (selected_country) filter += (!filter) ? `country="${selected_country}"` : ` && country="${selected_country}"`;
        if (selected_cuisine) filter += (!filter) ? `cuisine="${selected_cuisine}"` : `&& cuisine="${selected_cuisine}"`;
        if (selected_author) filter += (!filter) ? `author="${selected_author}"` : `&& author="${selected_author}"`;

        const response = await pb.collection('recipes').getList(page, page_size, {
            filter: filter,
            expand: `notes, ingr_list`,
            sort: `-created`
        });
        total_recipes_num = response.totalItems;
		newBatch = response.items;
	};
	
	onMount(async ()=> {
		// load first batch onMount
		fetchData();
        
        categories = await pb.collection('categories').getFullList();
        countries = await pb.collection('countries').getFullList();
        cuisines = await pb.collection('cuisines').getFullList();
        authors = await pb.collection('authors').getFullList();
        loading = false;
	})

  $: data = [
		...data,
    ...newBatch
  ];

  async function select_cat(e){
    loading = true;
    console.log(e.currentTarget.value == "null");
    if (e.currentTarget.firstChild.innerHTML == 'category') {
        if (e.currentTarget.value == "null") selected_category = null;
        else selected_category = e.currentTarget.value;
    } else if (e.currentTarget.firstChild.innerHTML == 'country') {
        if (e.currentTarget.value == "null") selected_country = null;
        else selected_country = e.currentTarget.value;
    } else if (e.currentTarget.firstChild.innerHTML == 'cuisine') {
        if (e.currentTarget.value == "null") selected_cuisine = null;
        else selected_cuisine = e.currentTarget.value;
    } else if (e.currentTarget.firstChild.innerHTML == 'author') {
        if (e.currentTarget.value == "null") selected_author = null;
        else selected_author = e.currentTarget.value;
    }
    if (e.currentTarget.value == "null") e.currentTarget.value = null;
    page = 0; 
    data = []; 
    newBatch = [];
    await fetchData();
    loading = false;
  }

  async function load_more(){
    console.log("load_more func");
    loading = true;
    page++;
    await fetchData();
    loading = false;
  }
</script>

<main class="flex flex-col w-full justify-center items-center">
  <h4>See what others are cooking</h4>
  <div class="flex w-full justify-center flex-col md:flex-row mt-2 space-y-2">
    <div class="flex flex-row md:flex-col mx-1 space-x-1">
        <select bind:value={selected_category} on:change={select_cat} class="select select-sm select-bordered w-full max-w-xs pl-1">
            <option value={null}>category</option>
            {#each categories as curr}
                <option>{curr.id}</option>
            {/each}
        </select>
        <select bind:value={selected_country} on:change={select_cat} class="select select-sm select-bordered w-full max-w-xs pl-1">
            <option value={null}>country</option>
            {#each countries as curr}
                <option>{curr.id}</option>
            {/each}
        </select>
        <select bind:value={selected_cuisine} on:change={select_cat} class="select select-sm select-bordered w-full max-w-xs pl-1">
            <option value={null}>cuisine</option>
            {#each cuisines as curr}
                <option>{curr.id}</option>
            {/each}
        </select>
        <select bind:value={selected_author} on:change={select_cat} class="select select-sm select-bordered w-full max-w-xs pl-1">
            <option value={null}>author</option>
            {#each authors as curr}
                <option>{curr.id}</option>
            {/each}
        </select>

    </div>
    <div class="flex flex-col w-full md:w-3/4 max-w-3xl space-y-2">
      <div class="mx-1">{total_recipes_num} total recipes</div>
      <ul class="flex flex-col w-full max-w-3xl space-y-4 h-[calc(100svh-220px)] md:h-[calc(100svh-85px)] overflow-y-auto">
          {#each data as item}
              <div class="card card-side bg-base-200 shadow-xl h-24 card-bordered cursor-pointer mx-1" on:keydown={window.location = `/cook_recipe/${item.url_id}/${item.servings}`} on:click={window.location = `/cook_recipe/${item.url_id}/${item.servings}`}>
                  <figure class="w-1/4 bg-cover bg-no-repeat bg-center" style="background-image: url('{item.image}')"></figure>
                  <div class="card-body h-full flex flex-row p-1 w-3/4 justify-between">
                      <div class="flex flex-col justify-between p-1 w-[70%]">
                          <h2 id={item.id} class="card-title text-sm text-ellipsis overflow-hidden">{item.title}</h2>
                          <div class="flex w-full">
                              <div class="text-[10px] md:text-[12px] border border-primary text-ellipsis whitespace-nowrap overflow-hidden h-fit px-1 text-nowrap text-center basis-12 grow rounded-tl rounded-bl">
                                  {#if isNaN(item.servings)}
                                      {item.servings}
                                  {:else}
                                      {item.servings} servings
                                  {/if}
                              </div>
                              <div class="text-[10px] md:text-[12px] border border-primary text-ellipsis whitespace-nowrap overflow-hidden h-fit px-1 text-nowrap text-center basis-12 grow">
                                  {#if item.time}
                                      {item.time}
                                  {:else}
                                      no time
                                  {/if}
                              </div>
                              <div class="text-[10px] md:text-[12px] border border-primary text-ellipsis whitespace-nowrap overflow-hidden h-fit px-1 text-nowrap text-center basis-12 grow rounded-tr rounded-br">
                                  {item.expand.ingr_list.length} ingredients
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          {/each}
          <span class=" loading loading-dots loading-md mx-7 self-center"></span>
          <InfiniteScroll
          hasMore={(newBatch.length == page_size)}
          threshold={100}
          on:loadMore={load_more} />
      </ul>
    </div>
  </div>
</main>