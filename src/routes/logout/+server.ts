import { removeAuthorization } from '$lib/cookies';
import type { RequestHandler } from './$types';
import { redirect } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
    removeAuthorization(cookies);
    throw redirect(302, "/");
};