import TextareaAutosize from "react-textarea-autosize";

export default function TextareaAuto({
    margins,
    width,
    id,
    name,
    placeholder,
    minRows,
    maxRows,
    className,
    defaultValue,
    onChange,
}) {
    return (
        <div className={`mx-${margins} w-${width}`}>
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
                    className={`focus:outline-none resize-none overflow-hidden ${
                        className || ""
                    }`}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
