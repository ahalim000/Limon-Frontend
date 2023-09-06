import TextareaAutosize from "react-textarea-autosize";
import { getRecipeClient } from "@/utils";
import useSWRImmutable from "swr/immutable";
import _ from "lodash";
import { useRef, useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/router";

import TagModal from "@/components/tagModal/TagModal";
import AreYouSureModal from "../areYouSureModal/AreYouSureModal";
import { exhaustPagination } from "@/utils";

function InputNumber({ rightMargin, max, onChange, defaultValue }) {
    return (
        <input
            type="number"
            className={`border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 mr-${rightMargin} w-16 h-9 text-center`}
            placeholder="00"
            min={0}
            max={max}
            defaultValue={defaultValue}
            onChange={onChange}
        ></input>
    );
}

function TimeField({
    name,
    setHours,
    setMinutes,
    defaultHours,
    defaultMinutes,
}) {
    return (
        <div>
            <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black mr-24">
                {name}
            </div>
            <div className="flex">
                <InputNumber
                    rightMargin={1}
                    onChange={setHours}
                    defaultValue={defaultHours}
                ></InputNumber>
                <div className="font-bold mr-1 text-xl">:</div>
                <InputNumber
                    rightMargin={2}
                    onChange={setMinutes}
                    defaultValue={defaultMinutes}
                    max={59}
                ></InputNumber>
            </div>
        </div>
    );
}

export default function AddEditRecipe({ edit = false }) {
    const client = getRecipeClient();
    const router = useRouter();
    let id = router.query.id;
    let inputFile = useRef(null);

    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [image, setImage] = useState(null);
    let [imageURL, setImageURL] = useState("");
    let [yieldQuantity, setYieldQuantity] = useState(1);
    let [yieldServingsType, setYieldServingsType] = useState("serving");
    let [prepTimeHours, setPrepTimeHours] = useState(0);
    let [prepTimeMinutes, setPrepTimeMinutes] = useState(0);
    let [cookTimeHours, setCookTimeHours] = useState(0);
    let [cookTimeMinutes, setCookTimeMinutes] = useState(0);
    let [favorite, setFavorite] = useState(false);
    let [source, setSource] = useState("");
    let [nutrition, setNutrition] = useState("");
    let [ingredients, setIngredients] = useState([]);
    let [steps, setSteps] = useState([]);

    const {
        data: tags,
        error: tagsError,
        isLoading: tagsIsLoading,
        mutate: tagsRefresh,
    } = useSWRImmutable(["listTags"], async () => {
        let tags = await exhaustPagination(
            (args) => client.tags.listTags(args),
            {}
        );
        tags = _.sortBy(tags, (x) => x.name);
        return _.map(tags, (x) => ({ clicked: false, ...x }));
    });

    const {
        data: recipe,
        error: recipeError,
        isLoading: recipeIsLoading,
        mutate: recipeRefresh,
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
        if (!recipe || tags === undefined) {
            return;
        }

        setName(recipe.name);
        setDescription(recipe.description);
        for (let recipeTag of recipe.tags) {
            for (let generalTag of tags) {
                if (recipeTag.id === generalTag.id) {
                    generalTag.clicked = true;
                }
            }
        }
        setImageURL(recipe.image_url);
        setYieldQuantity(recipe.servings);
        setYieldServingsType(recipe.servings_type);
        setPrepTimeHours(Math.floor(recipe.prep_time / 60));
        setPrepTimeMinutes(recipe.prep_time % 60);
        setCookTimeHours(Math.floor(recipe.cook_time / 60));
        setCookTimeMinutes(recipe.cook_time % 60);
        setFavorite(recipe.favorite);
        setSource(recipe.source);
        setNutrition(recipe.nutrition);

        let ings = [];
        for (let ing of recipe.ingredients) {
            ings.push(ing.input);
        }
        setIngredients(ings);

        let stps = [];
        for (let stp of recipe.steps) {
            stps.push(stp.text);
        }
        setSteps(stps);
    }, [recipe, tags]);

    let handleClickTag = (idx) => {
        return () => {
            let newTags = _.cloneDeep(tags);
            newTags[idx].clicked = !newTags[idx].clicked;
            tagsRefresh(newTags, { revalidate: false });
        };
    };

    let handleClickAddImage = () => {
        return () => {
            inputFile.current.click();
        };
    };

    let handleImageChange = (event) => {
        setImage(event.target.files[0]);
        let imageDisplay = URL.createObjectURL(event.target.files[0]);
        setImageURL(imageDisplay);
    };

    let handleClickRemoveImage = () => {
        return () => {
            setImageURL("/missing-image.png");
            setImage(null);
        };
    };

    let handleClickFavorite = () => {
        let newFavorite = !favorite;
        setFavorite(newFavorite);
    };

    let handleAddTag = async () => {
        tagsRefresh(
            async () => {
                let newTags = await exhaustPagination(
                    (args) => client.tags.listTags(args),
                    {}
                );
                newTags = _.sortBy(newTags, (x) => x.name);

                let idClickedMap = {};
                for (let tag of tags) {
                    idClickedMap[tag.id] = tag.clicked;
                }

                for (let tag of newTags) {
                    tag.clicked = idClickedMap[tag.id] || false;
                }
                return newTags;
            },
            { revalidate: false }
        );
    };

    let handleDeleteTag = async (tagId) => {
        let newTags = [];
        for (let tag of tags) {
            if (tag.id !== tagId) {
                newTags.push(tag);
            }
        }
        tagsRefresh(newTags, { revalidate: false });
    };

    let handleEditTag = async () => {
        tagsRefresh(
            async () => {
                let newTags = await exhaustPagination(
                    (args) => client.tags.listTags(args),
                    {}
                );
                newTags = _.sortBy(newTags, (x) => x.name);

                let idClickedMap = {};
                for (let tag of tags) {
                    idClickedMap[tag.id] = tag.clicked;
                }

                for (let tag of newTags) {
                    tag.clicked = idClickedMap[tag.id] || false;
                }
                return newTags;
            },
            { revalidate: false }
        );
    };

    let handleChangeIngredients = () => {
        return (event) => {
            let newIngredients = event.target.value.split(/\n+/);
            setIngredients(newIngredients);
        };
    };

    let handleAddDefaultIngredients = () => {
        let ings = "";
        for (let ing of ingredients) {
            ing += "\n";
            ings += ing;
        }
        return ings.trimEnd();
    };

    let handleChangeSteps = () => {
        return (event) => {
            let newSteps = event.target.value.split(/\n{3,}/);
            setSteps(newSteps);
        };
    };

    let handleAddDefaultSteps = () => {
        let stps = "";
        for (let stp of steps) {
            stp += "\n\n\n";
            stps += stp;
        }
        return stps.trimEnd();
    };

    let handleClickSubmitUpdate = () => {
        return async () => {
            let prepTimeToMinutes = prepTimeHours * 60 + prepTimeMinutes;
            let cookTimeToMinutes = cookTimeHours * 60 + cookTimeMinutes;

            let tagsForSubmission = [];
            for (let tag of tags) {
                if (tag.clicked) {
                    tagsForSubmission.push(tag.id);
                }
            }

            let rec = null;
            let requestBody = {
                name: name,
                description: description,
                tag_ids: tagsForSubmission,
                servings: yieldQuantity,
                servings_type: yieldServingsType,
                prep_time: prepTimeToMinutes,
                cook_time: cookTimeToMinutes,
                favorite: favorite,
                source: source,
                nutrition: nutrition,
                ingredients: ingredients,
                steps: steps,
            };

            if (edit) {
                if (image) {
                    rec = await client.recipes.updateRecipe({
                        id: recipe.id,
                        requestBody: {
                            ...requestBody,
                            image_url: null,
                        },
                    });
                    rec = await client.recipes.uploadRecipeImage({
                        id: rec.id,
                        formData: {
                            file: image,
                        },
                    });
                } else {
                    rec = await client.recipes.updateRecipe({
                        id: recipe.id,
                        requestBody: {
                            ...requestBody,
                            image_url: recipe.image_url,
                        },
                    });
                }
            } else {
                rec = await client.recipes.createRecipe({
                    requestBody: {
                        ...requestBody,
                        image_url: null,
                    },
                });
                if (image) {
                    rec = await client.recipes.uploadRecipeImage({
                        id: rec.id,
                        formData: {
                            file: image,
                        },
                    });
                }
            }
            window.location = `/recipes/${rec.id}`;
        };
    };

    return (
        <>
            <div className="flex mt-20">
                <div className="w-1/2">
                    <div className="mx-28 mb-8 flex flex-shrink-0 font-bold text-2xl">
                        About
                    </div>
                    <div className={`mx-28 w-96`}>
                        <label
                            htmlFor="name"
                            className="block text-md font-bold text-gray-800 dark:text-black"
                        >
                            Name
                        </label>
                        <TextareaAutosize
                            margins="28"
                            id="name"
                            className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 mt-2 h-9 w-96 resize-none"
                            minRows={1}
                            placeholder="Avocado Grilled Cheese"
                            defaultValue={recipe ? name : null}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        ></TextareaAutosize>
                    </div>
                    <div className={`mx-28 w-96`}>
                        <label
                            htmlFor="description"
                            className="block text-md font-bold text-gray-800 dark:text-black"
                        >
                            Description
                        </label>
                        <TextareaAutosize
                            margins="28"
                            id="description"
                            className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 mt-2 h-9 w-96 resize-none"
                            minRows={3}
                            placeholder="A sandwich that balances flavor and stretchiness."
                            defaultValue={recipe ? description : null}
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        ></TextareaAutosize>
                    </div>
                    <div className="mx-28">
                        <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black">
                            Tags
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex flex-wrap">
                                {tags
                                    ? tags.map((tag, idx) => (
                                          <button
                                              key={idx}
                                              className={`block border-2 border-black rounded-md hover:cursor-pointer hover:opacity-50 p-1 mr-2 mb-2 ${
                                                  tag.clicked
                                                      ? "bg-black text-white"
                                                      : ""
                                              }`}
                                              onClick={handleClickTag(idx)}
                                          >
                                              <span>{`${tag.name}`}</span>
                                          </button>
                                      ))
                                    : "Loading..."}
                            </div>
                            <TagModal
                                handleAddTag={handleAddTag}
                                handleDeleteTag={handleDeleteTag}
                                handleEditTag={handleEditTag}
                            ></TagModal>
                        </div>
                    </div>
                    <div className="mx-28">
                        <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black">
                            Image
                        </div>
                        <div className="flex h-44 w-44">
                            <img
                                height="100%"
                                width="100%"
                                className="object-cover hover:cursor-pointer"
                                src={imageURL ? imageURL : "/missing-image.png"}
                            ></img>
                        </div>
                        <div className="flex">
                            <div>
                                <button
                                    className="block border-2 border-dotted border-black rounded-md w-48 p-1 mt-4 mb-2 mr-2 text-center transition ease-in-out hover:opacity-50"
                                    onClick={handleClickAddImage()}
                                >
                                    Add Image
                                    <form>
                                        <input
                                            type="file"
                                            className="display: hidden"
                                            onChange={handleImageChange}
                                            ref={inputFile}
                                        />
                                    </form>
                                </button>{" "}
                            </div>
                            <button
                                className="block border-2 border-dotted border-black rounded-md w-48 p-1 mt-4 mb-2 text-center transition ease-in-out hover:opacity-50"
                                onClick={handleClickRemoveImage()}
                            >
                                Remove Image
                            </button>
                        </div>
                    </div>
                    <div className="mx-28">
                        <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black">
                            Yield
                        </div>
                        <div className="flex">
                            <input
                                type="number"
                                className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 mr-2 w-20 h-9 text-center"
                                min={1}
                                placeholder="1"
                                defaultValue={recipe ? yieldQuantity : null}
                                onChange={(event) =>
                                    setYieldQuantity(Number(event.target.value))
                                }
                            ></input>
                            <TextareaAutosize
                                margins="28"
                                id="servingsType"
                                placeholder="serving"
                                className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 w-48 h-9 resize-none"
                                defaultValue={recipe ? yieldServingsType : null}
                                onChange={(event) =>
                                    setYieldServingsType(event.target.value)
                                }
                            ></TextareaAutosize>
                        </div>
                    </div>
                    <div className="flex mx-28">
                        <TimeField
                            name="Prep Time"
                            setHours={(event) => {
                                setPrepTimeHours(Number(event.target.value));
                            }}
                            setMinutes={(event) => {
                                setPrepTimeMinutes(Number(event.target.value));
                            }}
                            defaultHours={recipe ? prepTimeHours : null}
                            defaultMinutes={recipe ? prepTimeMinutes : null}
                        ></TimeField>
                        <TimeField
                            name="Cook Time"
                            setHours={(event) => {
                                setCookTimeHours(Number(event.target.value));
                            }}
                            setMinutes={(event) => {
                                setCookTimeMinutes(Number(event.target.value));
                            }}
                            defaultHours={recipe ? cookTimeHours : null}
                            defaultMinutes={recipe ? cookTimeMinutes : null}
                        ></TimeField>
                        <div>
                            <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black">
                                Favorite
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={favorite ? "red" : "transparent"}
                                viewBox="0 0 24 24"
                                strokeWidth="1"
                                stroke="currentColor"
                                className="w-12 h-12 mx-2 mt-3 object-cover hover:cursor-pointer hover:opacity-50"
                                onClick={handleClickFavorite}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className={`mx-28 w-96`}>
                        <label
                            htmlFor="source"
                            className="block text-md font-bold text-gray-800 dark:text-black"
                        >
                            Source
                        </label>
                        <TextareaAutosize
                            margins="28"
                            id="source"
                            className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 mt-2 h-9 w-96 resize-none"
                            minRows={1}
                            placeholder="Family recipe"
                            defaultValue={recipe ? source : null}
                            onChange={(event) => setSource(event.target.value)}
                        ></TextareaAutosize>
                    </div>
                    <div className={`mx-28 w-96`}>
                        <label
                            htmlFor="nutrition"
                            className="block text-md font-bold text-gray-800 dark:text-black"
                        >
                            Nutrition
                        </label>
                        <TextareaAutosize
                            margins="28"
                            id="nutrition"
                            className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 mt-2 h-9 w-96 resize-none"
                            minRows={2}
                            placeholder="500 calories per serving"
                            defaultValue={recipe ? nutrition : null}
                            onChange={(event) =>
                                setNutrition(event.target.value)
                            }
                        ></TextareaAutosize>
                    </div>
                </div>

                <div className="w-1/2 mr-32">
                    <div>
                        <div className="flex mb-2 font-bold text-2xl">
                            Ingredients
                        </div>

                        <div className="flex flex-col">
                            <div className="font-thin italic mb-1">
                                for {yieldQuantity} {yieldServingsType}
                            </div>
                            <TextareaAutosize
                                margins="28"
                                id="ingredients"
                                className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-3 mt-2 h-9 resize-none"
                                minRows={15}
                                placeholder="2 slices good-quality sourdough bread"
                                defaultValue={
                                    recipe
                                        ? handleAddDefaultIngredients()
                                        : null
                                }
                                onChange={handleChangeIngredients()}
                            ></TextareaAutosize>
                        </div>
                    </div>

                    <div>
                        <div className="flex mb-2 font-bold text-2xl">
                            Steps
                        </div>

                        <div className="flex flex-col">
                            <div className="font-thin italic mb-1">
                                Leave 2 lines between each step.
                            </div>
                            <TextareaAutosize
                                margins="28"
                                id="steps"
                                className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-5 mt-2 h-9 resize-none"
                                minRows={15}
                                placeholder="Top one slice with half of cheese and a layer of avocado."
                                defaultValue={
                                    recipe ? handleAddDefaultSteps() : null
                                }
                                onChange={handleChangeSteps()}
                            ></TextareaAutosize>
                        </div>
                    </div>

                    <div className="flex justify-center ">
                        {edit ? (
                            recipe ? (
                                <AreYouSureModal
                                    messageText={`Are you sure you want to discard changes to "${recipe.name}"?`}
                                    acceptButtonText="Discard"
                                    acceptLogic={() => {
                                        window.location.reload();
                                    }}
                                >
                                    <button className="block border-2 border-solid border-black rounded-md w-48 p-1 mt-6 mr-2 mb-2 text-center font-bold hover:cursor-pointer transition ease-in-out hover:opacity-50">
                                        Discard
                                    </button>
                                </AreYouSureModal>
                            ) : (
                                []
                            )
                        ) : (
                            <AreYouSureModal
                                messageText={
                                    "Are you sure you want to discard this recipe?"
                                }
                                acceptButtonText="Discard"
                                acceptLogic={() => {
                                    window.location = "/recipes";
                                }}
                            >
                                <button className="block border-2 border-solid border-black rounded-md w-48 p-1 mt-6 mr-2 mb-2 text-center font-bold hover:cursor-pointer transition ease-in-out hover:opacity-50">
                                    Discard
                                </button>
                            </AreYouSureModal>
                        )}
                        <button
                            className="block border-2 border-solid border-black rounded-md w-48 p-1 mt-6 mr-2 mb-2 text-center font-bold hover:cursor-pointer transition ease-in-out hover:opacity-50"
                            onClick={handleClickSubmitUpdate()}
                        >
                            {recipe ? "Update" : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
