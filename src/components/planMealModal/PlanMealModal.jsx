import _ from "lodash";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import TextareaAutosize from "react-textarea-autosize";
import { getRecipeClient } from "@/utils";
import useSWRImmutable from "swr/immutable";

import { exhaustPagination } from "@/utils";
import SearchBar from "@/components/searchBar/SearchBar";
import RecipeList from "@/components/recipeList/RecipeList";

// function MealButton({ chosenMeal, name, onClick }) {
//     return (
//         <div
//             className={`block border-2 border-black rounded-md hover:cursor-pointer hover:opacity-50 p-1 mr-2 mb-2 ${
//                 chosenMeal === name ? "bg-black text-white" : ""
//             }`}
//             onClick={onClick}
//         >
//             {name}
//         </div>
//     );
// }

function MealButton({ chosenMeal, name, onClick }) {
    return (
        <p
            className={`p-3 hover:cursor-pointer ${
                chosenMeal === name
                    ? "bg-white text-black"
                    : "bg-black text-white"
            } hover:bg-white hover:text-black`}
            onClick={onClick}
        >
            {name}
        </p>
    );
}

export default function PlanMealModal({}) {
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            height: "600px",
        },
    };

    let client = getRecipeClient();
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

    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [chosenMeal, setChosenMeal] = useState("Breakfast");
    let [otherMeal, setOtherMeal] = useState("");
    let [recipesDisplay, setRecipesDisplay] = useState([]);
    let [chosenRecipes, setChosenRecipes] = useState([]);

    // useEffect(() => {
    //     if (!recipes) {
    //         return;
    //     }

    //     setRecipesDisplay(recipes);
    // }, [recipes]);

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setChosenMeal("");
        setOtherMeal("");
        setModalIsOpen(false);
    }

    let handleClickMeal = (name) => {
        return () => {
            if (chosenMeal === name) {
                setChosenMeal("");
            } else {
                setChosenMeal(name);
            }
        };
    };

    let handleSearchRecipes = () => {
        return (event) => {
            if (event.target.value === "") {
                setRecipesDisplay([]);
                return;
            }

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

    let handleClickX = (recipe) => {
        return () => {
            let newChosenRecipes = _.clone(chosenRecipes);
            for (let idx = 0; idx < newChosenRecipes.length; idx++) {
                if (newChosenRecipes[idx] === recipe) {
                    newChosenRecipes.splice(idx, 1);
                    setChosenRecipes(newChosenRecipes);
                    break;
                }
            }
        };
    };

    let handleClickRecipe = (recipe) => {
        for (let rec of chosenRecipes) {
            if (rec.id === recipe.id) {
                return;
            }
        }

        let newChosenRecipes = _.clone(chosenRecipes);
        newChosenRecipes.push(recipe);
        newChosenRecipes[newChosenRecipes.length - 1].newServings =
            recipe.servings;
        setChosenRecipes(newChosenRecipes);
        setRecipesDisplay([]);
    };

    let changeServingSize = (event, recipe) => {
        let recs = _.clone(chosenRecipes);

        for (let rec of recs) {
            if (rec.id === recipe.id) {
                rec.newServings = event.target.value;
                break;
            }
        }

        setChosenRecipes(recs);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="block border-2 border-dotted border-black rounded-md w-48 p-1 mt-4 mb-2 text-center transition ease-in-out hover:opacity-50"
            >
                Add Recipe
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Plan Meal Modal"
                ariaHideApp={false}
            >
                <div className="justify-center">
                    <div className="flex align-middle justify-between mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50 my-1 mr-2"
                            onClick={closeModal}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                        <div className="text-2xl font-bold">Plan a Meal</div>
                        <div></div>
                    </div>
                    <div className="w-[45rem]">
                        <div className="flex justify-center mx-8 mt-8 mb-3 text-lg font-bold bg-black text-white border-0 border-black rounded-lg">
                            <MealButton
                                name="Breakfast"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Breakfast")}
                            ></MealButton>
                            <MealButton
                                name="Lunch"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Lunch")}
                            ></MealButton>
                            <MealButton
                                name="Dinner"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Dinner")}
                            ></MealButton>
                            <MealButton
                                name="Snack"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Snack")}
                            ></MealButton>
                            <MealButton
                                name="Dessert"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Dessert")}
                            ></MealButton>
                            <MealButton
                                name="Other"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Other")}
                            ></MealButton>
                        </div>
                        {/* <div className="mx-8 mb-4 text-xl font-bold">
                            1. Choose a Meal
                        </div>
                        <div className="flex flex-wrap mx-8 mb-2">
                            <MealButton
                                name="Breakfast"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Breakfast")}
                            ></MealButton>
                            <MealButton
                                name="Lunch"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Lunch")}
                            ></MealButton>
                            <MealButton
                                name="Dinner"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Dinner")}
                            ></MealButton>
                            <MealButton
                                name="Snack"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Snack")}
                            ></MealButton>
                            <MealButton
                                name="Dessert"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Dessert")}
                            ></MealButton>
                            <MealButton
                                name="Other"
                                chosenMeal={chosenMeal}
                                onClick={handleClickMeal("Other")}
                            ></MealButton>
                            <div>
                                {chosenMeal === "Other" ? (
                                    <TextareaAutosize
                                        id="otherMeal"
                                        placeholder="Enter meal"
                                        className="block border-2 border-black bg-black text-white rounded-md py-1 px-2 focus:outline-none mb-2 h-9 resize-none text-center"
                                        onChange={(event) =>
                                            setOtherMeal(event.target.value)
                                        }
                                        autoFocus={true}
                                    ></TextareaAutosize>
                                ) : null}
                            </div>
                        </div> */}
                        {chosenMeal === "Other" ? (
                            <div className={`mx-8`}>
                                <label
                                    htmlFor="name"
                                    className="block text-lg font-bold text-gray-800 dark:text-black"
                                >
                                    Other
                                </label>
                                <TextareaAutosize
                                    margins="8"
                                    id="otherMeal"
                                    className="border-2 border-black rounded-lg text-lg py-1 px-2 focus:outline-none mb-2 mt-2 h-10 w-[41rem] resize-none"
                                    minRows={1}
                                    placeholder="Enter meal"
                                    onChange={(event) =>
                                        setOtherMeal(event.target.value)
                                    }
                                ></TextareaAutosize>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="mx-8 mb-4 text-xl font-bold">
                            1. Choose Your Recipes
                        </div>
                        <div className="mx-8 relative">
                            <div>
                                <SearchBar
                                    onChange={handleSearchRecipes()}
                                    bottomMargin={5}
                                ></SearchBar>
                            </div>
                            <div className="absolute w-[41rem] z-10">
                                <RecipeList
                                    backgroundColor={"bg-slate-300"}
                                    padding={5}
                                    recipeCollection={recipesDisplay}
                                    interRecipeSpace={"4"}
                                    imageContainerHeightWidth={"16"}
                                    hover={true}
                                    heartHeightWidth={"3"}
                                    textDataLeftMargin={"2"}
                                    textDataSize={"lg"}
                                    interTextDataSpace={"0"}
                                    onClick={handleClickRecipe}
                                    callWithRecipe={true}
                                    timeMakes={false}
                                    tags={false}
                                    servings={false}
                                ></RecipeList>
                            </div>
                        </div>
                        <div className="relative mx-8">
                            <div className="mb-4 text-xl font-bold">
                                2. Set Servings
                            </div>
                            <div>
                                <RecipeList
                                    recipeCollection={chosenRecipes}
                                    interRecipeSpace={"6"}
                                    imageContainerHeightWidth={"28"}
                                    hover={false}
                                    heartHeightWidth={"6"}
                                    textDataLeftMargin={"6"}
                                    textDataSize={"xl"}
                                    interTextDataSpace={"2"}
                                    timeMakes={false}
                                    tags={false}
                                    servings={true}
                                    changeServingSize={changeServingSize}
                                ></RecipeList>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
