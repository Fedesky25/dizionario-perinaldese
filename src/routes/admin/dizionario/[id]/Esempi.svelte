<script lang="ts">
    import type { Esempio } from "$lib/words/types";
    export let data: Esempio[];

    function getIndex(el: HTMLElement) {
        return +el.parentElement!.dataset.index!;
    }

    function down(this: HTMLElement) {
        const i = getIndex(this);
        if(i === data.length-1) return;
        const temp = data[i+1];
        data[i+1] = data[i];
        data[i] = temp;
    }

    function up(this: HTMLElement) {
        const i = getIndex(this);
        if(i === 0) return;
        const temp = data[i-1];
        data[i-1] = data[i];
        data[i] = temp;
    }
    
    function remove(this: HTMLElement) {
        const i = getIndex(this);
        data.splice(i, 1);
        data = data;
    }

    function add() {
        data.push({originale: '', traduzione: ''});
        data = data;
    }
</script>

<table class:hidden={!data.length}>
    <tr>
        <th>Originale</th>
        <th>Traduzione</th>
        <th>Azioni</th>
    </tr>
    {#each data as esempio, i}
        {@const valid = !!esempio.originale && !!esempio.traduzione}
        <tr class:warning={!valid}>
            <td>
                <textarea 
                bind:value={esempio.originale} 
                name={valid ? "esempi.originale" : null}
                ></textarea>
            </td>
            <td>
                <textarea 
                bind:value={esempio.traduzione}
                name={valid ? "esempi.traduzione" : null}
                ></textarea>
            </td>
            <td class="btns" data-index="{i}">
                <button on:click={down} type="button" class="move-btn" title="Sposta l'esempio giù">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><use href="#arrow-down"/></svg>
                </button>
                <button on:click={up} type="button" class="move-btn" title="Sposta l'esempio su">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);"><use href="#arrow-down"/></svg>
                </button>
                <button on:click={remove} type="button" class="remove-btn" title="Rimuovi l'esempio">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><use href="#bin-svg"/></svg>
                </button>
            </td>
        </tr>
    {/each}
</table>
<input type="hidden" name="esempi" value="NULL" disabled={data.length > 0}>
<button on:click={add} type="button" class="add-btn">Aggiungi esempio</button>

<style>
    table {
        border-spacing: 0;
        width: 100%;
        margin-bottom: 2.5rem;
    }
    th {
        border-bottom: 2px solid var(--olivina);
        padding-bottom: .3rem;
    }
    td {
        padding: .6rem;
        margin-top: .3rem;
    }
    textarea {
        display: block;
        width: 100%;
        min-height: 3em;
        max-height: 5em;
        resize: vertical;
    }
    tr > td:first-child {position: relative;}
    tr.warning > td:first-child::before {
        content: url('../assets/generic-error.svg');
        position: absolute;
        left: -1ch;
        top: 50%;
        transform: translate(-100%, -50%);
        width: 2rem;
        display: block;
    }
    button {
        cursor: pointer;
    }
    .add-btn {
        display: block;
        margin: 0 auto;
        padding: .4rem .8rem;
        border: 2px solid var(--olivina);
        border-radius: 5rem;
        background-color: white;
        font-weight: 500;
    }
    .add-btn:hover {
        background-color: var(--olivina);
		color: white;
    }
    svg:not(.hidden) {
        height: 1.5rem;
        width: 3ch;
        display: block;
    }
    @media (max-width: 60ch) {svg:not(.hidden) {height: 1.2rem;}}
    .btns {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        align-items: center;
    }
    .btns > button {
        border: 0;
        margin: .2rem;
        padding: .2rem;
        background-color: transparent;
    }
    .move-btn {
        grid-column: 1;
        color: lightslategray;
        opacity: .5;
        transition: opacity .2s ease;
    }
    .move-btn:hover {opacity: 1;}
    .remove-btn {
        filter: grayscale(.5);
		opacity: .5;
		transition: opacity .2s ease;
        grid-column: 2;
        grid-row: 1/3;
    }
    .remove-btn:hover {
        filter: grayscale(0);
        opacity: 1;
    }
    input[type="hidden"] {
        position: absolute;
        transform: scale(0);
        opacity: 0;
    }
</style>