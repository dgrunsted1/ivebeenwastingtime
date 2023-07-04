<script>
    export let menu;
    console.log({menu});
</script>

<div id="menu">
    {#each menu as recipe}
        <div class="menu_recipe">
            <p class="title">{recipe.title}</p>
            <div class="details">
                <div class="info">
                    <p class="time">{recipe.time}</p>
                    <div class="servings">
                        servings:<input type="text" class="servings" id={recipe.id} value={recipe.servings}>
                    </div>
                <!-- <p>{recipe.title}</p> -->
                </div>
                <p class="description">{recipe.description}</p>
                <!-- <p>{recipe.author}</p> -->
            </div>
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

    .menu_recipe {
        margin: 15px 0;
        
    }

    .details {
        margin: 5px 10px;
    }

    .title {
        font-size: 1.25em;
    }

    .info {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    input[type="text"] {
        width: 2em;
    }

    .description {
        /* margin: 0; */
    }

    .time {
        /* margin: 0; */
    }
</style>