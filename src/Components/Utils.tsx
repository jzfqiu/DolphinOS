import documentIcon from "../assets/icons/document.png";
import browserIcon from "../assets/icons/browser.png";
import folderIcon from "../assets/icons/folder.png";
import linkIcon from "../assets/icons/link.png";
import imageIcon from "../assets/icons/picture.png";

import applications_data from "../assets/appData.json";
export const applications = applications_data as Applications;

/*

Assets are placed in the public folder for expandability, since I don't want to 
add another require statement each time I add a file. 

Ref: https://create-react-app.dev/docs/using-the-public-folder/ 

*/

export type AppType = "Document" | "Link" | "Folder" | "Image" | "HTML"

type BaseAppData = {
	type: AppType;
	title: string;
    date: string;
};

export type FolderAppData = BaseAppData & {
	files: string[];
};

export type FileAppData = BaseAppData & {
	filepath: string;
};

export type LinkAppData = BaseAppData & {
	url: string;
};


export type AppData =
	| FolderAppData
	| FileAppData
	| LinkAppData

export type Applications = { [pid: string]: AppData };


export type Point = {
    x: number,
    y: number,
};

export function getIcon (type: AppType) {
    switch (type) {
        case "Document":
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
            return documentIcon;
    }
}


export function getPaths () {
    const tokens = window.location.href.split('/');
    const program = tokens.slice(3).join('/');
    const baseUrl = tokens.slice(0, 3).join('/');
    return {program: program, baseUrl: baseUrl};
}

export function updateAddressBar(url: string) {
    window.history.replaceState(null, "", url)
}
