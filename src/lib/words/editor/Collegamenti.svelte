<script lang="ts">
	import Search from "$lib/words/Search.svelte";
	import type { SearchResult } from "$lib/words/types";
	import { getSearchFilter } from "$lib/words/utils";
	import type { SupabaseClient } from "@supabase/supabase-js";
    import { scale } from "svelte/transition";

    export let name: string;
    export let data: {id: number, parola: string}[];
    export let client: SupabaseClient;

    function addWord(e: CustomEvent<SearchResult>) {
        //@ts-ignore
        data.push(e.detail);
        data = data;
    }
    function remove(this: HTMLButtonElement) {
        const index = +this.dataset.index!;
        data.splice(index, 1);
        data = data;
    }
</script>

<div class="wrapper">
    <div class="cerca box">
        <Search action={async (text) => {
            const res = await client.rpc("ricerca_singola", getSearchFilter(text));
            return res.error ? [] : res.data;
        }} placeholder="Aggiungi" on:word={addWord} />
    </div>
    <ul>
        {#each data as item, i (item.id)}
        <input type="hidden" {name} value={item.id}>
        <li class="box" transition:scale={{duration: 250}}>
            <span>{item.parola}</span>
            <button data-index="{i}" on:click={remove} type="button">
                <img src="/icons/cross.svg" alt="Rimouvi {item.parola}" />
            </button>
        </li>
        {/each}
    </ul>
</div>

<style>
    input {
        position: absolute;
        transform: scale(0);
        opacity: 0;
        pointer-events: none;
    }
    .box {
        border: 2px solid var(--olivina);
        border-radius: 5rem;
        padding: .4rem .8rem;
    }
    img {
        height: 1rem;
        width: 1rem;
        display: block;
    }
    button {
        display: block;
        background-color: transparent;
        padding: .2rem;
        border-radius: .2rem;
        border: none;
        margin-left: 1ch;
        cursor: pointer;
    }
    button:hover {
        background-color: #eee;
    }
    ul {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        margin-top: 1ch;
    }
    li {
        display: flex;
        align-items: center;
        border-color: #bbb !important;
        margin: .5ch;
    }
</style>
