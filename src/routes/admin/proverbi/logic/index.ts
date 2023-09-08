import { PostgrestErrorWrapper, getDataOrThrow, getIntList, getMandatoryString, getStringList, getStringOrNull } from "$lib/form-utils";
import type { Database } from "$lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export {default as Editor} from "./Editor.svelte";

export interface Tag {
    id: number;
    nome: string;
}

export interface LinkedWord<WithId extends boolean = false> {
    id: number;
    parola: string;
    indice: number;
    link: WithId extends true ? number : never;
}

export interface Proverbio<WordLinkId extends boolean = true> {
    id: number;
    originale: string;
    letterale: string; 
    significato: string|null;
    commenti_testo: string[]|null;
    commenti_inizio: number[]|null;
    commenti_fine: number[]|null;
    tags: Tag[]|null;
    parole: LinkedWord<WordLinkId>[]|null;
}

export function emptyProverbio(): Proverbio {
    return {
        id: 0,
        originale: '',
        letterale: '',
        significato: null,
        commenti_testo: null,
        commenti_inizio: null,
        commenti_fine: null,
        tags: [],
        parole: []
    }
}

function nullIfEmpty<T>(arr: T[]): T[]|null {
    return arr.length ? arr : null;
}

export function getProverbio(data: FormData) {
    const originale = getMandatoryString(data, "originale");
    const letterale = getMandatoryString(data, "letterale");
    const significato = getStringOrNull(data, "significato");

    const commenti_inizio = nullIfEmpty(getIntList(data, "commenti-inizio"));
    const commenti_fine = nullIfEmpty(getIntList(data, "commenti-fine"));
    const commenti_testo = nullIfEmpty(getStringList(data, "commenti-testo"));

    
    return {
        originale, letterale, significato,
        commenti_testo, commenti_inizio, commenti_fine
    }
}

function findLastIndex(arr: number[], index: number) {
    if(arr.length === 0) return -1;
    let i = Math.min(index, arr.length-1);
    while(i > 0 &&arr[i] > index) i--;
    return arr[i] === index ? i : -1;
}

function findLastOld(arr: {indice: number}[], index: number) {
    if(!arr.length) return -1;
    let i = Math.min(index, arr.length-1);
    while(i > 0 && arr[i].indice > index) i--;
    return arr[i].indice === index ? i : -1;
}


export async function updateLinks(id: number, data: FormData, client: SupabaseClient<Database>) {
    const links_word = getIntList(data, "link-id")
    const links_index = getIntList(data, "link-index");
    const len = links_word.length;
    
    const old = getDataOrThrow(await client.from("link_proverbi_parole").select("id, indice, parola").eq("proverbio", id).order("indice"));

    const deleting = old.filter(v => {
        const j = findLastIndex(links_index, v.indice); // links_index.lastIndexOf(v.indice, v.indice);
        return j === -1 || links_word[j] !== v.parola;
    });
    if(deleting.length) {
        const res = await client.from("link_proverbi_parole").delete().in("id", deleting.map(v => v.id));
        if(res.error) throw new PostgrestErrorWrapper(res.error);
    }

    const adding: {proverbio: number, parola: number, indice: number}[] = [];
    for(var i=0; i<len; i++) {
        const indice = links_index[i];
        const parola = links_word[i];
        let j = findLastOld(old, indice);
        if(j === -1 || parola !== links_word[j]) adding.push({indice, parola, proverbio: id});
    }
    if(adding.length) {
        const res = await client.from("link_proverbi_parole").insert(adding);
        if(res.error) throw new PostgrestErrorWrapper(res.error);
    }
}

export async function updateTags(id: number, data: FormData, old: number[], client: SupabaseClient<Database>) {
    const tags = new Set(getIntList(data, "tag"));
    // const res1 = await client.from("link_tags_proverbi").delete().eq("proverbio", id);
    // const res2 = await client.from("link_tags_proverbi").insert(Array.from(tags).map(tag => ({proverbio: id, tag})));

    // const res1 = await client.from("link_tags_proverbi").select("tag").eq("proverbio", id);
    // if(res1.error) throw postgresError2HTTPError(res1.error);
    // const old = res1.data.map(v => v.tag);

    const deleting = old.filter(v => !tags.has(v));
    if(deleting.length) {
        const res = await client.from("link_tags_proverbi").delete().in("tag", deleting).eq("proverbio", id);
        if(res.error) throw new PostgrestErrorWrapper(res.error);
    }
    const adding = Array.from(tags).filter(v => old.indexOf(v) === -1).map(tag => ({proverbio: id, tag}));
    if(adding.length) {
        const res = await client.from("link_tags_proverbi").insert(adding);
        if(res.error) throw new PostgrestErrorWrapper(res.error);
    }
}
