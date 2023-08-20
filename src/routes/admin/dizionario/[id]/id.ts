import { error } from "@sveltejs/kit";
import type { RouteParams } from "./$types";

export function getID(params: RouteParams) {
    const id = +params.id;
    if(!Number.isInteger(id) || id < 0) throw error(400, `${params.id} non è un ID valido`);
    return id;
}