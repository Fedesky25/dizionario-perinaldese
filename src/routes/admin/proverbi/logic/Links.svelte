<script lang="ts">
    import Search from "$lib/Search.svelte";
    import { getSearchAction, Result } from "$lib/words/search";
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
</script>

<div>
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
    <label for="add-link" class="search" class:show={considered !== -1} style:--x="{xshift}px">
        <Search 
            id="add-link"
            autoclear 
            action={getSearchAction(client, true)}
            placeholder="link a {$links[considered]?.piece}"
            on:select={e => {
                const d = e.detail;
                links.link(considered, d.id, d.parola);
                considered = -1;
            }}>
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
        left: var(--x);
        top: 100%;
        transform: translate(-50%, .5rem) scale(var(--scale));
        padding: .4rem .8rem;
        background-color: white;
        border-radius: .3rem;
        box-shadow: 0 0 .7rem #3335;
    }
    .search p {
        width: 25ch;
    }
    .search.show:focus-within {
        --scale: 1;
    }
</style>