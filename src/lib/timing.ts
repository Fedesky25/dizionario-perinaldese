import type { Action } from "svelte/action";
import type { Writable } from "svelte/store";

export function wait(ms: number) { return new Promise<void>(res => setTimeout(res,ms)) }

export const debounceInput: Action<HTMLInputElement|HTMLTextAreaElement, {
    store: Writable<string>,
    delay: number
}> = (node, {store, delay}) => {
    let itsme = false;
    let timer: ReturnType<typeof setTimeout>|null = null;
    node.addEventListener("input", callback);
    const unsub = store.subscribe(v => {
        if(!itsme) node.value = v;
    })
    return {
        destroy() {
            unsub();
            node.removeEventListener("input", callback);
        },
    };
    function exec() {
        itsme = true;
        store.set(node.value);
        itsme = false;
        timer = null;
    }
    function callback() {
        if(timer) clearTimeout(timer);
        timer = setTimeout(exec, delay);
    }
} 

export function debounce<T>(ms: number, fn: (arg: T) => any) {
    let req: ReturnType<typeof setTimeout>|null = null;
    function exec(arg: T) { fn(arg); req = null; }
    return function(arg: T) {
        if(req) clearTimeout(req);
        req = setTimeout(exec, ms, arg);
    }
}

export function throttle(ms: number, fn: () => any) {
    let will_call = false;
    return function() {
        if(will_call) return;
        will_call = true;
        setTimeout(() => { fn(); will_call = false }, ms);
    }
}

export function frameThrottle(fn: () => any) {
    let req: number|null;
    function onFrame() { fn(); req=null; }
    return function() {
        if(req) return;
        req = requestAnimationFrame(onFrame);
    }
}