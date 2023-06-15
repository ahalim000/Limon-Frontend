import Header from "@/components/header/Header";
import TextareaAutosize from "react-textarea-autosize";
import { getRecipeClient } from "@/utils";
import useSWRImmutable from "swr/immutable";
import _ from "lodash";
import { useState, useEffect } from "react";
import React from "react";
import Modal from "react-modal";
import { mutate } from "swr";

let exhaustPagination = async (apiFunc, data) => {
    let res = [];
    let resp = await apiFunc(data);
    res.push(...resp.items);
    while (resp.page < resp.pages) {
        data.page = (data.page || 0) + 1;
        res.push(...resp.items);
        resp = await apiFunc(data);
    }
    return res;
};

function TextareaAuto({
    id,
    name,
    placeholder,
    minRows,
    maxRows,
    className,
    width,
}) {
    return (
        <div className="mx-28">
            <label
                htmlFor={id}
                className="block mb-2 text-md font-bold text-gray-800 dark:text-black"
            >
                {name}
            </label>
            <div className="border-2 border-black rounded-md py-1 px-2 mb-2">
                <TextareaAutosize
                    minRows={minRows}
                    maxRows={maxRows}
                    className={`w-${width} focus:outline-none resize-none overflow-hidden ${
                        className || ""
                    }`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

function InputNumber({ rightMargin }) {
    return (
        <input
            type="number"
            className={`border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 mr-${rightMargin} w-16 h-9 text-center`}
            placeholder="00"
            min={0}
        ></input>
    );
}

function TimeField({ name }) {
    return (
        <div>
            <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black mr-24">
                {name}
            </div>
            <div className="flex">
                <InputNumber rightMargin={1}></InputNumber>
                <div className="font-bold mr-1 text-xl">:</div>
                <InputNumber rightMargin={2}></InputNumber>
            </div>
        </div>
    );
}

function TagModal({ handleAddTag, handleDeleteTag }) {
    const client = getRecipeClient();

    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [newTag, setNewTag] = useState("");

    const {
        data: tags,
        error: tagsError,
        isLoading: tagsIsLoading,
        mutate: tagsRefresh,
    } = useSWRImmutable(["listTagsModal"], async () => {
        let tags = await exhaustPagination(
            (args) => client.tags.listTags(args),
            {}
        );
        tags = _.sortBy(tags, (x) => x.name);
        return tags;
    });

    let handleClickAddTag = () => {
        return async () => {
            let tag = await client.tags.createTag({
                requestBody: {
                    name: newTag,
                },
            });
            tagsRefresh();
            if (handleAddTag) {
                handleAddTag(tag.id);
            }
            setNewTag("");
        };
    };

    let handleClickDeleteTag = (idx) => {
        return async () => {
            let tag = tags[idx];
            await client.tags.deleteTag({ id: tag.id });
            tagsRefresh();
            if (handleDeleteTag) {
                handleDeleteTag(tag.id);
            }
        };
    };

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    return (
        <div>
            <button
                onClick={openModal}
                className="block border-2 border-dotted border-black rounded-md w-48 p-1 mt-4 mb-2 text-center"
            >
                Add/Manage Tags
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 object-cover hover:cursor-pointer mb-2"
                    onClick={closeModal}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                </svg>
                <div>
                    <ol>
                        <div>
                            {tags
                                ? tags.map((tag, idx) => (
                                      <li
                                          className="flex justify-between mx-4"
                                          key={idx}
                                      >
                                          <div>{`${tag.name}`}</div>
                                          <div className="flex">
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth="1.5"
                                                  stroke="currentColor"
                                                  className="w-6 h-6 object-cover hover:cursor-pointer"
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
                                                  className="w-6 h-6 object-cover hover:cursor-pointer"
                                                  onClick={handleClickDeleteTag(
                                                      idx
                                                  )}
                                              >
                                                  <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                  />
                                              </svg>
                                          </div>
                                      </li>
                                  ))
                                : "Loading..."}
                        </div>
                    </ol>
                    <div className="flex mx-4">
                        <TextareaAutosize
                            id="add tag"
                            placeholder="Add tag"
                            width="48"
                            className="border-2 border-black rounded-md mt-2 py-1 px-2 focus:outline-none resize-none overflow-hidden"
                            value={newTag}
                            onChange={(event) => setNewTag(event.target.value)}
                        ></TextareaAutosize>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 mx-1 mt-3 object-cover hover:cursor-pointer"
                            onClick={handleClickAddTag()}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default function AddRecipe() {
    const client = getRecipeClient();
    let [photoAdded, setPhotoAdded] = useState(false);
    let [favorite, setFavorite] = useState(false);
    let [yieldQuantity, setYieldQuantity] = useState(1);
    let [yieldServingsType, setYieldServingsType] = useState("serving");

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

    let handleClickTag = (idx) => {
        return () => {
            let newTags = _.cloneDeep(tags);
            newTags[idx].clicked = !newTags[idx].clicked;
            tagsRefresh(newTags, { revalidate: false });
        };
    };

    let handleClickAddPhoto = () => {};

    let handleClickFavorite = () => {
        let newFavorite = !favorite;
        setFavorite(newFavorite);
    };

    let handleAddTag = async (tagId) => {
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

    return (
        <>
            <Header></Header>

            <div className="flex mt-20">
                <div className="w-1/2">
                    <div className="mx-28 mb-8 flex flex-shrink-0 font-bold text-2xl">
                        About
                    </div>
                    <TextareaAuto
                        id="name"
                        name="Name"
                        placeholder="Avocado Grilled Cheese"
                        width="96"
                    ></TextareaAuto>
                    <TextareaAuto
                        id="description"
                        name="Description"
                        minRows={3}
                        placeholder="A sandwich that balances flavor and stretchiness."
                        width="96"
                    ></TextareaAuto>
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
                                              className={`block border-2 border-black rounded-md p-1 mr-2 mb-2 ${
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
                            ></TagModal>
                        </div>
                    </div>
                    <div className="mx-28">
                        <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black">
                            Photo
                        </div>
                        <img
                            height="150"
                            width="200"
                            className="object-cover hover:cursor-pointer"
                            src={"/missing-image.png"}
                        ></img>
                        <div className="flex">
                            <button
                                className="block border-2 border-dotted border-black rounded-md w-48 p-1 mt-4 mb-2 mr-2 text-center"
                                onClick={handleClickAddPhoto}
                            >
                                Add Photo
                            </button>
                            <button className="block border-2 border-dotted border-black rounded-md w-48 p-1 mt-4 mb-2 text-center">
                                Delete Photo
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
                                onChange={(event) =>
                                    setYieldQuantity(event.target.value)
                                }
                            ></input>
                            <TextareaAutosize
                                id="servingsType"
                                placeholder="serving"
                                className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-2 w-48 h-9 resize-none"
                                onChange={(event) =>
                                    setYieldServingsType(event.target.value)
                                }
                            ></TextareaAutosize>
                        </div>
                    </div>
                    <div className="flex mx-28">
                        <TimeField name="Prep Time"></TimeField>
                        <TimeField name="Cook Time"></TimeField>
                        <div>
                            <div className="block mb-2 text-md font-bold text-gray-800 dark:text-black">
                                Favorite
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={favorite ? "red" : ""}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-9 h-9 mx-4 mt-3 object-cover hover:cursor-pointer"
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
                    <TextareaAuto
                        id="source"
                        name="Source"
                        placeholder="Family recipe"
                        width="96"
                    ></TextareaAuto>
                    <TextareaAuto
                        id="nutrition"
                        name="Nutrition"
                        placeholder="500 calories per serving"
                        width="96"
                        minRows="2"
                    ></TextareaAuto>
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
                                id="ingredients"
                                className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-3 mt-2 h-9 resize-none"
                                minRows={15}
                                placeholder="2 slices good-quality sourdough bread"
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
                                id="steps"
                                className="border-2 border-black rounded-md py-1 px-2 focus:outline-none mb-5 mt-2 h-9 resize-none"
                                minRows={15}
                                placeholder="Load one slice with half of cheese and a layer of avocado."
                            ></TextareaAutosize>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
