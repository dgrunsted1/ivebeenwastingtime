<script>
    /** @type {import('./$types').PageData} */
    export let data;
   
</script>

<div id="main" class="flex flex-auto flex-wrap justify-around items-center space-y-96 lg:space-y-12 py-32 lg:py-0 h-full">
    {#each data.photos as url}
    <div class="photo w-96 bg-base-200">
        <img src={url} alt="Shoes" class="rounded-lg" />
      </div>
    {/each}
</div>
