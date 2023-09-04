<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import Loading from "./Loading.svelte";

    const ID = crypto.randomUUID();
    const titleID = ID + "-title";
    const descID = ID + "-desc";

    export let action: string;
    export let encourage = true;
    export let hash: string = ID;

    interface $$Slots {
        default: {
            titleID: string;
            descID: string;
        }
    }

    let asking = false;
    let resolve: (res: boolean) => void;
    let show = false;

    export async function confirm() {
        show = true;
        location.hash = hash;
        return new Promise<boolean>(res => {resolve = res});
    }

    function exit() { 
        if(asking || !show) return;
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

    const afterResponse: ReturnType<SubmitFunction> = async ({ result }) => {
        resolve(result.type === "success");
        asking = false;
        exit();
    }

    const submit: SubmitFunction = ({ cancel }) => {
        if(!show || asking) return cancel();
        asking = true;
        return afterResponse;
    }

    function try_exit() {
        if(location.hash.slice(1) === hash) return;
        if(asking) return;
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
    <form {action} method="post" class:submitting={asking} use:enhance={submit}>
        <slot {titleID} {descID} />
        <div class="btns">
            {#if asking}
            <Loading />
            {:else}
            <button class:fill={!encourage} type="button" on:click={exit}>Annulla</button>
            <button class:fill={encourage} type="submit">Conferma</button>
            {/if}
        </div>
    </form>
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
    .btns {
        margin-top: 1.4rem;
        display: flex;
        justify-content: right;
    }
    button {
        border: 2px solid var(--olivina);
        border-radius: .3rem;
        padding: .4rem .8rem;
        color: var(--olivina);
        background-color: white;
        cursor: pointer;
        font-weight: 500;
        margin-left: 1.4rem;
    }
    button.fill {
        background-color: var(--olivina);
        color: white;
    }
    form.submitting {
        opacity: 0.8;
    }
</style>