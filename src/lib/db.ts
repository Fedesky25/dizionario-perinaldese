import { MongoClient } from "mongodb";
import { createClient, type PostgrestError} from "@supabase/supabase-js";
import { DB_URI, SUPABASE_URL, SUPABASE_KEY } from "$env/static/private";
import { error } from "@sveltejs/kit";

const client = new MongoClient(DB_URI);
await client.connect();

export const database = client.db();
export const words = database.collection("words");
export const proverbs = database.collection("proverbs");
export const proverbtags = database.collection("proverbtags");

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const postgresError2HTTPError = (err: PostgrestError) => (
    console.log(err),
    error(500, {
        message: err.message,
        details: err.details
    })
);