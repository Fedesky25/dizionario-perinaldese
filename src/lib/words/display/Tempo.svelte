<script lang="ts">
    import type { Voci } from "../types"; 

    export let nome: string;
    export let voci: Voci;
</script>

<h5>{nome}</h5>
<ul>
    {#each voci as v}
        <li>{v}</li>
    {/each}
</ul>