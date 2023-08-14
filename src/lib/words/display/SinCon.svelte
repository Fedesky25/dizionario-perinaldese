<script lang="ts">
	import type { SinCon } from "../types";

    export let title: string;
    export let data: SinCon[];
</script>

{#if data.length}
    <div>
        <h3>{title}:</h3>
        <ul>
            {#each data as item}
                <li>
                    <a 
                        href="/?parola={item.id||item.parola}"
                        data-sveltekit-noscroll
                        data-sveltekit-keepfocus
                    >{item.parola}</a>
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
        font-size: 1.4rem;
        color: #556B2F;
    }
    ul {
        list-style: none;
        display: flex;
        padding-left: 0;
    }
    li {
        margin-left: 1.5ch;
    }
    a {
        color: inherit;
        border: none;
        background: transparent;
        cursor: pointer;
        text-decoration: underline dashed var(--olivina);
    }
</style>

