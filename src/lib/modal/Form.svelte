<script lang="ts">
    import { enhance } from "$app/forms";
    import Loading from "../Loading.svelte";
	import { clientFormHandler } from "$lib/form-utils";

    const ID = crypto.randomUUID();
    const titleID = ID + "-title";
    const descID = ID + "-desc";
    
    export let show = false;
    export let action: string;
    export let encourage = false;
    export let hash: string = ID;
    export let execute: (data: FormData) => Promise<void>;

    interface $$Slots {
        default: {
            titleID: string;
            descID: string;
        }
    }


    const handler = clientFormHandler(null, async ({formData}) => {
        execute(formData);
        if(location.hash.slice(1) === hash) history.back();
        else show = false;
    });


    function exit() { 
        if(!show || $handler.submitting) return;
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
        if(location.hash.slice(1) === hash || $handler.submitting) return;
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
    <form {action} method="post" class:submitting={$handler.submitting} use:enhance={handler.submit}>
        <slot {titleID} {descID} />
        <div class="btns">
            {#if $handler.submitting}
            <Loading />
            {:else}
            <button class:fill={!encourage} type="button" on:click={exit}>Annulla</button>
            <button class:fill={encourage} type="submit">Conferma</button>
            {/if}
        </div>
        {#if $handler.error}
        <p class="err">{$handler.error}</p>
        {/if}
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
    .err {
        text-align: center;
        color: var(--rosso);
        margin-top: 1.4rem;
    }
</style>