import { useRouter } from "next/navigation";
import { getRecipeClient } from "@/utils";
import _ from "lodash";
import useSWR from "swr";

import Carousel from "@/components/carousel/Carousel";
import { CarouselItem } from "@/components/carousel/Carousel";
import Header from "@/components/header/Header";

export default function Landing() {
    let router = useRouter();
    let client = getRecipeClient();

    const {
        data: favoriteRecipes,
        error: favoriteRecipesError,
        isLoading: favoriteRecipesIsLoading,
    } = useSWR("getFavoriteRecipes", async () => {
        let recipes = await client.recipes.listRecipes({
            favorite: true,
            size: 10,
            sort: "rand",
        });
        let carouselItems = [];
        for (let recipe of recipes.items) {
            let item = new CarouselItem(recipe.image_url, recipe.name, () =>
                router.push(`/recipes/${recipe.id}`)
            );
            carouselItems.push(item);
        }
        return carouselItems;
    });

    const {
        data: upcomingMealRecipes,
        error: upcomingMealRecipesError,
        isLoading: upcomingMealRecipesIsLoading,
    } = useSWR("getUpcomingMealRecipes", async () => {
        let currentDate = new Date();
        let nextWeek = new Date();
        nextWeek.setDate(new Date().getDate() + 7);

        let mealPlanItems = await client.mealPlanItems.listMealPlanItems({
            startDate: currentDate.toISOString(),
            endDate: nextWeek.toISOString(),
        });
        let carouselItems = [];
        for (let mealPlanItem of mealPlanItems.items) {
            let recipe = await client.recipes.getRecipe({
                id: mealPlanItem.recipe_id,
            });
            let item = new CarouselItem(recipe.image_url, recipe.name, () =>
                router.push(`/recipes/${recipe.id}`)
            );
            carouselItems.push(item);
        }
        return carouselItems;
    });

    const {
        data: makeAgainRecipes,
        error: makeAgainRecipesError,
        isLoading: makeAgainRecipesIsLoading,
    } = useSWR("getMakeAgainRecipes", async () => {
        let currentDate = new Date();
        let lastWeek = new Date();
        lastWeek.setDate(new Date().getDate() - 7);

        let mealPlanItems = await client.mealPlanItems.listMealPlanItems({
            startDate: lastWeek.toISOString(),
            endDate: currentDate.toISOString(),
        });
        let carouselItems = [];
        for (let mealPlanItem of mealPlanItems.items) {
            let recipe = await client.recipes.getRecipe({
                id: mealPlanItem.recipe_id,
            });
            let item = new CarouselItem(recipe.image_url, recipe.name, () =>
                router.push(`/recipes/${recipe.id}`)
            );
            carouselItems.push(item);
        }
        return carouselItems;
    });

    return (
        <>
            <Header></Header>
            <div className="h-screen bg-[#ffffff]">
                <div className="flex justify-center">
                    <div>
                        <Carousel
                            displayItemCount={5}
                            items={upcomingMealRecipes || []}
                            name={"Upcoming Meals"}
                        ></Carousel>
                        <Carousel
                            displayItemCount={5}
                            items={makeAgainRecipes || []}
                            name={"Make Again"}
                        ></Carousel>
                        <Carousel
                            displayItemCount={5}
                            items={favoriteRecipes || []}
                            name={"Favorites"}
                        ></Carousel>
                    </div>
                </div>
            </div>
        </>
    );
}
