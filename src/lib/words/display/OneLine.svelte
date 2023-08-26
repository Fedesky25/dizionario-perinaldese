<script lang="ts">
    export let words: {parola: string, id: number|null}[];
</script>

{#if words.length}
    <div>
        <slot />
        <ul>
            {#each words as item}
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
    }
    ul {
        list-style: none;
        display: flex;
        padding-left: 0;
    }
    li {
        margin-left: 1.5ch;
        padding: 0 .2ch;
        border-bottom: 1px dashed var(--olivina);
    }
    a {
        color: inherit;
        border: none;
        background: transparent;
        cursor: pointer;
        text-decoration: none;
        /* text-decoration: underline dashed var(--olivina); */
    }
</style>