export function formatta(radice: string, valore: string) {
    switch(valore[0]) {
        case '|': return radice + valore.slice(1);
        case '<': return radice.slice(0, -1) + valore.slice(1);
        default: return valore;
    }
}

export interface Declinazione {
    ms: string;
    mp: string;
    fs: string;
    fp: string;
}

export interface Esempio {
    originale: string;
    traduzione: string;
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

export interface Summary {
    _id: string;
    parola: string;
    traduzione: string;
    funzione: number;
    ordine: number;
    descrizione: string;
    numero_esempi: number;
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

export function getSearchFilter(str: string) {
    const len = str.length;
    if(len > 2) str = str.replace(REtests.j, 'x').replace(REtests.r, '[rȓ]')
                         .replace(REtests.gn, '(gn|ñ)').replace(REtests.s, '(s|s-)');
    str = str.replace('n', '[nñ]').replace(REtests.a, '[aàâ]').replace(REtests.e, '[eéèê]')
             .replace(REtests.i, '[iìî]').replace(REtests.o, '[oòôö]').replace(REtests.u, '[uùûü]');
    if(len < 2) str = '^'+str+'$';
    const obj = { $regex: str, $options: "i" };
    return { $or: [ {parola: obj}, {traduzione: obj} ] };
}