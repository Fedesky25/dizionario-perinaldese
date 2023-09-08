<script lang="ts">
	import type { PageData } from "./$types";
	import { emptyProverbio, Editor, getProverbio, updateTags, updateLinks } from "../logic";
	import { InvalidField, PostgrestErrorWrapper, clientFormHandler, getDataOrThrow } from "$lib/form-utils";
	import Popup from "$lib/modal/Popup.svelte";

    export let data: PageData;

    let editor_data = emptyProverbio();

    const handler = clientFormHandler(null, async ({ formData, element }) => {
        const proverbio = getProverbio(formData);
        const id = getDataOrThrow(await data.supabase.from("proverbi").insert(proverbio).select("id"))[0].id;
        await updateTags(id, formData, [], data.supabase);
        await updateLinks(id, formData, data.supabase);
        editor_data = emptyProverbio();
    });
</script>

<Editor 
    id={null}
    client={data.supabase} 
    data={editor_data}
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
