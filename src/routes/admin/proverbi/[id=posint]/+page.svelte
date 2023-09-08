<script lang="ts">
	import type { PageData } from "./$types";
	import { Editor, getProverbio, updateTags, updateLinks } from "../logic";
	import { InvalidField, PostgrestErrorWrapper, clientFormHandler } from "$lib/form-utils";
	import Popup from "$lib/modal/Popup.svelte";
	import { goto } from "$app/navigation";

    export let data: PageData;

    $: old_tags = data.proverbio.tags ? data.proverbio.tags.map(t => t.id) : [];

    const handler = clientFormHandler(null, async ({ formData }) => {
        const proverbio = getProverbio(formData);
        const res = await data.supabase.from("proverbi").update(proverbio).eq("id", data.id);
        if(res.error) throw new PostgrestErrorWrapper(res.error);
        await updateTags(data.id, formData, old_tags, data.supabase);
        await updateLinks(data.id, formData, data.supabase);
        goto("/admin/proverbi");
    });
</script>

<Editor 
    id={data.id}
    client={data.supabase} 
    data={data.proverbio}
    submit={handler.submit}  />

<Popup show={!!$handler.error} let:titleID let:descID>
    <h2 id={titleID}>Errore</h2>
    {#if $handler.error}
        {#if $handler.error instanceof InvalidField}
        <p id={descID}>Il valore di un campo non è valido</p>
        <table>
            <tr>
                <th scope="row">campo:</th>
                <td>{$handler.error.field}</td>
            </tr>
            <tr>
                <th scope="row">atteso:</th>
                <td>{$handler.error.expected}</td>
            </tr>
            {#if $handler.error.got}
            <tr>
                <th scope="row">ottenuto:</th>
                <td>{$handler.error.got}</td>
            </tr>
            {/if}
        </table>
        {:else if $handler.error instanceof PostgrestErrorWrapper}
        <p id={descID}>Questo è un errore interno, probabilmente dovuto a qualche errore introdotto da Federico. Qui sotto i dettagli:</p>
        <table>
            <tr>
                <th scope="row">message</th>
                <td>{$handler.error.message}</td>
            </tr>
            <tr>
                <th scope="row">details</th>
                <td>{$handler.error.details}</td>
            </tr>
            <tr>
                <th scope="row">hint</th>
                <td>{$handler.error.hint}</td>
            </tr>
        </table>
        {:else}
        <p>{$handler.error}</p>
        {/if}
    {/if}
</Popup>
