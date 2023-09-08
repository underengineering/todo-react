import { FC } from "react";
import { Close } from "@mui/icons-material";

interface Props {
    title: string;
    selected: boolean;
    onClick?: () => void;
    onRemove?: () => void;
}

export const TodoSet: FC<Props> = ({ title, selected, onClick, onRemove }) => {
    return (
        <>
            <div className="flex group">
                <a
                    className={`text-lg ${selected ? "underline" : ""}`}
                    href="#"
                    onClick={onClick}
                >
                    {title}
                </a>
                <button
                    className="flex-shrink-0 border-none dark:bg-transparent bg-transparent"
                    onClick={onRemove}
                >
                    <Close
                        className="light:invert"
                        sx={{ fontSize: 16 }}
                    ></Close>
                </button>
            </div>
        </>
    );
};
