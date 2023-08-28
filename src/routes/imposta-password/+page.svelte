<script lang="ts">
	import { browser } from "$app/environment";
    import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Loading from "$lib/Loading.svelte";
	import type { ActionData } from "./$types";
	import type { PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    async function createSession(raw: string) {
        if(browser) {
            const params = new URLSearchParams(raw);
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

{#await createSession(location.hash.slice(1))}
    <Loading />
{:then ok} 
    {#if ok}
        <div>
            <h1>Imposta la tua password</h1>
            <form method="post" use:enhance={async ({ cancel, formData }) => {
                cancel();
                const password = formData.get("password");
                if(typeof password !== "string" || password.length < 8) return void (form = { password, msg: "Password troppo corta" });
                const res = await data.supabase.auth.updateUser({password});
                if(res.error) form = {password, msg: res.error.message};
                else goto("/admin");
            }}>
                <input type="password" name="password" value={form?.password || ''} autocomplete="new-password">
                <button type="submit">Invia</button>
            </form>
            {#if form?.msg}
            <p class="error">{form.msg}</p>
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
    }
    .error {
        color: var(--rosso);
    }
</style>