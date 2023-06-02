<script>
export let data;
</script>

<div id="main">
    <div id="hero" style="background-image: url('{data.hero_url}')">
        <div id="web_title">
            ivebeenwastingtime
        </div>
        <div class="secondary">
            <div id="left_side">
            </div>
            <div id="right_side">
            </div> 
        </div>
        
    </div>
    <div id="content">
        <div class="row">
            <a href="/gallery">gallery</a>
            <p>checkout my Gallery of photos</p>
        </div>
        <div class="row">
            <p>Easily create grocery lists from recipes you find on the internet.</p>
            <a href="/prep">prep</a>
        </div>
    </div>
    
</div>






<style>
    #main {
        width:100%;
        display: flex;
        flex-direction: column;
    }

    #left_side {
        width: 50%;
    }

    #right_side {
        width: 50%;
    }

    #hero {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        height: 100svh;
        margin: auto;
        background-size:     cover;
        background-repeat:   no-repeat;
        background-position: center center;
        z-index: 1;
    }

    #web_title {
        margin: auto;
        color: white;
        font-size: 45px;
        font-weight: 900;
        cursor: default;
    }

    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        margin: 100px;
    }
     .row p {
        font-size: 2em;
     }

     .row a {
        font-size: 2em;
         
     }

oo     @media (max-width: 600px) {
        #web_title {
            font-size: 2em;
        }
    }
    

</style>