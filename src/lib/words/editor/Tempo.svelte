<script context="module">
    const names = [
        "Indicativo Presente",
        "Indicativo Imperfetto",
        "Indicativo Futuro",
        "Congiuntivo Presente",
        "Congiuntivo Imperfetto",
        "Condizionale Presente",
        "Imperativo"
    ];
</script>

<script lang="ts">
    import InputConRadice from '$lib/words/InputConRadice.svelte';

    export let radice: string;
    export let index: number;
    export let soggetti: readonly string[];
    export let defaults: string[];
    export let values: string[]|null;

    let _v: string[];
    function set_v(values: string[]|null, defaults: string[]) { _v = values || (Array.from(defaults)); }
    $: set_v(values, defaults);

    function keyup(e: KeyboardEvent) {
        if(!e.altKey || !e.ctrlKey || e.key !== "d") return;
        e.preventDefault();
        _v = Array.from(defaults);
    }

    $: in_default = _v.every((v,i) => v === defaults[i]);
</script>

<div class="wrapper">
    <h4>{names[index]}</h4>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="inner" class:default={in_default} on:keyup={keyup}>
        {#each soggetti as soggetto, i}
            <span>{soggetto}</span>
            <InputConRadice {radice} name="tempo.{index}" bind:value={_v[i]} />
        {/each}
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