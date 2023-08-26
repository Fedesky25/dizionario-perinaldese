<script lang="ts">
    import Collapsible from "$lib/Collapsible.svelte";
    import InputConRadice from "$lib/words/InputConRadice.svelte";
	import { TipoVerbo, type ConiugazioneRaw } from "$lib/words/types";
	import Participio from "./Participio.svelte";

    export let radice: string;
    export let data: ConiugazioneRaw;
    export let disabled = false;

    $: avere = data.tipo === TipoVerbo.intransitivo_avere || data.tipo === TipoVerbo.impersonale;
</script>

<fieldset {disabled}>
    <div class="info">
        <label for="coniu-num">Numero coniugazione</label>
        <select id="coniu-num" name="coniugazione.numero" bind:value={data.numero}>
            <option value={1}>prima</option>
            <option value={2}>seconda</option>
            <option value={3}>terza</option>
            <option value={0}>propria</option>
        </select>
        <label for="coniu-tipo">Tipo di verbo</label>
        <select id="coniu-tipo" name="coniugazione.tipo" value={data.tipo}>
            <option value={1}>Transitivo</option>
            <option value={2}>Intransitivo - avere</option>
            <option value={3}>Intransitivo - essere</option>
            <option value={4}>Solo riflessivo</option>
            <!-- <option value={5}>Impersonale</option> -->
        </select>
        <label for="coniu-ger">Gerundio</label>
        <InputConRadice id="coniu-ger" name="coniugazione.gerundio" value={data.gerundio||""} {radice} />
    </div>
    <Participio {radice} numero={data.numero} single={avere} data={data.participio} />
    <Collapsible>
        <h3 slot="title">Tempi verbali</h3>
        
    </Collapsible>
</fieldset>
<input type="hidden" name="coniugazione" value="NULL" disabled={!disabled}>

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

    fieldset:disabled,
    input[type="hidden"] {
        position: absolute;
        transform: scale(0);
        opacity: 0;
    }
    .info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1ch;
        row-gap: .4rem;
        justify-items: start;
    }
    .info label {
        justify-self: end;
    }
</style>