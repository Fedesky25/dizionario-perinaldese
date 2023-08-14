<script lang="ts">
	import type { SinCon } from "../types";

    export let title: string;
    export let data: SinCon[];

    function wordLink(this: HTMLButtonElement) {

    }
</script>

{#if data.length}
    <div>
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

<style>
    div {
        display: flex;
        align-items: baseline;
        margin-top: 2rem;
    }
    h3 {
        font-size: 1.2rem;
    }
    ul {
        list-style: none;
        display: flex;
        padding-left: 0;
    }
    li {
        margin-left: 1.5ch;
    }
    button {
        border: none;
        background: transparent;
        cursor: pointer;
    }
</style>

