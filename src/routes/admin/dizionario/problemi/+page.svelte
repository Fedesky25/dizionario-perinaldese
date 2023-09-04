<script lang="ts">
	import type { PageData } from "./$types";
    import SortableList from "./SortableList.svelte";
    import Modal from "$lib/ConfirmModalForm.svelte";
	import { clientFormHandler, getInt, getIntList, InvalidField } from "$lib/form-utils";
	import { enhance } from "$app/forms";
    import Loading from "$lib/Loading.svelte";

    export let data: PageData;

    let remove: Modal;
    let removing: {id: number, parola: string, traduzione: string}|null = null;

    const single = clientFormHandler(async (formData) => {
        const ids = getIntList(formData, "id");
        const res = await data.supabase.from("parole").update({ordine: 0}).in("id", ids);
        if(res.error) throw res.error.details;
        else data.single = [];
    });

    let considered = -1;
    const multiple = clientFormHandler(async (formData: FormData) => {
        considered = getInt(formData, "index");
        const id_parole = getIntList(formData, "id");
        const res = await data.supabase.rpc("aggiorna_ordini", {id_parole});
        if(res.error) throw res.error.details;
        data.multiple.splice(considered, 1);
        data.multiple = data.multiple;
        considered = -1;
    });

    function onsingle(e: CustomEvent<{extra: number, id: number, traduzione: string}>) {
        const i = e.detail.extra;
        data.single.push({
            id: e.detail.id,
            parola: data.multiple[i].parola,
            traduzione: e.detail.traduzione
        });
        data.multiple.splice(i,1);
        data.single = data.single;
        data.multiple = data.multiple;
    }
</script>

<svelte:head>
    <title>Problemi | Dizionario Perinaldese</title>
</svelte:head>

<main>
    <h1>Problemi</h1>
    {#if data.multiple.length > 0}
    <section>
        <h2>Ordine delle definizioni multiple</h2>
        <p>Queste parole hanno più traduzioni con errori nel loro ordine: alcuni hanno lo stesso valore di ordine o hanno valore di ordine nullo.</p>
        <div class="grid">
            {#each data.multiple as word, index (word.parola)}
                {@const formID = `multipla-${word.parola}`}
                <div class="parola">{word.parola}</div>
                <form id={formID} action="?/multipla" method="post" use:enhance={multiple.submit}>
                    <input type="hidden" name="index" value={index}>
                    <SortableList 
                        extra={index} 
                        items={word.significati} 
                        onremove={(id, traduzione) => {
                            removing = { id, traduzione, parola: word.parola };
                            return remove.confirm();
                        }}
                        on:single={onsingle} />
                </form>
                <div class="last">
                    {#if index === considered}
                    <Loading />
                    {:else}
                    <button type="submit" form={formID} disabled={$multiple.submitting}>Invia</button>
                    {/if}
                </div>
                <hr>
            {/each}
        </div>
        {#if $multiple.error}
            <p class="err">{
                $multiple.error instanceof InvalidField
                ? `${$multiple.error.field}: ${$multiple.error.expected}`
                : $multiple.error
            }</p>
        {/if}
    </section>
    {/if}
    {#if data.single.length > 0}
    <section>
        <h2>Definizione singola</h2>
        <p>Le seguenti parole hanno una sola definizione, tuttavia riportano un ordine diverso da 0. Clicca sul tasto risolvi per sistemare automaticamente questo problema.</p>
        <form action="?/singolo" method="post" use:enhance={single.submit}>
            <ul>
                {#each data.single as s}
                    <li>
                        <input type="hidden" name="id" value={s.id}>
                        <a href="/?parola={s.id}" target="_blank">{s.parola}</a>
                    </li>
                {/each}
            </ul>
            {#if $single.submitting}
            <Loading />
            {:else}
            <button class="center" type="submit">Risolvi</button>
            {/if}
        </form>
        {#if $single.error}
        <p class="err">{$single.error instanceof InvalidField ? `${$single.error.field}: ${$single.error.expected}` : $single.error}</p>
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
        grid-template-columns: auto 1fr auto;
        column-gap: 2rem;
        max-width: fit-content;
        margin: 1.5rem auto;
        align-items: center;
    }
    .parola {
        justify-self: right;
        padding-left: 1rem;
    }
    .last {
        padding-right: 1rem;
    }
    hr {
        grid-column: 1/4;
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
        display: block;
        cursor: pointer;
    }
    button.center {
        margin: 0 auto;
    }
    a {
        color: inherit;
        text-decoration: underline dashed var(--olivina);
    }
    button:disabled {
        opacity: 0.8;
        filter: grayscale(0.9);
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

