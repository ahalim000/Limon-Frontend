import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { getRecipeClient } from "@/utils";
import _ from "lodash";
import { useEffect, useState } from "react";
import normalizeQuantityUnits from "@/converter";

import Header from "@/components/header/Header";
import AreYouSureModal from "../areYouSureModal/AreYouSureModal";

function RecipeAttribute({ label, className, value }) {
    return (
        <div className={"text-lg " + className}>
            <span className="font-bold mr-1">{`${label}: `}</span>
            <div className="break-words">{value ? value : ""}</div>
        </div>
    );
}

export default function Recipe() {
    const client = getRecipeClient();
    const router = useRouter();
    let id = router.query.id;

    let [ingredients, setIngredients] = useState(null);
    let [steps, setSteps] = useState(null);
    let [serves, setServes] = useState(null);

    const {
        data: recipe,
        error: recipeError,
        isLoading: recipeIsLoading,
    } = useSWRImmutable(["getRecipe", id], async () => {
        if (id === undefined) {
            return null;
        }
        let recipe = await client.recipes.getRecipe({
            id: id,
        });
        return recipe;
    });

    useEffect(() => {
        if (!recipe) {
            return;
        }

        let ingredients = _.map(recipe.ingredients, (ing) => {
            let normalized = normalizeQuantityUnits(
                ing.quantity,
                ing.unit,
                recipe.servings,
                recipe.servings,
                true
            );
            return {
                ...ing,
                active: true,
                scaleQuantity: normalized.quantity,
                scaleUnit: normalized.unit,
                fmt: normalized.rational.toString(),
            };
        });
        let steps = _.map(recipe.steps, (st) => ({ ...st, active: true }));

        setIngredients(ingredients);
        setSteps(steps);
        setServes(recipe.servings);
    }, [recipe]);

    let deleteRecipe = async () => {
        await client.recipes.deleteRecipe({
            id: recipe.id,
        });
        window.location = "/recipes/";
    };

    let handleClickIngredient = (idx) => {
        return () => {
            let newIngredients = _.cloneDeep(ingredients);
            newIngredients[idx].active = !newIngredients[idx].active;
            setIngredients(newIngredients);
        };
    };

    let handleClickStep = (idx) => {
        return () => {
            let newSteps = _.cloneDeep(steps);
            newSteps[idx].active = !newSteps[idx].active;
            setSteps(newSteps);
        };
    };

    let handleClickYieldIncrease = (newServings) => {
        return () => {
            let newIngredients = _.cloneDeep(ingredients);
            let newServes = serves + 1;
            for (let ingredient of newIngredients) {
                let normalized = normalizeQuantityUnits(
                    ingredient.quantity,
                    ingredient.unit,
                    recipe.servings,
                    newServings,
                    newServes === recipe.servings
                );
                ingredient.scaleQuantity = normalized.quantity;
                ingredient.scaleUnit = normalized.unit;
                ingredient.fmt = normalized.rational.toString();
            }
            setIngredients(newIngredients);
            setServes(newServes);
        };
    };

    let handleClickYieldDecrease = (newServings) => {
        return () => {
            if (serves === 1) {
                return;
            }

            let newIngredients = _.cloneDeep(ingredients);
            let newServes = serves - 1;

            for (let ingredient of newIngredients) {
                let normalized = normalizeQuantityUnits(
                    ingredient.quantity,
                    ingredient.unit,
                    recipe.servings,
                    newServings,
                    newServes === recipe.servings
                );
                ingredient.scaleQuantity = normalized.quantity;
                ingredient.scaleUnit = normalized.unit;
                ingredient.fmt = normalized.rational.toString();
            }
            setIngredients(newIngredients);
            setServes(newServes);
        };
    };

    let renderPrepTimeCookTime = (time) => {
        let hours = Math.floor(time / 60);
        let minutes = time % 60;

        let hoursString = hours.toString();
        if (hours === 0) {
            hoursString = "00";
        } else if (hours < 10) {
            hoursString = `0${hours}`;
        }

        let minutesString = minutes.toString();
        if (minutes === 0) {
            minutesString = "00";
        } else if (minutes < 10) {
            minutesString = `0${minutes}`;
        }

        return `${hoursString}:${minutesString}`;
    };

    return (
        <>
            <Header></Header>

            <div className="flex mt-20">
                <div className="w-96 h-96 ml-20 mr-20 flex flex-shrink-0 relative">
                    <img
                        height="100%"
                        width="100%"
                        className="object-cover hover:cursor-pointer"
                        src={
                            recipe
                                ? recipe.image_url
                                    ? recipe.image_url
                                    : "/missing-image.png"
                                : ""
                        }
                    ></img>
                    <div className="absolute bottom-0 right-0">
                        {recipe ? (
                            recipe.favorite ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={"red"}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-12 h-12 object-cover hover:cursor-pointer"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                    />
                                </svg>
                            ) : (
                                ""
                            )
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                <div className="w-[36rem] h-96 overflow-scroll">
                    <div className="font-bold text-3xl">
                        {recipe ? recipe.name : ""}
                    </div>
                    <div className="flex">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-7 h-7 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50 mt-4 mr-2.5"
                            onClick={() => {
                                window.location = `/recipes/${recipe.id}/edit`;
                            }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-7 h-7 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50 mt-4 mr-2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                            />
                        </svg>
                        {recipe ? (
                            <AreYouSureModal
                                messageText={`Are you sure you want to delete "${recipe.name}"?`}
                                acceptButtonText="Delete"
                                acceptLogic={deleteRecipe}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-7 h-7 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50 mt-4 mr-2.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
                            </AreYouSureModal>
                        ) : (
                            []
                        )}
                    </div>
                    <div className="flex">
                        <RecipeAttribute
                            label="Makes"
                            className="mt-4 mr-8 flex"
                            value={
                                recipe
                                    ? `${recipe.servings} ${recipe.servings_type}`
                                    : null
                            }
                        ></RecipeAttribute>
                        <RecipeAttribute
                            label="Prep"
                            className="mt-4 mr-8 flex"
                            value={
                                recipe
                                    ? renderPrepTimeCookTime(recipe.prep_time)
                                    : null
                            }
                        ></RecipeAttribute>
                        <RecipeAttribute
                            label="Cook"
                            className="mt-4 mr-8 flex"
                            value={
                                recipe
                                    ? renderPrepTimeCookTime(recipe.cook_time)
                                    : null
                            }
                        ></RecipeAttribute>
                    </div>
                    <RecipeAttribute
                        label="Source"
                        className={"mt-4"}
                        value={
                            recipe ? (
                                recipe.source.startsWith("http") ? (
                                    <a
                                        href={recipe.source}
                                        className="text-blue-700 visited:text-purple-900"
                                    >
                                        {recipe.source}
                                    </a>
                                ) : (
                                    <div>{recipe.source}</div>
                                )
                            ) : null
                        }
                    ></RecipeAttribute>
                    <RecipeAttribute
                        label="Description"
                        className="mt-4"
                        value={recipe ? recipe.description : null}
                    ></RecipeAttribute>
                    <RecipeAttribute
                        label="Tags"
                        className="mt-4"
                        value={
                            <div className="flex flex-wrap text-base">
                                {recipe
                                    ? recipe.tags.map((tag, idx) => (
                                          <div
                                              key={idx}
                                              className={`flex flex-wrap border-2 border-black rounded-md p-1 mr-2 mt-1 mb-2`}
                                          >
                                              {`${tag.name}`}
                                          </div>
                                      ))
                                    : null}
                            </div>
                        }
                    ></RecipeAttribute>
                </div>
            </div>

            <div className="flex mt-16">
                <div>
                    <div className="font-bold text-xl w-96 ml-20 mb-4">
                        Ingredients
                    </div>
                    <div className="flex ml-20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 hover:cursor-pointer transition ease-in-out hover:opacity-50"
                            onClick={handleClickYieldDecrease(serves - 1)}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div className="text-s mx-4 mb-4 select-none">
                            Yield:{" "}
                            <span className="font-bold">
                                {recipe ? serves : ""}
                            </span>{" "}
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 hover:cursor-pointer transition ease-in-out hover:opacity-50"
                            onClick={handleClickYieldIncrease(serves + 1)}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="ml-20 mb-8">
                        <ul className="w-96">
                            {ingredients
                                ? ingredients.map((ingredient, idx) => (
                                      <li key={idx}>
                                          <span
                                              className={
                                                  ingredients[idx].active
                                                      ? "text-lg hover:cursor-pointer select-none"
                                                      : "text-lg hover:cursor-pointer select-none line-through"
                                              }
                                              onClick={handleClickIngredient(
                                                  idx
                                              )}
                                          >
                                              <span className="font-bold">
                                                  {ingredient.fmt === "0"
                                                      ? ""
                                                      : `${ingredient.fmt} `}
                                              </span>
                                              {ingredient.scaleUnit}{" "}
                                              {ingredient.name}
                                              {ingredient.comment
                                                  ? `, ${ingredient.comment}`
                                                  : ""}
                                          </span>
                                      </li>
                                  ))
                                : ""}
                        </ul>
                    </div>
                </div>

                <div>
                    <div className="font-bold text-xl ml-20 mb-4">Steps</div>
                    <div className="ml-20 mb-8">
                        <ul className="w-[36rem]">
                            {steps
                                ? steps.map((step, idx) => (
                                      <li className="mb-8" key={idx}>
                                          <span
                                              className={
                                                  steps[idx].active
                                                      ? "text-lg hover:cursor-pointer select-none"
                                                      : "text-lg hover:cursor-pointer select-none line-through"
                                              }
                                              onClick={handleClickStep(idx)}
                                          >
                                              {idx + 1}. {step.text}
                                          </span>
                                      </li>
                                  ))
                                : ""}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
