export interface SinCon {
    contrario: boolean;
    parola: string;
    id: number|null;
}

export interface Collegamento<strict extends boolean> {
    tipo: number;
    parola: string;
    id: number | (strict extends true ? never : null)
}

export interface Esempio {
    originale: string;
    traduzione: string;
}

export interface Declinazione {
    ms: string|null;
    mp: string|null;
    fs: string|null;
    fp: string|null;
}

export interface StrictDeclinazione extends Declinazione {
    ms: string;
    mp: string;
    fs: string;
    fp: string;
}

export enum TipoVerbo {
    transitivo=1,
    intransitivo_avere=2,
    intransitivo_essere=3,
    riflessivo=4,
    impersonale=5
};
export type NumeroConiugazione = 0|1|2|3;
export type Voci = [ io: string, tu: string, egli: string, noi: string, voi: string, essi: string]
export type VociImperative = [tu: string, egli: string, noi: string, voi: string, essi: string]
export type TempiRaw = [Voci|null, Voci|null, Voci|null, Voci|null, Voci|null, Voci|null, VociImperative|null]

export interface ConiugazioneRaw {
    tipo: TipoVerbo,
    numero: NumeroConiugazione,
    participio: StrictDeclinazione|null,
    gerundio: string|null,
    tempi: TempiRaw|null
}

export interface Summary {
    id: number;
    parola: string;
    traduzione: string;
    funzione: string;
    ordine: number;
    con_descrizione: boolean;
    numero_esempi: number;
}

export type Complete = {
    parola: string;
    traduzione: string;
    ordine: number;
    descrizione: string|null;
    esempi: Esempio[]|null;
} & (
    {
        funzione: 1|2|3;
        radice: string;
        declinazione: Declinazione;
        coniugazione: null;
    } | {
        funzione: 4;
        radice: string;
        declinazione: null;
        coniugazione: ConiugazioneRaw;
    } | {
        funzione: 5|6|7|8|9|10|11|12;
        radice: null|"";
        declinazione: null;
        coniugazione: null;
    }
);

export type CompleteAdmin = Complete & {
    collegamenti: Collegamento<true>[]|null;
}

export type CompleteDisplay = Complete & {
    collegamenti: Collegamento<false>[]|null;
    funzione_display: string;
}


export interface WordUpdate {
    parola?: string;
    traduzione?: string;
    ordine?: number;
    descrizione?: string|null;
    esempi?: Esempio[]|null;
    declinazione?: Declinazione|null;
    coniugazione?: Partial<ConiugazioneRaw>|null;
    sin_con?: number[];
}

export interface SearchResult {
    id: number|null;
    parola: string;
    traduzione: string;
    funzione: string;
}