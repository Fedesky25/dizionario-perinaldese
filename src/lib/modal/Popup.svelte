<script lang="ts">
    const ID = crypto.randomUUID();
    const titleID = ID + "-title";
    const descID = ID + "-desc";
    
    export let show: boolean;
    export let hash: string = ID;

    interface $$Slots {
        default: {
            titleID: string;
            descID: string;
        }
    }

    function exit() { 
        if(!show) return;
        history.back(); 
        show = false;
    }
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

    function try_exit() {
        if(location.hash.slice(1) === hash) return;
        show = false;
    }
</script>

<svelte:window on:hashchange={try_exit} />

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
    <slot {titleID} {descID} />
    <button type="button" on:click={exit}>
        <div></div>
        <div></div>
    </button>
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
        z-index: 101;
        position: fixed;
        top: 50%;
        left: 50%;
        width: var(--modal-width, fit-content);
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 1rem;
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
        display: block;
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        width: 1.3rem;
        height: 1.3rem;
        cursor: pointer;
    }
    button > div {
        position: absolute;
        top: 50%;
        left: 0;
        border-bottom: 2px solid #aaa;
        --rot: 45deg;
        transform: translateY(-50%) rotate(var(--rot));
    }
    button > div:first-child {
        --rot: -45deg;
    }
</style>