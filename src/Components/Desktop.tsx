import React, { useEffect } from "react";
import Window from "./Window";
import Icon from "./Icon";
import {
    FolderAppData,
    applications,
    buildContent,
} from "./Utils";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import "../styles/System.sass";
import Taskbar from "./Taskbar";


function buildWindow(program: string) {
    return (
        <Window key={program} program={program}>
            {buildContent(applications[program])}
        </Window>
    );
}

export default function Desktop(props: {openedPrograms?: string[]}) {
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
