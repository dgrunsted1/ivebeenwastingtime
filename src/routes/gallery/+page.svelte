<script>
  import { onMount } from 'svelte';

    /** @type {import('./$types').PageData} */
    export let data;
    $: hiddenElements = [];

    

    onMount(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach((entry) => {
                console.log(entry.intersectionRatio);
                if (entry.isIntersecting) {
                    entry.target.style.transform = "perspective(1000px) rotateX(0deg)";
                } else {
                    entry.target.style.transform = "perspective(1000px) rotateX(-80deg)";
                }
            });
        });

        hiddenElements = document.querySelectorAll('.photo');
        hiddenElements.forEach((el) => {
            observer.observe(el);
        });
    });
</script>

<div id="main" class="flex flex-wrap justify-around items-center content-start space-y-96 py-64 h-full px-auto">
    {#each data.photos as url}
    <div class="photo w-96 bg-base-200">
        <img src={url} alt="Shoes" class="rounded-lg"/>
      </div>
    {/each}
</div>

<style>
    .photo {
        transform-style: preserve-3d;
        transform: perspective(1000px) rotateX(-80deg);
        transition: .5s ease-in-out transform;
    }
</style>