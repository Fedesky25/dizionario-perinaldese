<script lang="ts">
    import Search from "$lib/words/Search.svelte";
    import Collapsible from "$lib/Collapsible.svelte";
    import { Tab, TabContainer } from "$lib/tabs";
    import Display from "$lib/words/display/Index.svelte";

    import type { PageData } from "./$types";
	import { goto } from "$app/navigation";

    export let data: PageData;
    $: console.log(data);

    let rolling = false;
    function random() {}

    let retrieving = false;
    async function select(id: number|null, parola: string) {
        if(retrieving) return;
        retrieving = true;
        await goto("/?parola="+(id||parola), {
            keepFocus: true,
            noScroll: true
        });
        retrieving = false;
    }
</script>

<div class="griglia">
    <svg viewBox="-10 -10 370 470" id="logo">
        <path d="M60,0 L330,0 A30,30,0,0,1,360,30 L360,420 A30,30,0,0,1,330,450 L60,450 Z" fill="#9AB973"/>
        <path d="M54,0 L54,450 L25,450 A25,25,0,0,1,0,425 L0,25 A25,25,0,0,1,25,0 Z" fill="#414141"/>
        <polygon points="54,0 60,0 60,450, 54,450" fill="282828" />
        <polygon points="296,0 360,64 360,296 214,146" fill="#85a749" />
        <polygon points="214,0 296,0 296,180 255,152 214,180" fill="#ededed" />
        <polygon points="120,240 120,274 300,274 300,240" fill="#6b8f1e" />
        <polygon points="150,300 150,334 270,334 270,300" fill="#6b8f1e" />
    </svg>
    <nav>
        <ul>
            <li class="from-top small"><a href="/grammatica">grammatica</a></li>
            <li class="from-top small"><a href="#progetto">progetto</a></li>
            <li class="from-top small"><a href="#contattaci">contattaci</a></li>
        </ul>
    </nav>
    <div class="side-bar"></div>
    <h1 class="from-left">
        <span>Dizionario</span>
        <span>Pȓeiñaudencu</span>
    </h1>
    <p class="from-bottom introduction">Il portale online di parole e detti della parlata ligure perinaldese: cerca ora un termine in italiano o in pȓeiñaudencu!</p>
    <div class="color-rect from-top"></div>
    <div class="ricerca-box">
        <label for="ricerca">
            <Search 
                id="ricerca" 
                placeholder="Cerca..." 
                url="/?operazione=cerca&filtro=" 
                on:word={e => select(e.detail.id, e.detail.parola)}>
                <p slot="empty">Clicca sul dado per vedere una parola casuale</p>
            </Search>
        </label>
        <button on:click={random} class:rolling>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1.3rem" height="1.3rem">
                <rect width="100" height="100" fill="currentColor" rx="20" ry="20" />
                <circle cx="50" cy="50" r="10" fill="white" />
                <circle cx="25" cy="25" r="10" fill="white" />
                <circle cx="75" cy="25" r="10" fill="white" />
                <circle cx="75" cy="75" r="10" fill="white" />
                <circle cx="25" cy="75" r="10" fill="white" />
            </svg>
        </button>
    </div>
    <div id="word-show">
        {#if data.error}
            <h2 class="code">{data.code}</h2>
            <p class="error">{data.error}</p>
        {:else if data.words}
        {#each data.words as word}
            <Display {word} />
        {/each}
        {/if}
    </div>
    <div class="convenzioni" id="convenzioni">
        <h2 class="from-top small">Convenzioni</h2>
        <div class="side-bar"></div>
        <p class="from-right"> 
            Per rappresentare i fonemi della parlata perinaldese in forma scritta, vengono usati speciali caratteri. 
            Sono stati adottati in buona parte le convenzioni del Vocabolario delle Parlate Liguri, ma in 
            alcuni casi abbiamo reputato necessario differire in parte.
        </p>
        <ul class="from-right">
            <li>
                <Collapsible title="Perché l'accento circonflesso?">
                    L'accento circonflesso sulle vocali è segnale in tutti i casi di contrazione, un fenomeno per cui alcuni suoni cadono e la vocale prima di questi si allunga (allungamento di compenso)
                </Collapsible>
            </li>
            <li>
                <Collapsible title="Com'è la desinenza infinito presente?">
                    Dal momento che la desinenza dell'infinito presente ha sempre una contrazione, contrariamente a quanto propone il V.P.L., ovvero di scrivere gli infiniti "-àa" o "-èe" (grafia che usiamo per i participi, in quanto crediamo sia logicamente più adatta), scriveremo rispettivamente <span class="char">-&acirc;</span> o <span class="char">-&ecirc;</span>
                </Collapsible>
            </li>
            <li>
                <TabContainer>
                    <Tab title="ô" open>
                        Il carattere <span class="char">ô</span> indica, oltre alla presenza di una contrazione, un dittongo di pronuncia simile a <span class="char">òu</span>, risultato del precedente fenomeno
                    </Tab>
                    <Tab title="ü">
                        Il carattere <span class="char">ü</span> si pronuncia come la <span class="char">ü</span> tedesca, in IPA vocale anteriore chiusa arrotondata [y]
                    </Tab>
                    <Tab title="ö">
                        Il carattere <span class="char">ö</span> indica il suono <span class="char">eu</span> francese, in IPA vocale anteriore semichiusa arrotondata [ø]
                    </Tab>
                    <Tab title="ȓ">
                        Il carattere <span class="char">ȓ</span>, presente in alcuni dialetti montani e del ponente, indica la tipica <span class="char">r</span> inglese di "rise", l'approssimante alveolare [ɹ]
                    </Tab>
                    <Tab title="ñ">
                        Il carattere <span class="char">ñ</span> indica una "n fantasma", in IPA nasale velare [ŋ]
                    </Tab>
                    <Tab title="x">
                        Il carattere <span class="char">x</span> corrisponde alla <span class="char">j</span> francese, in IPA fricativa postalveolare sonora [ʒ]
                    </Tab>
                    <Tab title="s-">
                        Il digramma <span class="char">s-</span> indica la presenza di un suono <span class="char">sc</span> (del tipo "sci"), in IPA fricativa postalveolare sorda [ʃ], prima di una consonante, pronunciando sia il suono <span class="char">sc</span> sia la consonante seguente
                    </Tab>
                </TabContainer>
            </li>
        </ul>
    </div>
</div>
<section class="colored textual" id="progetto">
    <h2>Il progetto</h2>
    <div class="text">
        <p>Il <i>dizionario pȓeiñaudencu</i> consiste nella raccolta di quanti possibili vocaboli del perinaldese, variante della lingua ligure di Perinaldo, paesino in provincia di Imperia al confine francese. Vengono gradualmenti registrati i lessemi sia comuni che più desueti, con attenzione al contesto agricolo in cui nacque Perinaldo e la sua parlata.</p>
        <p>Gli obbiettivi finali, seppur inizialmente individuabili nella sola creazione di una app android, sono ora molteplici e mirati alla facile fruizione del vocabolario stesso, sia su mobile offline e sia online su ogni dispositivo.</p>
        <ul>
            <li>Vocabolario online ricco di descrizioni, esempi, declinazioni e coniugazioni</li>
            <li>Futura sezione riguardo detti e modi di dire</li>
            <li>Sezione dedicata alla grammatica, in particolare morfologia e fonologia</li>
        </ul>
        <p>Il team dietro al progetto è composto da due ragazzi dalle origini perinaldesi che, innamoratisi del paese e della sua cultura, hanno deciso di creare e proporre un vocabolario digitale ricco e più completo possibile. Siamo Federico e Francesco che, sfruttando le conoscenze infomatiche dell'uno e storico-linguistiche dell'altro, raccogliamo parole, frasi, detti dei nostri parenti perinaldesi e tanti altri abitanti del paese.</p>
        <p>Infine, il progetto vuole essere un dolce tributo alle nostre nonne, Paola Guglielmi e Angela Borgogno, per noi fonte in primis di insostituibile compagnia e in secundis di molti e ricercati termini perinaldesi. A loro è volto un sincero ringraziamento.</p>
    </div>
</section>
<section id="contattaci">
    <h2>Contattaci</h2>
    <p class="central-p">
        Vuoi contattarci per ulteriori informazioni o curiosità? Usa il modulo qui sotto!
        Inoltre, sentiti libero/a di contribuire suggerendo modifiche o nuove parole:
        in tal caso specifica con chiarezza parola, traduzione, e opzionalmente gli altri
        campi (descrizione/approfondimento, esempi, sinonimi, ...)
    </p>
    <form action="https://formspree.io/f/xrgorpnw" method="POST" id="contact-form">
        <div class="form-group--normal">
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome" minlength="3" required>
        </div>
        <div class="form-group--normal">
            <label for="cognome">Cognome</label>
            <input type="text" id="cognome" name="cognome" minlength="3" required>
        </div>
        <div class="form-group--large">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" required>
        </div>
        <div class="form-group--large">
            <label for="messaggio">Messaggio</label>
            <textarea name="messaggio" id="messaggio" cols="30" rows="10" minlength="10" required></textarea>
        </div>
        <div class="form-group--normal centered">
            <button type="submit" id="contact-form-submit">Invia</button>
        </div>
        <div class="form-group--normal centered" id="contact-form-feedback"></div>
    </form>
</section>
<footer>
    <a href="mailto:dizionario.perinaldese@gmail.com?subject=Richiesta informazioni">dizionario.perinaldese@gmail.com</a>
    <br><br>
    Dizionario Pȓeiñaudencu&trade; 2020-2022
</footer>
<div class="water-mark perinaldese" role="presentation" aria-hidden="true">Pȓeiñaudencu</div>

<style>
    :global(body){overflow-x: hidden;}

    .water-mark {
        --b: 0vh;
        position: fixed;
        top: 1rem;
        right: 0;
        color: rgba(127, 127, 127, .045);
        font-size: 13rem;
        font-weight: 700;
        z-index: -3;
        user-select: none;
        white-space: nowrap;
        transform-origin: top right;
        transform: rotate(-90deg) translate(var(--b), -94%);
    }
    h2 {
        font-size: 2rem;
        text-align: center;
    }
    h2.code {
        color: #BB5E64;
        font-size: 4rem;
    }
    p.error {
        text-align: center;
        max-width: 25ch;
        margin: .3rem auto;
    }
    .griglia {
        display: grid;
        grid-template-rows: 18px auto 60px auto auto 2rem auto 2rem 60px auto auto auto;
        grid-template-columns: 6px 12px auto auto 12px 6px;
        position: relative;
    }
    .griglia #logo {
        grid-row: 2/3;
        grid-column: 3/4;
        height: 30px;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 5rem;
        filter: drop-shadow(0 2.5px 2px #a8a8a8);
    }
    .griglia nav {
        grid-row: 2/3;
        grid-column: 4/5;
        justify-self: right;
        margin-top: auto;
        margin-bottom: auto;
    }
    nav ul {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        justify-content: flex-end;
        padding: 0;
    }
    nav ul li {margin: .15rem .5rem;}
    nav ul li a {
        text-decoration: none;
        color: lightslategray;
        transition: color ease-in-out .2s;
        font-weight: 600;
        font-size: .9rem;
        text-transform: uppercase;
    }
    nav ul li a:hover {color: #556B2F;}

    .griglia .side-bar {
        background-color: lightslategray;
        grid-row: 4/6;
    }
    h1 {
        grid-row: 5/6;
        grid-column: 3/5;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    h1 :first-child {
        font-size: 1.1rem;
        line-height: 1rem;
    }
    h1 :last-child {
        font-size: 2.5rem;
        line-height: 2.4rem;
    }
    .introduction {
        grid-row: 7/8;
        grid-column: 3/5;
        max-width: 450px;
    }
    .ricerca-box {
        grid-row: 9/10;
        grid-column: 3/5;
    }
    #word-show {
        grid-row: 10/11;
        grid-column: 3/5;
        width: 100%;
        max-width: 60ch;
        margin-top: 3rem;
        margin-left: auto;
        margin-right: auto;
        min-height: 50vh;
        text-align: justify;
    }
    /* Convenzioni */
    .convenzioni {
        grid-row: 11/12;
        grid-column: 1/7;
        padding: 2rem 1rem;
        min-height: max-content;
    }
    .convenzioni h2 {color: #9AB973;}
    .convenzioni p {
        text-align: justify;
        padding: 1rem 0;
    }
    .convenzioni ul {
        text-align: justify;
        padding-left: 1.5rem;
    }
    .convenzioni li {
        margin-bottom: .75rem;
    }
    .convenzioni span.char::before, .convenzioni span.char::after {color: rgba(119, 136, 153, 0.9);}
    .convenzioni span.char::before {content: '\201C'; margin-right: .07em;}
    .convenzioni span.char::after {content: '\201D'; margin-left: .07em;}

    @media (max-width: 80ch) {
        section {
            padding: 1.5rem;
            margin-top: 3rem;
            margin-bottom: 3rem;
        }
    }
    @media (min-width: 80ch) {
        section {
            padding: 3.5rem;
            margin-top: 5rem;
            margin-bottom: 5rem;
        }
    }
    section.colored {
        background-color:#556B2F;
        color: white;
    }
    section:not(.colored) > h2 {color: #556B2F;}
    section > h2 {margin-bottom: 2rem;}
    .text {
        column-width: 40ch;
        column-gap: 2rem;
        width: 100%;
        max-width: 100ch;
        margin: 0 auto;
    }
    .text > p,
    .text > ul {
        margin-bottom: 1rem;
        break-inside: avoid;
    }
    .text > p {
        text-align: justify;
    }
    .text > ul {
        padding-left: 2.5ch;
    }
    .text > ul > li {margin-bottom: .4rem;}
    .central-p {
        display: block;
        max-width: 60ch;
        margin: 0 auto;
        text-align: justify;
    }

    form {margin-top: 3rem;}
    @media (max-width: 70ch){
        form > * + * {margin-top: .8rem;}
    }
    @media (min-width: 70ch) {
        form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            max-width: 75ch;
            margin: 3rem auto 0;
            column-gap: 2.5rem;
            row-gap: 1.5rem;
        }
        .form-group--normal {grid-column-end: span 1;}
        .form-group--large {grid-column-end: span 2;}
    }

    @media screen and (min-width: 860px) {
        .water-mark {
            bottom: 2rem;
            left: 5rem;
            top: unset;
            right: unset;
            font-size: 17rem; 
            transform: translateY(calc(-1 * var(--b)));
        }
        .griglia {
            grid-template-rows: 20px auto 80px auto auto 3rem auto 3rem 60px auto 5rem auto 5rem auto;
            grid-template-columns: 10px 30px 1fr 30px 1fr 30px 10px;
        }
        .griglia nav {
            grid-row: 2/3;
            grid-column: 5/8;
            justify-self: center;
            margin-right: 10px;
        }
        nav ul {flex-wrap: nowrap;}
        nav ul li + li {margin-left: 1.2rem;}
        nav ul li {position: relative;}
        nav ul li::after {
            content: '';
            position: absolute;
            top: -3px;
            left: 0;
            background-color: #ddd;
            height: 3px;
            width: 100%;
            transform: scale(0, 1);
            transition: transform ease-in-out .15s;
        }
        nav ul li:hover::after {transform: scale(1, 1);}
        nav ul li a {
            color: white;
            font-size: 1rem;
        }
        nav ul li a:hover {color: #eee;}

        h1 {
            grid-row: 5/6;
            grid-column: 3/6;
        }
        h1 :first-child {
            font-size: 1.3rem;
            line-height: 1.2rem;
        }
        h1 :last-child {
            font-size: 4.2rem;
            line-height: 3.8rem;
        }
        .introduction {
            grid-row: 7/8;
            grid-column: 3/4;
        }
        .color-rect {
            background-color: #9AB973;
            grid-row: 1/9;
            grid-column: 5/8;
            z-index: -2;
            position: relative;
        }
        .color-rect::before {
            content: '';
            position: absolute;
            top: 3px;
            left: 0;
            right: 0;
            width: 100%;
            height: 5rem;
            background-color: #9AB973;
            transform: translateY(-100%);
        }
        /*.griglia .water-mark.perinaldese {
            grid-row: 8/11;
            grid-column: 3/8;
            bottom: -2.5rem;
            display: none;
        }*/
        .griglia .ricerca-box {
            grid-row: 10/11;
            grid-column: 3/6;
        }

        #word-show {
            grid-row: 12/13;
            grid-column: 3/6;
            max-width: 72ch;
            margin-top: 0;
        }
        /*.griglia .water-mark.parola {
            grid-row: 12/13;
            grid-column: 3/8;
            bottom: 3rem;
        }*/

        .convenzioni {
            max-width: 45ch;
            justify-self: end;
            grid-row: 14/15;
            grid-column: 1/7;
            display: grid;
            grid-template-columns: auto 5px;
            grid-template-rows: repeat(3,auto);
            column-gap: 1.25rem;
            row-gap: 2rem;
            padding: 0;
        }
        .convenzioni .side-bar {
            grid-row: 1/3;
            grid-column: 2;
        }
        .convenzioni h2,
        .convenzioni p,
        .convenzioni ul {
            grid-column: 1;
            text-align: right;
            padding: 0;
        }
        .convenzioni h2 {
            line-height: 2rem;
        }
        .convenzioni ul {
            list-style: none;
            --collapsible-head-justify: right;
        }
        .convenzioni li {
            margin-bottom: .8rem;
            position: relative;
        }
        .convenzioni li::after {
            content: '';
            position: absolute;
            right: -25px;
            top: 3px;
            bottom: 2px;
            width: 5px;
            background-color: rgba(119, 136, 153, .15);
            border-radius: 2.5px;
        }
    }

    @media screen and (min-width: 1080px) {
        .griglia {
            grid-template-columns: 10px 40px minmax(18rem, 1.1fr) 40px .75fr 3fr 10px;
            grid-template-rows: 30px auto 110px auto auto 4.5rem auto 4.5rem 90px auto;
        }
        .griglia nav {
            grid-row: 2/3;
            grid-column: 6/7;
            justify-self: right;
            margin-right: 20px;
        }
        nav ul li::after {background-color: #6B8E23;}
        nav ul li a {color: lightslategray;}
        nav ul li a:hover {color: #556B2F;}
        .griglia .color-rect {
            grid-row: 1/9;
            grid-column: 5/6;
        }
        .griglia .ricerca-box {
            grid-row: 4/6;
            grid-column: 6/7;
        }
        #word-show {
            grid-row: 7/12;
            grid-column: 6/7;
            padding-left: 3rem;
            padding-right: 3rem;
        }
        /*.griglia .water-mark.parola {
            grid-row: 10/12;
            grid-column: 6/7;
        }*/
        .convenzioni {
            grid-row: 10/11;
            grid-column: 3/6;
            color: #555;
        }
    }

    .ricerca-box {
        margin-left: auto;
        margin-right: auto;
        margin-top: auto;
        position: relative;
    }
    .ricerca-box label {
        --search-space-below: 2rem;
        display: block;
        border: none;
        cursor: text;
        border-bottom: 2.5px solid lightslategray;
        transition: border-bottom-color ease-in-out .8s;
        padding: .5rem 2.5rem;
        padding-right: calc(2.5rem + 22px);
        max-width: 20rem;
        font-size: 1.1rem;
        font-weight: 600;
        background-color: transparent;
    }
    .ricerca-box label:focus-within {
        border-bottom-color: #9AB973;
    }
    .ricerca-box button {
        position: absolute;
        right: 2.15rem;
        bottom: .35rem;
        cursor: pointer;
        height: 2rem;
        width: 2rem;
        color: lightslategray;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color ease-in-out .4s;
        background-color: transparent;
        border: none;
    }
    .ricerca-box button:hover{color: #BB5E64;}
    .ricerca-box svg {transform: rotate(20deg);}
    .ricerca-box button.rolling svg {
        transform: rotate(380deg); 
        transition: transform .8s cubic-bezier(.6, 0, .15, 1);
    }

    #word-show {transition: opacity .2s ease-in;}
    /* #word-show.hide {opacity: 0;} */

    form input[type=text], form input[type=email], form textarea {
        width: 100%;
        font-size: 13pt;
        font-weight: 600;
        padding: .4em .5em;

        color: #444;
        border-radius: 3.5px;
        border-width: 1px;
        border-color: rgba(119, 136, 153, .35);
        border-style: solid;
        box-shadow: 0 0 15px rgba(0,0,0,.04);
        transition: border-color ease-out .3s;

        margin-top: .3rem;
        background-color: #fff8;
        /* backdrop-filter: blur(4px); bad performance */
    }
    form input[type=text]:focus, form input[type=email]:focus, form textarea:focus {
        outline: none;
        border-color: rgba(154, 185, 115, .6);
    }
    form textarea {
        resize: vertical;
        min-height: 8rem;
    }
    form label {
        font-size: 12pt;
        font-weight: 500;
        padding: .5em .7em;
        margin-top: .6em;
        color: #555;
    }
    form button {
        color: #9AB973;
        background-color: #fff8;
        border-radius: 3px;
        border-color: #9AB973;
        border-width: 1px;
        border-style: solid;
        padding: .8rem 2.4rem;
        font-size: 14pt;
        font-weight: 700;
        transition: background-color ease-in-out .3s, color ease-in-out .3s, box-shadow ease-in-out .3s;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(0, 0, 0, .08);
        margin: 0 auto;
        display: block;
    }
    form button:hover {
        background-color: #9AB973;
        color: white;
        box-shadow: 0 0 40px rgba(0, 0, 0, .15);
    }
    form button:focus {
        outline: none;
        text-decoration: underline;
    }
    form button:disabled {
        background-color: lightslategray;
        color: white;
    }

    footer {
        background-color: rgb(63, 71, 78);
        color: white;
        text-align: center;
        margin-top: 7rem;
        padding: 3rem;
        font-weight: 600;
    }
    footer a {
        color: #BB5E64;
        filter: brightness(140%);
        text-decoration: none;
        transition: filter ease-in-out .1s;
    }
    footer a:hover {
        filter: brightness(200%);
    }

    .from-left {animation: fade-from-left .8s ease-out backwards;}
    .from-right {animation: fade-from-rigth .8s ease-out backwards 1s;}
    .from-top {animation: clip-from-top 1.2s cubic-bezier(0.215, 0.610, 0.355, 1) backwards;}
    .from-top.small {
        animation-duration: .4s;
        animation-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
        animation-delay: .6s;
    }
    .from-bottom {animation: fade-from-bottom .7s ease-out backwards .2s;}
    @keyframes fade-from-left {
        0% {opacity: 0; transform: translateX(-35px);}
        100% {opacity: 1; transform: translateX(0);}
    }
    @keyframes fade-from-rigth {
        0% {opacity: 0; transform: translateX(35px);}
        100% {opacity: 1; transform: translateX(0);}
    }
    @keyframes fade-from-bottom {
        0% {opacity: 0; transform: translateY(35px);}
        100% {opacity: 1; transform: translateY(0);}
    }
    @keyframes clip-from-top {
        0% {clip-path: inset(0 0 100% 0);}
        100% {clip-path: inset(0 0 0 0);}
    }
</style>