<script lang="ts">
	import type { PageData } from "./$types";
    import Editor from "$lib/words/editor/Editor.svelte"
    import { type ClientFormHandlerCallback } from "$lib/form-utils";
    import { getDataFromForm, createWord, updateCollegamenti } from "$lib/words/editor/logic";
	import { emptyWord } from "$lib/words/utils";

    export let data: PageData;
    let word = emptyWord(1);

    const handler: ClientFormHandlerCallback<null> = async ({formData}) => {
        const body = getDataFromForm(formData, data.funzioni.map(v => v.id)); 
        const id = await createWord(body, data.supabase);
        await updateCollegamenti(id, formData, data.supabase);
        word = emptyWord(1);
    }
</script>

<Editor client={data.supabase} fgs={data.funzioni} id={null} {word} {handler} />