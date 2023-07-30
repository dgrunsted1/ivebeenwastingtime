<script>
import { deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
$: scraper_test_result = [];

async function fetch_recipe(e){
    document.getElementById("scrape_loading").classList.remove("hidden");
    const data = new FormData(this);

    const response = await fetch(this.action, {
        method: 'POST',
        body: data
    });

    /** @type {import('@sveltejs/kit').ActionResult} */
    const result = deserialize(await response.text());
    document.getElementById("scrape_loading").classList.add("hidden");
    console.log(result.data);
    if (result.data.err) {
        alert(result.data.err);
    } else if (result.type === 'success') {
        scraper_test_result = result.data;
    }
}



</script>



<div class="flex">
    <!-- 
        scraper for each website
            
        process_recipe
        merge?
     -->
     <div class="flex w-full m-5">
        <div class="w-fit justify-center">
            <div class="flex justify-center space-x-10 content-center">
                <form method="POST" action="?/scrape"  on:click|preventDefault={fetch_recipe}>
                    <button class="btn btn-primary">
                        test scraper
                    </button>
                </form>
                <div class="w-5 content-center"><span id="scrape_loading" class="loading loading-ring loading-lg hidden text-primary"></span></div>
            </div>
            
            <div class="flex flex-col w-full space-y-2 m-5 justify-center">
                {#if scraper_test_result}
                    {#each scraper_test_result as curr}
                        {#if !curr.message.includes("failed")}
                            <p class="alert alert-success p-2 m-auto w-fit text-center">{curr.message}</p>
                        {:else}
                            <p class="alert alert-error p-2">{curr.message}</p><a href={curr.url} target="_blank" class="btn btn-warning btn-sm">link</a>
                            <div class="flex flex-col ml-5 space-y-1">
                                {#each Object.entries(curr) as [key, value]}
                                    {#if key == "directions" || key == "ingredients"}
                                        {#if value.status}
                                            <p class="alert alert-success text-sm p-1">{key}</p>
                                        {:else}
                                            <p class="alert alert-error text-sm p-1">{key}</p>
                                            <div class="flex flex-col m-5">
                                                {#each value.message as message}
                                                    <p class="alert alert-error text-sm p-1">{message}</p>
                                                {/each}
                                            </div>
                                        {/if}
                                    {:else if key != "message" && key != "url"}
                                        {#if value}
                                            <p class="alert alert-success text-sm p-1">{key}</p>
                                        {:else}
                                            <p class="alert alert-error text-sm p-1">{key}</p>
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
        <div class="w-fit">

        </div>
     </div>


</div>