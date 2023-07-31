import type { Cookies } from "@sveltejs/kit";

const algorith = "RSA-OAEP";
const secret = crypto.randomUUID();
const duration = 1800_000;

const key = await crypto.subtle.generateKey({
    name: algorith,
    modulusLength: 2048, 
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), 
    hash: "SHA-256"
}, false, ["encrypt", "decrypt"]);

function stringToBuffer(str: string) {
    const len = str.length;
    const bytes = new Uint8Array( len );
    for(var i=0; i <len; i++) bytes[i] = str.charCodeAt(i);
    return bytes.buffer;
}

function bufferToString(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    return String.fromCharCode(...bytes);
}

export async function authorize(cookies: Cookies) {
    const now = Date.now();
    const data = stringToBuffer(secret+now);
    const enc = await crypto.subtle.encrypt(algorith, key.publicKey, data);
    cookies.set("auth", bufferToString(enc), {
        expires: new Date(now + duration),
        sameSite: "strict",
        path: "/",
    });
}

export async function isAuthorized(cookies: Cookies) {
    const raw = cookies.get("auth");
    if(!raw) return false;
    let text: string;
    try {
        const buffer = await crypto.subtle.decrypt(algorith, key.privateKey, stringToBuffer(raw));
        text = bufferToString(buffer);
    } catch {
        return false;
    }
    if(!text.startsWith(secret)) return false;
    const time = text.slice(secret.length);
    const num = parseInt(time);
    if(Number.isNaN(num) || Date.now() > num + duration) return false;
    await authorize(cookies);
    return true;
}

export function removeAuthorization(cookies: Cookies) {
    cookies.delete("auth");
} 