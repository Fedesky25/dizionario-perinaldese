import type { Declinazione, NumeroConiugazione, Voci, VociImperative, ConiugazioneRaw } from "./types"
import { TipoVerbo } from "./types";
import { formatta } from './utils';

const pronomi = {
    maschili: {
        normali: ['mi a', 'tü ti', 'elu u', 'nui a', 'vui u', 'eli i'],
        imperativi: ['(tü)', '(elu)', '(nui)', '(vui)', '(eli)']
    },
    femminili: {
        normali: ['mi a', 'tü ti', 'ela a', 'nui a', 'vui u', 'ele e'],
        imperativi: ['(tü)', '(ela)', '(nui)', '(vui)', '(ele)']
    }
}
const complementi: Voci = ['m', 't', 's', 's', 'v', 's'];

type Ausiliare = [Voci, Voci, Voci, Voci, Voci, Voci];
const ausiliari: {avere: Ausiliare, essere: Ausiliare, riflessivo: Ausiliare} = {
    avere: [
        ['hon', 'hai', "l'ha", 'amu', 'ave', 'han'],
        ['avia', 'avìi', "l'avia", 'avimu', 'avìi', 'avia'],
        ['aveȓon', 'aveȓai', "l'aveȓà", 'aveȓemu', 'aveȓei', 'aveȓan'],
        ['aglie', 'agli', "l'aglie", 'agliemu', 'agliei', 'aglie'],
        ['avesse', 'avessi', "l'avesse", 'avescimu', 'avessi', 'avesse'],
        ['aveȓia', 'aveȓisci', "l'aveȓia", 'aveȓiscimu', 'aveȓisci', 'aveȓia']
    ],
    essere: [
        ['sun', 'sei', "l'è", 'semu', 'sei', 'sun'],
        ['eia', 'ei', "l'eia", 'eimu', 'ei', 'eia'],
        ['seȓòn', 'seȓai', 'seȓà', 'seȓemu', 'seȓei', 'seȓan'],
        ['scia', 'sci', 'scie', 'semu', 'sei', 'scie'],
        ['fusse', 'fussi', 'fusse', 'fussimu', 'fussi', 'fusse'],
        ['seȓia', 'seȓisci', 'seȓia', 'seȓiscimu', 'seȓisci', 'seȓia']
    ],
    riflessivo: [
        ['me sun', 'te sei', "s'è", 'se semu', 've sei', 'se sun'],
        ['m\'eia', 't\'ei', "s'eia", 's\'eimu', 'v\'ei', 's\'eia'],
        ['me seȓòn', 'te seȓai', 'se seȓà', 'se seȓemu', 've seȓei', 'se seȓan'],
        ['me scia', 'te sci', 'se scie', 'se semu', 've sei', 'se scie'],
        ['me fusse', 'te fussi', 'se fusse', 'se fussimu', 've fussi', 'se fusse'],
        ['me seȓia', 'te seȓisci', 'se seȓia', 'se seȓiscimu', 've seȓisci', 'se seȓia']
    ]
}

type DesinenzeConiugazioni = [
    { seconda: Voci, altro: Voci },
    { seconda: Voci, altro: Voci },
    Voci, Voci, Voci, Voci
]

const coniugazione_default: DesinenzeConiugazioni = [
    {
        altro: ['u', 'i', 'a', 'amu', 'ai', 'a'],
        seconda: ['u', 'i', 'e', 'emu', 'ei', 'e']
    },
    {
        altro: ['ava', 'avi', 'ava', 'eiximu', 'eixì', 'ava'],
        seconda: ['ia', 'ìi', 'ia', 'eiximu', 'eixì', 'ia']
    },
    ['eȓon', 'eȓai', "eȓà", 'eȓemu', 'eȓei', 'eȓan'],
    ['e', 'i', 'e', 'amu', 'ai', 'e'],
    ['esse', 'essi', 'esse', 'essimu', 'essi', 'esse'],
    ['eȓia', 'eȓisci', 'eȓia', 'eȓiscimu', 'eȓisci', 'eȓia'],
]

