import Header from "@/components/header/Header";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { getRecipeClient } from "@/utils";
import _ from "lodash";
import { useState } from "react";
import normalizeQuantityUnits from "@/converter";
import { RationalValue } from "@/converter";

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

        let ingredients = _.map(recipe.ingredients, (ing) => ({
            ...ing,
            active: true,
            scaleQuantity: ing.quantity,
            scaleUnit: ing.unit,
            fmt: new RationalValue(ing.quantity).toString(),
        }));
        let steps = _.map(recipe.steps, (st) => ({ ...st, active: true }));

        setIngredients(ingredients);
        setSteps(steps);
        setServes(recipe.servings);
        // console.log(ingredients);

        return recipe;
    });

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
            console.log("LALALAALALA");
            for (let ingredient of newIngredients) {
                let normalized = normalizeQuantityUnits(
                    ingredient.quantity,
                    ingredient.unit,
                    recipe.servings,
                    newServings
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
                    newServings
                );
                ingredient.scaleQuantity = normalized.quantity;
                ingredient.scaleUnit = normalized.unit;
                ingredient.fmt = normalized.rational.toString();
            }
            setIngredients(newIngredients);
            setServes(newServes);
        };
    };

    function createQuantityForRender(ingredient) {
        if (ingredient.scaleQuantity % 1 === 0) {
            return ingredient.scaleQuantity.toString();
        }
        return ingredient.fmt.toString();
    }

    return (
        <>
            <Header></Header>

            <div className="flex mt-20">
                <div className="w-96 h-96 ml-20 mr-20 mb-20 flex flex-shrink-0">
                    <img
                        height="100%"
                        width="100%"
                        className="object-cover hover:cursor-pointer"
                        src={recipe ? recipe.image_url : ""}
                    ></img>
                </div>

                <div className="w-[36rem]">
                    <div className="font-bold text-4xl">
                        {recipe ? recipe.name : ""}
                    </div>
                    <div className="text-lg mt-8 flex">
                        {recipe
                            ? [
                                  <span
                                      key={"source_key"}
                                      className="font-bold mr-1"
                                  >
                                      Source:{" "}
                                  </span>,
                                  <p key={"source_val"}>{recipe.source}</p>,
                              ]
                            : ""}
                    </div>
                    <div className="flex">
                        <div className="text-lg mt-8 mr-8 flex">
                            {recipe
                                ? [
                                      <span
                                          key={"makes_key"}
                                          className="font-bold mr-1"
                                      >
                                          Makes:{" "}
                                      </span>,
                                      <p key={"makes_val"}>
                                          {recipe.servings}{" "}
                                          {recipe.servings_type}
                                      </p>,
                                  ]
                                : ""}
                        </div>
                        <div className="text-lg mt-8 mr-8 flex">
                            {recipe
                                ? [
                                      <span
                                          key={"prep_time_key"}
                                          className="font-bold mr-1"
                                      >
                                          Prep Time:{" "}
                                      </span>,
                                      <p key={"prep_time_val"}>
                                          {recipe.prep_time}
                                      </p>,
                                  ]
                                : ""}
                        </div>
                        <div className="text-lg mt-8 mr-8 flex">
                            {recipe
                                ? [
                                      <span
                                          key={"cook_time_key"}
                                          className="font-bold mr-1"
                                      >
                                          Cook Time:{" "}
                                      </span>,
                                      <p key={"cook_time_val"}>
                                          {recipe.cook_time}
                                      </p>,
                                  ]
                                : ""}
                        </div>
                    </div>
                    <div className="text-lg mt-8 flex">
                        {recipe
                            ? [
                                  <span
                                      key={"tags_key"}
                                      className="font-bold mr-1"
                                  >
                                      Tags:{" "}
                                  </span>,
                                  <p key={"tags_val"}>
                                      {_.join(
                                          _.map(recipe.tags, (x) => x.name),
                                          ", "
                                      )}
                                  </p>,
                              ]
                            : ""}
                    </div>
                    <div className="text-lg mt-8">
                        {recipe
                            ? [
                                  <span
                                      key="description_key"
                                      className="font-bold"
                                  >
                                      Description:{" "}
                                  </span>,
                                  <p key="description_val">
                                      {recipe.description}
                                  </p>,
                              ]
                            : ""}
                    </div>
                </div>
            </div>

            <div className="flex mt-24">
                <div>
                    <div className="font-bold text-2xl w-96 ml-20 mb-4">
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
                                                  {ingredient.scaleQuantity !==
                                                  0
                                                      ? createQuantityForRender(
                                                            ingredient
                                                        )
                                                      : ""}
                                              </span>{" "}
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
                    <div className="font-bold text-2xl ml-20 mb-4">Steps</div>
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
