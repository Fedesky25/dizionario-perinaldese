<script lang="ts">
    const id = crypto.randomUUID();
    export let title: string = '';
    export let open = false;
</script>

<div>
    <input type="checkbox" id={id} bind:checked={open}>
    {#if title || $$slots.title}
    <label for={id}>
        <slot name="title">{title}</slot>
    </label>
    {/if}
    <div class="grid">
        <div class="inner"><slot /></div>
    </div>
</div>

<style>
    input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        transform: scale(0);
    }
    .grid {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 150ms ease-in-out;
    }
    .inner {
        min-height: 0;
        opacity: 0;
        clip-path: inset(0 0 100% 0);
        transition: opacity 150ms ease-in-out, clip-path 150ms ease-in-out;
    }
    input:checked ~ .grid {
        opacity: 1;
        grid-template-rows: 1fr;
    }
    input:checked ~ .grid > .inner {
        clip-path: inset(0);
        opacity: 1;
    }
    label {
        display: block;
        position: relative;
        cursor: pointer;
        user-select: none;
        margin-bottom: .3rem;
    }
    label::after {
        content: '';
        height: 0;
        display: inline-block;
        margin-left: 1ch;
        border-right: 6px solid var(--collapsible-marker-color, rgba(119, 136, 153, 0.6));
        border-bottom: 6px solid transparent;
        border-top: 6px solid transparent;
        transform: translateX(-3px);
        transition: transform .3s ease;
    }
    input:checked + label::after {transform: translateX(-3px) rotate(-90deg);}
</style>