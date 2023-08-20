<script lang="ts">
    import type { PageData } from "./$types";
	import Coniugazione from "./Coniugazione.svelte";
    import Declinazione from "./Declinazione.svelte";
    import Collegamenti from "./Collegamenti.svelte";
    import Esempi from "./Esempi.svelte";
    import { emptyConiugazione, splitCollegamenti } from "$lib/words/utils";

    export let data: PageData;
    let word = data.parola;
    let parola = word.parola;
    let radice = word.radice||"";
    let traduzione = word.traduzione;
    let funzione = word.funzione;
    $: valid = parola && traduzione && (
        (funzione < 4 && word.declinazione) ||
        (funzione === 4 && word.coniugazione) ||
        funzione > 4
    );
    $: parola_automatica = funzione <= 4;
    $: [vedi_anche, sinonimi, contrari] = splitCollegamenti(word.collegamenti||[]);
</script>

<form method="POST">
    <div class="buttons">
        <div>
            <button
                title="Salva"
                class="outline-btn"
                style="--clr: var(--olivina);"
                disabled={!valid}
                type="submit">
                <svg viewBox="0 0 50 50"><use href="#save-svg"/></svg>
                <span>Salva</span>
            </button>
            <button
                title="Drop"
                class="outline-btn"
                style="--clr: lightslategray;"
                type="reset">
                <svg viewBox="0 0 50 50"><use href="#clear-svg"/></svg>
                <span>Drop</span>
            </button>
        </div>
    </div>
    <div class="body">
        <h1>
            <span>{data.id ? "Aggiorna" : "Aggiungi"}</span>
            <select name="funzione" bind:value={funzione}>
                {#each data.funzioni as fg}
                    <option value={fg.id}>{fg.nome}</option>
                {/each}
            </select>
            <input type="text" name="parola" readonly={parola_automatica} bind:value={parola}>
            {#if parola_automatica}
                <span>avente radice</span>
                <input type="text" name="radice" bind:value={radice}>
            {/if}
        </h1>
        <Declinazione 
            disabled={funzione >= 4} 
            radice={radice} 
            data={word.declinazione} 
            on:parola={e => {parola = e.detail;}} />
        <Coniugazione
            disabled={funzione !== 4}
            radice={radice}
            data={word.coniugazione||emptyConiugazione()}
        />
        <section class="two-cols">
            <div class="named-input">
                <span>Traduzione:</span>
                <input type="text" bind:value={traduzione} autocapitalize="off" />
            </div>
            <div class="named-input">
                <span>Ordine:</span>
                <select value={word.ordine}>
                    <option value={0}>Unico</option>
                    <option value={1}>1&ordm;</option>
                    <option value={2}>2&ordm;</option>
                    <option value={3}>3&ordm;</option>
                    <option value={4}>4&ordm;</option>
                </select>
            </div>
            <textarea placeholder="Descrizione..." rows="3" name="descrizione" value={word.descrizione||''}></textarea>
        </section>
        <hr>
        <h2>Collegamenti</h2>
        <div class="links">
            <h3>Vedi anche</h3>
            <Collegamenti name="vedi_anche" data={vedi_anche} />
            <h3>Sinonimi</h3>
            <Collegamenti name="sinonimi" data={sinonimi} />
            <h3>Contrari</h3>
            <Collegamenti name="sinonimi" data={contrari} />
        </div>
        <hr>
        <h2>Esempi</h2>
        <Esempi data={word.esempi||[]} />
    </div>
</form>

<style>
    input, select,
    :global(textarea) {
        border: 1px solid #ccc;
        border-radius: .3rem;
        padding: .3rem .6rem;
        font: inherit;
        background-color: white;
    }
    button {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--clr);
        border: 2px solid var(--clr);
        background-color: white;
        border-radius: 5rem;
        padding: .5rem 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    button:hover:not(:disabled) {
        color: white;
        background-color: var(--clr);
    }
    button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
    @media (min-width: 50rem) {
        form {
            display: grid;
            grid-template-columns: 1fr minmax(40ch, 80ch) 1fr;
            min-height: 100vh;
        }
        .buttons {
            align-self: start;
            position: sticky;
            top: 50%;
        }
        .buttons > div {
            transform: translateY(-50%);
            display: flex;
            gap: 3rem;
            flex-direction: column;
            align-items: center;
            height: max-content;  
        }
        button {
            transform: rotate(45deg);
        }
        .body {
            padding-top: 4rem;
            padding-bottom: 10rem;
            align-self: center;
        }
        .two-cols {
            margin-top: 4rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto auto;
            align-items: start;
            column-gap: 3ch;
            row-gap: 1rem;
        }
        .named-input {
            grid-column: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        textarea {
            grid-column: 2;
            grid-row: 1/4;
            resize: vertical;
        }
        hr {
            height: 0;
            border: 0;
            border-bottom: 1px solid #ccc;
            margin: 4rem 0;
        }
        h2 {
            text-align: center;
            margin-bottom: 2rem;
        }
        .links {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-flow: row;
            justify-items: center;
            align-items: start;
            column-gap: 3ch;
        }
        .links h3 {
            grid-row: 1;
            margin-bottom: .5rem;
        }
    }
</style>