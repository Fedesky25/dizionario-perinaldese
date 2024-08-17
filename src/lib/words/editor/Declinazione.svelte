<script lang="ts">
    import InputConRadice from '$lib/words/InputConRadice.svelte';
	import type { Declinazione } from '$lib/words/types';
	import { createEventDispatcher } from 'svelte';
	import { formatta, getDefaultDeclinazione,  } from '$lib/words/utils';

    export let radice: string;
    export let data: Declinazione|null;
    export let disabled = false;

    let ms: string, mp: string, fs: string, fp: string;

    $: takeFrom(data);

    function takeFrom(data: Declinazione|null) {
        if(data) {
            ms = data.ms || "";
            mp = data.mp || "";
            fs = data.fs || "";
            fp = data.fp || "";
        } else {
            ms = mp = fs = fp = "";
        }
    }

    const dispatch = createEventDispatcher<{parola: string}>();

    $: des = ms || fs || mp || fp;
    $: !disabled && dispatch("parola", formatta(radice,des));
    // $: console.log("ms", ms);

    function handleDefault(e: KeyboardEvent) {
        if(!e.altKey || !e.ctrlKey) return;
        if(e.key !== 'm' && e.key !== 'f' && e.key !== 'x') return;
        const def = getDefaultDeclinazione(radice);
        switch(e.key) {
            case 'm': {
                ms = def.ms; mp = def.mp;
                fs = fp = "";
                break;
            }
            case 'f': {
                fs = def.fs; 
                fp = def.fp;
                ms = "";
                mp = "";
                break;
            }
            case 'x': {
                ms = def.ms; mp = def.mp;
                fs = def.fs; fp = def.fp;
                break;
            }
        }
    }
</script>

<svelte:body on:keyup={handleDefault} />

<fieldset {disabled}>
    <label for="dec-ms">masch sing:</label>
    <InputConRadice {radice} name="declinazione.ms" bind:value={ms} id="dec-ms"/>
    <label for="dec-mp">masch plur:</label>
    <InputConRadice {radice} name="declinazione.mp" bind:value={mp} id="dec-mp"/>
    <label for="dec-fs">femm sing:</label>
    <InputConRadice {radice} name="declinazione.fs" bind:value={fs} id="dec-fs"/>
    <label for="dec-fp">femm plur:</label>
    <InputConRadice {radice} name="declinazione.fp" bind:value={fp} id="dec-fp"/>
</fieldset>
<input type="hidden" name="declinazione" value="NULL" disabled={!disabled}>

<style>
    fieldset {
        display: grid;
        row-gap: 1rem;
        column-gap: 1ch;
        max-width: 70ch;
        margin: 2rem auto;
        border: 1px solid #ccc;
        padding: 1rem;
    }
    @media (max-width: 80ch) {
        fieldset {grid-template-columns: 2fr 3fr;}
    }
    @media (min-width: 80ch) {
        fieldset {grid-template-columns: repeat(4, 1fr);}
    }
    fieldset:disabled {
        display: none;
    }
    label {
        text-align: right;
        align-self: center;
        white-space: nowrap;
        cursor: text;
    }
</style>