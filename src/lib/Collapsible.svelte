<script lang="ts">
    const id = crypto.randomUUID();
    export let title: string = '';
    export let open = false;
</script>

<div>
    <input type="checkbox" id={id} bind:checked={open}>
    {#if title}
    <label for={id}>{title}</label>
    {/if}
    <div class="grid">
        <div><slot /></div>
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
        opacity: 0;
        display: grid;
        grid-template-columns: 0fr;
        transition: grid-template-columns .3s linear, opacity .3s linear;
    }
    input:checked ~ .grid {
        opacity: 1;
        grid-template-columns: 1fr;
    }
    label {
        display: block;
        margin: 0 auto;
        width: max-content;
        position: relative;
        cursor: pointer;
        user-select: none;
        font-size: 1.5em;
        font-weight: 700;
    }
    label::after {
        content: '';
        position: absolute;
        top: calc(50% - 4px);
        right: -20px;
        border-right: 6px solid lightslategray;
        border-bottom: 6px solid transparent;
        border-top: 6px solid transparent;
        transform: translateX(-3px);
        transition: transform .3s ease;
    }
    input:checked + label::after {transform: translateX(-3px) rotate(-90deg);}
</style>