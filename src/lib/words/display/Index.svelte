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
    import OneLine from "./OneLine.svelte";
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

<h2>{word.parola} &ndash; {word.traduzione}</h2>
<span class="funzione">[{word.funzione_display}{extra_fg ? ' '+extra_fg : ''}]</span>
{#if word.descrizione}
    <p class="descrizione">{word.descrizione}</p>
{/if}
<OneLine words={sinonimi}>
    <h3>Sinonimi</h3>
</OneLine>
<OneLine words={contrari}>
    <h3>Contrari</h3>
</OneLine>
{#if word.esempi && word.esempi.length}
    <h3>Esempi</h3>
    <table class="esempi">
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
        <div>
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
        </div>
        <Collapsible>
            <h4 slot="title">Indicativo</h4>
            <div class="cols">
                <Tempo nome="Presente" voci={coniugazione.indicativo.presente} />
                <Tempo nome="Passato prossimo" voci={coniugazione.indicativo.passato_prossimo} />
                <Tempo nome="Imperfetto" voci={coniugazione.indicativo.imperfetto} />
                <Tempo nome="Trapassato prossimo" voci={coniugazione.indicativo.trapassato_prossimo} />
                <Tempo nome="Futuro semplice" voci={coniugazione.indicativo.futuro_semplice} />
                <Tempo nome="Futuro anteriore" voci={coniugazione.indicativo.futuro_anteriore} />
            </div>
        </Collapsible>
        <Collapsible>
            <h4 slot="title">Congiuntivo</h4>
            <div class="cols">
                <Tempo nome="Presente" voci={coniugazione.congiuntivo.presente} />
                <Tempo nome="Passato" voci={coniugazione.congiuntivo.passato} />
                <Tempo nome="Imperfetto" voci={coniugazione.congiuntivo.imperfetto} />
                <Tempo nome="Trapassato" voci={coniugazione.congiuntivo.trapassato} />
            </div>
        </Collapsible>
        <Collapsible>
            <h4 slot="title">Condizionale</h4>
            <div class="cols">
                <Tempo nome="Presente" voci={coniugazione.condizionale.presente} />
                <Tempo nome="Passato" voci={coniugazione.condizionale.passato} />
            </div>
        </Collapsible>
    </div>
{/if}


<style>
    h2 {
        color: #6B8E23;
        font-size: 2.7rem;
        text-align: left;
        margin-bottom: .7rem;
    }
    h2:not(:first-of-type) {
        margin-top: 5rem;
    }
    h3 {
        font-size: 1.4rem;
        margin-top: 2rem;
        color: #556B2F;
    }
    h4 {
        font-size: 1.1rem;
        font-weight: 600;
    }
    .funzione {
        font-weight: 600;
    }
    .descrizione {
        margin-top: .2rem;
    }
    .esempi {
        border-collapse: collapse;
        text-align: center;
    }
    th {
        font-weight: 550;
        border-bottom: 1px solid #444;
    }
    th, td {
        padding: .4ch .8ch;
    }
    th:first-child,
    td:first-child {
        border-right: 1px solid #444;
    }
    .esempi tr:nth-child(2n) td {
        background-color: rgba(119, 136, 153, 0.05);
        --r: .3rem;
    }
    .esempi tr:nth-child(2n) td:first-child {
        border-bottom-left-radius: var(--r);
        border-top-left-radius: var(--r);
    }
    .esempi tr:nth-child(2n) td:last-child {
        border-bottom-right-radius: var(--r);
        border-top-right-radius: var(--r);
    }
    .coniugazione {
        padding-left: 1.6ch;
        padding-top: .35rem;
        padding-bottom: .35rem;
        border-left: 2px solid hsl(210, 14%, 93%);
    }
    .coniugazione ul {
        padding-left: 2.5ch;
    }
    .coniugazione > :global(*) + :global(*) {
        margin-top: 1rem;
    }
    .cols {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(21ch, 1fr));
        grid-auto-flow: row;
        gap: 1.5ch;
    }
</style>