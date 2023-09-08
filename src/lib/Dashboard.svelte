<script lang="ts">
    export let title: string;
</script>

<svelte:head>
    <title>{title} | Dizionario Perinaldese</title>
</svelte:head>

<div class="container">
    <h1>{title}</h1>
    <div class="text">
        <slot name="text" />
    </div>
    <div class="interaction">
        <slot name="interaction" />
    </div>
    <div class="table-container">
        <div class="scrollable">
            <slot name="data" />
        </div>
    </div>
</div>

<style>
    .container {
        overflow: hidden;
        background-color: #f8f8f8;
        display: grid;
        width: 100%;
        max-width: 100%;
        height: 100dvh;
        overflow: hidden;
    }
    .interaction {display: flex;}
    .table-container {
        max-height: 100%;
    }
    @media (max-width: 100ch) {
        .container {
            position: absolute;
            inset: 0;
            grid-template-rows: auto 1fr auto;
        }
        h1 {
            grid-row: 1;
            padding: .5rem;
            text-align: center;
        }
        .text {display: none;}
        .interaction {
            background-color: white;
            padding: .5rem 1rem;
            box-shadow: 0 0 25px #0001;
            grid-row: 3;
            justify-content: space-between;
            column-gap: 1rem;
        }
        .table-container {
            grid-row: 2;
            overflow: scroll;
        }
        .scrollable {
            width: max-content;
        }

    }
    @media (min-width: 100ch) {
        .container {
            max-height: 100vh;
            grid-template-columns: 32ch 1fr;
            grid-template-rows: repeat(3, auto) 1fr;
            row-gap: 1rem;
            column-gap: 1rem;
            padding: 2.5rem;
            /* padding-bottom: 3rem; */
        }
        h1 {grid-row: 1;}
        .text {
            grid-row: 2;
            margin-bottom: .5rem;
        }
        .interaction {
            grid-row: 3;
            flex-direction: column;
            align-items: start;
            row-gap: 1rem;
        }
        h1, .text, .interaction {grid-column: 1;}
        .table-container {
            grid-column: 2;
            grid-row: 1/6;
            background-color: white;
            border-radius: 1rem;
            box-shadow: 0 0 45px #0001;
            padding: 1rem;
            margin: 0 auto;
            width: 100%;
            max-width: 80ch;
            position: relative;
            align-self: start;
            height: fit-content;

            
            display: flex;
            flex-direction: column;
            /* https://stackoverflow.com/questions/27784727/how-to-make-child-div-scrollable-when-it-exceeds-parent-height */
        }
        .scrollable {
            overflow-y: scroll;
            max-height: 100%;
            height: 100%;
            scrollbar-width: thin;
            scrollbar-color: #e1e1e1 transparent;
        }
    }
    @media (min-width: 140ch) {.container {grid-template-columns: 42ch 1fr;}}
</style>