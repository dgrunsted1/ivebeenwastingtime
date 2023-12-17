	<script>
		import { page } from '$app/stores';  
		import { currentUser, pb, signOut } from '/src/lib/pocketbase.js';
		import "../input.css";
		$: is_homepage = ($page.url.pathname == "/") ? true : false; 
	</script>
	
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />
	</head>
	
	
	
	<body data-sveltekit-preload-data="hover">
		{#if !is_homepage}
			<div class="navbar bg-base-100">
				<div class="navbar-start">
					{#if $currentUser && ($currentUser.id == "67gxu7xk6x46gjy" || $currentUser.id == "n7ei4wy3vqv78ea") && $page.url.pathname != "/gallery" && $page.url.pathname != "/test_suite"}
						<a href="test_suite" class="btn btn-error btn-sm">test suite</a>
					{/if}
				</div>
				<div class="navbar-center">
				<a class="btn btn-ghost normal-case text-xl py-1" href="/">www.ivebeenwastingtime.com</a>
				</div>
				<ul class="menu menu-horizontal navbar-end px-1">
					<li class="flex flex-row">
						{#if !$currentUser && $page.url.pathname != "/login" && $page.url.pathname != "/gallery"}
							<a href="login">login</a>
						{:else if $currentUser && $page.url.pathname != "/login" && $page.url.pathname != "/gallery"}
							<div>Hello {$currentUser.name}</div><div on:click={signOut} on:keypress={signOut}>logout</div>
						{/if}
					</li>
				</ul>
			</div>
		  {/if}
		<div style="display: contents"><slot></slot></div>
	</body>
