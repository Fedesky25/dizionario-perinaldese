<script lang="ts">
    import { fgs, type Summary } from "$lib/word-utils";
    export let word: Summary;
    export let index: number;
</script>

<tr>
    <td>{word.parola}{#if word.ordine}<sup>{word.ordine}</sup>{/if}</td>
    <td>{word.traduzione}</td>
    <td>{fgs[word.funzione]}</td>
    <td><img src="/icons/{word.descrizione ? 'tick' : 'cross'}.svg" alt={word.descrizione ? 'sì' : 'no'}></td>
    <td class="{word.numero_esempi ? 'green' : 'red'}-cell">
        {#if word.numero_esempi}
            {word.numero_esempi}
        {:else}
            <img src="/icons/cross.svg" alt="0">
        {/if}
    </td>
    <div class="menu">
        <a href="/admin/dizionario/{word._id}">
            <img src="/icons/edit.svg" alt="Modifica">
            <span>Modifica</span>
        </a>
        {#if !word.descrizione}
            <a href="#descrizione/{word._id}/{index}">
                <img src="/icons/description.svg" alt="Descrizione">
                <span>Scrivi desc.</span>
            </a>
        {/if}
        <a href="#rimuovi/{word._id}/{index}">
            <img src="/icons/delete.svg" alt="Rimuovi">
            <span>Rimuovi</span>
        </a>
    </div>
</tr>

<style>
    tr {
        position: relative;
    }
    .menu {
        z-index: 20;
        position: absolute;
        top: 1px;
        left: 50%;
        transform-origin: bottom;
        transform: translate(-50%, -100%) scaleY(0);
        opacity: 0;
        transition: transform .1s ease-in, opacity .1s ease;

        background-color: white;
        padding: .5rem 1.2rem .65rem;
        border-top-left-radius: var(--medium-radius);
        border-top-right-radius: var(--medium-radius);
        box-shadow: 0 0 25px #0002;
        /* clip-path: polygon(-30px .5px, calc(100% + 30px) .5px, calc(100% + 30px) calc(100% + 30px), -30px calc(100% + 30px)); */
        clip-path: polygon(-30px -30px, calc(100% + 30px) -30px, calc(100% + 30px) 100%, -30px 100%);
        display: grid;
        column-gap: 3rem;
    }
    tr:hover {box-shadow: 0 0 25px #0002;}
    tr:hover > .menu {
        transform: translate(-50%, -100%) scaleY(1);
        opacity: 1;
    }
    img {
        max-height: 1rem;
        max-width: 1rem;
        vertical-align: middle;
    }
    td {
        padding: .4rem 1ch;
        text-align: center;
        vertical-align: middle;
        border-bottom: 1px solid #77889944;
    }
    .green-cell {color: var(--olivina);}
    .red-cell {color: var(--rosso);}
    .menu > a {
        text-decoration-color: #77889944;
        color: inherit;
        display: flex;
        align-items: center;
        grid-row: 1;
        white-space: nowrap;
    }
    .menu > a > img {
        width: 1rem;
        margin-right: .5ch;
    }
</style>