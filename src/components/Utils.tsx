import documentIcon from "../assets/icons/document.png";
import browserIcon from "../assets/icons/browser.png";
import folderIcon from "../assets/icons/folder.png";
import linkIcon from "../assets/icons/link.png";
import imageIcon from "../assets/icons/picture.png";
import homeIcon from "../assets/icons/house.png";
import appIcon from "../assets/icons/script.png";

import previous from "../assets/icons/previous.png";
import dolphin from "../assets/icons/dolphin.png";
import cross from "../assets/icons/cross.svg";

import applications_data from "../appData.public.json";
// import applications_data from "../appData.json";
import React from "react";
import { Markdown } from "./Markdown";
import { Folder } from "./Folder";
import { Browser } from "./Browser";

export { previous, dolphin, homeIcon, cross };

/*
Most contents are placed in the public folder for expandability
https://create-react-app.dev/docs/using-the-public-folder/ 
*/

type BaseAppData = {
    type: string;
    title: string;
    date: string;
    initialSize?: Point;
    initialPos?: Point;
};

export type FolderData = BaseAppData & {
    files: string[];
};

export type FileData = BaseAppData & {
    filepath: string;
};

export type LinkData = BaseAppData & {
    url: string;
};

export type AppData = FolderData | FileData | LinkData | BaseAppData;

// https://google.github.io/styleguide/tsguide.html#indexable-key-string-number-type
export const applications = new Map(Object.entries(applications_data)) as Map<
    string,
    AppData
>;

export const app404 = {
    type: "Markdown",
    title: "404 Not Found",
    date: "-",
} as AppData;

export const getAppData = (program: string) =>
    applications.get(program) || app404;

export const appDesktop =
    (applications.get("desktop") as FolderData) ||
    ({
        type: "Folder",
        title: "DolphinOS",
        date: "-",
        files: [""],
    } as FolderData);

export type Point = {
    x: number;
    y: number;
};

export function getIcon(type: string) {
    switch (type) {
        case "Markdown":
            return documentIcon;
        case "Folder":
            return folderIcon;
        case "Link":
            return linkIcon;
        case "Image":
            return imageIcon;
        case "HTML":
            return browserIcon;
        default:
            return appIcon;
    }
}

export function getPaths() {
    const tokens = window.location.href.split("/");
    const program = tokens.slice(3).join("/");
    const baseUrl = tokens.slice(0, 3).join("/");
    return { program: program, baseUrl: baseUrl };
}

export function setAddressBar(path: string) {
    window.history.replaceState(null, "", getPaths().baseUrl + "/" + path);
}

// Link type contents are handled in Folder component
export function buildContent(appData: AppData, mobile = false) {
    switch (appData.type) {
        case "Markdown":
            return <Markdown appData={appData as FileData} />;
        case "Folder":
            return <Folder appData={appData as FolderData} mobile={mobile} />;
        case "Image":
            return <div>TODO</div>;
        case "HTML":
            return <Browser appData={appData as FileData} />;
        default:
            return <div>Unknown Contents</div>;
    }
}
