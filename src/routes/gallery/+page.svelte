<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div id="main">
    {#each data.photos as url}
        <div class="photo" >
            <img src={url}>
        </div>
    {/each}
</div>


<style>
    #main {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        align-items: center;
        align-content: flex-start;
    }
    .photo {
        width: 20%;
        /* width: 15%; */
        /* height: 15%; */
        /* background-size:     cover;
        background-repeat:   no-repeat;
        background-position: center center; */
    }
     img {
        width: 100%;
     }
</style>