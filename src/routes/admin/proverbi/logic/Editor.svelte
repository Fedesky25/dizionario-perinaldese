<script lang="ts">
    import Tags from "./Tags.svelte";
    import Links from "./Links.svelte";
    import Commenti from "./Commenti.svelte";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "$lib/supabase";
	import { enhance } from "$app/forms";
	import type { Proverbio } from "./index";
	import EditorButtons from "$lib/EditorButtons.svelte";
    import { handleSpecialChars } from "$lib/words/utils";
	import type { SubmitFunction } from "@sveltejs/kit";

    export let id: number|null;
    export let submit: SubmitFunction;
    export let client: SupabaseClient<Database>;
    export let data: Proverbio;

    let originale: string;
    let letterale: string;
    $: destructure(data);
    function destructure(d: Proverbio) {
        originale = d.originale;
        letterale = d.letterale;
    }
    
    $: valid = data.originale.length > 0 && data.letterale.length > 0;
</script>

<svelte:head>
    <title>{id ? "Modifica" : "Aggiungi"} proverbio perinaldese</title>
</svelte:head>

<form method="post" action="/admin/proverbi?/upsert" use:enhance={submit}>
    {#if id}
        <input type="hidden" name="id" value={id}>
    {/if}
    <div class="btns">
        <div class="sticky">
            <EditorButtons goto={id ? "proverbi" : null} {valid} />
        </div>
    </div>
    <div class="body">
        <h1>{id ? "Modifica" : "Aggiungi"} proverbio</h1>
        <section>
            <h2>Testo</h2>
            <div class="three">
                <span>Originale</span>
                <textarea name="originale" rows="2" bind:value={originale} on:keydown={handleSpecialChars}></textarea>
                <span>Letterale</span>
                <textarea name="letterale" rows="2" bind:value={letterale} on:keydown={handleSpecialChars}></textarea>
                <span>Significato</span>
                <textarea name="significato" rows="2" value={data.significato||''} on:keydown={handleSpecialChars}></textarea>
            </div>
        </section>
        <section>
            <h2>Link a parole</h2>
            <Links {client} text={originale} words={data.parole||[]} />
        </section>
        <section>
            <h2>Etichette</h2>
            <Tags {client} tags={data.tags||[]} />
        </section>
        <section>
            <h2>Commenti</h2>
            <Commenti testo={data.commenti_testo||[]} inizio={data.commenti_inizio||[]} fine={data.commenti_fine||[]} text={originale} />
        </section>
    </div>
</form>

<style>
    form {
        padding: 1rem;
        margin-top: 2rem;
    }
    .body {
        margin-bottom: 40vh;
    }
    .sticky {
        position: sticky;
        top: 0;
        margin-bottom: 1px solid #ccc;
        background-color: white;
        box-shadow: 0 1rem 1rem -1rem rgba(0,0,0,0.15);
    }
    section {
        margin-top: 6rem;
    }
    h2 {
        margin-bottom: 1rem;
    }

    .three {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: 1ch;
    }
    textarea {
        resize: vertical;
        border: 1px solid #ccc;
        border-radius: .2rem;
        padding: .4rem .5rem;
        width: 100%;
        min-height: 3rem;
    }
    textarea:focus {
        border-color: var(--olivina);
        /* box-shadow: 0 0 2px var(--olivina); */
        outline: none;
    }
    @media (min-width: 50rem) {
        h1, h2 {
            text-align: center;
        }
        .three {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: auto auto;
            grid-auto-flow: column;
            gap: 1ch 3ch;
            justify-items: center;
        }
        form {
            margin-top: 8rem;
            display: grid;
            grid-template-columns: 1fr minmax(50rem, 120ch) 1fr;
            column-gap: 4rem;
        }
        .btns {
            justify-self: end;
        }
        .sticky {
            top: 50%;
            transform: translateY(-50%);
            box-shadow: none;
            --editor-buttons-direction: column;
            --editor-buttons-gap: 3rem;
            --editor-button-rotate: -45deg;
        }
    }
</style>
