<script lang="ts">
	import type { Coniugazione } from "../coniugazione";
    export let c: Coniugazione<string>;
</script>

<ul class="cols">
    <li>
        <span>Indicativo</span>
        <table>
            <tr>
                <td>Presente</td>
                <td>{c.indicativo.presente}</td>
            </tr>
            <tr>
                <td>Pass. pross.</td>
                <td>{c.indicativo.passato_prossimo}</td>
            </tr>
            <tr>
                <td>Imperfetto</td>
                <td>{c.indicativo.imperfetto}</td>
            </tr>
            <tr>
                <td>Trap. pross.</td>
                <td>{c.indicativo.trapassato_prossimo}</td>
            </tr>
            <tr>
                <td>Futuro semplice</td>
                <td>{c.indicativo.futuro_semplice}</td>
            </tr>
            <tr>
                <td>Futuro anteriore</td>
                <td>{c.indicativo.futuro_anteriore}</td>
            </tr>
        </table>
    </li>
    <li>
        <span>Congiuntivo</span>
        <table>
            <tr>
                <td>Presente</td>
                <td>{c.congiuntivo.presente}</td>
            </tr>
            <tr>
                <td>Pass. pross.</td>
                <td>{c.congiuntivo.passato}</td>
            </tr>
            <tr>
                <td>Imperfetto</td>
                <td>{c.congiuntivo.imperfetto}</td>
            </tr>
            <tr>
                <td>Trap. pross.</td>
                <td>{c.congiuntivo.trapassato}</td>
            </tr>
        </table>
    </li>
    <li>
        <span>Condizionale</span>
        <table>
            <tr>
                <td>Presente</td>
                <td>{c.condizionale.presente}</td>
            </tr>
            <tr>
                <td>Passato </td>
                <td>{c.condizionale.passato}</td>
            </tr>
        </table>
    </li>
    <li>
        <span>Imperativo</span>: {c.imperativo}
    </li>
</ul>

<style>
    ul {
        list-style: none;
        text-align: left;
    }
    li {
        margin-top: .5rem;
    }
    span {
        font-weight: 500;
        font-size: 1.1rem;
    }
    table {
        margin-top: .3rem;
        border-collapse: collapse;
    }
    td {
        padding: .1rem .6ch;
    }
    tr:nth-child(2n-1) td {
        background-color: rgba(119, 136, 153, 0.05);
        --r: .3rem;
    }
    tr:nth-child(2n-1) td:first-child {
        border-bottom-left-radius: var(--r);
        border-top-left-radius: var(--r);
    }
    tr:nth-child(2n-1) td:last-child {
        border-bottom-right-radius: var(--r);
        border-top-right-radius: var(--r);
    }
    @media (min-width: 50rem) {
        ul {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto auto;
            column-gap: 1.5rem;
        }
        li {
            grid-column: 2;
        }
        li:first-child {
            grid-column: 1;
            grid-row: 1/4;
        }
    }
</style>