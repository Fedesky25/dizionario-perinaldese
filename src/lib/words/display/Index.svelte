<script lang="ts" context="module">
    import type { SinCon, Declinazione } from "../types";
    const tipoVerboNum2Str = ['', ' transitivo', ' intransitivo', ' intransitivo', ' riflessivo', ' impersonale']

    function nomeTipoDeclinazione(voci: Declinazione) {
        if(!voci.fs && !voci.fp) {
            if(!voci.mp) return "maschile singolare";
            if(!voci.ms) return "maschile plurale";
            return "maschile"
        }
        if(!voci.ms && !voci.mp) {
            if(!voci.fp) return "femminile singolare";
            if(!voci.fs) return "femminile plurale";
            return "femminile"
        }
        return '';
    }

    function splitSinCon(arr: SinCon[]): [sinonimi: SinCon[], contrari: SinCon[]] {
        const sin: SinCon[] = [];
        const con: SinCon[] = [];
        const len = arr.length;
        for(var i=0; i<len; i++) (arr[i].contrario ? con : sin).push(arr[i]);
        return [sin, con]
    }
</script>

<script lang="ts">
    import type { Complete } from "../types";
	import Collapsible from "$lib/Collapsible.svelte";
	import { coniuga } from "../coniugazione";
    import SinConTag from "./SinCon.svelte";
    import DeclinazioneTag from "./Declinazione.svelte";
    import Tempo from "./Tempo.svelte";

    export let word: Complete;

    let extra_fg = '';
    $: switch(word.funzione) {
        case 1:
        case 2:
        case 3:
            extra_fg = nomeTipoDeclinazione(word.declinazione);
            break;
        case 4:
            extra_fg = tipoVerboNum2Str[word.coniugazione.tipo];
            break;
        default:
            extra_fg = '';
    }
    $: [sinonimi, contrari] = splitSinCon(word.sin_con || []);
</script>

<h2>{word.parola} - {word.traduzione}</h2>
<span class="funzione">[{word.funzione_display}{extra_fg ? ' '+extra_fg : ''}]</span>
{#if word.descrizione}
    <p class="descrizione">{word.descrizione}</p>
{/if}
<SinConTag title="Sinonimi" data={sinonimi} />
<SinConTag title="Contrari" data={contrari} />
{#if word.esempi && word.esempi.length}
    <h3>Esempi</h3>
    <table>
        <tr>
            <th>Originale</th>
            <th>Traduzione</th>
        </tr>
        {#each word.esempi as esempio}
            <tr>
                <td>{esempio.originale}</td>
                <td>{esempio.traduzione}</td>
            </tr>
        {/each}
    </table>
{/if}
{#if word.funzione === 1 || word.funzione === 2 || word.funzione === 3}
    <h3>Declinazione</h3>
    <!-- @ts-ignore -->
    <DeclinazioneTag radice={word.radice} data={word.declinazione} />
{:else if word.funzione === 4}
    {@const coniugazione = coniuga(word.radice, word.coniugazione)}
    <h3>Coniugazione</h3>
    <div class="coniugazione">
        <h4>Tempi infiniti</h4>
        <ul>
            <li>Infinito presente: {word.parola}</li>
            <li>Ferundio presente: {coniugazione.gerundio}</li>
            <li>
                <span>Participio passato:</span>
                {#if coniugazione.avere}
                    {coniugazione.participio.ms}
                {:else}
                    <DeclinazioneTag radice={word.radice} data={coniugazione.participio} />
                {/if}
            </li>
        </ul>
        <Collapsible>
            <h4 slot="title">Indicativo</h4>
            <Tempo nome="Presente" voci={coniugazione.indicativo.presente} />
            <Tempo nome="Passato prossimo" voci={coniugazione.indicativo.passato_prossimo} />
            <Tempo nome="Imperfetto" voci={coniugazione.indicativo.imperfetto} />
            <Tempo nome="Trapassato prossimo" voci={coniugazione.indicativo.trapassato_prossimo} />
            <Tempo nome="Futuro semplice" voci={coniugazione.indicativo.futuro_semplice} />
            <Tempo nome="Futuro anteriore" voci={coniugazione.indicativo.futuro_anteriore} />
        </Collapsible>
        <Collapsible>
            <h4 slot="title">Congiuntivo</h4>
            <Tempo nome="Presente" voci={coniugazione.congiuntivo.presente} />
            <Tempo nome="Passato" voci={coniugazione.congiuntivo.passato} />
            <Tempo nome="Imperfetto" voci={coniugazione.congiuntivo.imperfetto} />
            <Tempo nome="Trapassato" voci={coniugazione.congiuntivo.trapassato} />
        </Collapsible>
        <Collapsible>
            <h4 slot="title">Condizionale</h4>
            <Tempo nome="Presente" voci={coniugazione.condizionale.presente} />
            <Tempo nome="Passato" voci={coniugazione.condizionale.passato} />
        </Collapsible>
    </div>
{/if}


