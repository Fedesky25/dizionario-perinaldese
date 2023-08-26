<script lang="ts">
    import Collapsible from "$lib/Collapsible.svelte";
    import InputConRadice from "$lib/words/InputConRadice.svelte";
	import { getDefaultTempo, getOperazioneConiugazione } from "$lib/words/coniugazione";
	import { TipoVerbo, type ConiugazioneRaw } from "$lib/words/types";
	import Participio from "./Participio.svelte";
	import Tempo from "./Tempo.svelte";

    export let radice: string;
    export let disabled = false;
    export let data: ConiugazioneRaw;

    $: avere = data.tipo === TipoVerbo.intransitivo_avere || data.tipo === TipoVerbo.impersonale;
    $: riflessivo = data.tipo === TipoVerbo.riflessivo;
    $: operazione = getOperazioneConiugazione(radice, data.numero);
</script>

<fieldset {disabled}>
    <div class="info">
        <label for="coniu-num">Numero coniugazione</label>
        <select id="coniu-num" name="coniugazione.numero" bind:value={data.numero}>
            <option value={1}>Prima</option>
            <option value={2}>Seconda</option>
            <option value={3}>Terza</option>
            <option value={0}>Propria</option>
        </select>
        <label for="coniu-tipo">Tipo di verbo</label>
        <select id="coniu-tipo" name="coniugazione.tipo" bind:value={data.tipo}>
            <option value={1}>Transitivo</option>
            <option value={2}>Intransitivo - avere</option>
            <option value={3}>Intransitivo - essere</option>
            <option value={4}>Solo riflessivo</option>
            <!-- <option value={5}>Impersonale</option> -->
        </select>
        <label for="coniu-ger">Gerundio</label>
        <InputConRadice id="coniu-ger" name="coniugazione.gerundio" value={data.gerundio||""} {radice} />
    </div>
    <Participio {radice} 
        numero={data.numero} 
        single={avere} 
        data={data.participio}
        on:parola />
    <div class="space"></div>
    <Collapsible>
        <h3 slot="title">Tempi verbali</h3>
        <div class="tempi">
            <Tempo index={0} {riflessivo} {radice} values={data.tempi?.[0] || null} defaults={getDefaultTempo(0, data.numero, operazione)} />
            <Tempo index={1} {riflessivo} {radice} values={data.tempi?.[1] || null} defaults={getDefaultTempo(1, data.numero, operazione)} />
            <Tempo index={2} {riflessivo} {radice} values={data.tempi?.[2] || null} defaults={getDefaultTempo(2, data.numero, operazione)} />
            <Tempo index={3} {riflessivo} {radice} values={data.tempi?.[3] || null} defaults={getDefaultTempo(3, data.numero, operazione)} />
            <Tempo index={4} {riflessivo} {radice} values={data.tempi?.[4] || null} defaults={getDefaultTempo(4, data.numero, operazione)} />
            <Tempo index={5} {riflessivo} {radice} values={data.tempi?.[5] || null} defaults={getDefaultTempo(5, data.numero, operazione)} />
        </div>
    </Collapsible>
</fieldset>
<input type="hidden" name="coniugazione" value="NULL" disabled={!disabled}>

<style>
    fieldset {
        margin-top: 2rem;
        margin-bottom: 2rem;
        border: 1px solid #ccc;
        padding-bottom: 1rem;
        --collapsible-head-justify: center;
    }

    fieldset:disabled,
    input[type="hidden"] {
        position: absolute;
        transform: scale(0);
        opacity: 0;
    }
    .info {
        padding: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1ch;
        row-gap: .4rem;
        margin-bottom: .4rem;
        justify-items: start;
        align-items: center;
    }
    .info label {
        justify-self: end;
    }
    select {
        font-size: inherit;
        border: 1px solid #ccc;
        border-radius: .2rem;
    }
    .space {
        height: 1rem;
    }
    .tempi {
        padding: 1.5rem;
        gap: 1.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>