	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />
		<link rel="stylesheet" href="/src/lib/style/header.css">
	</head>
    <header>
		<a href="/">Home</a>
		<a href="/upload">upload</a>
		<a href="/gallery">Gallery</a>
		<a href="/groceries">Groceries</a>
	</header>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents"><slot></slot></div>
	</body>
