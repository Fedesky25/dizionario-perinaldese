<script lang="ts" generics="T">
	import { writable } from "svelte/store";
    import { debounceInput } from "$lib/timing";
    import Loading from "$lib/Loading.svelte";
	import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{
        select: T;
        none: string;
    }>();

    export let placeholder: string|undefined = undefined;
    export let id: string|undefined = undefined;
    export let delay = 500;
    export let action: (text: string) => Promise<T[]>;

    const regexp = /^[\/#\?\.&\s]*([\S\s]*)$/;
    let text = writable("");
    let results: T[] = [];
    let active: number = -1;
    let hidden = true;
    let loading = false;
    let error = false;
    let firstTime = true;
    let input: HTMLInputElement;

    export function clear() { $text = ''; }
    export function blur() { input.blur(); }

    function emit(index: number) {
        active = -1;
        hidden = true;
        dispatch("select", results[index]);
    }

    $: query = regexp.exec($text)?.[1] || "";
    $: retrieve(query);
    
    async function retrieve(query: string) {
        if(firstTime) return void (firstTime = false);
        hidden = false;
        active = -1;
        loading = true;
        try {
            results = await action(query);
            error = false;
        } catch(err) {
            console.dir(err);
            error = true;
            results = [];
        }
        loading = false;
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
    <input type="text" {id} {placeholder}
        autocapitalize="off"
        bind:this={input} 
        on:focus={() => {hidden = false;}}
        on:keydown={handleArrows} 
        on:keydown
        on:focus
        on:blur
        use:debounceInput={{ delay, store: text }}>
    <div class="box" aria-hidden={hidden}>
        {#if query.length === 0}
            <div class="padded">
                <slot name="empty" />
            </div>
        {:else if loading}
            <Loading />
        {:else if error}
            <p class="padded">Errore interno: riprovare più tardi</p>
        {:else if results.length === 0}
            <p class="padded">Nessun risultato</p>
        {:else}
            <ul>
                {#each results as data, i}
                    <li>
                        <button 
                            tabindex={-hidden} 
                            type="button"
                            class="padded" 
                            class:active={i === active} 
                            data-index={i} 
                            on:click={select}>
                                <slot name="result" {data} />
                        </button>
                    </li>
                {/each}
            </ul>
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
        z-index: 10;
        position: absolute;
        min-width: var(--search-results-min-width, 25ch);
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
        transition: background-color .1s ease;
        border-radius: .5rem;

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
</style>