<script lang="ts">
	import type { PageData } from "./$types";
    import Editor from "$lib/words/editor/Editor.svelte"

    export let data: PageData;
</script>

<Editor client={data.supabase} fgs={data.funzioni} id={data.id} word={data.parola} />