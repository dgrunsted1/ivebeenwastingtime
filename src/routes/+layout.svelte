	<script>
		import { page } from '$app/stores';  
		import { currentUser, pb, signOut } from '/src/lib/pocketbase.js';

		$: is_homepage = ($page.url.pathname == "/") ? true : false; 

	</script>
	
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />
		<link rel="stylesheet" href="/src/lib/style/header.css">
	</head>
	
	<header>
		{#if !is_homepage}
			<div id="web_title"><a href="/">WWW.IVEBEENWASTINGTIME.COM</a></div>
		{/if}
		<div id="menu">
		{#if !$currentUser}
			<a href="login">login</a>
		{:else}
			<div on:click={signOut}>logout</div>
		{/if}
	</div>
	</header>
	
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents"><slot></slot></div>
	</body>
