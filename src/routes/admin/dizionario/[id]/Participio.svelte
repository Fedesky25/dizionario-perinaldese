<script lang="ts">
	import InputConRadice from "$lib/words/InputConRadice.svelte";
	import { participi_default } from "$lib/words/coniugazione";
	import type { StrictDeclinazione } from "$lib/words/types";

    export let single: boolean;
    export let radice: string;
    export let numero: number;
    export let data: StrictDeclinazione|null;

    $: default_values = participi_default[numero];
    
    let ms: string, mp: string, fs: string, fp: string;
    $: if(data) {
        ms = data.ms;
        mp = data.mp;
        fs = data.fs;
        fp = data.fp;
    } else set_defaults();
    
    function set_defaults() {
        ms = default_values[0];
        mp = default_values[1];
        fs = default_values[2];
        fp = default_values[3];
    }

    $: in_default = ms === default_values[0] && (
        single || (
            mp === default_values[1] && fs === default_values[2] && fp === default_values[3]
        )
    );

    function handleDefault(e: KeyboardEvent) {
        if(!e.altKey || !e.ctrlKey || e.key !== 'p') return;
        e.preventDefault();
        set_defaults();
    }
</script>

<svelte:body on:keyup={handleDefault} />

{#if single}
    <div class="oneline">
        <h3>Participio passato</h3>
        <InputConRadice name="coniugazione.participio.ms" bind:value={ms} {radice} />
    </div>
    <input type="hidden" name="coniugazione.participio.mp" value="NULL">
    <input type="hidden" name="coniugazione.participio.fs" value="NULL">
    <input type="hidden" name="coniugazione.participio.fp" value="NULL">
{:else}
    <h3>Participio passato</h3>
    <div class="grid">
        <label for="part-pass-ms">masch sing</label>
        <InputConRadice {radice} name="coniugazione.participio.ms" bind:value={ms} id="part-pass-ms"/>
        <label for="part-pass-mp">masch plur</label>
        <InputConRadice {radice} name="coniugazione.participio.mp" bind:value={mp} id="part-pass-mp"/>
        <label for="part-pass-fs">femm sing</label>
        <InputConRadice {radice} name="coniugazione.participio.fs" bind:value={fs} id="part-pass-fs"/>
        <label for="part-pass-fp">femm plur</label>
        <InputConRadice {radice} name="coniugazione.participio.fp" bind:value={fp} id="part-pass-fp"/>
    </div>
{/if}
<input type="hidden" disabled={!in_default} name="coniugazione.participio" value="NULL">

<style>

</style>