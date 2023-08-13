<script lang="ts">
	import type { SinCon } from "../types";

    export let title: string;
    export let data: SinCon[];

    function wordLink(this: HTMLButtonElement) {

    }
</script>

{#if data.length}
    <div class="one-line">
        <h3>{title}:</h3>
        <ul>
            {#each data as item}
                <li>
                    <button 
                        data-id={item.id} 
                        data-parola={item.parola}
                        on:click={wordLink}
                    >{item.parola}</button>
                </li>
            {/each}
        </ul>
    </div>
{/if}

