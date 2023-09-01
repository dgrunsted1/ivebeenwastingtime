<script>
    export let page;
    let page_links = [{href:"/menu", display: "Create Menu"},
        {href:"/prep", display: "Prep"},
        {href:"/my_menus", display: "My Menus"},
        {href:"/today", display: "Today"},
        {href:"/add_recipe", display: "Add Recipe"}
    ];
</script>

<div class="flex space-x-1 m-1 ">
    {#each page_links as link}
        {#if link.href != page}
            <a href={link.href} class="btn btn-xs btn-primary">{link.display}</a>
        {/if}
    {/each}
</div>