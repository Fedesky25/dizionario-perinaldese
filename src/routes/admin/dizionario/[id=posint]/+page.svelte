<script lang="ts">
	import type { PageData } from "./$types";
    import Editor from "$lib/words/editor/Editor.svelte"
    import { type ClientFormHandlerCallback } from "$lib/form-utils";
    import { getDataFromForm, updateWord, updateCollegamenti } from "$lib/words/editor/logic";
	import { goto } from "$app/navigation";

    export let data: PageData;

    const handler: ClientFormHandlerCallback<null> = async ({formData}) => {
        const body = getDataFromForm(formData, data.funzioni.map(v => v.id)); 
        await updateWord(data.id, body, data.supabase);
        await updateCollegamenti(data.id, formData, data.supabase);
        goto("/admin/dizionario");
    }
</script>

<Editor client={data.supabase} fgs={data.funzioni} id={data.id} word={data.parola} {handler} />