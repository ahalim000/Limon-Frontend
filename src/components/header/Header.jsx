import { getRecipeClient } from "@/utils";
import useSWRImmutable from "swr/immutable";

export default function Header() {
    const client = getRecipeClient();

    const {
        data: user,
        error: userError,
        isLoading: userIsLoading,
        mutate: userRefresh,
    } = useSWRImmutable(["getUser"], async () => {
        let user = await client.users.getUserSelf();
        return user;
    });

    return (
        <div className="bg-lemon-background bg-cover">
            <div className="flex min-w-max justify-between items-center pt-3 pb-1 px-5 h-16">
                <div className="flex items-center h-full">
                    <img
                        src="/limon.png"
                        height="100%"
                        width="100%"
                        className="object-scale-down hover:cursor-pointer h-full w-full transition ease-in-out hover:opacity-50"
                        onClick={() => (window.location = "/")}
                    ></img>
                </div>
                <div>
                    <span>{user ? `Hello, ${user.username}!` : "Sign In"}</span>
                </div>
            </div>

            <div className="flex justify-left items-center min-w-max mb-1 mx-3">
                <a
                    className="flex-initial ml-1 mr-2.5 transition ease-in-out hover:opacity-50"
                    href="/recipes"
                >
                    Recipes
                </a>
                <a
                    className="flex-initial mx-2.5 transition ease-in-out hover:opacity-50"
                    href="/recipes/add"
                >
                    Add Recipe
                </a>
                <a
                    className="flex-initial mx-2.5 transition ease-in-out hover:opacity-50"
                    href="/meal-planner"
                >
                    Meal Planner
                </a>
                <a
                    className="flex-initial ml-2.5 transition ease-in-out hover:opacity-50"
                    href=""
                >
                    Grocery List
                </a>
            </div>
            <div className="border-t-2 border-t-black mb-8"></div>
        </div>
    );
}
