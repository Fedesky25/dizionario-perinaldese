<script context="module">
    const names = [
        "Indicativo Presente",
        "Indicativo Imperfetto",
        "Indicativo Futuro",
        "Congiuntivo Presente",
        "Congiuntivo Imperfetto",
        "Condizionale Presente"
    ];
</script>

<script lang="ts">
    import InputConRadice from '$lib/words/InputConRadice.svelte';
    import type { Voci } from '$lib/words/types';
    import type { IndiceTempo } from '$lib/words/coniugazione';

    export let radice: string;
    export let index: IndiceTempo;
    export let defaults: Voci;
    export let values: Voci|null;
    export let riflessivo: boolean;

    let _v: Voci;
    function set_v(values: Voci|null, defaults: Voci) { _v = values || (Array.from(defaults) as Voci); }
    $: set_v(values, defaults);

    function keyup(e: KeyboardEvent) {
        if(!e.ctrlKey || e.key !== "d") return;
        e.preventDefault();
        _v = Array.from(defaults) as Voci;
    }

    $: in_default = _v.every((v,i) => v === defaults[i]);
</script>

<div class="wrapper">
    <h4>{names[index]}</h4>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="inner" class:default={in_default} on:keyup={keyup}>
        <span>mi a {#if riflessivo}me{/if}</span>
        <InputConRadice {radice} name="tempo.{index}" bind:value={_v[0]} />
        <span>tü ti {#if riflessivo}te{/if}</span>
        <InputConRadice {radice} name="tempo.{index}" bind:value={_v[1]} />
        <span>{Math.round(Math.random()) ? "elu u" : "ela a"} {#if riflessivo}se{/if}</span>
        <InputConRadice {radice} name="tempo.{index}" bind:value={_v[2]} />
        <span>nui a {#if riflessivo}se{/if}</span>
        <InputConRadice {radice} name="tempo.{index}" bind:value={_v[3]} />
        <span>vui u {#if riflessivo}ve{/if}</span>
        <InputConRadice {radice} name="tempo.{index}" bind:value={_v[4]} />
        <span>{Math.round(Math.random()) ? "eli i" : "ele e"} {#if riflessivo}se{/if}</span>
        <InputConRadice {radice} name="tempo.{index}" bind:value={_v[5]} />
    </div>
    <input type="hidden" name="tempo.{index}.default" value="true" disabled={!in_default}>
</div>

<style>
    .wrapper {
        padding: 1.3ch 1.6ch;
        border-radius: var(--large-radius);
        box-shadow: 0 0 .9rem rgba(0,0,0,.05);
        border-radius: 1ch;
    }
    .inner {
        display: grid;
        grid-template-columns: auto 1fr;
        row-gap: .3rem;
        column-gap: .8rem;
        align-items: center;
        grid-auto-flow: row;
        /* width: fit-content;
        margin: 0 auto; */
    }
    .default {
        --input-color: burlywood;
    }
    span {
        grid-column: 1;
        text-align: right;
    }
    h4 {
        color: var(--olivastro);
        text-align: center;
        margin-bottom: .5rem;
    }
</style>