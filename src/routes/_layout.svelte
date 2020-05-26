<script context="module">
  export function preload(page, { user }) {
		if (page.path.startsWith('/app') && !user) {
      return this.redirect(302, "/auth/login");
		}
	}
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<main>
	<slot></slot>
</main>