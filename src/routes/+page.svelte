<script>
    function logout() {
        fetch("/logout", {
            credentials: "include",
            method: "POST"
        });
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<a href="/login">Login</a>
<a href="/admin">admin</a>
<a href="/admin/dizionario">dizionario</a>

<button on:click={logout}>logout</button>
