<script>
    import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
    import { signin } from "./signin";
    export let form;
    export let data;

    function clear() { if(form) form.error = '';}
</script>

<svelte:head>
    <title>Dizionario Perinaldese - login</title>
</svelte:head>

<div class="center">
    <h1>Login al dizionario perinaldese</h1>
    <form method="POST" use:enhance={async ({cancel, formData}) => {
        cancel();
        const res = await signin(formData, data.supabase);
        if(res.success) goto(data.goto);
        else form = res.form;
    }}>
        <div>
            <label for="email">Nome utente</label>
            <input type="email" name="email" autocomplete="email" required title="Inserisci la mail" value={form?.email || ""} on:input={clear}>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" autocomplete="current-password" required title="Inserisci la password" on:input={clear}>
        </div>
        <button type="submit">Invia</button>
    </form>
    {#if form?.error} 
    <p>{form.error}</p>
    {/if}
</div>

<style>
    :global(body) {background-color: #fcfcfc;}
    p {
        color: crimson;
        text-align: center;
    }

    .center {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
        max-width: 40ch;
    }
    h1 {
        width: 100%;
        color: #9AB973;
        margin-bottom: 50px;
        text-align: center;
    }
    form > * + * {margin-top: 1rem;}
    input[type="email"],
    input[type="password"] {
        width: 100%;
        font-size: 13pt;
        font-weight: 600;
        padding: .4em .5em;

        color: #444;
        border-radius: 3.5px;
        border-width: 1px;
        border-color: rgba(119, 136, 153, .35);
        border-style: solid;
        box-shadow: 0 0 15px rgba(0,0,0,.04);
        transition: border-color ease-out .3s;
        background-color: white;

        margin-top: .3rem;
    }
    input[type="email"]:focus,
    input[type="password"]:focus {
        outline: none;
        border-color: rgba(154, 185, 115, .6);
    }
    label {
        font-size: 12pt;
        font-weight: 500;
        padding: .5em .7em;
        margin-top: .6em;
        color: #555;
    }
    button {
        color: #9AB973;
        background-color: white;
        border-radius: 3px;
        border-color: #9AB973;
        border-width: 1px;
        border-style: solid;
        padding: .8rem 2.4rem;
        font-size: 14pt;
        font-weight: 700;
        transition: background-color ease-in-out .3s, color ease-in-out .3s, box-shadow ease-in-out .3s;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(0, 0, 0, .08);
        display: block;
        margin: 2.2rem auto;
    }
    button:hover {
        background-color: #9AB973;
        color: white;
        box-shadow: 0 0 40px rgba(0, 0, 0, .15);
    }
    button:focus {
        outline: none;
        text-decoration: underline;
    }
</style>