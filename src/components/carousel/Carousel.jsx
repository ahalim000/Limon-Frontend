import { useRef } from "react";

export class CarouselItem {
    constructor(imageSrc, footer, onClick) {
        this.imageSrc = imageSrc;
        this.footer = footer;
        this.onClick = onClick;
    }
}

export default function Carousel({ className, displayItemCount, items, name }) {
    let carouselContainer = useRef(null);
    let width = (176 + 8) * displayItemCount;

    function handleClickChevronLeft() {
        carouselContainer.current.scrollBy({
            left: -1 * width,
            top: 0,
            behavior: "smooth",
        });
    }

    function handleClickChevronRight() {
        carouselContainer.current.scrollBy({
            left: width,
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <div>
            <div className="font-bold flex basis-full h-0 ml-[4.25rem] text-lg">
                {name}
            </div>
            <div
                className={`flex items-center px-5 pb-5 pt-2 m-5 ${
                    className || ""
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-6 h-6 hover:cursor-pointer transition duration-300 ease-in-out hover:opacity-50"
                    onClick={handleClickChevronLeft}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                </svg>
                <div
                    className={`flex overflow-hidden`}
                    style={{ width: `${width}px` }}
                    ref={carouselContainer}
                >
                    {items.map((item, idx) => (
                        <div
                            className="h-full m-1 font-bold text-sm whitespace-pre-wrap"
                            key={idx}
                        >
                            <div className="flex w-44 h-44">
                                <img
                                    height="100%"
                                    width="100%"
                                    className="object-cover rounded-lg hover:cursor-pointer"
                                    src={item.imageSrc}
                                    onClick={item.onClick}
                                ></img>
                            </div>
                            {item.footer}
                        </div>
                    ))}
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-6 h-6 hover:cursor-pointer transition duration-300 ease-in-out hover:opacity-50"
                    onClick={handleClickChevronRight}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                </svg>
            </div>
        </div>
    );
}
