// See https://kit.svelte.dev/docs/types#app

import type { SupabaseClient, Session } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			details?: string;
		}
		interface Locals {
			supabase: SupabaseClient
			session: Session|null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
