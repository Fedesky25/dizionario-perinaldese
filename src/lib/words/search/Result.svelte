<script lang="ts">
    export let data: {parola: string, funzione: string, traduzione: string};
</script>

<div>
    <span class="lex">{data.parola}</span>
    <span class="fgs">{data.funzione}</span>
    <span class="tra">{data.traduzione}</span>
</div>

<style>
    div {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 3ch;
    }
    .lex {
        font-weight: 700;
        grid-row: 1;
        grid-column: 1;
        justify-self: start;
    }
    .fgs {
        color: lightslategray;
        grid-row: 1;
        grid-column: 2;
        justify-self: end;
    }
    .tra {
        grid-row: 2;
        grid-column: 1/3;
        justify-self: start;
    }
    .tra::before {
        content: ">> ";
        color: #ccc;
    }
</style>