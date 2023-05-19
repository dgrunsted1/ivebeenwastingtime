<script>
export let data;
</script>

<div id="main">
    <div id="hero" style="background-image: url('{data.url}')">
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
        height: 100vh;
        margin: auto;
        background-size:     cover;
        background-repeat:   no-repeat;
        background-position: center center;
        z-index: 1;
    }

    #web_title {
        /* display: flex; */
        margin: auto;
        /* width:20%; */
        color: black;
        font-size: 45px;
        font-weight: 900;
    }
    

</style>