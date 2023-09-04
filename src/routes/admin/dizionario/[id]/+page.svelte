<script lang="ts">
    import type { ActionData, PageData } from "./$types";
	import Coniugazione from "./Coniugazione.svelte";
    import Declinazione from "./Declinazione.svelte";
    import Collegamenti from "./Collegamenti.svelte";
    import Esempi from "./Esempi.svelte";
    import { emptyConiugazione, emptyWord, splitCollegamenti } from "$lib/words/utils";
	import type { CompleteAdmin } from "$lib/words/types";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { createWord, getDataFromForm, updateCollegamenti, updateWord } from "./logic";
	import { InvalidField } from "$lib/form-utils";
	import { goto } from "$app/navigation";

    export let form: ActionData;
    export let data: PageData;
    const fgs = data.funzioni;

    let word: CompleteAdmin;
    let parola: string;
    let radice: string;
    let traduzione: string;
    let funzione: number;

    function destructureWord(w: CompleteAdmin) {
        word = w;
        parola = w.parola;
        radice = w.radice||"";
        traduzione = w.traduzione;
        funzione = w.funzione;
    }

    $: destructureWord(data.parola);
    $: valid = parola && traduzione; // && (
    //     (funzione < 4 && word.declinazione) ||
    //     (funzione === 4 && word.coniugazione) ||
    //     funzione > 4
    // );
    $: parola_automatica = funzione <= 4;
    $: [vedi_anche, sinonimi, contrari] = splitCollegamenti(word.collegamenti||[]);

    const onsubmit: SubmitFunction = async ({ cancel, formData }) => {
        cancel();
        try {
            const word = getDataFromForm(formData, data.funzioni.map(v => v.id));
            let id = data.id;
            if(id) await updateWord(id, word, data.supabase);
            else id = await createWord(word, data.supabase);
            await updateCollegamenti(id, formData, data.supabase);
            form = { success: true };
            if(data.id) goto("/admin/dizionario");
            else data.parola = emptyWord(funzione); 
        }
        catch(err) {
            if(err instanceof InvalidField) form = {
                success: false, field: err.field,
                expected: err.expected, got: err.got
            };
            else if(
                typeof err === "object" && err
                && "body" in err && typeof err.body === "object" && err.body
                && "message" in err.body && typeof err.body.message === "string"
            ) form = {
                success: false, field: err.body.message,
                // @ts-ignore
                expected: err.body.details||"", got: undefined
            }
            else {
                console.error(err);
                form = {
                    success: false, field: "Ignoto",
                    expected: "Ignoto", got: ""+err
                };
            }
        }
    }
</script>

<svelte:head>
    <title>{data.id ? `Modifica «${parola}»` : "Crea parola"} | Dizionario Perinaldese</title>
</svelte:head>

