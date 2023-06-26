<script>
    export let menu;
</script>

<div id="menu">
    {#each menu as recipe}
        <div class="menu_recipe">
            <p>{recipe.title}</p>
            <p>{recipe.description}</p>
            <!-- <p>{recipe.author}</p> -->
            <p>{recipe.time}</p>
            <!-- <p>{recipe.title}</p> -->
        </div>
    {/each}
</div>


<style>
    p {
        margin: 3px 10px;
    }
    
    #menu {
        margin: auto;
    }
</style>