export default function SearchBar({ onChange, bottomMargin, value }) {
    return (
        <div className={`flex relative mb-${bottomMargin}`}>
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
            <input
                className={
                    "border-2 border-black bg-white h-10 px-9 pr-16 rounded-lg text-lg focus:outline-none w-[50rem]"
                }
                type="search"
                name="search"
                // size={50}
                placeholder="Search recipes..."
                onChange={onChange}
                autoComplete="off"
                value={value}
            ></input>
        </div>

        // <div className="flex relative">
        //     <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         fill="none"
        //         viewBox="0 0 24 24"
        //         strokeWidth={1.5}
        //         stroke="currentColor"
        //         className="w-6 h-6 my-2 mx-2 absolute"
        //     >
        //         <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        //         />
        //     </svg>
        //     <input
        //         className={
        //             "border-2 border-black rounded-md pt-1 pb-1 px-9 mb-2 focus:outline-none"
        //         }
        //         type="search"
        //         name="search"
        //         size={16}
        //         placeholder="Search tags..."
        //         onChange={onChange}
        //     ></input>
        // </div>
    );
}
