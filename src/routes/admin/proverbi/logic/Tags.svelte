<script lang="ts">
    import Search from "$lib/Search.svelte";
	import type { Database } from "$lib/supabase";
	import type { SupabaseClient } from "@supabase/supabase-js";
    import { scale } from "svelte/transition";
	import type { Tag } from "./index";

    export let client: SupabaseClient<Database>;
    export let tags: Tag[];

    function removeTag(this: HTMLButtonElement) {
        const i = +(this.dataset.index||0);
        tags.splice(i,1);
        tags = tags;
    }
</script>

<div>
    <label for="add-tag" class="pillow" style:--clr="var(--olivina)">
        <Search 
            id="add-tag"
            placeholder="Aggiungi..." 
            action={async (text) => {
                const res = await client.from("tags").select("id, nome").like("nome", text+"%");
                return res.data || [];
            }}
            on:select={function (e) {
                tags.push(e.detail);
                tags = tags;
                //@ts-ignore
                this.clear();
            }}
            >
            <p slot="empty">Mentre scrivi compariranno le etichette che cominciano con ciò che scrivi.</p>
            <span slot="result" let:data>{data.nome}</span>
        </Search>
    </label>
    <ul>
        {#each tags as t, i (t.id)}
            <li class="pillow" transition:scale={{duration: 250, start: .3}}>
                <input type="hidden" name="tag" value={t.id}>
                <span>{t.nome}</span>
                <button type="button" data-index={i} on:click={removeTag}>
                    <img src="/icons/cross.svg" alt="rimuovi">
                </button>
            </li>
        {/each}
    </ul>
</div>

<style>
    div {
        display: flex;
        justify-content: center;
        column-gap: 1ch;
        --search-width: 15ch;
    }
    p {
        width: 32ch;
    }
    ul {
        list-style: none;
        display: flex;
        column-gap: 1ch;
    }
    li {
        display: flex;
        align-items: center;
    }
    .pillow {
        padding: .3rem .7rem;
        border: 1px solid var(--clr, #ccc);
        border-radius: 5rem;
    }
    button {
        padding: .1rem;
        border: none;
        background: transparent;
        cursor: pointer;
        margin-left: 1ch;
    }
    img {
        width: 1rem;
        height: 1rem;
        display: block;
    }
</style>