<script lang="ts">
	import { browser } from "$app/environment";
    import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Loading from "$lib/Loading.svelte";
	import type { PageData } from "./$types";

    export let data: PageData;
    let error: string|null = null;

    async function createSession() {
        if(browser) {
            const params = new URLSearchParams(location.hash.slice(1));
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");
            if(access_token && refresh_token) {
                const res = await data.supabase.auth.setSession({access_token, refresh_token});
                data.session = res.data.session;
                console.log(res.error);
            }
        }
        return data.session !== null;
    }
</script>

<svelte:head>
    <title>Imposta password | Dizionario Perinaldese</title>
</svelte:head>

{#await createSession()}
    <Loading />
{:then ok} 
    {#if ok}
        <div>
            <h1>Imposta la tua password</h1>
            <p>Se sei arrivato qui seguendo un link ricevuto via mail <b>non chiudere questo tab</b>: i dati di questa richiesta sono validi una sola volta. In caso contrario, in questa pagina puoi comunque modificare la tua password.</p>
            <form method="post" use:enhance={async ({ cancel, formData }) => {
                cancel();
                const password = formData.get("password");
                if(typeof password !== "string" || password.length < 8) return void (error = "Password troppo corta");
                const res = await data.supabase.auth.updateUser({password});
                if(res.error) error = res.error.message;
                else goto("/admin");
            }}>
                <input type="password" name="password" autocomplete="new-password">
                <button type="submit">Cambia</button>
            </form>
            {#if error}
            <p class="error">{error}</p>
            {/if}
        </div>
    {:else}
    <p>Nessuna sessione presente: <a href="/">torna alla homepage</a></p>
    {/if}
{/await}


<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 45ch;
        margin: 30vh auto;
    }
    h1 {
        margin-bottom: 1rem;
        color: var(--olivastro);
    }
    p {
        text-align: justify;
        margin-bottom: 2rem;
    }
    .error {
        color: var(--rosso);
    }
    input, button {
        font-size: 1rem;
        border: 1px solid #ccc;
        padding: .3ch .6ch;
    }
    button {
        border-color: var(--olivastro);
        color: var(--olivastro);
        font-weight: 600;
        background-color: transparent;
        cursor: pointer;
    }
    input:focus {
        outline: none;
        border-color: var(--olivina);
    }
</style>