import { FC, useRef, useState } from "react";

interface Props {
    onEnter: (text: string) => void;
}

const TodoInput: FC<Props> = ({ onEnter }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [text, setText] = useState("");
    function onEnterWrapper(text: string) {
        onEnter(text);

        // Clear the input field
        inputRef.current!.value = "";
        setText("");
    }

    return (
        <>
            <div className="flex gap-1">
                <input
                    className="w-full"
                    type="text"
                    placeholder="New item text"
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key == "Enter") onEnterWrapper(text);
                    }}
                    ref={inputRef}
                ></input>
                <button onClick={() => onEnterWrapper(text)}>Add</button>
            </div>
        </>
    );
};

export default TodoInput;
