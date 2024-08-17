<script lang="ts">
    import { InvalidField, PostgrestErrorWrapper, type FormError } from "./form-utils";

    export let titleID: string|undefined = undefined;
    export let descID: string|undefined = undefined;
    export let error: NonNullable<FormError>
</script>

<h2 id={titleID}>Errore</h2>
{#if error}
    {#if error instanceof InvalidField}
    <p id={descID}>Il valore di un campo non è valido</p>
    <table>
        <tr>
            <th scope="row">campo:</th>
            <td>{error.field}</td>
        </tr>
        <tr>
            <th scope="row">atteso:</th>
            <td>{error.expected}</td>
        </tr>
        {#if error.got}
        <tr>
            <th scope="row">ottenuto:</th>
            <td>{error.got}</td>
        </tr>
        {/if}
    </table>
    {:else if error instanceof PostgrestErrorWrapper}
    <p id={descID}>Questo è un errore interno, probabilmente dovuto a qualche errore introdotto da Federico. Qui sotto i dettagli:</p>
    <table>
        <tr>
            <th scope="row">message</th>
            <td>{error.message}</td>
        </tr>
        <tr>
            <th scope="row">details</th>
            <td>{error.details}</td>
        </tr>
        <tr>
            <th scope="row">hint</th>
            <td>{error.hint}</td>
        </tr>
    </table>
    {:else}
    <p>{error}</p>
    {/if}
{/if}

<style>
    h2 {
        color: var(--rosso);
        font-size: 1.2rem;
        margin-bottom: .5rem;
    }
    table {
        margin: 0 auto;
    }
    th {
        text-align: right;
        font-weight: 600;
    }
    td {
        text-align: left;
    }
    th, td {
        padding: .2rem .3ch;
    }
</style>