<script lang="ts" generics="T">
	import { createEventDispatcher } from "svelte";
    import { dndzone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";

    const dispatch = createEventDispatcher<{
        single: {
            extra: T, 
            id: number,
            traduzione: string
        }
    }>();

    export let extra: T;
    export let items: {id: number, traduzione: string}[];
    export let onremove: (id: number, traduzione: string) => Promise<boolean>;

    const flipDurationMs = 300;
    const type = crypto.randomUUID();

    async function remove(this: HTMLButtonElement) {
        const index = +(this.dataset.index||0);
        const ok = await onremove(items[index].id, items[index].traduzione);
        if(!ok) return;
        items.splice(index, 1);
        items = items;
    }

    function onsingle() {
        dispatch("single", {
            extra, 
            id: items[0].id,
            traduzione: items[0].traduzione
        });
    }
    $: if(items.length === 1) onsingle();
</script>

<ol 
use:dndzone={{items, flipDurationMs, type}} 
on:consider={e => {items = e.detail.items}}
on:finalize={e => {items = e.detail.items}}
>
{#each items as s,i (s.id)}
    <li animate:flip={{duration: flipDurationMs}}>
        <input type="hidden" name="id" value={s.id}>
        <a href="/?parola={s.id}" target="_blank">{s.traduzione}</a>
        <button type="button" data-index={i} on:click={remove}>
            <img src="/icons/delete.svg" alt="rimuovi">
        </button>
    </li>
{/each}
</ol>

<style>
    ol {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .3rem;
    }
    li {
        border-radius: .25rem;
        padding: .3rem;
        background-color: rgba(32,32,32,0.025);
        display: flex;
        justify-content: space-between;
    }
    a {
        text-decoration: none;
        margin-left: .3rem;
        color: currentColor;
        text-decoration: underline dashed var(--olivina);
    }
    button {
        border-radius: .1rem;
        padding: .15rem;
        cursor: pointer;
        margin-left: 2ch;
        border: none;
        background-color: transparent;
        padding-top: .2rem;
    }
    button:hover {
        background-color: rgba(32,32,32,0.15);
    }
    img {
        display: block;
        height: 1rem;
        width: 1rem;
    }
</style>