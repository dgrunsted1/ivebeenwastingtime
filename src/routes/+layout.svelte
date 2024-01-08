	<script>
		import { page } from '$app/stores';  
		import { currentUser, pb, signOut } from '/src/lib/pocketbase.js';
		import "../input.css";
		$: is_homepage = ($page.url.pathname == "/") ? true : false; 

    	let page_links = [{href:"/menu", display: "Create Menu"},
        {href:"/my_menus", display: "My Menus"},
        {href:"/today", display: "Today"},
        {href:"/add_recipe", display: "Add Recipe"}
    ];
	</script>
	
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />
	</head>
	
	
	
	<body data-sveltekit-preload-data="hover">
		{#if !is_homepage}
			<div>
				<div class="navbar bg-base-100 fixed z-10">
					<div class="navbar-start">
						<div class="dropdown">
							<div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
							</div>
							<ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-36 space-y-1.5">
								{#each page_links as link}
									{#if link.href != $page.url.pathname}
										<li><a href={link.href} class="btn btn-xs btn-primary">{link.display}</a></li>
									{:else}
										<li><a href={link.href} class="btn btn-xs btn-ghost" disabled>{link.display}</a></li>
									{/if}
								{/each}
							{#if !$currentUser && $page.url.pathname != "/login"}
								<li><a href="login" class="btn btn-xs btn-primary">login</a></li>
							{:else if $currentUser && $page.url.pathname != "/login" && $page.url.pathname != "/gallery"}
								<li><div on:click={signOut} class="btn btn-xs btn-primary" on:keypress={signOut}>logout</div></li>
							{/if}
							</ul>
						</div>
						<!-- {#if $currentUser && ($currentUser.id == "67gxu7xk6x46gjy" || $currentUser.id == "n7ei4wy3vqv78ea") && $page.url.pathname != "/gallery" && $page.url.pathname != "/test_suite"}
							<a href="test_suite" class="btn btn-error btn-sm">test suite</a>
						{/if} -->
					</div>
					<div class="navbar-center">
					<a class="btn btn-ghost normal-case md:text-xl py-1 btn-sm md:btn-lg" href="/">www.ivebeenwastingtime.com</a>
					</div>
					<ul class="menu menu-horizontal navbar-end">
					</ul>
				</div>
			</div>
		  {/if}
		<div style="display: contents" class="relative">
			{#if !is_homepage}
				<div class="h-16 md:h-20"></div>
			{/if}
			<slot></slot>
		</div>
	</body>
