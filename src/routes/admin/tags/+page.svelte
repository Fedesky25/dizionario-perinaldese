<script lang="ts">
    import Modal from "$lib/modal/Hashed.svelte";
    import Collapsible from "$lib/Collapsible.svelte";
	import type { PageData } from "./$types";
	import { clientFormHandler, getInt, getMandatoryString } from "$lib/form-utils";
	import { enhance } from "$app/forms";
	import Loading from "$lib/Loading.svelte";

    export let data: PageData;

    const create = clientFormHandler(null, async ({formData, element}) => {
        const nome = getMandatoryString(formData, "nome");
        const res = await data.supabase.from("tags").insert({nome}).select("id");
        if(res.error) throw res.error.details;
        data.tags.splice(0, 0, {id: res.data[0].id, nome, parole: [], proverbi: []});
        data.tags = data.tags;
        element.reset();
    });

    const update = clientFormHandler(
        ({ element }) => +(element.dataset.index||0),
        async ({formData, who}) => {
            const id = getInt(formData, "id");
            const nome = getMandatoryString(formData, "nome");
            const res = await data.supabase.from("tags").update({nome}).eq("id", id);
            if(res.error) throw res.error.details;
            data.tags[who]
        },
    );
</script>

<div class="padded">
    <h1>Etichette</h1>
    <form action="?/create" method="post" use:enhance={create.submit} style="width: fit-content;">
        <input type="text" name="nome" disabled={$create.submitting} placeholder="Aggiungi" class="add" class:low={$create.submitting}>
        {#if $create.submitting}
        <div class="overlay">
            <Loading />
        </div>
        {/if}
    </form>
</div>
<div class="grid padded">
    {#each data.tags as tag, index (tag.id)}
        <div class="align-center">
            <a class="remove" href="#rimuovi/{index}" data-sveltekit-reload>
                <img src="/icons/cross.svg" alt="Rimuovi">
            </a>
            <form action="?/rename" method="post" data-index={index} use:enhance={update.submit}>
                <input type="hidden" name="id" value={tag.id} readonly>
                <input type="text" name="nome" value={tag.nome} readonly={$update.submitting} class="nome" class:low={$update.who === index}> 
                {#if $update.who === index}
                <div class="overlay">
                    <Loading />
                </div>
                {/if}
            </form>
        </div>    
        <Collapsible title="{tag.parole.length} parole">
            <ul class="flex">
                {#each tag.parole as parola}
                    <li>
                        <a href="/?parola={parola.id}" target="_blank">{parola.parola}</a>
                    </li>
                {/each}
            </ul>
        </Collapsible>
        <Collapsible title="{tag.proverbi.length} proverbi">
            <ul>
                {#each tag.proverbi as proverbio}
                    <li>
                        <a href="/?parola={proverbio.id}" target="_blank">{proverbio.originale}</a>
                    </li>
                {/each}
            </ul>
        </Collapsible>
        <hr>
    {/each}
</div>

<Modal
    action="?/remove" 
    hashRegExp={/#rimuovi\/(\d+)/}
    parse={arr => {
        const index = +arr[1];
        const tag = data.tags[index];
        return tag ? { id: tag.id, nome: tag.nome, index } : null;
    }}
    execute={async (tag) => {
        const res = await data.supabase.from("tags").delete().eq("id",tag.id);
        if(res.error) throw res.error.details;
        data.tags.splice(tag.index,1);
        data.tags = data.tags;
    }}
    let:titleID
    let:descID
    let:data={tag}
> 
    <h2 id={titleID}>Rimozione «{tag.nome}»</h2>
    <p id={descID}>Sei sicuro di voler rimuovere l'etichetta «{tag.nome}»?<br>L'operazione non potrà essere annullata.</p>
    <input type="hidden" name="id" value={tag.id}>
</Modal>


<style>
    .padded {
        padding: 1rem;
    }
    .add {
        padding: .2rem .4rem;
    }
    .grid {
        display: grid;
        grid-template-columns: auto 1fr 1fr;
        align-items: start;
        column-gap: 2rem;
        row-gap: 1rem;
        overflow-x: auto;
    }
    .align-center {
        display: flex;
        align-items: center;
        flex-direction: row;
        column-gap: 1ch;
    }
    .nome {
        border: 0;
        border-bottom: 1px solid #bbb;
        font-size: inherit;
        padding: .2rem .5rem;
    }
    .nome:focus {
        border-color: var(--olivina);
        outline: none;
    }
    input.low {
        opacity: 0.3;
    }
    hr {
        grid-column: 1/5;
        border: 0;
        height: 0;
        border-bottom: 1px solid #ccc;
    }
    .flex {
        list-style: none;
        display: flex;
        flex-direction: column;
    }
    .flex > li {
        background-color: #fafafa;
        padding: .3rem .6rem;
        border-radius: .2rem;
    }
    .remove {
        padding: .2rem;
        border-radius: .1rem;
    }
    .remove img {
        width: 1rem;
        height: 1rem;
        display: block;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    a:hover {
        text-decoration: underline dashed var(--olivina);
    }
    form {
        position: relative;
    }
    .overlay {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        width: 100%;
        transform: translateY(-50%);
        padding: 0 1ch;
    }
</style>

