<script lang="ts">
    import type { Voci } from "../types"; 

    export let nome: string;
    export let voci: Voci;
</script>

<div>
    <h5>{nome}</h5>
    <ul>
        {#each voci as v}
        <li>{v}</li>
        {/each}
    </ul>
</div>

<style>
    h5 {
        font-weight: 500;
        font-size: 1.05rem;
    }
    ul {
        padding-left: 2.5ch;
        color: #232323;
    }
    li::marker {
        color: hsl(210, 14%, 83%);
    }
</style>