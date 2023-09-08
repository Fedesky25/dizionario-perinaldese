import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    const n = +param;
    return Number.isInteger(n) && n >= 0;
};