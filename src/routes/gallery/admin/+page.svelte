<script>


</script>
<div id="main">
    <form action="">
        <div class="row"><label for="album">Album: </label><input type="text" name="album" id="album"></div>
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
        padding-top: 40px;
        display: flex;

    }
    label {
        font-size: 20px;
    }

    form p {
        height: 100%;
        text-align: center;
        /* line-height: 170px; */
        color: rgb(46, 1, 42);
        font-family: Arial;
        /* line-height: 50px; */
        /* position: absolute; */
        /* top: 50%; */
        /* left: 50%; */
        /* margin-top: -100px; */
        /* margin-left: -250px; */
        height: 200px;
        border: 4px dashed rgb(46, 1, 42);
    }

    #submit {
        
    }

    #photo {
        display: flex;
        flex-direction:column;
    }
    input[type=submit] {
        margin: auto;
        
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


    
</style>