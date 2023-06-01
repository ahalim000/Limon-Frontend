import { RecipeClient } from "@/recipe_client";
import Cookies from "js-cookie";

export function getRecipeClient() {
    let client = new RecipeClient({
        WITH_CREDENTIALS: true,
        TOKEN: Cookies.get("session-token"),
    });
    return client;
}