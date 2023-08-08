import { useEffect, useState } from "react";
import Modal from "react-modal";
import _ from "lodash";
import useSWRImmutable from "swr/immutable";
import { getRecipeClient } from "@/utils";
import TextareaAutosize from "react-textarea-autosize";

import AreYouSureModal from "../areYouSureModal/AreYouSureModal";

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

function SearchBar({ onChange }) {
    return (
        <div className="flex items-center relative">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 my-2 mx-2 absolute"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
            </svg>
            <TextareaAutosize
                id="search bar"
                placeholder="Search tags..."
                cols="16"
                className="border-2 border-black rounded-md mt-2 py-1 px-9 mb-2 focus:outline-none resize-none overflow-hidden"
                onChange={onChange}
            ></TextareaAutosize>
        </div>
    );
}

export default function TagModal({
    handleAddTag,
    handleDeleteTag,
    handleEditTag,
}) {
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
    const client = getRecipeClient();

    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [newTag, setNewTag] = useState("");
    let [newName, setNewName] = useState("");
    let [editClicked, setEditClicked] = useState(null);

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
        tags = _.map(tags, (x) => ({ ...x }));
        return tags;
    });

    let [tagsDisplay, setTagsDisplay] = useState(null);
    useEffect(() => {
        if (!tags) {
            return;
        }

        setTagsDisplay(tags);
    }, [tags]);

    let handleSearchTags = () => {
        return (event) => {
            let matchingTags = [];

            for (let tag of tags) {
                if (
                    tag.name
                        .toLowerCase()
                        .trim()
                        .includes(event.target.value.toLowerCase().trim())
                ) {
                    matchingTags.push(tag);
                }
            }

            setTagsDisplay(matchingTags);
        };
    };

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
        return async (event) => {
            event.stopPropagation();
            let tag = tags[idx];
            await client.tags.deleteTag({ id: tag.id });
            tagsRefresh();
            if (handleDeleteTag) {
                handleDeleteTag(tag.id);
            }
        };
    };

    let handleClickEditTag = (idx) => {
        return async (event) => {
            event.stopPropagation();
            let newTags = _.cloneDeep(tags);
            setEditClicked(newTags[idx].id);
            tagsRefresh(newTags, { revalidate: false });
        };
    };

    let handleClickUpdateTag = (idx) => {
        return async () => {
            let tag = tags[idx];
            await client.tags.updateTag({
                id: tag.id,
                requestBody: {
                    name: newName,
                },
            });
            tagsRefresh();
            if (handleEditTag) {
                handleEditTag();
            }
            setNewName("");
            setEditClicked(null);
        };
    };

    let handleClickModalBackground = () => {
        return async () => {
            setEditClicked(null);
        };
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
                className="block border-2 border-dotted border-black rounded-md w-48 p-1 mt-4 mb-2 text-center transition ease-in-out hover:opacity-50"
            >
                Add/Manage Tags
            </button>
            <div onClick={handleClickModalBackground()}>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Tag Modal"
                    ariaHideApp={false}
                >
                    <div className="justify-center">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50 my-2 mr-2"
                                onClick={closeModal}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                />
                            </svg>
                            <SearchBar
                                onChange={handleSearchTags()}
                                bottomMargin={6}
                            ></SearchBar>
                        </div>
                        <div>
                            <ol>
                                <div className="ml-4">
                                    {tagsDisplay
                                        ? tagsDisplay.map((tag, idx) => (
                                              <div key={idx}>
                                                  {editClicked === tag.id ? (
                                                      <div className="flex mx-4">
                                                          <TextareaAutosize
                                                              id="edit tag"
                                                              placeholder={`Edit "${tag.name}"`}
                                                              width="48"
                                                              className="border-2 border-black rounded-md my-2 py-1 px-2 focus:outline-none resize-none overflow-hidden"
                                                              value={newName}
                                                              onClick={(
                                                                  event
                                                              ) =>
                                                                  event.stopPropagation()
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) => {
                                                                  setNewName(
                                                                      event
                                                                          .target
                                                                          .value
                                                                  );
                                                              }}
                                                              autoFocus
                                                          ></TextareaAutosize>
                                                          <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              strokeWidth="1.5"
                                                              stroke="currentColor"
                                                              className="w-6 h-6 mx-1 mt-3 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50"
                                                              onClick={handleClickUpdateTag(
                                                                  idx
                                                              )}
                                                          >
                                                              <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  d="M12 4.5v15m7.5-7.5h-15"
                                                              />
                                                          </svg>
                                                      </div>
                                                  ) : (
                                                      <li className="flex justify-between mx-4">
                                                          <div>{`${tag.name}`}</div>
                                                          <div>
                                                              <div className="flex">
                                                                  <svg
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      fill="none"
                                                                      viewBox="0 0 24 24"
                                                                      strokeWidth="1.5"
                                                                      stroke="currentColor"
                                                                      className="w-6 h-6 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50"
                                                                      onClick={handleClickEditTag(
                                                                          idx
                                                                      )}
                                                                  >
                                                                      <path
                                                                          strokeLinecap="round"
                                                                          strokeLinejoin="round"
                                                                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                      />
                                                                  </svg>
                                                                  {/* <svg
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      fill="none"
                                                                      viewBox="0 0 24 24"
                                                                      strokeWidth="1.5"
                                                                      stroke="currentColor"
                                                                      className="w-6 h-6 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50"
                                                                      onClick={handleClickDeleteTag(
                                                                          idx
                                                                      )}
                                                                  >
                                                                      <path
                                                                          strokeLinecap="round"
                                                                          strokeLinejoin="round"
                                                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                                      />
                                                                  </svg> */}
                                                                  <AreYouSureModal
                                                                      messageText={`Are you sure you want to delete "${tag.name}"? (It will delete for all containing recipes.)`}
                                                                      acceptButtonText="Delete"
                                                                      acceptLogic={handleClickDeleteTag(
                                                                          idx
                                                                      )}
                                                                  >
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          fill="none"
                                                                          viewBox="0 0 24 24"
                                                                          strokeWidth="1.5"
                                                                          stroke="currentColor"
                                                                          className="w-6 h-6 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50"
                                                                      >
                                                                          <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                                          />
                                                                      </svg>
                                                                  </AreYouSureModal>
                                                              </div>
                                                          </div>
                                                      </li>
                                                  )}
                                                  <div></div>
                                              </div>
                                          ))
                                        : "Loading..."}
                                </div>
                            </ol>
                            <div className="flex mx-4">
                                <TextareaAutosize
                                    id="add tag"
                                    placeholder="Add tag"
                                    width="48"
                                    className="border-2 border-black rounded-md mt-2 py-1 px-2 ml-4 focus:outline-none resize-none overflow-hidden"
                                    value={newTag}
                                    onChange={(event) =>
                                        setNewTag(event.target.value)
                                    }
                                ></TextareaAutosize>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6 mx-1 mt-3 object-cover hover:cursor-pointer transition ease-in-out hover:opacity-50"
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
                    </div>
                </Modal>
            </div>
        </div>
    );
}
