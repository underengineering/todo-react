import { FC } from "react";

interface Props {
    text: string;
    checked: boolean;
    onChecked?: (value: boolean) => void;
    onRemove?: () => void;
}

const Item: FC<Props> = ({ text, checked, onChecked, onRemove }) => {
    return (
        <>
            <div className="flex justify-between">
                <div className="flex gap-1">
                    <input
                        type="checkbox"
                        defaultChecked={checked}
                        onChange={
                            onChecked !== undefined
                                ? (event) => onChecked(event.target.checked)
                                : undefined
                        }
                    ></input>
                    <span>{text}</span>
                </div>
                <button onClick={onRemove}>Remove</button>
            </div>
        </>
    );
};

export default Item;
