<script>
	import {onMount} from "svelte";
    import { pb } from '/src/lib/pocketbase.js';
    import InfiniteScroll from "/src/lib/components/infinite_scroll.svelte";
	
	// if the api (like in this example) just have a simple numeric pagination
    let page = 0;
	// but most likely, you'll have to store a token to fetch the next page
	let nextUrl = '';

    let page_size = 10
	// store all the data here.
	let data = [];
	// store the new batch of data here.
	let newBatch = [];
    let categories = [];
    let countries = [];
    let cuisines = [];
    let authors = [];
    let web_sites = [];
    
    let total_recipes_num = 0;
	
	async function fetchData() {
        const response = await pb.collection('recipes').getList(page, page_size, {
            expand: `notes, ingr_list`,
            sort: `-created`
        });
        total_recipes_num = response.totalItems;
		newBatch = response.items;
	};
	
	onMount(()=> {
		// load first batch onMount
		fetchData();
        
	})

  $: data = [
		...data,
    ...newBatch
  ];

  function view(){
    console.log("implement this");
  }
</script>

<main class="flex flex-col w-full justify-center items-center">
  <h4>See what others are cooking</h4>
  <div class="flex w-full justify-center">
    <div class="flex flex-col">
        <select class="select select-bordered w-full max-w-xs">
            <option disabled selected>Who shot first?</option>
            <option>Han Solo</option>
            <option>Greedo</option>
          </select>
          <select class="select select-bordered w-full max-w-xs">
            <option disabled selected>Who shot first?</option>
            <option>Han Solo</option>
            <option>Greedo</option>
          </select>
          <select class="select select-bordered w-full max-w-xs">
            <option disabled selected>Who shot first?</option>
            <option>Han Solo</option>
            <option>Greedo</option>
          </select>
    </div>
    <div class="flex flex-col w-3/4 max-w-3xl">
      <div>{total_recipes_num} total recipes</div>
      <ul class="flex flex-col w-full max-w-3xl space-y-4 md:h-[calc(100svh-80px)] overflow-y-auto">
          {#each data as item}
              <div class="card card-side bg-base-200 shadow-xl h-24 card-bordered cursor-pointer mx-1" on:click={window.location = `/cook_recipe/${item.url_id}/${item.servings}`}>
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
          <InfiniteScroll
          hasMore={(newBatch.length == page_size)}
          threshold={100}
          on:loadMore={() => {page++; fetchData()}} />
      </ul>
    </div>
  </div>
</main>