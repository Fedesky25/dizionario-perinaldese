<script lang="ts">
    import { page } from "$app/stores";

    export let encourage = true;
    export let hashRegExp: RegExp;
    export let action: (arr: RegExpExecArray) => Promise<any>;

    let confirming = false;
    $: arr = hashRegExp.exec($page.url.hash);
    $: show = arr !== null;

    const ID = crypto.randomUUID();
    const titleID = ID + "-title";
    const descID = ID + "-desc";

    function exit() { if(show) history.back(); }
    function escape(ev: KeyboardEvent) { if(ev.key === "Escape") exit(); }

    function setFocus(node: HTMLElement, flag: boolean) {
        if(flag) node.focus();
        return {
            update(flag: boolean) { flag ? node.focus() : node.blur(); }
        }
    }
    function move(node: HTMLElement) {
        document.body.appendChild(node);
    }
    async function confirm() {
        if(confirming || !arr) return;
        confirming = true;
        await action(arr).catch(() => {});
        confirming = false;

    }
</script>

<div 
    role="presentation" 
    class="back-drop" 
    class:show
    on:click={exit}
    use:move
></div>
<div 
    role="dialog" 
    class="popup" 
    aria-hidden={!show} 
    aria-labelledby={titleID} 
    aria-describedby={descID} 
    tabindex="-1" 
    on:keyup={escape} 
    use:setFocus={show}
    use:move
>
    <slot {titleID} {descID} data={arr} />
    <div class="btns">
        <button class:fill={!encourage} on:click={exit}>Annulla</button>
        <button class:fill={encourage} on:click={exit}>Conferma</button>
    </div>
</div>

<style>
    .back-drop {
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 0;
        transform: scale(0);
        background-color: black;
        transition: transform 0s linear 150ms, opacity 150ms ease;
    }
    .back-drop.show {
        transition: transform 0s linear, opacity 150ms ease;
        transform: scale(1);
        opacity: .5;
    }
    .popup {
        z-index: 201;
        position: fixed;
        top: 50%;
        left: 50%;
        width: fit-content;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: .6rem;
        padding: 1.4rem;
        padding-top: 1rem;
        background-color: white;
        scrollbar-width: thin;
    }
    .popup[aria-hidden="true"] {
        transition: transform .25s ease-in, opacity .15s ease;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    .popup[aria-hidden="false"] {
        transition: transform .25s ease, opacity .2s ease;
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    button {
        border: 2px solid var(--olivina);
        border-radius: .3rem;
        padding: .4rem .8rem;
        color: var(--olivina)
    }
    button.fill {
        background-color: var(--olivina);
        color: white;
    }
</style>