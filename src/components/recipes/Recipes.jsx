import { getRecipeClient } from "@/utils";
import useSWRImmutable from "swr/immutable";
import _ from "lodash";
import { useEffect, useState } from "react";

import Header from "@/components/header/Header";
import SearchBar from "@/components/searchBar/SearchBar";
import RecipeList from "@/components/recipeList/RecipeList";
import { exhaustPagination, calculateTotalTime } from "@/utils";

export default function Recipes() {
    const client = getRecipeClient();

    const {
        data: recipes,
        error: recipesError,
        isLoading: recipesIsLoading,
        mutate: recipesRefresh,
    } = useSWRImmutable(["listRecipes"], async () => {
        let recipes = await exhaustPagination(
            (args) => client.recipes.listRecipes(args),
            {}
        );

        return _.sortBy(recipes, (x) => x.name);
    });

    let [recipesDisplay, setRecipesDisplay] = useState(null);
    useEffect(() => {
        if (!recipes) {
            return;
        }

        setRecipesDisplay(recipes);
    }, [recipes]);

    let handleSearchRecipes = () => {
        return (event) => {
            let matchingRecipes = [];

            for (let recipe of recipes) {
                if (
                    recipe.name
                        .toLowerCase()
                        .trim()
                        .includes(event.target.value.toLowerCase().trim())
                ) {
                    matchingRecipes.push(recipe);
                }
            }

            setRecipesDisplay(matchingRecipes);
        };
    };

    let redirectToRecipe = (recipe) => {
        window.location = `/recipes/${recipe.id}`;
    };

    return (
        <>
            <Header></Header>
            <div className="flex justify-center mx-28 mt-20 w-[1056px]">
                <div>
                    <div className="flex justify-center">
                        <SearchBar
                            onChange={handleSearchRecipes()}
                            bottomMargin={6}
                            size={32}
                        ></SearchBar>
                    </div>
                    <RecipeList
                        recipeCollection={recipesDisplay}
                        interRecipeSpace={"6"}
                        imageContainerHeightWidth={"28"}
                        hover={true}
                        heartHeightWidth={"6"}
                        textDataLeftMargin={"6"}
                        textDataSize={"xl"}
                        interTextDataSpace={"2"}
                        onClick={redirectToRecipe}
                        timeMakes={true}
                        tags={true}
                        servings={false}
                    ></RecipeList>
                    {/* {recipesDisplay
                        ? recipesDisplay.map((recipe, idx) => (
                              <div
                                  key={idx}
                                  className="flex mb-6 hover:cursor-pointer transition ease-in-out hover:opacity-50"
                                  onClick={() => {
                                      window.location = `/recipes/${recipe.id}`;
                                  }}
                              >
                                  <div className="flex h-28 w-28 mr-6 relative">
                                      <img
                                          height="100%"
                                          width="100%"
                                          className="object-cover rounded-lg"
                                          src={
                                              recipe.image_url
                                                  ? recipe.image_url
                                                  : "/missing-image.png"
                                          }
                                      ></img>
                                      <div className="absolute bottom-0 right-0">
                                          {recipe.favorite ? (
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill={"red"}
                                                  viewBox="0 0 24 24"
                                                  strokeWidth="1.5"
                                                  stroke="currentColor"
                                                  className="w-6 h-6 object-cover hover:cursor-pointer"
                                              >
                                                  <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                                  />
                                              </svg>
                                          ) : (
                                              ""
                                          )}
                                      </div>
                                  </div>
                                  <div className="h-28 flex items-center">
                                      <div>
                                          <div className="flex font-bold text-xl mb-2 mr-2">
                                              {recipe.name}
                                          </div>
                                          <div className="flex mb-2">
                                              <div className="mr-5">
                                                  <span className="font-bold">
                                                      Time:{" "}
                                                  </span>
                                                  {calculateTotalTime(recipe)}
                                              </div>
                                              <div className="mr-10">
                                                  <span className="font-bold">
                                                      Makes:{" "}
                                                  </span>
                                                  {recipe.servings}{" "}
                                                  {recipe.servings_type}
                                              </div>
                                          </div>
                                          <div className="flex flex-wrap">
                                              {recipe.tags.map((tag, idx) => (
                                                  <div
                                                      key={idx}
                                                      className={`block border-2 border-black rounded-md p-1 mr-2 mb-2 text-sm`}
                                                  >
                                                      {`${tag.name}`}
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))
                        : "Loading..."} */}
                </div>
            </div>
        </>
    );
}
