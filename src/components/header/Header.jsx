export default function Header() {
    return (
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

                <div className="flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 my-1.5 mx-1.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                    <input
                        className="border-2 border-gray-300 bg-white h-10 px-3 pr-16 rounded-lg text-lg focus:outline-none"
                        type="search"
                        name="search"
                        size="50"
                        placeholder="Search"
                    ></input>
                </div>

                <div>
                    <span>Hello, user!</span>
                </div>
            </div>

            <div className="flex justify-left items-center min-w-max py-3 px-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-6 prS-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>

                <p className="flex-initial pr-3">All</p>
                <a className="flex-initial px-3" href="/recipes">
                    Recipes
                </a>
                <p className="flex-initial px-3">Meal Planner</p>
                <p className="flex-initial px-3">Grocery List</p>
                <p className="flex-initial px-3">Import Recipe</p>
            </div>
            <div className="border-t-2 border-t-black mb-8"></div>
        </div>
    );
}
