import React, { useEffect } from "react";
import Window from "./Window";
import Icon from "./Icon";
import Markdown from "./Markdown";
import Folder from "./Folder";
import Browser from "./Browser";
import {
    AppData,
    FolderAppData,
    FileAppData,
    applications,
} from "./Utils";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import "../styles/System.sass";
import Taskbar from "./Taskbar";


// Link type contents are handled in System component
function buildWindowContent(appData: AppData) {
    switch (appData.type) {
        case "Document":
            return <Markdown appData={appData as FileAppData} />;
        case "Folder":
            return <Folder appData={appData as FolderAppData} />;
        case "Image":
            return <div>TODO</div>;
        case "HTML":
            return <Browser appData={appData as FileAppData} />;
        default:
            return <div>Unknown Contents</div>;
    }
}

function buildWindow(program: string) {
    return (
        <Window key={program} program={program}>
            {buildWindowContent(applications[program])}
        </Window>
    );
}

export default function System(props: {openedPrograms?: string[]}) {
    const dispatch = useDispatch();
    const processes = useSelector((state: RootState) => state.window.processes);

    // Open programs in props
    useEffect(() => {
        if (props.openedPrograms) {
            props.openedPrograms.forEach((program) => {
                dispatch({ type: "window/mount", payload: program });
            });
        }
    }, [props, dispatch]);

    let desktopIcons = [];
    // special apps like desktop is guaranteed to exist in applications
    // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
    for (const [index, program] of (
        applications.desktop as FolderAppData
    ).files.entries()) {
        const pos = {
            x: 50,
            y: 120 * index + 50,
        };
        const icon = <Icon key={program} program={program} initialPos={pos} />;
        desktopIcons.push(icon);
    }

    let windows = [];
    for (const program in processes) {
        windows.push(buildWindow(program));
    }
    return (
        <div className="System">
            <div
                className="Desktop"
                onMouseDown={() => dispatch({ type: "icon/deselect" })}
            >
                {desktopIcons}
                {windows}
            </div>
            <Taskbar/>
        </div>
    );
}
