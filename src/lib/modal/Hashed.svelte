<script lang="ts" generics="T">
	import { onMount } from "svelte";
    import { enhance } from "$app/forms";
	import { clientFormHandler } from "$lib/form-utils";
	import Loading from "$lib/Loading.svelte";

    export let encourage = false;
    export let hashRegExp: RegExp;
    export let action: string;
    export let parse: (arr: RegExpExecArray) => T|null;
    export let execute: (data: T, form: FormData) => Promise<void>;

    $: if(hashRegExp.source[0] !== "#") throw Error("Hashed modal regexp must start with #");

    let arr: RegExpExecArray|null = null;
    $: data = arr ? parse(arr) : null;
    
    let persistent_data: T|null = null;
    $: if(data !== null) persistent_data = data;
    
    const handler = clientFormHandler(null, async ({formData}) => {
        if(!data) throw "WTF";
        await execute(data, formData);
        exit();
    });

    $: data && handler.reset();
    
    // let _data: T|null = null;
    // $: delayEnd(data);
    // let req: ReturnType<typeof setTimeout>|null = null;
    // async function delayEnd(d: T|null) {
    //     if(req) clearTimeout(req);
    //     if(d === null) {
    //         req = setTimeout(() => _data = null, 260);
    //     }
    //     else {
    //         req = null;
    //         _data = d;
    //     }
    // }

    interface $$Slots {
        default: {
            titleID: string;
            descID: string;
            data: T
        }
    }

    const ID = crypto.randomUUID();
    const titleID = ID + "-title";
    const descID = ID + "-desc";


    function exit() { if(data) history.back(); }
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
    function syncWithHash() { arr = hashRegExp.exec(window.location.hash); }
    onMount(syncWithHash);
</script>

<svelte:window on:hashchange={syncWithHash} />

<div 
    role="presentation" 
    class="back-drop" 
    class:show={data !== null}
    on:click={exit}
    use:move
></div>
<div 
    role="dialog" 
    class="popup" 
    aria-hidden={data === null} 
    aria-labelledby={titleID} 
    aria-describedby={descID} 
    tabindex="-1" 
    on:keyup={escape} 
    use:setFocus={data !== null}
    use:move>
    <form {action} method="post" class:submitting={$handler.submitting} use:enhance={handler.submit}>
        {#if persistent_data !== null}
        <slot {titleID} {descID} data={persistent_data} />
        {/if}
        {#if $handler.submitting}
        <Loading />
        {:else}
        <div class="btns">
            <button class:fill={!encourage} type="button" on:click={exit}>Annulla</button>
            <button class:fill={encourage} type="submit">Conferma</button>
        </div>
        {/if}
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
        z-index: 201;
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
        font-weight: 600;
    }
</style>