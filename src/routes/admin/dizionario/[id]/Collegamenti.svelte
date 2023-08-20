<script lang="ts">
	import Search from "$lib/words/Search.svelte";
	import type { SearchResult } from "$lib/words/types";
    import { scale } from "svelte/transition";

    export let name: string;
    export let data: {id: number, parola: string}[];

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
        <Search url="/admin/dizionario?opzione=cerca&parametro=" placeholder="Aggiungi" on:word={addWord} />
    </div>
    {#each data as item, i (item.id)}
        <input type="hidden" {name} value={item.id}>
        <div class="box item" transition:scale>
            <span>{item.parola}</span>
            <button data-index="{i}" on:click={remove} type="button">
                <img src="/icons/cross.svg" alt="Rimouvi {item.parola}" />
            </button>
        </div>
    {/each}
</div>

<style>
    .wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 2ch;
    }
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
    .item {
        display: flex;
        align-items: center;
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
</style>
