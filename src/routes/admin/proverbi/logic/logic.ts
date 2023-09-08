import { writable } from "svelte/store";

// const re = /\s+|(?<=')\s*/g;
// const re = /\s*[?!.,;:\s]\s*/g;
const re = /\s*(?:[?!.,;:\s]|('))\s*/g;

function splitIntoWords(text: string) {
    return text.replace(re, (_, a) => a ? "' " : ' ').trim().split(' ');
}


type WordInfo = { piece: string } & ( {id: null, display: null} | {id: number, display: string});

function findNext(arr: WordInfo[], piece: string, from: number) {
    for(var i=from; i<arr.length; i++) {
        if(arr[i].piece === piece) return i;
    }
    return -1;
}

function findPrevious(arr: WordInfo[], piece: string, from: number) {
    for(var i=from-1; i>=0; i--) {
        if(arr[i].piece === piece) return i;
    }
    return -1;
}

type WordLink = {indice: number, id: number, parola: string};

function findLastLink(arr: WordLink[], index: number) {
    if(!arr.length) return -1;
    let i = Math.min(arr.length-1, index);
    while(i > 0 && arr[i].indice > index) i--;
    return arr[i].indice === index ? i : -1;
}

export function wordLinks(text: string) {
    let last_text = text;
    let last_links: WordInfo[] = []; // splitIntoWords(text).map(piece => ({piece, id: null, display: null}));
    const { set, subscribe } = writable(last_links);

    function impose(arr: WordLink[]) {
        last_links = splitIntoWords(last_text).map((piece, i) => {
            const j = findLastLink(arr, i);
            return j === -1 
                ? ({piece, id: null, display: null})
                : ({piece, id: arr[j].id, display: arr[j].parola});
        });
        set(last_links);
    }

    function merge(text: string) {
        if(last_text === text) return;
        const pieces = splitIntoWords(text);
        const len = pieces.length;
        const infos = new Array<WordInfo>(len);
        let k=0;
        for(var i=0; i<len; i++) {
            const p = pieces[i];
            let j = findNext(last_links, p, k);
            if(j === -1) j = findPrevious(last_links, p, k);
            if(j === -1) infos[i] = {piece: p, id: null, display: null};
            else {
                k = j;
                infos[i] = last_links[j];
            }
        }
        last_links = infos;
        last_text = text;
        set(infos);
    }

    function link(index: number, id: number, display: string) {
        last_links[index].id = id;
        last_links[index].display = display;
        set(last_links);
    }

    function unlink(index: number) {
        last_links[index].id = last_links[index].display = null;
        set(last_links);
    }

    return { 
        subscribe, merge, link, unlink, impose,
        get value() {return last_links as readonly WordInfo[]} 
    };
}