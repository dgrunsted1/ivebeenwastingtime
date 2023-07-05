<script>
    export let menu;
    console.log({menu});
</script>

<div id="menu">
    {#each menu as recipe}
        <div class="menu_recipe">
            <div class="details">
                <div class="info">
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
                </div>
            </div>
        </div>
    {/each}
</div>


<style>
    p {
        /* margin: 3px 10px; */
    }
    
    #menu {
        margin: auto;
    }

    .menu_recipe {
        margin: 15px 0;
        
    }

    .details {
        /* margin: 5px 10px; */
    }

    .title {
        font-size: 1.25em;
    }

    .info {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    input[type="text"] {
        width: 2em;
    }

    .image {
        width: 15%;
        /* height: auto; */
        /* max-height: 200px; */
    }

    img {
        width: 100%;
    }

    .img_serv_container {
        display: flex;
        width: 100%;
        align-items: center;
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