<form method="POST" use:enhance={onsubmit}>
    <div class="sticky-middle">
        <div class="buttons">
            <button
                title="Salva"
                class="outline-btn"
                style="--clr: var(--olivina);"
                disabled={!valid}
                type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path fill="currentColor" d="M 8 4 C 6.3 4 5 5.3 5 7 L 5 43 C 5 44.7 6.3 46 8 46 L 44 46 C 45.7 46 47 44.7 47 43 L 47 13.199219 C 47 12.899219 46.899219 12.7 46.699219 12.5 L 38.5 4.3007812 C 38.3 4.1007812 38.100781 4 37.800781 4 L 8 4 z M 13 6 L 37 6 L 37 18 C 37 19.1 36.1 20 35 20 L 15 20 C 13.9 20 13 19.1 13 18 L 13 6 z M 29 9 L 29 17 L 33 17 L 33 9 L 29 9 z M 15 27 L 37 27 C 38.1 27 39 27.9 39 29 L 39 44 L 13 44 L 13 29 C 13 27.9 13.9 27 15 27 z M 8 41 L 10 41 L 10 43 L 8 43 L 8 41 z M 42 41 L 44 41 L 44 43 L 42 43 L 42 41 z"></path>
                </svg>
                <span>Salva</span>
            </button>
            {#if data.id}
            <a href="/admin/dizionario" style="--clr: lightslategray;">
                <svg style="transform: rotate(90deg);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path fill="currentColor" d="M 13.035156 2.9648438 C 11.930156 2.9648438 11.035156 3.8598438 11.035156 4.9648438 L 11.035156 15.964844 L 5.9648438 15.964844 C 5.5608438 15.964844 5.1950156 16.206078 5.0410156 16.580078 C 4.8850156 16.954078 4.9718125 17.384875 5.2578125 17.671875 L 14.328125 26.742188 C 14.719125 27.133187 15.351187 27.133187 15.742188 26.742188 L 24.814453 17.671875 C 25.005453 17.480875 25.107422 17.224844 25.107422 16.964844 C 25.107422 16.835844 25.08225 16.704078 25.03125 16.580078 C 24.87725 16.206078 24.511422 15.964844 24.107422 15.964844 L 19.035156 15.964844 L 19.035156 4.9648438 C 19.035156 3.8598438 18.140156 2.9648438 17.035156 2.9648438 L 13.035156 2.9648438 z"></path></svg>
                <span>Indietro</span>
            </a>
            {:else}
            <button
                title="Drop"
                class="outline-btn"
                style="--clr: lightslategray;"
                type="reset">
                <svg viewBox="0 0 50 50">
                    <path fill="currentColor" d="M 46.4375 0.03125 C 45.539063 0.0390625 44.695313 0.398438 44.21875 1.125 L 36.625 15.40625 C 37.1875 15.601563 38.453125 16.164063 42.65625 18.0625 L 42.71875 18.09375 C 43.445313 18.421875 44 18.65625 44.21875 18.75 C 44.292969 18.785156 44.363281 18.839844 44.4375 18.875 L 49.96875 3.5625 C 50.316406 2.351563 49.449219 0.957031 48.0625 0.40625 C 47.546875 0.148438 46.976563 0.0273438 46.4375 0.03125 Z M 4 8 C 1.792969 8 0 9.792969 0 12 C 0 14.207031 1.792969 16 4 16 C 6.207031 16 8 14.207031 8 12 C 8 9.792969 6.207031 8 4 8 Z M 13 11 C 11.894531 11 11 11.894531 11 13 C 11 14.105469 11.894531 15 13 15 C 14.105469 15 15 14.105469 15 13 C 15 11.894531 14.105469 11 13 11 Z M 32.15625 16.625 C 30.222656 16.769531 28.539063 17.730469 27.34375 19.40625 C 28.097656 20.675781 29.417969 22.226563 31.28125 22.1875 C 31.773438 22.167969 32.1875 22.523438 32.28125 23 C 32.660156 23.589844 34.988281 24.636719 35.65625 24.375 C 35.9375 24.265625 36.238281 24.289063 36.5 24.4375 C 36.761719 24.585938 36.949219 24.828125 37 25.125 C 37.039063 25.289063 37.476563 25.863281 38.375 26.28125 C 39.082031 26.609375 39.769531 26.691406 40.15625 26.5 C 40.40625 26.375 40.679688 26.371094 40.9375 26.46875 C 41.199219 26.566406 41.425781 26.773438 41.53125 27.03125 C 42.207031 28.679688 45.292969 28.800781 47.40625 28.625 C 47.714844 27.285156 47.632813 25.890625 47.15625 24.59375 C 46.496094 22.808594 45.1875 21.398438 43.40625 20.59375 C 43.21875 20.511719 42.613281 20.222656 41.84375 19.875 C 38.28125 18.265625 36.269531 17.390625 35.875 17.28125 C 34.570313 16.765625 33.316406 16.539063 32.15625 16.625 Z M 11.5 18 C 8.46875 18 6 20.46875 6 23.5 C 6 26.53125 8.46875 29 11.5 29 C 14.53125 29 17 26.53125 17 23.5 C 17 20.46875 14.53125 18 11.5 18 Z M 26.28125 21.40625 C 25.96875 22.148438 25.613281 22.84375 25.25 23.5 C 25.679688 24.546875 26.949219 26.972656 29.28125 26.4375 C 29.550781 26.375 29.835938 26.410156 30.0625 26.5625 C 30.292969 26.714844 30.421875 26.949219 30.46875 27.21875 C 30.535156 27.59375 30.976563 28.039063 31.59375 28.375 C 32.46875 28.847656 33.414063 28.953125 33.8125 28.78125 C 34.074219 28.667969 34.367188 28.660156 34.625 28.78125 C 34.882813 28.902344 35.078125 29.132813 35.15625 29.40625 C 35.296875 29.882813 35.789063 30.371094 36.46875 30.71875 C 37.269531 31.125 38.183594 31.273438 38.78125 31.0625 C 39.242188 30.902344 39.734375 31.097656 39.96875 31.53125 C 40.851563 33.167969 43.75 33.34375 46 33.1875 C 46.285156 32.375 46.550781 31.539063 46.8125 30.65625 C 46.542969 30.671875 46.261719 30.6875 45.96875 30.6875 C 43.875 30.6875 41.371094 30.273438 40.125 28.5625 C 39.28125 28.675781 38.3125 28.492188 37.34375 28 C 36.640625 27.640625 35.867188 27.089844 35.40625 26.40625 C 34.132813 26.40625 32.667969 25.699219 31.9375 25.25 C 31.371094 24.902344 30.929688 24.558594 30.65625 24.1875 C 28.671875 24.003906 27.253906 22.710938 26.28125 21.40625 Z M 24 25.46875 C 17.800781 34.082031 7.214844 33.828125 7.09375 33.8125 C 6.699219 33.777344 6.3125 33.988281 6.125 34.34375 C 5.9375 34.699219 5.964844 35.125 6.21875 35.4375 C 8.003906 37.640625 9.921875 39.503906 11.875 41.09375 C 12.796875 41.277344 18.597656 42.097656 24.34375 35.4375 C 24.703125 35.019531 25.332031 34.984375 25.75 35.34375 C 26.167969 35.703125 26.203125 36.332031 25.84375 36.75 C 21.835938 41.394531 17.609375 42.847656 14.65625 43.15625 C 17.125 44.820313 19.613281 46.078125 21.9375 47.03125 C 23.414063 46.722656 28.367188 45.242188 32.75 38.5625 C 33.054688 38.101563 33.695313 37.945313 34.15625 38.25 C 34.617188 38.554688 34.742188 39.195313 34.4375 39.65625 C 31.132813 44.691406 27.515625 47.054688 24.96875 48.15625 C 30.167969 49.839844 34.046875 49.988281 34.375 50 L 34.40625 50 C 34.59375 50 34.777344 49.945313 34.9375 49.84375 C 35.21875 49.667969 41.007813 45.886719 45.25 35.25 C 45.085938 35.253906 44.917969 35.28125 44.75 35.28125 C 42.5625 35.28125 40.035156 34.839844 38.65625 33.125 C 37.6875 33.242188 36.578125 33.019531 35.5625 32.5 C 34.734375 32.074219 34.078125 31.503906 33.65625 30.84375 C 32.59375 30.933594 31.445313 30.550781 30.65625 30.125 C 29.84375 29.683594 29.207031 29.128906 28.84375 28.5 C 26.542969 28.621094 24.945313 27.054688 24 25.46875 Z"></path>
                </svg>
                <span>Drop</span>
            </button>
            {/if}
        </div>
    </div>
    <div class="body">
        <h1>
            <span>
                {data.id ? "Aggiorna" : "Aggiungi"}
                <select name="funzione" bind:value={funzione}>
                    {#each fgs as fg}
                    <option value={fg.id}>{fg.nome}</option>
                    {/each}
                </select>
            </span>
            <span>«<input type="text" 
                name="parola" 
                readonly={parola_automatica} 
                title={parola_automatica ? "La parola viene generata automaticamente" : "Parola"} 
                size={parola.length+1}
                autocomplete="off"
                bind:value={parola}>»</span>
            {#if parola_automatica}
                <span>avente radice <input type="text" name="radice" autocomplete="off" size={radice.length+1} bind:value={radice}></span>
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
            on:parola={e => {parola = e.detail}}
        />
        <section class="two-cols">
            <div class="named-input">
                <span>Traduzione:</span>
                <input type="text" name="traduzione" autocomplete="off" bind:value={traduzione} autocapitalize="off" />
            </div>
            <div class="named-input">
                <span>Ordine:</span>
                <select value={word.ordine} name="ordine">
                    <option value={0}>Unico</option>
                    <option value={1}>1&ordm;</option>
                    <option value={2}>2&ordm;</option>
                    <option value={3}>3&ordm;</option>
                    <option value={4}>4&ordm;</option>
                </select>
            </div>
            <textarea placeholder="Descrizione..." rows="3" name="descrizione" autocomplete="off" value={word.descrizione||''}></textarea>
        </section>
        <hr>
        <h2>Collegamenti</h2>
        <div class="links">
            <h3>Vedi anche</h3>
            <Collegamenti client={data.supabase} name="vedi_anche" data={vedi_anche} />
            <h3>Sinonimi</h3>
            <Collegamenti client={data.supabase} name="sinonimi" data={sinonimi} />
            <h3>Contrari</h3>
            <Collegamenti client={data.supabase} name="sinonimi" data={contrari} />
        </div>
        <hr>
        <h2>Esempi</h2>
        <Esempi data={word.esempi||[]} />
    </div>
    {#if form?.success === false}
    <div class="sticky-middle">
        <div>
            <h2 class="err">Errore</h2>
            <table>
                <tr>
                    <th scope="row">Campo:</th>
                    <td>{form.field}</td>
                </tr>
                <tr>
                    <th scope="row">Atteso:</th>
                    <td>{form.expected}</td>
                </tr>
                {#if form.got}
                <tr>
                    <th scope="row">Ottenuto:</th>
                    <td>{form.got}</td>
                </tr>
                {/if}
            </table>
        </div>
    </div>
    {/if}
</form>

<style>
    :global(body) {
        overflow-y: scroll !important;
        background-color: white !important;
        max-height: 100%;
    }
    h1 {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: .5rem;
    }

    input, select,
    :global(textarea) {
        border: 1px solid #ccc;
        border-radius: .15rem;
        padding: .3rem .6rem;
        font: inherit;
        background-color: white;
    }
    input:focus, select:focus,
    :global(textarea:focus) {
        border-color: var(--olivina);
        outline: none;
    }
    textarea {
        resize: vertical;
    }

    h1 input {
        border: none;
        border-radius: 0;
        border-bottom: 1px dashed #ccc;
    }
    input[name="parola"] {
        text-align: center;
    }
    input[name="parola"]:read-only {
        border-bottom-style: dashed;
        color: #444;
    }
    button, a {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--clr);
        border: 2px solid var(--clr);
        background-color: white;
        border-radius: 5rem;
        padding: .5rem .8rem;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    a {
        text-decoration: none;
    }
    button:hover:not(:disabled),
    a:hover {
        color: white;
        background-color: var(--clr);
    }
    button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
    svg {
        height: 1.3rem;
        width: 1.3rem;
        margin-right: 1ch;
    }
    .named-input {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .two-cols {
        margin-top: 4rem;
        display: grid;
        grid-template-rows: auto auto auto;
        align-items: start;
        column-gap: 3ch;
        row-gap: 1rem;
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
    .links h3 {
        margin-bottom: .5rem;
    }
    @media (max-width: 50rem) {
        form {
            padding-bottom: 20vh;
        }
        h1 select {
            max-width: 100%;
            text-align: center;
        }
        .sticky-middle {
            position: sticky;
            top: 0;
            z-index: 2;
        }
        .buttons {
            display: flex;
            justify-content: center;
            padding: 1rem 0;
            background-color: white;
            column-gap: 1rem;
            border-bottom: 1px solid #ccc;
        }
        .body {
            padding: 1rem;
            z-index: 1;
        }
        .links h3 {
            margin-top: 1.7rem;
        }
    }
    @media (min-width: 50rem) {
        select {
            max-width: 100%;
        }
        form {
            display: grid;
            grid-template-columns: 1fr minmax(40ch, 80ch) 1fr;
            min-height: 100vh;
            column-gap: 1rem;
        }
        .sticky-middle {
            align-self: start;
            position: sticky;
            top: 50%;
        }
        .sticky-middle > div {
            transform: translateY(-50%);
        }
        .buttons {
            display: flex;
            gap: 3rem;
            flex-direction: column;
            align-items: center;
            height: max-content;  
        }
        button, a {
            transform: rotate(45deg);
        }
        .body {
            padding-top: 4rem;
            padding-bottom: 10rem;
            align-self: center;
        }
        .two-cols {
            grid-template-columns: 1fr 1fr;
        }
        .named-input {
            grid-column: 1;
        }
        textarea {
            grid-column: 2;
            grid-row: 1/4;
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
        }
    }
    h2.err {
        color: var(--rosso);
        font-size: 1.2rem;
        margin-bottom: .5rem;
    }
    table {
        margin: 0 auto;
    }
    th {
        text-align: right;
        font-weight: 600;
    }
    td {
        text-align: left;
    }
    th, td {
        padding: .2rem .3ch;
    }
</style>