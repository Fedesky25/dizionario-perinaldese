import type { NumeroConiugazione, Voci, VociImperative, ConiugazioneRaw, StrictDeclinazione, ConiugazioneRawTypes } from "./types"
import { TipoVerbo } from "./types";
import { formatta } from './utils';

const suffissi_infinito = {
    normale: ['ê', 'â', 'ê', 'î'], 
    riflessivo: ['esse', 'asse', 'esse', 'isse']
}

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

export function getPronomiBase(riflessivo: boolean, imperativo: boolean) {
    const base = (
        Math.random() > .5 
        ? pronomi.maschili 
        : pronomi.femminili
    )[
        imperativo 
        ? "imperativi"
        : "normali"
    ];
    return (
        riflessivo 
        ? base.map((v,i) => `${v} ${complementi[i]}e`)
        : Array.from(base)
    ) as readonly string[];
}

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

export enum OperazioneConiugazione { normal, del_I, del_H, add_H };

interface Indicativo<T extends string|Voci> {
    presente: T,
    passato_prossimo: T,
    imperfetto: T,
    trapassato_prossimo: T,
    futuro_semplice: T,
    futuro_anteriore: T,
}
interface Congiuntivo<T extends string|Voci> {
    presente: T,
    passato: T,
    imperfetto: T,
    trapassato: T,
}
interface Condizionale<T extends string|Voci> {
    presente: T,
    passato: T,
}
export interface Coniugazione<T extends string|Voci> {
    gerundio: string;
    participio: string | StrictDeclinazione;
    impersonale: T extends string ? true : false;
    indicativo: Indicativo<T>,
    congiuntivo: Congiuntivo<T>,
    condizionale: Condizionale<T>,
    imperativo: T extends Voci ? VociImperative : string;
}

export function computeInfinito(radice: string, numero: NumeroConiugazione, riflessivo: boolean) {
    return radice + (riflessivo ? suffissi_infinito.riflessivo : suffissi_infinito.normale)[numero];
}

function startsWithVowel(s: string) {
    return s[0] == 'a' || s[0] == 'e' || s[0] == 'i' || s[0] == 'o' || s[0] == 'u';
}

