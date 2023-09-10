<script lang="ts">
	import Dashboard from "$lib/Dashboard.svelte";
	import Loading from "$lib/Loading.svelte";
    import Modal from "$lib/modal/Hashed.svelte";
	import type { PageData } from "./$types";

    export let data: PageData;
    let can_extend = data.proverbi.length === 50;
    let extending = false;
    let error = '';

    function setError(msg: string) {
        can_extend = false;
        error = msg;
        data.proverbi = [];
    }

    async function extend() {
        if(!can_extend) return;
        const len = data.proverbi.length;
        const res = await data.supabase.from("proverbi")
            .select("id, originale, letterale")
            .order("creazione", {ascending: false})
            .range(len, len+49);
        if(res.error) setError(res.error.details);
        else {
            data.proverbi = data.proverbi.concat(res.data);
            can_extend = res.data.length === 50;
        }
    }

</script>

<Dashboard title="Proverbi">
    <div slot="text">
        <p>Clicca su una voce a fianco per modificare il proverbio o effettua una ricerca tra proverbi selezionando delle etichette.</p>
    </div>
    <a slot="interaction" href="/admin/proverbi/crea" class="btn">Aggiungi proverbio</a>
    <svelte:fragment slot="data">
        <ul>
            {#each data.proverbi as p, i}
                <li>
                    <a href="/admin/proverbi/{p.id}" class="originale">
                        <span>{p.originale}</span>
                        <br>
                        <span class="obl">{p.letterale}</span>
                    </a>
                    <a href="#rimuovi/{i}" class="delete" data-sveltekit-reload>
                        <img src="/icons/cross.svg" alt="Rimuovi">
                    </a>
                </li>
            {/each}
        </ul>
        {#if error}
            <p class="err">{error}</p>
        {:else if extending}
            <Loading />
        {:else if can_extend}
            <button type="button" class="btn" on:click={extend}>Carica altri</button>
        {/if}
    </svelte:fragment>
</Dashboard>

<Modal
    action="?/rimuovi"
    hashRegExp={/#rimuovi\/(\d+)/}
    parse={arr => {
        const index = +arr[1];
        const p = data.proverbi[index];
        return p ? { testo: p.originale, id: p.id, index } : null
    }}
    execute={async (p) => {
        const res = await data.supabase.from("proverbi").delete().eq("id", p.id);
        if(res.error) throw res.error.details;
        data.proverbi.splice(p.index, 1);
        data.proverbi = data.proverbi;
    }}
    let:titleID let:descID let:data
>
    <h2 id={titleID}>Rimozione proverbio</h2>
    <p id={descID}>Sei sicuro di vole rimuover il proverbio &laquo;{data.testo}&raquo;? L'operazione non potrà essere annullata.</p>
    <input type="hidden" name="id" value={data.id}>
</Modal>

<style>
    :root {
        --modal-width: 45ch;
    }
    .btn {
        padding: .5rem 1rem;
        border-radius: .2rem;
        font-weight: 500;
        border: none;
        background-color: var(--olivina);
        font-size: 1rem;
        color: white;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
    }
    li {
        display: flex;
        align-items: center;
        padding: .3rem .55rem;
        border-radius: .3rem;
    }
    li:hover {
        background-color: #f7f7f7;
    }
    li + li {
        margin-top: .2rem;
    }
    .originale {
        flex-grow: 1;
        text-decoration: none;
        color: inherit;
    }
    .obl {
        font-style: italic;
        color: #777;
    }
    img {
        height: 1rem;
        width: 1rem;
        display: block;
    }
    .delete {
        margin-left: 2ch;
    }
    @media (min-width: 50rem) {
        .delete {
            transform: scale(0);
            transition: transform 50ms ease;
        }
        li:hover .delete {
            transform: scale(1);
        }
        ul {
            padding-right: 1ch;
        }
    }
</style>