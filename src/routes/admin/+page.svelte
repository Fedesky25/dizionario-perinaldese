<script lang="ts">
    import { goto } from "$app/navigation";
    async function logout() {
        await fetch("/logout", {
            credentials: "include",
            method: "POST"
        });
        goto("/");
    }
</script>

<main>
    <h1>Seleziona l'editor</h1>
    <ul>
        <li>
            <a href="/admin/dizionario" class="worded">
                <h2>Dizionario</h2>
                <p>Aggiungi, modifica ed elimina parole perinaldesi, con descrizioni, sinonimi, contrari, declinazioni, e coniugazioni annessi.</p>
            </a>
        </li>
        <li>
            <a href="#top" class="wip">
                <h2>Proverbi</h2>
                <p>Gestisci i detti e i proverbi della parlata ligure, fornendo traduzioni letterali, approfondendo il significato e origine.</p>
            </a>
        </li>
        <li>
            <a href="#top" class="wip map">
                <h2>Mappa perinaldese</h2>
                <p>Gestisci la mappa culturale e storica di Perinaldo, indicando sentieri, carruggi, campagne, chiese, edifici importanti e tanti altri luoghi di interesse.</p>
            </a>
        </li>
        <li>
            <a href="#top" class="wip">
                <h2>Casate perinaldesi</h2>
                <p>Registra ed organizza le famiglie perinaldesi.</p>
            </a>
        </li>
    </ul>
</main>
<button on:click={logout}>Log out</button>

<style>
    :global(body) {
        background-color: #f2f2f2;
    }
    main {
        padding: 1rem;
        max-width: 60rem;
        padding-bottom: 6rem;
    }
    h1 {
        color: #9AB973;
        margin-bottom: 4rem;
        text-align: center;
    }
    ul {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr);
        gap: 3rem;
    }
    a {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: #f2f2f2;
        border-radius: 2rem;
        box-shadow:  2rem 2rem 4rem #c9c9c9,
                    -2rem -2rem 4rem #ffffff;
        color: #212121;
        text-decoration: none;
    }
    h2 {
        font-size: 1.4rem;
        text-decoration: underline dashed #9AB973;
    }
    p {
        margin-top: 1rem;
        text-align: center;
    }
    .worded::before,
    .worded::after {
        position: absolute;
        font-weight: 600;
        font-size: 1.8rem;
        color: lightslategray;
        opacity: .1;
        transform-origin: left;
        width: max-content;
    }
    .worded::before {
        content: 'parola: Pȓeiñ\2936 audencu';
        top: .5rem;
        left: 1rem;
        transform: rotate(2deg);
    }
    .worded::after {
        content: 'traduzione: Pe_inaldese';
        text-align: right;
        bottom: .8rem;
        left: 1rem;
        transform: rotate(-5deg);
    }
    .wip, .worded {
        position: relative;
        overflow: hidden;
    }
    .wip::after {
        content: 'Work in progess';
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        padding: .5rem 1rem;
        background-color: lightslategray;
        color: white;
        font-weight: 600;
        border-bottom-left-radius: 22px;
        border-top-right-radius: 22px;
        box-shadow: 0 0 20px rgba(0,0,0,.2);
    }
    .map {
        background-image: linear-gradient(to left, rgba(0,0,0,.35), rgba(0,0,0,.35)), url('/mappaPeri.png');
        background-size: cover;
        background-position: center;
        color: white;
    }
    button {
        position: fixed;
        bottom: 0;
        right: 0;
        border: #9AB973 1px solid;
        padding: .4rem .8rem;
        background-color: #ffffff20;
        cursor: pointer;
    }
    @media (min-width: 50rem) {
        :global(body) {
            height: 100vh;
            display: grid;
            place-items: center;
        }
        main {
            padding: 2rem;
        }
        ul {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 5rem;
        }
        a {
            padding: 2.5rem;
        }
        button {
            bottom: 1rem;
            right: 1rem;
        }
    }
</style>