interface ConiugazioneImperativo {
    riflessivo: [VociImperative, VociImperative, VociImperative]
    attivo: [VociImperative, VociImperative, VociImperative]
}

const imperativo_default: ConiugazioneImperativo = {
    riflessivo: [
        ['até', 'ese', 'amuse', 'aive', 'ese'],
        ['eté', 'ese', 'emuse', 'eive', 'ese'],
        ['ité', 'ese', 'imuse', 'iive', 'ese']
    ],
    attivo: [
        ['a', 'e', 'amu', 'ai', 'e'],
        ['e', 'e', 'emu', 'ei', 'e'],
        ['i', 'e', 'imu', 'ii', 'e']
    ]
}

enum OperazioneConiugazione { normal, del_I, del_H, add_H };

interface Indicativo {
    presente: Voci,
    passato_prossimo: Voci,
    imperfetto: Voci,
    trapassato_prossimo: Voci,
    futuro_semplice: Voci,
    futuro_anteriore: Voci,
}
interface Congiuntivo {
    presente: Voci,
    passato: Voci,
    imperfetto: Voci,
    trapassato: Voci,
}
interface Condizionale {
    presente: Voci,
    passato: Voci,
}
interface Coniugazione {
    avere: boolean;
    gerundio: string;
    participio: Required<Declinazione>;
    indicativo: Indicativo,
    congiuntivo: Congiuntivo,
    condizionale: Condizionale,
    imperativo: VociImperative
}

function startsWithVowel(s: string) {
    return s[0] == 'a' || s[0] == 'e' || s[0] == 'i' || s[0] == 'o' || s[0] == 'u';
}

function singolo(radice: string, desinenza: string, operazione: OperazioneConiugazione) {
    switch(operazione) {
        case OperazioneConiugazione.del_I:
            if(desinenza[0] == 'e' || desinenza[0] == 'i') return radice.slice(0,-1)+desinenza;
            break;
        case OperazioneConiugazione.del_H:
            if(desinenza[0] == 'a' || desinenza[0] == 'u') return radice.slice(0,-1)+desinenza;
            break;
        case OperazioneConiugazione.add_H:
            if(desinenza[0] == 'e' || desinenza[0] == 'i') return radice+'h'+desinenza;
            break;
    }
    return radice + desinenza;
}


