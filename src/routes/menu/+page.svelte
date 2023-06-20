<script>
    import { onMount } from 'svelte';
    import { currentUser, pb } from '/src/lib/pocketbase.js';
    import { each } from 'svelte/internal';

    let user_recipes;
    let menu_recipes = {};

    onMount(async () => {
        const result_list = await pb.collection('recipes').getList(1, 50, {
            filter: `user="${$currentUser.id}"`
        });
        user_recipes = result_list;
        // console.log(user_recipes);
    });

    function check_item(e){
        let index = e.srcElement.parentNode.getElementsByTagName("p")[0].id;
        if (e.target.firstChild.checked) {
            e.target.firstChild.checked = false;
            let temp = {};
            for (let i = 0; i < menu_recipes.length; i++) {
                if (menu_recipes[i].id != user_recipes[index].id) {
                    temp.push(menu_recipes[i]);
                }
            }
            menu_recipes = temp;
        } else {
            e.target.firstChild.checked = true;
            menu_recipes.push(user_recipes[index]);
            menu_recipes = menu_recipes;
        }
    }
    function add_to_menu(e) {
        console.log(e);
    }
</script>

<div id="main">
    <h1>Menu</h1>
    <div><a href="/prep">prep</a></div>
    <div id="content">
        <div id="recipes">
            {#if user_recipes}
                {#each user_recipes.items as curr, i}
                    <div class="recipe">
                        <div class="checks" on:click|self={check_item}>
                            <input type="checkbox" class="checkbox" id="{curr.id}">
                        </div>
                        <p id={i}>{curr.title}</p>
                        <div class="add_to_menu" on:click={add_to_menu}>
                            add to menu
                        </div>
                    </div>
                {/each}
            {/if}
            <!-- <div id="add_recipe" on:click={()=>{input_count++}}>Add Recipe</div> -->
        </div>
        <div id="right_column">
            {#if menu_recipes.length}
                <div id="menu">
                    {#each menu_recipes as recipe}
                        
                    {/each}
                </div>
            {:else}
                <h2>select recipes to add to your menu</h2>
            {/if}
        </div>
    </div>
</div>




<style>
    h1 {
        font-variant: normal;
        margin: 30px 150px;
    }

    #content {
        /* border: 3px solid blue; */
        margin: 5px;
        display: flex;
    }
    #recipes {
        /* border: 3px solid black; */
        margin: 5px;
        width: 50%;
    }
    #right_column {
        /* border: 3px solid green; */
        margin: 5px;
        width: 50%;
    }

    .recipe {
        text-align: center;
        display: flex;
        align-items: center;
    }

    .checks{
        background-color: #fbe4cb;
        border: 2px solid hsla(35, 39%, 22%, 0.83);
        border-radius: 30px;
        box-shadow: hsla(35, 39%, 22%, 0.83) 3px 3px 0 0;
        color: hsla(35, 39%, 22%, 0.83);
        cursor: initial;
        display: inline-block;
        font-weight: 600;
        font-size: 18px;
        padding: 0 10px;
        line-height: 30px;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        padding: 2px;
        border-radius: 50%;
        margin: 10px;
        cursor: pointer;
    }

    input[type=checkbox] {
        margin: 2px;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fbe4cb;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    input[type="checkbox"]::before {
        content: "";
        width: .75em;
        height: .75em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        background-color: black;
        transform-origin: bottom left;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }

    input[type="checkbox"]:checked::before {
        transform: scale(1);

    }

</style>