function startsWithTheseChars(s: string, c1: string, c2: string) {
    return s[0] === c1 || s[0] === c2;
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

export type IndiceTempo = 0|1|2|3|4|5;

export function getOperazioneConiugazione(radice: string, numero: NumeroConiugazione) {
    if(numero == 1) {
        if(radice.endsWith('ci') || radice.endsWith('gi')) return OperazioneConiugazione.del_I;
        if(radice.endsWith('c') || radice.endsWith('g')) return OperazioneConiugazione.add_H;
    } 
    else if(radice.endsWith('ch') || radice.endsWith('gh')) return OperazioneConiugazione.del_H;
    return OperazioneConiugazione.normal;
}

export function getDefaultSuffissi(tempo: IndiceTempo, numero: NumeroConiugazione) {
    return (tempo === 0 || tempo == 1) ? (
        numero === 2
        ? coniugazione_default[tempo].seconda
        : coniugazione_default[tempo].altro
    ) : coniugazione_default[tempo];
}

export function getDefaultSuffissiImperativo(riflessivo: boolean, numero: NumeroConiugazione) {
    return riflessivo 
    ? imperativo_default.riflessivo[numero-1]
    : imperativo_default.attivo[numero-1]
}

export function operateWithSuffix<T extends string[]>(operazione: OperazioneConiugazione, arr: T): T {
    const len = arr.length;
    const res = new Array<string>(len) as T;
    switch(operazione) {
        case OperazioneConiugazione.del_I:
            for(var i=0; i<len; i++) res[i] = (startsWithTheseChars(arr[i], 'e', 'i') ? '<' : '|') + arr[i];
            break;
        case OperazioneConiugazione.del_H:
            for(var i=0; i<len; i++) res[i] = (startsWithTheseChars(arr[i], 'a', 'u') ? '<' : '|') + arr[i];
            break;
        case OperazioneConiugazione.add_H:
            for(var i=0; i<len; i++) res[i] = (startsWithTheseChars(arr[i], 'e', 'i') ? '|h' : '|') + arr[i];
            break;
        default:
            for(var i=0; i<len; i++) res[i] = '|' + arr[i];
            break;
    }
    return res;
}

export function operateWithRadice<T extends string[]>(radice: string, operazione: OperazioneConiugazione, arr: T): T {
    const len = arr.length;
    const res = new Array<string>(len);
    const cutted = radice.slice(0,-1);
    switch(operazione) {
        case OperazioneConiugazione.del_I:
            for(var i=0; i<len; i++) res[i] = (startsWithTheseChars(arr[i], 'e', 'i') ? cutted : radice) + arr[i];
            break;
        case OperazioneConiugazione.del_H:
            for(var i=0; i<len; i++) res[i] = (startsWithTheseChars(arr[i], 'a', 'u') ? cutted : radice) + arr[i];
            break;
        case OperazioneConiugazione.add_H:
            for(var i=0; i<len; i++) res[i] = radice + (startsWithTheseChars(arr[i], 'e', 'i') ? 'h' : '') + arr[i];
            break;
        default:
            for(var i=0; i<len; i++) res[i] = radice + arr[i];
            break;
    }
    return res as T;
}

export function getDefaultTempo(tempo: IndiceTempo, numero: NumeroConiugazione, operazione: OperazioneConiugazione) {
    return operateWithSuffix(operazione, getDefaultSuffissi(tempo, numero));
}

export function coniuga(radice: string, coniugazione: ConiugazioneRaw) {
    return (coniugazione.tipo === TipoVerbo.impersonale) ? coniugaImpersonale(radice, coniugazione) : coniugaPersonale(radice, coniugazione);
}

export function coniugaPersonale(radice: string, coniugazione: ConiugazioneRawTypes["intr_avere"] | ConiugazioneRawTypes["altro"]): Coniugazione<Voci> {
    const num = coniugazione.numero
    const tipo = coniugazione.tipo;
    const values = coniugazione.tempi || [];
    const operazione = getOperazioneConiugazione(radice, num);

    const femminile = Math.random() > 0.5;
    const soggetti = femminile ? pronomi.maschili : pronomi.femminili;
    const avere = tipo === TipoVerbo.transitivo || tipo === TipoVerbo.intransitivo_avere;
    const ausiliare = avere ? ausiliari.avere : ausiliari.essere;
    const participio = computeParticipio(radice, coniugazione);
    const desinenzaPP: [singolare: string, plurale: string] = typeof participio === "string"
        ? [participio, participio]
        : tipo === TipoVerbo.transitivo
        ? [participio.ms, participio.ms] 
        : femminile 
        ? [participio.fs, participio.fp] 
        : [participio.ms, participio.mp];

    return {
        participio,
        gerundio: gerundio(radice, coniugazione.gerundio),
        impersonale: false,
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

    function semplice(t: IndiceTempo) {
        let res: string[];
        const voce = values[t]
        if(voce && voce.length === 6) {
            res = voce.map(v => formatta(radice, v));
            if(tipo === TipoVerbo.riflessivo) res = res.map((v,i) => complementi[i] + (startsWithVowel(v) ? "'" : "e ") + v);
            else if(startsWithVowel(res[2])) res[2] = "l'" + res[2];
        } else {
            res = operateWithRadice(radice, operazione, getDefaultSuffissi(t, num));
            if(tipo === TipoVerbo.riflessivo) {
                if(startsWithVowel(radice)) res = res.map((v,i) => complementi[i] + "'" + v);
                else res = res.map((v,i) => complementi[i] + 'e ' + v);
            } else if(startsWithVowel(res[2])) res[2] = "l'" + res[2];
        }
        return res.map((v,i) => soggetti.normali[i] + " " + v) as Voci;
    }

    function composto(t: IndiceTempo) {
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
            const res = operateWithRadice(radice, operazione, getDefaultSuffissiImperativo(tipo === TipoVerbo.riflessivo, num));
            for(var i=0; i<5; i++) res[i] = soggetti.imperativi[i] + ' ' + res[i];
            return res;
        }
    }
}

function coniugaImpersonale(radice: string, coniu: ConiugazioneRawTypes["impersonale"]): Coniugazione<string> {
    const operazione = getOperazioneConiugazione(radice, coniu.numero);
    const values = coniu.tempi || []
    const p = coniu.participio
    ? formatta(radice, coniu.participio.ms)
    : radice+participi_default[coniu.numero][0];
    
    return {
        gerundio: gerundio(radice, coniu.gerundio),
        participio: p,
        impersonale: true,
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

    function semplice(t: IndiceTempo) {
        const voce = values[t];
        let res = voce
        ? formatta(radice, voce)
        : operateWithRadice(radice, operazione, [getDefaultSuffissi(t, coniu.numero)[2]])[0];
        if(startsWithVowel(res)) res = "l'" + res;
        return 'u ' + res;
    }

    function composto(t: IndiceTempo) {
        return `u ${ausiliari.essere[t][2]} ${p}`;
    }
    function imperativo() {
        return values[6] ? formatta(radice, values[6]) : operateWithRadice(radice, operazione, [getDefaultSuffissiImperativo(false, coniu.numero)[2]])[0];
    }
}

// coniuga('', 3, TipoVerbo.intransitivo_avere, {ms: '', mp: '', fs: '', fp: ''}, [null, null, null, null, null, null, null])

type DesinenzeParticio = [string, string, string, string];

export function onlyPPms(tipo: TipoVerbo) { return tipo === TipoVerbo.intransitivo_avere || tipo === TipoVerbo.impersonale }

export const participi_default: [DesinenzeParticio, DesinenzeParticio, DesinenzeParticio, DesinenzeParticio] = [
    ['üu', 'üi', 'üa', 'üe'],
    ['àu', 'ài', 'àa', 'àe'],
    ['üu', 'üi', 'üa', 'üe'],
    ['ìu', 'ìi', 'ìa', 'ìe']
];

function PPvoce(radice: string, voce: string|undefined, num: NumeroConiugazione, index: 0|1|2|3) {
    return voce ? formatta(radice, voce) : radice + participi_default[num][index];
}

export function computeParticipio(radice: string, coniu: ConiugazioneRaw): string|StrictDeclinazione {
    if(coniu.tipo === TipoVerbo.intransitivo_avere || coniu.tipo === TipoVerbo.impersonale) {
        return coniu.participio
        ? formatta(radice, coniu.participio.ms)
        : radice+participi_default[coniu.numero][0];
    }
    else {
        const p = coniu.participio;
        const num = coniu.numero;
        return p
        ? ({
            ms: formatta(radice, p.ms),
            mp: formatta(radice, p.mp),
            fs: formatta(radice, p.fs),
            fp: formatta(radice, p.fp),
        })
        : ({
            ms: radice+participi_default[num][0],
            mp: radice+participi_default[num][1],
            fs: radice+participi_default[num][2],
            fp: radice+participi_default[num][3],
        })
    }
}

export function gerundio(radice: string, value: string|null) {
    return !value || value === "$" ? radice + 'endu' : formatta(radice, value);
}