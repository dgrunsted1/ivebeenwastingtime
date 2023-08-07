<script>
export let data;
</script>

<div id="main" class="w-full flex flex-col">
    <div id="hero" style="background-image: url('{data.hero_url}')" class="flex flex-col relative w-full h-screen m-auto bg-cover bg-no-repeat bg-center">
        <div id="web_title" class="m-auto cursor-default text-5xl text-white">
            <h1>ivebeenwastingtime</h1>
        </div>
    </div>
    <div id="content">
        <div class="row flex justify-evenly items-center m-24">
            <a href="/gallery" class="btn btn-primary btn-lg">gallery</a>
            <p class="text-2xl">checkout my Gallery of photos</p>
        </div>
        <div class="row flex justify-evenly items-center m-24">
            <p class="text-2xl">Easily create grocery lists from recipes you find on the internet.</p>
            <a href="/prep" class="btn btn-primary btn-lg">prep</a>
        </div>
        <div class="row flex justify-evenly items-center m-24">
            <a href="/menu" class="btn btn-primary btn-lg">create menu</a>
            <p class="text-2xl">Create menus from recipes youve added</p>
        </div>
        <div class="row flex justify-evenly items-center m-24">
            <p class="text-2xl">Check out this weeks recipes and cook.</p>
            <a href="/today" class="btn btn-primary btn-lg">today</a>
        </div>
        <div class="row flex justify-evenly items-center m-24">
            <a href="/my_menus" class="btn btn-primary btn-lg">My Menus</a>
            <p class="text-2xl">Look at your past menus and choose one for today.</p>
        </div>
    </div>
    
</div>