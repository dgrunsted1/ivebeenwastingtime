<script>
    /** @type {import('./$types').PageData} */
    export let data;
   
</script>

<div id="main" class="flex flex-auto flex-wrap justify-around items-center space-y-96 py-64 h-full px-auto">
    {#each data.photos as url}
    <div class="photo w-96 bg-base-200 mx-auto">
        <img src={url} alt="Shoes" class="rounded-lg" />
      </div>
    {/each}
</div>
