<script>
    export let menu;
    console.log({menu});
</script>

<div id="menu">
    {#each menu as recipe}
        <div class="img_serv_container">
            <div class="image">
                <img src={recipe.image} alt={recipe.title}/>
            </div>
            <div class="servings_time_container">
                <p class="title">{recipe.title}</p>
                <p class="time">{recipe.time}</p>
                <div class="servings">
                    servings:<input type="text" class="servings" id={recipe.id} value={recipe.servings}>
                </div>
                <p class="description">{recipe.description}</p>
            </div>
        </div>
    {/each}
</div>


<style>
    
    #menu {
        margin: auto;
    }

    .title {
        font-size: 1.25em;
    }


    input[type="text"] {
        width: 2em;
    }

    .image {
        width: 15%;
    }

    img {
        width: 100%;
    }

    .img_serv_container {
        display: flex;
        width: 100%;
        align-items: center;
        margin: 15px 0;
    }

    .servings_time_container {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        margin: 0 10px;
    }
    p {
        margin: 0;
    }
</style>