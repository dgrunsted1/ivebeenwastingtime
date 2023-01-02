<script>
let albums = {};

</script>


<div id="main">
    <form action="">
        <div class="sec-center"> 	
            <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
            <label class="for-dropdown" for="dropdown">Album <i class="uil uil-arrow-down"></i></label>
            <div class="section-dropdown"> 
                {#each albums as album}
                <a href="#">Dropdown Link <i class="uil uil-arrow-right"></i></a>
                {/each}
                <a>New Album <i class="uil uil-arrow-right"></i></a>
            </div>
            <input type="text" name="album" id="album">
        </div>
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

    .sec-center {
        position: relative;
        max-width: 100%;
        text-align: center;
        z-index: 200;
    }

    [type="checkbox"]:checked, [type="checkbox"]:not(:checked){
        position: absolute;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
    }

    .dropdown:checked + label, .dropdown:not(:checked) + label{
        position: relative;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 15px;
        line-height: 2;
        height: 50px;
        transition: all 200ms linear;
        border-radius: 4px;
        width: 220px;
        letter-spacing: 1px;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        -moz-justify-content: center;
        -ms-justify-content: center;
        justify-content: center;
        -ms-flex-pack: center;
        text-align: center;
        border: none;
        background-color: #874fe8b7;
        cursor: pointer;
        color: #ffffff;
        box-shadow: 0 12px 35px 0 rgba(255,235,167,.15);
    }

    .dropdown:checked + label:before, .dropdown:not(:checked) + label:before{
        position: fixed;
        top: 0;
        left: 0;
        content: '';
        /* width: 100%; */
        height: 100%;
        z-index: -1;
        cursor: auto;
        pointer-events: none;
    }
    .dropdown:checked + label:before{
        pointer-events: auto;
    }
    .dropdown:not(:checked) + label .uil {
        font-size: 24px;
        margin-left: 10px;
        transition: transform 200ms linear;
    }
    .dropdown:checked + label .uil {
        transform: rotate(180deg);
        font-size: 24px;
        margin-left: 10px;
        transition: transform 200ms linear;
    }
    .section-dropdown {
        position: relative;
        width: 60%;
        padding: 5px;
        margin: auto;
        background-color: rgb(226, 226, 226);
        top: 10px;
        left: 0;
        /* width: 100%; */
        border-radius: 4px;
        display: block;
        box-shadow: 0 14px 35px 0 rgba(9,9,12,0.4);
        z-index: 2;
        opacity: 0;
        pointer-events: none;
        transform: translateY(20px);
        transition: all 200ms linear;
    }

    .dropdown:checked ~ .section-dropdown{
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
    }
    .section-dropdown:before {
        position: absolute;
        top: -20px;
        left: 0;
        /* width: 100%; */
        height: 20px;
        content: '';
        display: block;
        z-index: 1;
    }
    .section-dropdown:after {
        position: absolute;
        top: -7px;
        left: 30px;
        width: 0; 
        height: 0; 
        border-left: 8px solid transparent;
        border-right: 8px solid transparent; 
        border-bottom: 8px solid rgb(226, 226, 226);
        content: '';
        display: block;
        z-index: 2;
        transition: all 200ms linear;
    }

    a {
        position: relative;
        color: #381070;
        transition: all 200ms linear;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 15px;
        border-radius: 2px;
        padding: 5px 0;
        padding-left: 20px;
        padding-right: 15px;
        margin: 2px 0;
        text-align: left;
        text-decoration: none;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        align-items: center;
        justify-content: space-between;
            -ms-flex-pack: distribute;
    }

    a:hover {
        color: #102770;
        background-color: hsl(261, 100%, 92%);
    }

    a .uil {
        font-size: 22px;
    }
    .dropdown-sub:checked + label, .dropdown-sub:not(:checked) + label{
        position: relative;
        color: #381070;
        transition: all 200ms linear;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 15px;
        border-radius: 2px;
        padding: 5px 0;
        padding-left: 20px;
        padding-right: 15px;
        text-align: left;
        text-decoration: none;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        align-items: center;
        justify-content: space-between;
        -ms-flex-pack: distribute;
        cursor: pointer;
    }

    .dropdown-sub:checked + label .uil, .dropdown-sub:not(:checked) + label .uil{
        font-size: 22px;
    }
    .dropdown-sub:not(:checked) + label .uil {
        transition: transform 200ms linear;
    }
    .dropdown-sub:checked + label .uil {
        transform: rotate(135deg);
        transition: transform 200ms linear;
    }
    .dropdown-sub:checked + label:hover,
    .dropdown-sub:not(:checked) + label:hover{
        color: #102770;
        background-color: hsl(261, 100%, 92%);
    }

    .section-dropdown-sub {
        position: relative;
        display: block;
        width: 100%;
        pointer-events: none;
        opacity: 0;
        max-height: 0;
        padding-left: 10px;
        padding-right: 3px;
        overflow: hidden;
        transition: all 200ms linear;
    }
    .dropdown-sub:checked ~ .section-dropdown-sub{
        pointer-events: auto;
        opacity: 1;
        max-height: 999px;
    }
    .section-dropdown-sub a {
        font-size: 14px;
    }
    .section-dropdown-sub a .uil {
        font-size: 20px;
    }
</style>