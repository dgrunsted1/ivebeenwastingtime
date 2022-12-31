<script>
let albums = {};

</script>


<div id="main">
    <form action="">
        <div class="row"><label for="album_dropdown">Album: </label><select name="album_dropdown" id="album_dropdown">
            {#each albums as album}
                <option value={album}>{album}</option>
            {/each}
            <option value="new">New Album</option>
        </select></div>
        <div class="row" id="new_album_input"><label for="album">Album: </label><input type="text" name="album" id="album"></div>
        <div class="row" id="photo"><input type="file" name="photo" id="photo" multiple><p>Drag your files here or click to browse</p></div>
        <div class="row" id="submit"><input type="submit" value="upload" multiple></div>    
    </form>
</div>



<style>
    #main {
        display: block;
        max-width: 600px;
        margin: auto;
        padding-top: 60px;
        /* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */
        /* font-family:Verdana, Geneva, Tahoma, sans-serif; */
        font-family: tahoma;
    }
    form {
        display: flex;
        flex-direction: column;
        margin:auto;
    }

    .row {
        width: 100%;
        /* padding-top: 40px; */
        display: flex;

    }
    label {
        font-size: 20px;
    }

    form p {
        height: 100%;
        text-align: center;
        line-height: 200px;
        color: rgb(46, 1, 42);
        font-family: Arial;
        /* line-height: 50px; */
        /* position: absolute; */
        /* top: 50%; */
        /* left: 50%; */
        /* margin-top: -100px; */
        /* margin-left: -250px; */
        height: 200px;
        border: 2px dashed rgb(46, 1, 42);
    }

    input[type=submit] {
        /* margin: 0; */
        color: #fff;
        background: #4916a0b7;
        border: none;
        /* width: 508px; */
        /* height: 35px; */
        /* margin-top: -20px; */
        /* margin-left: -4px; */
        border-radius: 4px;
        border-bottom: 4px solid #4916a0b7;
        transition: all .2s ease;
        outline: none;
        padding: 20px 0;
        width: 60%;
        margin:auto;
        font-size: 25px; 
    }

    #photo {
        display: flex;
        flex-direction:column;
    }

    input[type=file] {
        margin: auto;
        /* position: absolute; */
        /* margin: 0;
        padding: 0; */
        width: 100%;
        height: 100%;
        outline: none;
        opacity: 0;
    }

    input[type=submit]:hover{
        background: #4916a0;
        color: #fff09e;
    }
    input[type=submit]:active{
        border:0;
    }

    #new_album_input {
        /* display: none; */
    }

    
</style>