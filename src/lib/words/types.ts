export interface SinCon {
    contrario: boolean;
    parola: string;
    id: number|string;
}

export interface Esempio {
    originale: string;
    traduzione: string;
}

export interface Declinazione {
    ms?: string;
    mp?: string;
    fs?: string;
    fp?: string;
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
    participio: Declinazione|null,
    gerundio: string|null,
    tempi: TempiRaw|null
}

export interface Summary {
    id: number;
    parola: string;
    traduzione: string;
    funzione: number;
    ordine: number;
    con_descrizione: boolean;
    numero_esempi: number;
}

export type Complete = {
    parola: string;
    traduzione: string;
    funzione_display: string;
    ordine: number;
    descrizione: string|null;
    esempi: Esempio[]|null;
    sin_con: SinCon[]|null;
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
)

export interface SearchResult {
    id: number|null;
    parola: string;
    traduzione: string;
    funzione: string;
}