import {
    FC,
    Dispatch,
    SetStateAction,
    useMemo,
    ReactElement,
    useCallback,
} from "react";
import Item from "@/components/Item";

export interface ItemData {
    id: number;
    checked: boolean;
    text: string;
}

interface Props {
    items: ItemData[];
    setItems: Dispatch<SetStateAction<ItemData[]>>;
}

export const ItemList: FC<Props> = ({ items, setItems }) => {
    const onChecked = useCallback(
        (id: number, checked: boolean) => {
            const newItems = items.map((item) =>
                item.id === id ? { ...item, checked: checked } : item
            );

            setItems(newItems);
        },
        [items, setItems]
    );

    const onRemoved = useCallback(
        (id: number) => {
            const newItems = items.filter((item) => item.id !== id);

            setItems(newItems);
        },
        [items, setItems]
    );

    const filterItems = useCallback(
        (cond: (item: ItemData) => boolean): ReactElement[] => {
            return items.filter(cond).map((item) => {
                return (
                    <Item
                        key={item.id}
                        checked={item.checked}
                        text={item.text}
                        onChecked={(checked) => onChecked(item.id, checked)}
                        onRemove={() => onRemoved(item.id)}
                    ></Item>
                );
            });
        },
        [items, onChecked, onRemoved]
    );

    const uncheckedItems = useMemo(
        () => filterItems((item) => !item.checked),
        [filterItems]
    );

    const checkedItems = useMemo(
        () => filterItems((item) => item.checked),
        [filterItems]
    );

    const isEmpty = uncheckedItems.length == 0 && checkedItems.length == 0;
    const content = isEmpty ? (
        <>
            <span className="text-center opacity-40">Empty...</span>
        </>
    ) : (
        <>
            {uncheckedItems}
            {checkedItems.length > 0 ? (
                <>
                    <div className="border-2 border-slate-800 dark:border-slate-300 rounded-sm"></div>
                    {checkedItems}
                </>
            ) : null}
        </>
    );

    return (
        <>
            <div className="p-1 flex flex-col gap-1 border-2 border-slate-800 dark:border-slate-300 rounded-sm">
                {content}
            </div>
        </>
    );
};
