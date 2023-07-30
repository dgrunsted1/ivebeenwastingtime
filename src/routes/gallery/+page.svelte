<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div id="main" class="flex flex-wrap justify-around items-center content-start">
    {#each data.photos as url}
        <div class="photo w-[500px]" >
            <img class="w-full" src={url} loading="lazy">
        </div>
    {/each}
</div>