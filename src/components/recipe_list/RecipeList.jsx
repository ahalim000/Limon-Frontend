import { useState } from "react";

export default function recipeList() {
    let [recipes, setRecipes] = useState([]);

    return (
        <>
            <div className="bg-lemon-background bg-cover">
                <div className="flex min-w-max justify-between items-center py-2 px-4 sm:h-[4rem] md:h-[4rem] lg:h-[4rem]">
                    <div className="flex items-center h-full">
                        <img
                            src="/limon.png"
                            height="100%"
                            width="100%"
                            className="object-scale-down h-full w-full"
                        ></img>
                    </div>
                </div>
            </div>
        </>
    );
}
