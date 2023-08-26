<script lang="ts">
    // import { page } from "$app/stores";
	import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import type { ActionResult, SubmitFunction } from "@sveltejs/kit";

    export let encourage = true;
    export let hashRegExp: RegExp;
    export let action: string;

    type UpdateFormFunction = (options?: {reset: boolean;} | undefined) => Promise<void>;
    type OnResultType = (array: RegExpExecArray, update: UpdateFormFunction) => void|Promise<void>;

    export let onresult: undefined | ((
        regexp: RegExpExecArray, 
        action: ActionResult, 
        update: UpdateFormFunction
    ) => void|Promise<void>) = undefined;
    export let onsuccess: OnResultType |undefined = undefined;
    export let onfail: OnResultType | undefined = undefined


    let confirming = false;
    let arr: RegExpExecArray|null = null;
    // $: arr = hashRegExp.exec($page.url.hash);

    interface $$Slots {
        default: {
            titleID: string;
            descID: string;
            data: RegExpExecArray
        }
    }

    const ID = crypto.randomUUID();
    const titleID = ID + "-title";
    const descID = ID + "-desc";

    function exit() { if(arr) history.back(); }
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
        confirming = false;
    }
    function syncWithHash() { arr = hashRegExp.exec(window.location.hash); }
    onMount(syncWithHash);

    const afterResponse: ReturnType<SubmitFunction> = async ({ result, update }) => {
        let res: void | Promise<void>;
        if(onresult) res = onresult(arr!, result, update);
        else {
            if(result.type === "success" && onsuccess) res = onsuccess(arr!, update);
            else if(result.type === "failure" && onfail) res = onfail(arr!, update);
            else res = update();
        }
        if(res instanceof Promise) await res;
        confirming = false;
        exit();
    }

    const submit: SubmitFunction = ({ cancel }) => {
        if(confirming || !arr) return cancel();
        confirming = true;
        return afterResponse;
    }
</script>

<svelte:window on:hashchange={syncWithHash} />

<div 
    role="presentation" 
    class="back-drop" 
    class:show={!!arr}
    on:click={exit}
    use:move
></div>
<div 
    role="dialog" 
    class="popup" 
    aria-hidden={!arr} 
    aria-labelledby={titleID} 
    aria-describedby={descID} 
    tabindex="-1" 
    on:keyup={escape} 
    use:setFocus={!!arr}
    use:move>
    <form {action} method="post" class:submitting={confirming} use:enhance={submit}>
        {#if arr}
        <slot {titleID} {descID} data={arr} />
        {/if}
        <div class="btns">
            <button class:fill={!encourage} type="button" on:click={exit}>Annulla</button>
            <button class:fill={encourage} type="submit" on:click={confirm}>Conferma</button>
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
        color: var(--olivina);
        background-color: white;
        cursor: pointer;
    }
    button.fill {
        background-color: var(--olivina);
        color: white;
    }
    form.submitting {
        opacity: 0.8;
    }
</style>