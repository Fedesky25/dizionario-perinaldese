<script lang="ts">
	import { writable } from "svelte/store";
    import { debounceInput, wait } from "$lib/timing";
	import type { SearchResult } from "./types";
    import Loading from "$lib/Loading.svelte";
	import { createEventDispatcher } from "svelte";
    import { handleSpecialChars } from "./utils";

    const dispatch = createEventDispatcher<{
        word: SearchResult;
        none: string;
    }>();

    export let url: string;
    export let placeholder: string|undefined = undefined;
    export let id: string|undefined = undefined;
    export let delay = 500;

    const regexp = /^[\/#\?\.&\s]*([\S\s]*)$/;
    let text = writable("");
    $: query = regexp.exec($text)?.[1] || "";
    let results: SearchResult[] = [];
    let active: number = -1;
    let hidden = true;

    const jsonReq: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: { "Accept": "aaplication/json" }
    }

    function emit(index: number) {
        active = -1;
        hidden = true;
        dispatch("word", results[index]);
    }

    async function retrieve(query: string): Promise<SearchResult[]> {
        hidden = false;
        active = -1;
        try {
            const res = await fetch(encodeURI(url+query), jsonReq);
            return results = await res.json();
        } catch(err) {
            console.log(err);
            return results = [];
        }
    }

    function handleArrows(this: HTMLInputElement, e: KeyboardEvent) {
        switch(e.key) {
            case "Enter":
                e.preventDefault();
                if(active === -1) dispatch("none", this.value);
                else emit(active);
                break;
            case "ArrowDown":
                e.preventDefault();
                if(active === results.length-1) active = -1;
                else active++;
                break;
            case "ArrowUp":
                e.preventDefault();
                if(active === -1) active = results.length-1;
                else active--;
                break;
        }
    }

    function select(this: HTMLButtonElement) {
        const raw = this.dataset.index;
        if(raw) {
            const index = +raw;
            if(Number.isInteger(index) && index >= 0 && index < results.length) {
                emit(raw ? +raw : 0);
            }
        }
    }
</script>

<div class="wrapper">
    <input type="search" {id} {placeholder}
        autocapitalize="off"
        on:focus={() => {hidden = false;}}
        on:keydown={handleSpecialChars} 
        on:keydown={handleArrows} 
        use:debounceInput={{ delay, store: text }}>
    <div class="box" aria-hidden={hidden}>
        {#if query.length === 0}
            <div class="padded">
                <p class="no-sel">Mentre scrivi in italiano o in perinaldese compariranno i risultati; con 1 o 2 lettere vedrai solo le parole che combaciano esattamente.</p>
                <slot name="empty" />
            </div>
        {:else}
            {#await retrieve(query)}
                <Loading />
            {:then results} 
                {#if results.length === 0}
                <p class="padded">Nessun risultato</p>
                {:else}
                <ul>
                    {#each results as word, i}
                        <li>
                            <button 
                                tabindex={-hidden} 
                                type="button"
                                class="padded" 
                                class:active={i === active} 
                                data-index={i} 
                                on:click={select}>
                                <span class="lex">{word.parola}</span>
                                <span class="fgs">{word.funzione}</span>
                                <span class="tra">{word.traduzione}</span>
                            </button>
                        </li>
                    {/each}
                </ul>
                {/if}
            {/await}
        {/if}
    </div>
</div>

<style>
    .wrapper {
        position: relative;
        width: var(--search-width, 100%);
    }
    input {
        width: 100%;
        border: none;
        font-family: inherit;
        font-weight: inherit;
        font-size: var(--search-fs, 1em);
        background-color: transparent;
    }
    input:focus {
        outline: none;
    }

    .box {
        z-index: 1;
        position: absolute;
        min-width: 25ch;
        width: max-content;
        max-width: min(90vw, 45ch);
        top: calc(100% + var(--search-space-below, 1rem));
        left: 50%;
        opacity: 0;
        transform-origin: top center;
        box-shadow: 0 0 35px 0 rgba(0, 0, 0, .13);
        background-color: #fffffff3;
        border-radius: 15px;
        color: #111;
        font-weight: 500;
        padding: .6rem;

        transition: transform .15s ease-out, opacity .15s ease-out;
        transform: translateX(-50%) scale(1);
        opacity: 1;
    }
    /* input:focus ~ .box {
        transition: transform .15s ease-out, opacity .15s ease-out;
        transform: translateX(-50%) scale(1);
        opacity: 1;
    } */
    .wrapper:not(:focus-within) .box,
    .box[aria-hidden="true"] {
        transition: transform .1s ease-in, opacity .1s ease-in;
        transform: translateX(-50%) scale(0.6);
        opacity: 0;
        pointer-events: none;
    }

    .padded {
        padding: .4rem 1rem;
    }
    ul {
        list-style: none;
    }
    li + li {
        margin-top: .8rem;
        position: relative;
    }
    li + li::after {
        content: '';
        position: absolute;
        top: -.4rem;
        left: 50%;
        background-color: #BB5E64;
        height: 2.4px;
        width: 85%;
        border-radius: 10px;
        transform: translate(-50%, -50%);
    }

    button {
        cursor: pointer;
        display: grid;
        grid-template-columns: auto auto;
        transition: background-color .1s ease;
        border-radius: .5rem;
        column-gap: 3ch;

        font-size: inherit;
        background: none;
        width: 100%;
        border: 0;
    }
    button.active,
    button:hover,
    button:focus {
        background-color: #f9f9f9;
    }

    .lex {
        font-weight: 700;
        grid-row: 1;
        grid-column: 1;
        justify-self: start;
    }
    .fgs {
        color: lightslategray;
        grid-row: 1;
        grid-column: 2;
        justify-self: end;
    }
    .tra {
        grid-row: 2;
        grid-column: 1/3;
        justify-self: start;
    }
    .tra::before {
        content: ">> ";
        color: #ccc;
    }
</style>