export function coniuga(radice: string, coniugazione: ConiugazioneRaw): Coniugazione {
    const num = coniugazione.numero
    const tipo = coniugazione.tipo;
    const values = coniugazione.tempi || [];
    let operazione = OperazioneConiugazione.normal;
    if(num == 1) {
        if(radice.endsWith('ci') || radice.endsWith('gi')) operazione = OperazioneConiugazione.del_I;
        else if(radice.endsWith('c') || radice.endsWith('g')) operazione = OperazioneConiugazione.add_H;
    } else if(radice.endsWith('ch') || radice.endsWith('gh')) operazione = OperazioneConiugazione.del_H;

    const femminile = Math.random() > 0.5;
    const soggetti = femminile ? pronomi.maschili : pronomi.femminili;
    const avere = tipo === TipoVerbo.transitivo || tipo === TipoVerbo.intransitivo_avere;
    const ausiliare = avere ? ausiliari.avere : ausiliari.essere;
    const participio = computeParticipio(radice, coniugazione);
    const desinenzaPP: [singolare: string, plurale: string] = avere 
        ? [participio.ms, participio.ms] 
        : femminile 
        ? [participio.fs, participio.fp] 
        : [participio.ms, participio.mp];

    return {
        avere,
        participio,
        gerundio: gerundio(radice, coniugazione.gerundio),
        indicativo: {
            presente: semplice(0), passato_prossimo: composto(0),
            imperfetto: semplice(1), trapassato_prossimo: composto(1),
            futuro_semplice: semplice(2), futuro_anteriore: composto(2)
        }, 
        congiuntivo: {
            presente: semplice(3), passato: composto(3),
            imperfetto: semplice(4), trapassato: composto(4)
        },
        condizionale: {
            presente: semplice(5), passato: composto(5)
        },
        imperativo: imperativo()
    }

    function semplice(t: 0|1|2|3|4|5) {
        let res: string[];
        const voce = values[t]
        if(voce && voce.length === 6) {
            res = voce.map(v => formatta(radice, v));
            if(tipo === TipoVerbo.riflessivo) res = res.map((v,i) => complementi[i] + (startsWithVowel(v) ? "'" : "e ") + v);
            else if(startsWithVowel(res[2])) res[2] = "l'" + res[2];
        } else {
            if(t === 0 || t === 1) {
                if(num === 2) res = coniugazione_default[t].seconda;
                else res = coniugazione_default[t].altro;
            } else res = coniugazione_default[t];
            res = res.map(v => singolo(radice, v, operazione));
            if(tipo === TipoVerbo.riflessivo) {
                if(startsWithVowel(radice)) res = res.map((v,i) => complementi[i] + "'" + v);
                else res = res.map((v,i) => complementi[i] + 'e ' + v);
            } else if(startsWithVowel(res[2])) res[2] = "l'" + res[2];
        }
        return res.map((v,i) => soggetti.normali[i] + " " + v) as Voci;
    }

    function composto(t: 0|1|2|3|4|5) {
        let i: number;
        const res: string[] = new Array(6);
        for(i=0; i<3; i++) res[i] = soggetti.normali[i] + ' ' + ausiliare[t][i] + ' ' + desinenzaPP[0];
        for(i=3; i<6; i++) res[i] = soggetti.normali[i] + ' ' + ausiliare[t][i] + ' ' + desinenzaPP[1];
        return res as Voci;
    }

    function imperativo() {
        if(values[6] && values[6].length === 5) {
            return values[6].map((v,i) => soggetti.imperativi[i] + ' ' + formatta(radice, v)) as VociImperative;
        } else {
            const base = tipo === TipoVerbo.riflessivo 
            ? imperativo_default.riflessivo[num-1]
            : imperativo_default.attivo[num-1];
            return base.map((v,i) => soggetti.imperativi[i] + ' ' + singolo(radice, v, operazione)) as VociImperative;
        }
    }
}

// coniuga('', 3, TipoVerbo.intransitivo_avere, {ms: '', mp: '', fs: '', fp: ''}, [null, null, null, null, null, null, null])

type DesinenzeParticio = [string, string, string, string];

export function onlyPPms(tipo: TipoVerbo) { return tipo === TipoVerbo.intransitivo_avere || tipo === TipoVerbo.impersonale }

const participi_default: [DesinenzeParticio, DesinenzeParticio, DesinenzeParticio, DesinenzeParticio] = [
    ['üu', 'üi', 'üa', 'üe'],
    ['àu', 'ài', 'àa', 'àe'],
    ['üu', 'üi', 'üa', 'üe'],
    ['ìu', 'ìi', 'ìa', 'ìe']
];

function PPvoce(radice: string, voce: string|undefined, num: NumeroConiugazione, index: 0|1|2|3) {
    return voce ? formatta(radice, voce) : radice + participi_default[num][index];
}

export function computeParticipio(radice: string, coniu: ConiugazioneRaw): Required<Declinazione> {
    const values = coniu.participio;
    const num = coniu.numero;
    if(values) {
        return onlyPPms(coniu.tipo) 
        ? ({ ms: PPvoce(radice, values.ms, num, 0), mp: '', fs: '', fp: '' }) 
        : ({
            ms: PPvoce(radice, values.ms, num, 0),
            mp: PPvoce(radice, values.mp, num, 1),
            fs: PPvoce(radice, values.fs, num, 2),
            fp: PPvoce(radice, values.fp, num, 3),
        });
    }
    return {
        ms: radice+participi_default[num][0],
        mp: radice+participi_default[num][1],
        fs: radice+participi_default[num][2],
        fp: radice+participi_default[num][3],
    }
}

export function gerundio(radice: string, value: string|null) {
    return !value || value === "$" ? radice + 'endu' : formatta(radice, value);
}