<script lang="ts">
	import { getContext, onDestroy } from "svelte";

    export let open = false;
    export let title: string|undefined = undefined;
    const name = getContext<string>("tab-group-name");
    const register = getContext<() => any>("tab-register");
    const id = crypto.randomUUID();

    if(register) onDestroy(register());
</script>

<input type="radio" checked={open} {name} {id} aria-hidden="true">
<label for={id} aria-hidden="true">
    <slot name="title">{title}</slot>
</label>
<div>
    <slot />
</div>

<style>
    input {
        position: absolute;
        transform: scale(0);
        opacity: 0;
    }
    label {
        grid-row: 1;
        display: block;
        padding: .5rem .8rem;
        text-align: center;
        cursor: pointer;
        font-size: inherit;
    }
    div {
        grid-row: 3;
        grid-column: 1/-1;
        opacity: 0;
        transition: opacity 250ms ease;
    }
    input:checked + label {
        border-bottom: 2px solid var(--rosso);
    }
    input:checked + label + div {
        opacity: 1;
        /* transition: opacity 250ms ease 50ms; */
    }
</style>