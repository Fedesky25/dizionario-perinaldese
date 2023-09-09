<script lang="ts">
    import Search from "$lib/Search.svelte";
    import { getSearchAction, Result, type SearchResult } from "$lib/words/search";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "$lib/supabase";
	import { wordLinks } from "./logic";

    export let text: string;
    export let words: {id: number, indice: number, parola: string}[];
    export let client: SupabaseClient<Database>;

    let links = wordLinks(text)
    $: links.merge(text);
    $: links.impose(words);

    let considered = -1;
    let xshift = 0;
    function consider(this: HTMLLabelElement) {
        const i = +(this.dataset.index||0);
        considered = i;
        //@ts-ignore
        xshift = this.offsetParent.offsetLeft + 0.5 * this.clientWidth;
    }

    function followConsidered() {
        const l = document.querySelector(`label[for="add-link"][data-index="${considered}"]`);
        //@ts-ignore
        if(l) xshift = l.offsetParent.offsetLeft + 0.5 * l.clientWidth;
        else considered = -1;
    }

    function onselect(this: Search<SearchResult<true>>, e: CustomEvent<SearchResult<true>>) {
        const d = e.detail;
        links.link(considered, d.id, d.parola);
        this.clear();
        if($links.length === considered+1) {
            considered = -1;
            this.blur();
        }
        else {
            considered++;
            followConsidered();
        }
    }

    function move(e: KeyboardEvent) {
        if(e.key !== "Tab") return;
        if(e.shiftKey) {
            considered--;
            if(considered < 0) return;
            e.preventDefault();
            followConsidered();
        }
        else {
            if(considered === $links.length-1) considered = -1;
            else {
                e.preventDefault();
                considered++;
                followConsidered();
            }
        }
    }

    function tabFromOut(this: HTMLInputElement, e: FocusEvent) {
        if(considered >= 0) return;
        const other = e.relatedTarget;
        if(other instanceof HTMLElement) {
            const res = this.compareDocumentPosition(other);
            switch(res) {
                case Node.DOCUMENT_POSITION_PRECEDING:
                    e.preventDefault();
                    considered = 0;
                    followConsidered();
                    break;
                case Node.DOCUMENT_POSITION_FOLLOWING:
                    e.preventDefault();
                    considered = $links.length-1;
                    followConsidered();
                    break;
                default:
                    console.log("Unknown focus origin");
            }
        }
    }

    let container: HTMLDivElement
    function onClickOut(e: Event) {
        if(e.target instanceof Node && !container.contains(e.target)) considered = -1;
    }
</script>

<svelte:document on:click={onClickOut} on:contextmenu={onClickOut} />

<div bind:this={container}>
    <ul>
        {#each $links as l, index}
        <li class:linked={l.id}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <label class="piece-label" for="add-link" data-index={index} on:click={consider}>{l.piece}</label>
            {#if l.id}
            <span class="linked-word">{l.display}</span>
            <input type="hidden" name="link-id" value={l.id}>
            <input type="hidden" name="link-index" value={index}>
            {/if}
        </li>
        {/each}
    </ul>
    <label for="add-link" class="search" class:show={considered >= 0} style:--x="{xshift}px">
        <Search 
            id="add-link"
            action={getSearchAction(client, true)}
            placeholder="link a {$links[considered]?.piece}"
            on:keydown={move}
            on:select={onselect}
            on:focus={tabFromOut}
            >
                <p slot="empty">Cerca la voce del vocabolario corrispondente a &laquo;{$links[considered]?.piece}&raquo;</p>
                <Result slot="result" let:data {data} />
        </Search>
    </label>
</div>

<style>
    div {
        position: relative;
    }
    ul {
        list-style: none;
        display: flex;
        justify-content: center;
    }
    li {
        margin: .3ch;
        position: relative;
        padding-bottom: .3rem;
        border-bottom: 2px solid #ddd;
    }
    .linked {
        border-color: var(--olivina);
    }
    li label {
        display: block;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: .2rem .4rem;
        border-radius: .3rem;
    }
    li label:hover {
        background-color: #f7f7f7;
    }
    li span {
        --scale: 0;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, .5rem) scale(var(--scale));
        padding: .3rem .6rem;
        background-color: white;
        border-radius: .2rem;
        box-shadow: 0 0 .3rem #3335;
    }
    li:hover span {
        --scale: 1;
    }
    .search {
        --scale: 0;
        position: absolute;
        z-index: 10;
        left: 0;
        top: 100%;
        transform: translate(calc(var(--x) - 50%), 1rem) scale(var(--scale));
        transition: transform 120ms ease;
        padding: .4rem .8rem;
        background-color: white;
        border-radius: .3rem;
        box-shadow: 0 0 1rem #3333;
    }
    .search::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 1px;
        transform: translate(-50%, -100%);
        border: 8px solid transparent;
        border-bottom-color: white;
    }
    .search p {
        width: 25ch;
    }
    .search.show {
        --scale: 1;
    }
</style>