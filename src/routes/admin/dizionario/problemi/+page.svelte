<script lang="ts">
	import type { PageData } from "./$types";
    import SortableList from "./SortableList.svelte";
    import Modal from "$lib/ConfirmModalForm.svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { getIntList, InvalidField } from "$lib/form-utils";
	import { enhance } from "$app/forms";
    import Loading from "$lib/Loading.svelte";

    export let data: PageData;

    let err_msg = '';
    let remove: Modal;
    let removing: {id: number, parola: string, traduzione: string}|null = null;
    let submitting = false;

    const submit: SubmitFunction = async ({ formData, cancel }) => {
        cancel();
        if(submitting) return;
        submitting = true;
        try {
            const ids = getIntList(formData, "id");
            const res = await data.supabase.from("parole").update({ordine: 0}).in("id", ids);
            if(res.error) err_msg = res.error.details;
            else data.single = [];
        }
        catch(err) {
            err_msg = err instanceof InvalidField ? `${err.field}: ${err.expected}` : err+'';
        }
        submitting = false;
    }
</script>

<svelte:head>
    <title>Problemi | Dizionario Perinaldese</title>
</svelte:head>

<main>
    <h1>Problemi</h1>
    <section>
        <h2>Ordine delle definizioni multiple</h2>
        <p>Queste parole hanno più traduzioni con errori nel loro ordine: alcuni hanno lo stesso valore di ordine o hanno valore di ordine nullo.</p>
        <div class="grid">
            {#each data.multiple as word, index}
                <div class="parola">{word.parola}</div>
                <SortableList items={word.significati} extra={index} onremove={(id, traduzione) => {
                    removing = { id, traduzione, parola: word.parola };
                    return remove.confirm();
                }} />
                <hr>
            {/each}
        </div>
    </section>
    {#if data.single.length > 0}
    <section>
        <h2>Definizione singola</h2>
        <p>Le seguenti parole hanno una sola definizione, tuttavia riportano un ordine diverso da 0. Clicca sul tasto risolvi per sistemare automaticamente questo problema.</p>
        <form action="?/singolo" method="post" use:enhance={submit}>
            <ul>
                {#each data.single as s}
                    <li>
                        <input type="hidden" name="id" value={s.id}>
                        <a href="/?parola={s.id}" target="_blank">{s.parola}</a>
                    </li>
                {/each}
            </ul>
            {#if submitting}
            <Loading />
            {:else}
            <button type="submit">Risolvi</button>
            {/if}
        </form>
        {#if err_msg}
        <p class="err">{err_msg}</p>
        {/if}
    </section>
    {/if}
</main>

<Modal action="/admin/dizionario?/rimuovi" encourage={false} bind:this={remove} let:titleID let:descID>
    {#if removing}
    <h2 id={titleID}>Rimozione {removing.parola}</h2>
    <p id={descID}>Sei sicuro di voler rimuover la parola &laquo;<a href="/?parola={removing.id}" target="_blank">{removing.parola} &mdash; {removing.traduzione}</a>&raquo;? Non è una operazione reversibile</p>
    <input type="hidden" name="id" value={removing.id}>
    {/if}
</Modal>

<style>
    :root {
        --modal-width: 45ch;
    }
    h1 {
        font-size: 3rem;
    }
    h2 {
        font-size: 1.5rem;
        margin-bottom: .3rem;
    }
    main {
        max-width: 55ch;
        margin: 8rem auto;
    }
    section {
        margin-top: 3rem;
    }
    .grid {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 2rem;
        max-width: fit-content;
        margin: 1.5rem auto;
    }
    .parola {
        justify-self: right;
        align-self: center;
        padding-left: 1rem;
    }
    hr {
        grid-column: 1/3;
        height: 0;
        border: none;
        border-bottom: 1px solid #ccc;
        margin: 1rem 0;
    }
    hr:last-child {
        display: none;
    }
    ul {
        list-style: none;
        display: flex;
        justify-content: center;
        margin: 1rem 0;
    }
    li {
        margin: .7rem;
        padding: .3rem .6rem;
        background-color: rgba(32, 32, 32, 0.03);
        border-radius: .3rem;

    }
    button {
        border: none;
        background-color: var(--olivina);
        color: white;
        padding: .4rem .8rem;
        border-radius: .15rem;
        margin: 0 auto;
        display: block;
        cursor: pointer;
    }
    a {
        color: inherit;
        text-decoration: underline dashed var(--olivina);
    }
    form {
        --loading-width: 20ch;
    }
    .err {
        text-align: center;
        color: var(--rosso);
        margin-top: 1rem;
        font-weight: 600;
    }
</style>

