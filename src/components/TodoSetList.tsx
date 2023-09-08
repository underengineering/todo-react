import Image from "next/image";
import { FC, useMemo } from "react";
import { TodoSet } from "./TodoSet";
import { Add } from "@mui/icons-material";

export interface SetData {
    id: number;
    title: string;
    selected: boolean;
}

interface Props {
    sets: SetData[];
    onAdd: () => void;
    onRemove: (id: number) => void;
    onSetSelected: (id: number) => void;
}

export const TodoSetList: FC<Props> = ({ sets, onAdd, onRemove, onSetSelected }) => {
    const setElements = useMemo(() => {
        return sets.map((set) => {
            return (
                <li key={set.id} className="whitespace-nowrap">
                    <TodoSet
                        title={set.title}
                        selected={set.selected}
                        onClick={() => onSetSelected(set.id)}
                        onRemove={() => onRemove(set.id)}
                    ></TodoSet>
                </li>
            );
        });
    }, [sets, onRemove, onSetSelected]);

    return (
        <>
            <div className="flex justify-between">
                <ul className="flex gap-1 overflow-x-auto">{setElements}</ul>
                <button className="flex-shrink-0" onClick={onAdd}>
                    <Add
                        sx={{ fontSize: 24 }}
                    ></Add>
                </button>
            </div>
        </>
    );
};
