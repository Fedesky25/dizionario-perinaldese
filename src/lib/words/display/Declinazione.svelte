<script lang="ts">
	import type { Declinazione } from "../types";
    import { formatta } from "../utils";

    export let radice: string;
    export let data: Declinazione;
</script>

<table>
    <tr>
        <td></td>
        <th scope="col">maschile</th>
        <th scope="col">femminile</th>
    </tr>
    <tr>
        <th scope="row">singolare</th>
        <td>{data.ms ? formatta(radice, data.ms) : '-'}</td>
        <td>{data.fs ? formatta(radice, data.fs) : '-'}</td>
    </tr>
    <tr>
        <th scope="row">singolare</th>
        <td>{data.mp ? formatta(radice, data.mp) : '-'}</td>
        <td>{data.fp ? formatta(radice, data.fp) : '-'}</td>
    </tr>
</table>

<style>
    table {
        border-collapse: collapse;
    }
    th {
        font-weight: 550;
    }
    th, td {
        padding: .4ch .8ch;
        text-align: center;
    }
    tr > :first-child {
        border-right: #444 solid 1px;
    }
    tr:first-child > * {
        border-bottom: #444 solid 1px;
    }
</style>