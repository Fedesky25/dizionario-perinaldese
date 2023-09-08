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
            .select("id, originale")
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
    <div slot="interaction">

    </div>
    <svelte:fragment slot="data">
        <ul>
            {#each data.proverbi as p, i}
                <li>
                    <a href="/admin/proverbi/{p.id}" class="originale">{p.originale}</a>
                    <a href="#rimuovi/{i}" class="delete" data-sveltekit-reload>
                        <img src="/icons/delete.svg" alt="Rimuovi">
                    </a>
                </li>
            {/each}
        </ul>
        {#if error}
            <p class="err">{error}</p>
        {:else if extending}
            <Loading />
        {:else if can_extend}
            <button type="button" on:click={extend}>Carica altri</button>
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

</style>