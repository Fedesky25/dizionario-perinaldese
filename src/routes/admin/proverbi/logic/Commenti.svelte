<script context="module" lang="ts">
    let counter = 0;

    interface Comment {
        id: number;
        inizio: number;
        fine: number;
        testo: string;
    }
</script>

<script lang="ts">
    export let text: string;
    export let inizio: number[];
    export let fine: number[];
    export let testo: string[];

    let comments: Comment[];
    function zip(testo: string[], inizio: number[], fine: number[]) {
        const len = Math.min(testo.length, inizio.length, fine.length);
        const res = new Array<Comment>(len);
        for(var i=0; i<len; i++) res[i] = {
            id: (counter++),
            inizio: inizio[i],
            fine: fine[i],
            testo: testo[i]
        };
        comments = res;
    }
    $: zip(testo, inizio, fine);

    type MaybeRange = [start: number, end: number]|null;

    let span: HTMLSpanElement;
    let highlight: MaybeRange = null;
    let considered: MaybeRange = null;

    function add() {
        if(!considered) return;
        comments.push({
            id: (counter++),
            inizio: considered[0],
            fine: considered[1],
            testo: ''
        });
        comments = comments;
    }

    function selectionchange() {
        if(!span) return void (considered = null);
        const sel = window.getSelection();
        if(!sel || !span.contains(sel.anchorNode)) return void (considered=null);
        const range = sel.getRangeAt(0);
        considered = [range.startOffset, range.endOffset];
    }

    function remove(this: HTMLButtonElement) {
        const i = +(this.dataset.index||0);
        highlight = null;
        comments.splice(i,1);
        comments = comments;
    }

    function mouseenter(this: HTMLLIElement) {
        const start = +(this.dataset.start||0)
        const end = +(this.dataset.end||0)
        highlight = [start,end];
    }
    function leave() {
        highlight = null;
    }
</script>

<svelte:document on:selectionchange={selectionchange} />

<div class="split">
    <p class="display">
        {#if highlight}
            <span class="low">{text.slice(0,highlight[0])}</span><span class="high">{text.slice(highlight[0],highlight[1])}</span><span class="low">{text.slice(highlight[1])}</span>
        {:else}
            <span bind:this={span}>{text}</span>
        {/if}
        {#if considered}
            <button class="add" type="button" on:click={add}>Aggiungi</button>
        {/if}
    </p>
    <ul>
        {#each comments as c, i (c.id)}
            <li data-start={c.inizio} data-end={c.fine} on:mouseenter={mouseenter} on:mouseleave={leave}>
                <button class="remove" type="button" data-index={i} on:click={remove}>
                    <img src="/icons/cross.svg" alt="Rimuovi">
                </button>
                <textarea rows="2" name="commenti-testo" value={c.testo}></textarea>
                <input type="hidden" name="commenti-inizio" value={c.inizio}>
                <input type="hidden" name="commenti-fine" value={c.fine}>
            </li>
        {/each}
    </ul>
</div>

<style>
    .display {
        position: relative;
        place-self: center;
    }
    .display span {
        font-size: 1.6rem;

    }
    @media (max-width: 50rem) {
        .display {
            position: sticky;
            top: 0;
            margin-bottom: 1rem;
            background-color: white;
            padding-top: 1rem;
            padding-bottom: 1rem;
            box-shadow: 0 1rem 1rem -1rem rgba(0,0,0,0.15);
            clip-path: inset(0 0 -6rem 0);
        }
    }
    @media (min-width: 50rem) {
        .split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 1rem;
        }
        ul {
            grid-column: 1;
            grid-row: 1;
        }
        .display {
            grid-column: 2;
            grid-row: 1;
        }
    }
    .low {color: #ccc;}
    .high {color: var(--oliva-scuro);}
    .add {
        z-index: 10;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 1rem);
        border: none;
        background-color: var(--olivina);
        padding: .3rem .6rem;
        border-radius: .2rem;
        font-weight: 500;
        color: white;
        cursor: pointer;
    }
    ul {
        list-style: none;
    }
    li {
        display: flex;
        align-items: center;
        padding: .5rem;
        border-radius: .4rem;
        margin-bottom: .5rem;
    }
    li:hover {
        background-color: #f3f3f3;
    }
    textarea {
        border: 1px solid #ccc;
        border-radius: .2rem;
        padding: .4rem .6rem;
        min-height: 3rem;
        resize: vertical;
        flex-grow: 1;
    }
    textarea:focus {
        border-color: var(--olivina);
        outline: none;
    }
    img {
        width: 1.2rem;
        height: 1.2rem;
        display: block;
    }
    .remove {
        padding: .2rem;
        border: none;
        border-radius: .2rem;
        background-color: transparent;
        cursor: pointer;
        margin-right: 1rem;
    }
    .remove:hover {
        background-color: #f1f1f1;
    }
</style>