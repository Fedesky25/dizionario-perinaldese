<script lang="ts">
    import type { Esempio } from "$lib/words/types";
	import { handleSpecialChars } from "../utils";
    export let data: Esempio[];

    const svgid = crypto.randomUUID();

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
                on:keydown={handleSpecialChars}
                name={valid ? "esempi.originale" : null}
                ></textarea>
            </td>
            <td>
                <textarea 
                bind:value={esempio.traduzione}
                on:keydown={handleSpecialChars}
                name={valid ? "esempi.traduzione" : null}
                ></textarea>
            </td>
            <td style="width: 0px;">
                <div class="btns" data-index="{i}">
                    <button on:click={up} type="button" class="move-btn" title="Sposta l'esempio su">
                        <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);"><use href="#{svgid}-arrow"/></svg>
                    </button>
                    <button on:click={down} type="button" class="move-btn" title="Sposta l'esempio giù">
                        <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><use href="#{svgid}-arrow"/></svg>
                    </button>
                    <button on:click={remove} type="button" class="remove-btn" title="Rimuovi l'esempio">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><use href="#{svgid}-bin"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    {/each}
</table>
<input type="hidden" name="esempi" value="NULL" disabled={data.length > 0}>
<button on:click={add} type="button" class="add-btn">Aggiungi esempio</button>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" class="hidden">
    <path id="{svgid}-arrow" fill="currentColor" d="M 13.035156 2.9648438 C 11.930156 2.9648438 11.035156 3.8598438 11.035156 4.9648438 L 11.035156 15.964844 L 5.9648438 15.964844 C 5.5608438 15.964844 5.1950156 16.206078 5.0410156 16.580078 C 4.8850156 16.954078 4.9718125 17.384875 5.2578125 17.671875 L 14.328125 26.742188 C 14.719125 27.133187 15.351187 27.133187 15.742188 26.742188 L 24.814453 17.671875 C 25.005453 17.480875 25.107422 17.224844 25.107422 16.964844 C 25.107422 16.835844 25.08225 16.704078 25.03125 16.580078 C 24.87725 16.206078 24.511422 15.964844 24.107422 15.964844 L 19.035156 15.964844 L 19.035156 4.9648438 C 19.035156 3.8598438 18.140156 2.9648438 17.035156 2.9648438 L 13.035156 2.9648438 z"></path>
    <path id="{svgid}-bin" fill="#BB5E64" d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z M 12 13 C 12.25575 13 12.511531 13.097469 12.707031 13.292969 L 15 15.585938 L 17.292969 13.292969 C 17.683969 12.901969 18.316031 12.901969 18.707031 13.292969 C 19.098031 13.683969 19.098031 14.316031 18.707031 14.707031 L 16.414062 17 L 18.707031 19.292969 C 19.098031 19.683969 19.098031 20.316031 18.707031 20.707031 C 18.512031 20.902031 18.256 21 18 21 C 17.744 21 17.487969 20.902031 17.292969 20.707031 L 15 18.414062 L 12.707031 20.707031 C 12.512031 20.902031 12.256 21 12 21 C 11.744 21 11.487969 20.902031 11.292969 20.707031 C 10.901969 20.316031 10.901969 19.683969 11.292969 19.292969 L 13.585938 17 L 11.292969 14.707031 C 10.901969 14.316031 10.901969 13.683969 11.292969 13.292969 C 11.488469 13.097469 11.74425 13 12 13 z"></path>
</svg>

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
        min-height: 4em;
        max-height: 8em;
        resize: vertical;
    }
    tr > td:first-child {position: relative;}
    tr.warning > td:first-child::before {
        content: url('/icons/generic-error.svg');
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
    @media (max-width: 60ch) {svg {height: 1.2rem;}}
    .btns {
        display: grid;
        --size: 2rem;
        grid-template-rows: repeat(2, var(--size));
        grid-template-columns: repeat(2, var(--size));
        gap: .2rem;
        width: fit-content;
        align-items: center;
    }
    .btns > button {
        border: 0;
        padding: .2rem;
        height: var(--size);
        width: var(--size);
        background-color: transparent;
    }
    svg {
        height: 100%;
        width: 100%;
        object-fit: contain;
        display: block;
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
    .hidden {
        position: absolute;
        transform: scale(0);
        opacity: 0;
    }
</style>