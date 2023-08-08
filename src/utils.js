import { RecipeClient } from "@/recipe_client";
import Cookies from "js-cookie";

export function getRecipeClient() {
    let client = new RecipeClient({
        WITH_CREDENTIALS: true,
        TOKEN: Cookies.get("session-token"),
    });
    return client;
}

export async function exhaustPagination(apiFunc, data) {
    let res = [];
    let resp = await apiFunc(data);
    res.push(...resp.items);
    while (resp.page < resp.pages) {
        data.page = (data.page || 0) + 1;
        res.push(...resp.items);
        resp = await apiFunc(data);
    }
    return res;
}

export function calculateTotalTime(recipe) {
    let totalTime = Number(recipe.prep_time) + Number(recipe.cook_time);
    let totalTimeHours = Math.floor(totalTime / 60);
    let totalTimeMinutes = totalTime % 60;

    let tthString = totalTimeHours.toString();
    if (totalTimeHours === 0) {
        tthString = "00";
    } else if (totalTimeHours < 10) {
        tthString = `0${totalTimeHours}`;
    }

    let ttmString = totalTimeMinutes.toString();
    if (totalTimeMinutes === 0) {
        ttmString = "00";
    } else if (totalTimeMinutes < 10) {
        ttmString = `0${totalTimeMinutes}`;
    }

    return `${tthString}:${ttmString}`;
};