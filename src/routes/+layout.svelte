	<script>
		import { page } from '$app/stores';  
		$: is_homepage = ($page.url.pathname == "/") ? true : false; 
	</script>
	
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />
		<link rel="stylesheet" href="/src/lib/style/header.css">
	</head>
	{#if !is_homepage}
		<header>
			<div id="web_title"><a href="/">WWW.IVEBEENWASTINGTIME.COM</a></div>
			<!-- <div id="menu">
				<a href="/upload">Upload</a>
				<a href="/gallery">Gallery</a>
				<a href="/groceries">Groceries</a>
				<a href="/prep">prep</a>
			</div> -->
		</header>
	{/if}
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents"><slot></slot></div>
	</body>
