import Image from "next/image";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Brightness5, Brightness4 } from "@mui/icons-material";

export type Theme = "dark" | "light";
interface Props {
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
}

export function getPreferredTheme(): Theme {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("theme") as Theme | undefined;
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
        ? "dark"
        : "light";

    return savedTheme ?? preferredTheme;
}

export const ThemeButton: FC<Props> = ({ theme, setTheme }) => {
    function onClick() {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    }

    useEffect(() => {
        if (theme == "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        // Save the theme
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <>
            <button onClick={onClick}>
                {theme == "light" ? <Brightness4
                ></Brightness4> : <Brightness5></Brightness5>}
            </button>
        </>
    );
};
