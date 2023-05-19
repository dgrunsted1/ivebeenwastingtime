<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div id="main">
    {#each data.photos as url}
        <div class="photo">
            <img src={url}>
        </div>
    {/each}
</div>


<style>
    #main {
        display: flex;
        flex-direction: row;
    }
</style>