<script lang="ts">
	import { getSearchFilter, handleSpecialChars } from "$lib/words/utils";
    import { debounceInput } from "$lib/timing";
	import Modal from "$lib/modal/Hashed.svelte";
	import type { PageData } from "./$types";
    import Voce from "./Voce.svelte";
	import { writable } from "svelte/store";
	import type { Summary } from "$lib/words/types";
	import Loading from "$lib/Loading.svelte";
	import { getMandatoryString } from "$lib/form-utils";
    import Dashboard from "$lib/Dashboard.svelte";

    export let data: PageData;
    let words: Summary[] = data.words;
    let can_extend = words.length === 50;
    let error: string|null;

    const search = writable("");

    function setError(msg: string) {
        can_extend = false;
        error = msg;
        words = [];
    }
    
    let first_time = true;
    async function searchFor(str: string) {
        if(first_time) return void (first_time = false);
        const res = await (str 
            ? data.supabase.rpc("ricerca_singola", getSearchFilter(str))
            : data.supabase.rpc("riassunto")
        );
        if(res.error) setError(res.error.message);
        else {
            words = res.data;
            can_extend = str ? false : words.length === 50;
        }
    }
    $: searchFor($search);
    
    let extending = false;
    async function extend() {
        if(extending || !can_extend) return;
        extending = true;
        const res = await data.supabase.rpc("riassunto", {salta: words.length});
        if(res.error) setError(res.error.message);
        else {
            error = null;
            const newWords: Summary[] = await res.data;
            can_extend = newWords.length === 50;
            words.push(...newWords);
            words = words;
        }
        extending = false;
    }

    function wordFromRegExp(arr: RegExpExecArray) {
        const index = +arr[1];
        const w = data.words[index];
        return w ? { id: w.id, index, parola: w.parola, traduzione: w.traduzione } : null;
    }
</script>

<svelte:head>
    <title>Voci del Dizionario Perinaldese</title>
</svelte:head>

<Dashboard title="Voci del dizionario">
    <p slot="text">Vai sopra una voce del dizionario per poterla modificare o rimuovere, o per aggiungerne una descrizione al volo. I risultati della ricerca compaiono man mano che si scrive.</p>
    <svelte:fragment slot="interaction">
        <input type="text" placeholder="Cerca..." 
            on:keydown={handleSpecialChars} 
            use:debounceInput={{ delay: 500, store: search }}>
        <a class="btn" href="/admin/dizionario/crea">Aggiungi parola</a>
    </svelte:fragment>
    <svelte:fragment slot="data">
        <table>
            <tr>
                <th>Parola</th>
                <th>Traduzione</th>
                <th>Funzione</th>
                <th>Desc.</th>
                <th>Esempi</th>
            </tr>
            {#each words as word, index (word.id)}
                <Voce {word} {index} />
            {/each}
        </table>
        {#if error}
            <div class="table-msg">
                <img src="/icons/cloud-error.svg" alt="Errore nel cloud"><br>
                <span>{error}</span>
            </div>
        {:else if words.length === 0}
            <div class="table-msg">
                <img src="/icons/nothing-here.svg" alt="Nulla qui"><br>
                <span>Nessun risultato di ricerca</span>
            </div>
        {/if}
        {#if extending}
            <div class="load-wrapper">
                <Loading />
            </div>
        {:else if can_extend}
            <button class="btn" type="button" disabled={extending} on:click={extend}>Carica altri</button>
        {/if}
    </svelte:fragment>

</Dashboard>

<Modal
    encourage={true}
    action="?/descrizione"
    hashRegExp={/#descrizione\/(\d+)/}
    parse={wordFromRegExp}
    execute={async (w, form) => {
        const descrizione = getMandatoryString(form, "descrizione");
        const res = await data.supabase.from("parole").update({descrizione}).eq("id", w.id);
        if(res.error) throw res.error.details;
        words[w.index].con_descrizione = true;
    }}
    let:data let:titleID let:descID
>
    <h2 id={titleID}>Aggiungi una descrizione</h2>
    <p id={descID}>La voce «<a class="home-link" href="/?parola={data.id}" target="_blank">{data.parola} - {data.traduzione}</a>» non ha una descrizione: scrivila al volo qui sotto.</p>
    <textarea cols="30" rows="6" name="descrizione" on:keydown={handleSpecialChars}></textarea>
    <input type="hidden" name="id" value={data.id}>
</Modal>

<Modal 
    encourage={false} 
    action="?/rimuovi"
    hashRegExp={/#rimuovi\/(\w+)/}
    parse={wordFromRegExp}
    execute={async (w) => {
        const res = await data.supabase.from("parole").delete().eq("id",w.id);
        if(res.error) throw res.error.details;
        words.splice(w.index, 1);
        words = words;
    }}
    let:titleID let:descID let:data>
    <h2 id={titleID}>Rimozione «{data.parola}»</h2>
    <p id={descID}>Sei sicuro di voler rimuovere la voce «<a class="home-link" href="/?parola={data.id}" target="_blank">{data.parola} - {data.traduzione}</a>»?<br>L'operazione non potrà essere annullata.</p>
    <input type="hidden" name="id" value={data.id}>
</Modal>

<style>
    a {
        text-decoration: none;
    }
    table {
        width: 100%;
        border-spacing: 0;
        /* border-collapse: collapse; */
    }

    th {
        border-bottom: 2px solid var(--olivina);
        padding: .5rem 1ch;
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 10;
    }
    .table-msg {
        max-width: 60ch;
        text-align: center;
        margin: 2.5rem auto;
    }
    .table-msg > img {
        max-height: 4rem;
        width: auto;
    }
    textarea {
        padding: .5rem 1rem;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: .3rem;
        resize: vertical;
        min-height: 6rem;
        max-height: 50vh;
    }
    textarea:focus {
        outline: none;
        border-color: var(--olivina);
    }

    input, .btn {
        padding: .5rem 1rem;
        border-radius: .2rem;
        font-weight: 500;
        border: none;
    }
    input {
        box-shadow: inset 0 0 0 1px #ccc;
    }
    input:focus {
        box-shadow: inset 0 0 0 1px var(--olivina);
        outline: none;
    }
    .btn {
        background-color: var(--olivina);
        font-size: 1rem;
        color: white;
        cursor: pointer;
    }
    button {
        display: block;
        margin: 2rem auto;
    }
    .load-wrapper {
        margin-top: 2rem;
        margin-bottom: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        --loading-width: 30ch;
    }
    .home-link {
        color: inherit;
        text-decoration: underline dashed var(--olivina);
    }
</style>