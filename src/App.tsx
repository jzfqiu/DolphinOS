import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Mobile from "./components/Mobile";
import System from "./components/System";
import { getPaths } from "./components/Utils";


export default function App() {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const dispatch = useDispatch();

    // Switch between mobile and desktop
    // https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    // Open Window loaded through address bar
    useEffect(()=>{
        const openedProgram = getPaths().program;
        if (openedProgram !== "")
            dispatch({ type: "window/mount", payload: openedProgram });
    }, [dispatch])

    const isMobile = width <= 768;

    if (isMobile)
        return <Mobile/>;
    else
        return <System/>;
}