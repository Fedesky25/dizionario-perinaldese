import type { ConiugazioneRaw, Declinazione, StrictDeclinazione, CompleteAdmin, Collegamento } from "./types";

export function formatta(radice: string, valore: string) {
    switch(valore[0]) {
        case '|': return radice + valore.slice(1);
        case '<': return radice.slice(0, -1) + valore.slice(1);
        default: return valore;
    }
}

export function eq(suffix: string, value: string) {
    const len = value.length;
    if(suffix.length !== len+1) return false;
    for(var i=0; i<len; i++) {
        if(suffix.charCodeAt(i+1) !== value.charCodeAt(i)) {
            return false;
        }
    }
    return true;
}

export const summary_projection = {
    _id: 1,
    parola: 1,
    traduzione: 1,
    funzione: 1,
    ordine: 1,
    descrizione: 1,
    numero_esempi: {
        $cond: {
            if: { $isArray: "$esempi"},
            then: { $size: "$esempi" },
            else: 0
        }
    },
}

export const fgs = [
    'null', 'n. com.', 'agg.', 'prep. art.', 'ver.', 'n. prop.',
    'prep. sempl.', 'art.', 'avv.', 'pron.', 'escl.', 'part. morf.'
];

const specialChars = {'a': 'â', 'e': 'ê', 'i': 'î', 'n': 'ñ', 'o': 'ô', 'r': 'ȓ', 'u': 'û', 'ù': 'ü', 'ò': 'ö'}

export function handleSpecialChars(this: HTMLInputElement|HTMLTextAreaElement, e: KeyboardEvent) {
    if(!e.altKey || !specialChars.hasOwnProperty(e.key)) return;
    this.focus();
    const txt = this.value;
    // if(typeof e.target.selectionStart != "number" || typeof e.target.selectionEnd != "number") return;
    const start = this.selectionStart!, end = this.selectionEnd!;
    this.value = txt.slice(0, start) + specialChars[(e.key as keyof typeof specialChars)] + txt.slice(end);
    this.setSelectionRange(start+1, start+1);
}

const REtests = {
    j: /j/g, r: /r/g, gn: /gn/g, n: /(?<!g)n/g, s: /s(?![aeious])/g,
    a: /[aà]/g, e: /[eéè]/g, i: /[iì]/g, o: /[oò]/g, u: /[uù]/g
};

export function getSearchFilterOld(str: string) {
    const len = str.length;
    if(len > 2) str = str.replace(REtests.j, 'x').replace(REtests.r, '[rȓ]')
                         .replace(REtests.gn, '(gn|ñ)').replace(REtests.s, '(s|s-)');
    str = str.replace('n', '[nñ]').replace(REtests.a, '[aàâ]').replace(REtests.e, '[eéèê]')
             .replace(REtests.i, '[iìî]').replace(REtests.o, '[oòôö]').replace(REtests.u, '[uùûü]');
    if(len < 2) str = '^'+str+'$';
    const obj = { $regex: str, $options: "i" };
    return { $or: [ {parola: obj}, {traduzione: obj} ] };
}

export function getSearchFilter(str: string) {
    const len = str.length;
    let traduzione_re = str.replace(REtests.a, "[aà]").replace(REtests.e, "[eèé]")
                   .replace(REtests.i, "[iì]").replace(REtests.o, "[oò]")
                   .replace(REtests.u, "[uù]");
    let parola_re = str;
    if(len > 2) parola_re = parola_re.replace(REtests.j, 'x').replace(REtests.r, '[rȓ]')
                         .replace(REtests.gn, '(gn|ñ)').replace(REtests.s, '(s|s-)');
    parola_re = parola_re.replace('n', '[nñ]').replace(REtests.a, '[aàâ]').replace(REtests.e, '[eéèê]')
             .replace(REtests.i, '[iìî]').replace(REtests.o, '[oòôö]').replace(REtests.u, '[uùûü]');
    if(len <= 2) {
        parola_re = '^'+parola_re+'$';
        traduzione_re = '^'+traduzione_re+'$';
    }
    return { parola_re, traduzione_re  };
}

export function emptyDeclinazione(): Declinazione {
    return ({ ms: null, mp: null, fs: null, fp: null });
}

export function emptyWord(): CompleteAdmin {
    return ({
        parola: "",
        traduzione: "",
        funzione: 1,
        ordine: 0,
        descrizione: "",
        esempi: null,
        collegamenti: null,
        radice: "",
        declinazione: emptyDeclinazione(),
        coniugazione: null
    });
}

const decl_def_cg = {
    ms: '|u', mp: '|hi',
    fs: '|a', fp: '|he',
}

const declinazioni_default: Record<string,StrictDeclinazione> = {
    normal: {
        ms: '|u', mp: '|i',
        fs: '|a', fp: '|e'
    },
    n: {
        ms: '|', mp: '|',
        fs: '<ña', fp: '<ñe'
    },
    h: {
        ms: '<u', mp: '|i',
        fs: '<a', fp: '|e',
    },
    c: decl_def_cg,
    g: decl_def_cg,
}

export function getDefaultDeclinazione(radice: string) {
    const lastChar = radice.slice(-1);
    return declinazioni_default[lastChar] || declinazioni_default.normal;
}

export function emptyConiugazione(): ConiugazioneRaw {
    return ({
        numero: 1,
        tipo: 1,
        participio: null,
        gerundio: null,
        tempi: null
    });
}

export function splitCollegamenti<strict extends boolean>(arr: Collegamento<strict>[]) {
    const res: [
        vedi_anche: Collegamento<strict>[],
        sinonimi: Collegamento<strict>[],
        contrari: Collegamento<strict>[]
    ] = [[],[],[]]
    const len = arr.length;
    for(var i=0; i<len; i++) res[arr[i].tipo].push(arr[i]);
    return res;
}