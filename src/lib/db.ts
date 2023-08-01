import { MongoClient } from "mongodb";
import { DB_URI } from "$env/static/private";

const client = new MongoClient(DB_URI);
await client.connect();

export const database = client.db();
export const words = database.collection("words");
export const proverbs = database.collection("proverbs");
export const proverbtags = database.collection("proverbtags");