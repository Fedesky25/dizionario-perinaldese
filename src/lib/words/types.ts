export enum Funzione {
    nome_comune = 1,
    aggettivo,
    prep_art,
    verbo,
    nome_proprio,
    perp_sempl,
    articolo,
    avverbio,
    pronome,
    esclamazione,
    part_morf,
    coniugazione,
}

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
    coniuNum: NumeroConiugazione,
    partPass: Declinazione|null,
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

export interface Complete<F extends Funzione = Funzione> {
    parola: string;
    traduzione: string;
    funzione: F;
    ordine: number;
    descrizione?: string;
    esempi?: Esempio[];
    sin_con?: SinCon[];
    radice: F extends 1|2|3|4 ? string : null;
    declinazione: F extends 1|2|3 ? Declinazione : null;
    coniugazione: F extends 4 ? ConiugazioneRaw : null;
}

export interface SearchResult {
    id: number|null;
    parola: string;
    traduzione: string;
    funzione: string;
}