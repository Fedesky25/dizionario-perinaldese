<script lang="ts">
	import { setContext } from "svelte";
    setContext("tab-group-name", crypto.randomUUID());
    setContext("tab-register", registerTab);

    let count = 0;
    function decrease() {count--;}
    function registerTab() {
        count++;
        return decrease;
    }
</script>

<div class="wrapper" style:--count={count}>
    <hr aria-hidden="true">
    <slot />
</div>

<style>
    .wrapper {
        display: grid;
        grid-template-columns: repeat(var(--count), 1fr);
        grid-template-rows: auto auto auto;
    }
    hr {
        grid-row: 2;
        grid-column: 1/-1;
        height: 0;
        border: none;
        border-top: 2px solid #ccc4;
        transform: translateY(-2px);
        margin-bottom: .5rem;
    }
</style>
