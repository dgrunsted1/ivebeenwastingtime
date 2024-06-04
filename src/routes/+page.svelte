<script>
    import { currentUser } from '/src/lib/pocketbase.js';
    
    export let data;
</script>

<div id="main" class="w-full flex flex-col">
    <div id="hero" style="background-image: url('{data.hero_url}')" class="flex flex-col relative w-full h-screen m-auto bg-cover bg-no-repeat bg-center">
        <div id="web_title" class="m-auto cursor-default md:text-5xl text-white">
            <h1>ivebeenwastingtime</h1>
        </div>
    </div>
    <div id="content">
        <div class="flex justify-evenly items-center m-5 md:m-24 space-x-3">
            <p class="md:text-2xl">checkout my Gallery of photos</p>
            <a href="/gallery" class="btn btn-primary md:btn-lg">gallery</a>
        </div>
        <div class="flex justify-evenly items-center m-5 md:m-24 space-x-3">
            <a href="/menu" class="btn btn-primary md:btn-lg">create menu</a>
            <p class="md:text-2xl">Create menus from recipes youve added</p>
        </div>
        <div class="flex justify-evenly items-center m-5 md:m-24 space-x-3">
            <p class="md:text-2xl">Check out this weeks recipes and cook</p>
            <a href="/today" class="btn btn-primary md:btn-lg">today</a>
        </div>
        <div class="flex justify-evenly items-center m-5 md:m-24 space-x-3">
            <a href="/my_menus" class="btn btn-primary md:btn-lg">My Menus</a>
            <p class="md:text-2xl">Look at your past menus and choose one for today</p>
        </div>
        <div class="flex justify-evenly items-center m-5 md:m-24 space-x-3">
            <p class="md:text-2xl">Add recipes here</p>
            <a href="/add_recipe" class="btn btn-primary md:btn-lg">add recipe</a>
        </div>
        {#if $currentUser}
            <div class="flex justify-evenly items-center m-5 md:m-24 space-x-3">
                <a href="/{$currentUser.username}" class="btn btn-primary md:btn-lg">My Profile</a>
                <p class="md:text-2xl">Manage how others can view your recipes</p>
            </div>
        {/if}
    </div>
    
</div>