<script lang="ts">
	import { handleSpecialChars } from "$lib/words/utils";
    import { debounceInput } from "$lib/timing";
	import type { PageData } from "./$types";
    import Modal from "$lib/Modal.svelte";
    import Voce from "./Voce.svelte";
	import { writable } from "svelte/store";
	import type { Summary } from "$lib/words/types";

    export let data: PageData;
    let words: Summary[] = data.parole;
    let can_extend = words.length === 50;
    
    // $: if(data.cached) {
    //     const cache = sessionStorage.getItem("cache");
    //     if(cache) words = JSON.parse(cache);
    //     else extend();
    // } else {
    //     words = data.parole;
        
    // }

    const search = writable("");

    const req: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: { "Accept": "application/json" }
    }
    
    let first_time = true;
    async function searchFor(str: string) {
        if(first_time) return void (first_time = false);
        const res = await fetch("/admin/dizionario?search="+str, req);
        words = await res.json();
        can_extend = words.length === 50;
    }
    $: searchFor($search);
    
    let extending = false;
    async function extend() {
        if(extending || !can_extend) return;
        extending = true;
        const res = await fetch(`/admin/dizionario?search=${$search}&skip=${words.length}`, req);
        const newWords: Summary[] = await res.json();
        can_extend = newWords.length === 50;
        words.push(...newWords);
        words = words;
        extending = false;
    }

    let descrizione = '';
    async function changeDescription(arr: RegExpExecArray) {
        const id = arr[1];
        const res = await fetch("/admin/dizionario/"+id, {
            credentials: "include",
            redirect: "follow",
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({descrizione})
        });
        if(res.ok) words[+arr[2]].descrizione = descrizione; 
        descrizione = '';
    }
    async function removeWord(arr: RegExpExecArray) {
        const id = arr[1];
        const res = await fetch("/admin/dizionario/"+id, {
            credentials: "include",
            redirect: "follow",
            method: "DELETE",
        });
        const { deleted } = await res.json();
        if(deleted) {
            const index = +arr[2];
            words.splice(index, 1);
            words = words;
        }
    }
</script>

<div class="container">
    <h1>Voci del dizionario</h1>
    <p> Vai sopra una voce del dizionario per poterla modificare o rimuovere, o per aggiungerne una descrizione al volo.risultati della ricerca compaiono man mano che si scrive.</p>
    <div class="interaction">
        <input type="text" placeholder="Cerca..." 
            on:keydown={handleSpecialChars} 
            use:debounceInput={{ delay: 500, store: search }}>
        <a class="btn" href="/admin/dizionario/nuova">Aggiungi parola</a>
    </div>
    <div class="table-container">
        <table>
            <tr>
                <th>Parola</th>
                <th>Traduzione</th>
                <th>Funzione</th>
                <th>Desc.</th>
                <th>Esempi</th>
            </tr>
            {#each words as word, index (word._id)}
                <Voce {word} {index} />
            {/each}
        </table>
        {#if words.length === 0}
            <div class="table-msg">
                <img src="/icons/nothing-here.svg" alt="Nulla qui"><br>
                <span>Nessun risultato di ricerca</span>
            </div>
        {/if}
        {#if can_extend}
            <button class="btn" disabled={extending} on:click={extend}>Carica altri</button>
        {/if}
    </div>
</div>

<Modal 
    encourage={true} action={changeDescription}
    hashRegExp={/#descrizione\/(\w+)\/(\d+)/}
    let:data let:titleID let:descID>
    {#if words.length}
    {@const w = words[+(data[2]||0)]}
    <h2 id={titleID}>Aggiungi una descrizione</h2>
    <p id={descID}>La voce «{w.parola} - {w.traduzione}» non ha una descrizione: scrivila al volo qui sotto.</p>
    <textarea cols="30" rows="6" bind:value={descrizione} on:keydown={handleSpecialChars}></textarea>
    {/if}
</Modal>

<Modal 
    encourage={false} action={removeWord}
    hashRegExp={/#rimuovi\/(\w+)\/(\d+)/}
    let:titleID let:descID let:data>
    {#if words.length}
    {@const w = words[+(data[2]||0)]}
    <h2 id={titleID}>Rimozione «{w.parola}»</h2>
    <p id={descID}>Sei sicuro di voler rimuovere la voce «{w.parola} - {w.traduzione}»?<br>L'operazione non potrà essere annullata.</p>
    {/if}
</Modal>

<style>
    :global(html) {overflow: hidden;}
    :global(body) {overflow: hidden;}
    .container {
        display: grid;
        width: 100%;
        max-width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .interaction {display: flex;}
    .interaction > a {
        display: block;
        text-decoration: none;
    }
    .table-container {
        overflow-y: auto;
        max-height: 100%;
    }
    table {
        width: 100%;
        border-spacing: 0;
        /* border-collapse: collapse; */
    }
    @media (max-width: 100ch) {
        .container {
            position: absolute;
            inset: 0;
            grid-template-rows: auto 1fr auto;
        }
        h1 {
            grid-row: 1;
            padding: .5rem;
            text-align: center;
        }
        p {display: none;}
        .interaction {
            background-color: white;
            padding: .5rem 1rem;
            box-shadow: 0 0 25px #0001;
            grid-row: 3;
            justify-content: space-between;
            column-gap: 1rem;
        }
        .interaction > a {text-align: center;}
        .table-container {grid-row: 2;}
    }
    @media (min-width: 100ch) {
        .container {
            max-height: 100vh;
            grid-template-columns: 32ch 1fr;
            grid-template-rows: repeat(3, auto) 1fr;
            row-gap: 1rem;
            column-gap: 1rem;
            padding: 2.5rem;
            /* padding-bottom: 3rem; */
        }
        h1 {grid-row: 1;}
        p {
            grid-row: 2;
            margin-bottom: 1rem;
        }
        .interaction {
            grid-row: 3;
            flex-direction: column;
        }
        .interaction > :global(*) {
            width: fit-content;
            margin: .5rem 0;
        }
        h1, p, .interaction {grid-column: 1;}
        .table-container {
            grid-column: 2;
            grid-row: 1/6;
            background-color: white;
            border-radius: var(--large-radius);
            box-shadow: 0 0 45px #0001;
            padding: 0 1rem 1rem;
            margin: 0 auto;
            width: 100%;
            height: fit-content;
            max-width: 80ch;
            position: relative;
        }
    }
    @media (min-width: 140ch) {.container {grid-template-columns: 42ch 1fr;}}
    tr > th {
        border-bottom: 2px solid var(--olivina);
        padding: 1rem 1ch .5rem;
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
    textarea {width: 100%;}
    .btn {
        background-color: var(--olivina);
        font-size: 1rem;
        font-weight: 500;
        border: none;
        border-radius: .2rem;
        color: white;
        padding: .5rem 1rem;
        cursor: pointer;
    }
    button {
        display: block;
        margin: 2rem auto;
    }
</style>