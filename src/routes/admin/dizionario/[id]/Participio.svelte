<script lang="ts">
	import InputConRadice from "$lib/words/InputConRadice.svelte";
	import { participi_default } from "$lib/words/coniugazione";
	import type { StrictDeclinazione } from "$lib/words/types";
	import { eq } from "$lib/words/utils";

    export let single: boolean;
    export let radice: string;
    export let numero: number;
    export let data: StrictDeclinazione|null;

    $: default_values = participi_default[numero];
    $: default_values && update_defaults();
    
    let ms: string, mp: string, fs: string, fp: string;
    $: if(data) {
        ms = data.ms;
        mp = data.mp || "";
        fs = data.fs || "";
        fp = data.fp || "";
    } else set_defaults();
    
    function set_defaults() {
        ms = '|' + default_values[0];
        mp = '|' + default_values[1];
        fs = '|' + default_values[2];
        fp = '|' + default_values[3];
    }
    function update_defaults() { if(in_default) set_defaults(); }

    $: in_default = eq(ms,default_values[0]) && (
        single || (
            eq(mp,default_values[1]) && eq(fs,default_values[2]) && eq(fp,default_values[3])
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
    <div class="oneline" class:default={in_default}>
        <h3>Participio passato</h3>
        <InputConRadice name="coniugazione.participio.ms" bind:value={ms} {radice} />
    </div>
    <input type="hidden" name="coniugazione.participio.mp" value="NULL">
    <input type="hidden" name="coniugazione.participio.fs" value="NULL">
    <input type="hidden" name="coniugazione.participio.fp" value="NULL">
{:else}
    <h3>Participio passato</h3>
    <div class="grid" class:default={in_default}>
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
    h3 {
        text-align: center;
    }
    .grid {
        display: grid;
        row-gap: 1rem;
        column-gap: 1ch;
        width: fit-content;
        margin: .5rem auto;
    }
    @media (max-width: 80ch) {
        .grid {grid-template-columns: 2fr 3fr;}
    }
    @media (min-width: 80ch) {
        .grid {grid-template-columns: repeat(4, 1fr);}
    }
    label {
        text-align: right;
        align-self: center;
        white-space: nowrap;
        cursor: text;
    }
    .oneline {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1ch;
    }
    .oneline h3 {
        justify-self: end;
        font-size: 1rem;
        font-weight: 400;
    }
    .default {
        --input-color: burlywood;
    }
</style>