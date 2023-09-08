import Head from "next/head";
import {
    useCallback,
    SetStateAction,
    useState,
    useEffect,
    useMemo,
    useRef,
} from "react";

import { SetData, TodoSetList } from "@/components/TodoSetList";
import TodoInput from "@/components/TodoInput";
import {
    Theme,
    ThemeButton,
    getPreferredTheme,
} from "@/components/ThemeButton";
import { ItemData, ItemList } from "@/components/ItemList";

function saveAppState(sets: SetData[], setItems: ItemData[][]) {
    localStorage.setItem("sets", JSON.stringify(sets));
    localStorage.setItem("setItems", JSON.stringify(setItems));
}

function loadSets(): SetData[] {
    const json = localStorage.getItem("sets");
    if (json === null) return [{ id: 0, title: "Set 1", selected: true }];

    return JSON.parse(json);
}

function loadSetItems(): ItemData[][] {
    const json = localStorage.getItem("setItems");
    if (json === null) return [[]];

    return JSON.parse(json);
}

export default function Home() {
    const [sets, setSets] = useState<SetData[]>([
        { id: 0, title: "Set 1", selected: true },
    ]);

    const selectedSetIndex: number | undefined = useMemo(
        () => sets.findIndex((set) => set.selected),
        [sets]
    );

    const [setItems, setSetItems] = useState<ItemData[][]>([[]]);

    // Load state after hydration
    const isFirstRenderRef = useRef(true);
    useEffect(() => {
        if (!isFirstRenderRef.current) return;
        isFirstRenderRef.current = false;

        setSets(loadSets());
        setSetItems(loadSetItems());
    }, []);

    // Save app state
    useEffect(() => {
        if (isFirstRenderRef.current) return;
        saveAppState(sets, setItems);
    }, [sets, setItems]);

    const [theme, setTheme] = useState<Theme>(getPreferredTheme());

    const removeCheckedRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const items = setItems[selectedSetIndex];
        removeCheckedRef.current!.disabled =
            items.length === 0 || items.every((item) => !item.checked);
    }, [selectedSetIndex, setItems]);

    function onEnter(text: string) {
        if (!text) return;
        if (selectedSetIndex === undefined) return;

        const newSetItems = [...setItems];
        const items = newSetItems[selectedSetIndex];
        newSetItems[selectedSetIndex].push({
            id: items.length !== 0 ? items[items.length - 1].id + 1 : 0,
            text,
            checked: false,
        });

        setSetItems(newSetItems);
    }

    function onFilterChecked() {
        if (selectedSetIndex === undefined) return;

        const newSetItems = [...setItems];
        newSetItems[selectedSetIndex] = newSetItems[selectedSetIndex].filter(
            (item) => !item.checked
        );

        setSetItems(newSetItems);
    }

    const setSelectedSetItems = useCallback(
        (newState: SetStateAction<ItemData[]>) => {
            const newSetItems = [...setItems];
            newSetItems[selectedSetIndex] =
                typeof newState === "function"
                    ? newState(setItems[selectedSetIndex])
                    : newState;
            setSetItems(newSetItems);
        },
        [selectedSetIndex, setItems]
    );

    const onSetAdd = useCallback(() => {
        const newSets = sets.map((set) => {
            return { ...set, selected: false };
        });
        const newSetItems = [...setItems];

        newSets.push({
            id: newSets.length !== 0 ? newSets[newSets.length - 1].id + 1 : 0,
            title: `Set ${newSets.length + 1}`,
            selected: true,
        });

        newSetItems.push([]);

        setSets(newSets);
        setSetItems(newSetItems);
    }, [sets, setItems]);

    const onSetRemove = useCallback(
        (id: number) => {
            const removedSetIndex = sets.findIndex((set) => set.id == id);
            const newSets = [...sets];
            const newSetItems = [...setItems];

            const removedSet = newSets.splice(removedSetIndex, 1);
            newSetItems.splice(removedSetIndex, 1);

            if (newSets.length === 0) {
                // Create a new empty set
                newSets.push({
                    id:
                        newSets.length !== 0
                            ? newSets[newSets.length - 1].id + 1
                            : 0,
                    title: `Set ${newSets.length + 1}`,
                    selected: true,
                });

                newSetItems.push([]);

                setSets(newSets);
                setSetItems(newSetItems);
            } else if (removedSet[0].selected) {
                const newSelectedSetIndex =
                    removedSetIndex === 0
                        ? removedSetIndex
                        : removedSetIndex - 1;
                newSets[newSelectedSetIndex].selected = true;

                setSets(newSets);
                setSetItems(newSetItems);
            } else {
                setSets(newSets);
                setSetItems(newSetItems);
            }
        },
        [sets, setItems]
    );

    const onSetSelected = useCallback(
        (id: number) => {
            const newSets = sets.map((set) => {
                return { ...set, selected: set.id == id };
            });
            setSets(newSets);
        },
        [sets]
    );

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="flex flex-col gap-1">
                    <TodoSetList
                        sets={sets}
                        onAdd={onSetAdd}
                        onRemove={onSetRemove}
                        onSetSelected={onSetSelected}
                    ></TodoSetList>
                    <TodoInput onEnter={onEnter}></TodoInput>
                    <ItemList
                        items={setItems[selectedSetIndex]}
                        setItems={setSelectedSetItems}
                    ></ItemList>
                    <div className="flex justify-between">
                        <button
                            onClick={onFilterChecked}
                            ref={removeCheckedRef}
                        >
                            Remove checked
                        </button>
                        <ThemeButton
                            theme={theme}
                            setTheme={setTheme}
                        ></ThemeButton>
                    </div>
                </div>
            </main>
        </>
    );
}
