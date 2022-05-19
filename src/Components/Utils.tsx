import browserIcon from "../assets/icons/browser.png";
import folderIcon from "../assets/icons/folder.png";
import linkIcon from "../assets/icons/link.png";
import imageIcon from "../assets/icons/picture.png";

/*

Assets are placed in the public folder for expandability, since I don't want to 
add another require statement each time I add a file. 

Ref: https://create-react-app.dev/docs/using-the-public-folder/ 

*/

export type AppType = "special" | "Document" | "Link" | "Folder" | "image";

type BaseAppData = {
	type: AppType;
	title: string;
    date: string;
};

export type FolderAppData = BaseAppData & {
	files: string[];
};

export type MarkdownAppData = BaseAppData & {
	filepath: string;
};

export type LinkAppData = BaseAppData & {
	url: string;
};

export type ImageAppData = BaseAppData & {
	filepath: string;
};

export type AppData =
	| FolderAppData
	| MarkdownAppData
	| LinkAppData
	| ImageAppData;

export type Applications = { [pid: string]: AppData };


export type Point = {
    x: number,
    y: number,
};

export function getIcon (type: AppType) {
    switch (type) {
        case "Document":
            return browserIcon;
        case "Folder":
            return folderIcon;
        case "Link":
            return linkIcon;
        case "image":
            return imageIcon;
        default:
            return browserIcon;
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
