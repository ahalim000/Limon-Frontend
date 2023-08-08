import { calculateTotalTime } from "@/utils";

export default function RecipeList({
    backgroundColor,
    padding,
    recipeCollection,
    interRecipeSpace,
    imageContainerHeightWidth,
    hover,
    heartHeightWidth,
    textDataLeftMargin,
    textDataSize,
    interTextDataSpace,
    onClick,
    timeMakes,
    tags,
    servings,
    changeServingSize,
}) {
    return (
        <ul
            className={`border-0 border-black rounded-lg ${backgroundColor} p-${
                recipeCollection.length > 0 ? padding : 0
            }`}
        >
            {recipeCollection
                ? recipeCollection.map((recipe, idx) => (
                      <li
                          key={idx}
                          className={`flex items-center ${
                              hover
                                  ? "hover:cursor-pointer transition ease-in-out hover:opacity-50"
                                  : ""
                          } mb-${
                              idx === recipeCollection.length - 1
                                  ? "0"
                                  : interRecipeSpace
                          } h-${imageContainerHeightWidth}`}
                          onClick={onClick ? () => onClick(recipe) : () => {}}
                      >
                          <div
                              className={`flex shrink-0 w-full mr-4 h-${imageContainerHeightWidth}`}
                          >
                              <div className="flex relative">
                                  <img
                                      className={`object-cover rounded-lg w-${imageContainerHeightWidth} h-${imageContainerHeightWidth}`}
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
                                              className={`object-cover hover:cursor-pointer w-${heartHeightWidth} h-${heartHeightWidth}`}
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
                              <div
                                  className={`flex items-center mt-2 ml-${textDataLeftMargin}`}
                              >
                                  <div className={"mb-2 mr-2"}>
                                      <div
                                          className={`font-bold text-${textDataSize} mb-${interTextDataSpace} line-clamp-1`}
                                      >
                                          {recipe.name}
                                      </div>
                                      {timeMakes ? (
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
                                      ) : (
                                          ""
                                      )}
                                      {tags ? (
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
                                      ) : (
                                          ""
                                      )}
                                      {servings ? (
                                          <>
                                              <div className="flex">
                                                  <input
                                                      type="number"
                                                      className="border-2 border-black rounded-md py-1 px-2 mb-2 focus:outline-none mr-1 w-20 h-7 text-sm text-center"
                                                      min={1}
                                                      placeholder="1"
                                                      defaultValue={
                                                          recipe.servings
                                                      }
                                                      onChange={(event) =>
                                                          changeServingSize(
                                                              event,
                                                              recipe
                                                          )
                                                      }
                                                  ></input>{" "}
                                                  <div className="text-lg font-bold mr-5">
                                                      {recipe.servings_type}
                                                  </div>
                                              </div>
                                              <div className="text-md italic">
                                                  {"Default: "}
                                                  {recipe.servings}
                                              </div>
                                          </>
                                      ) : null}
                                  </div>
                              </div>
                          </div>
                      </li>
                  ))
                : "Loading..."}
        </ul>
    );
}
