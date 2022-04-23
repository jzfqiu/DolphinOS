import { AppType } from "./AppData";
import browserIcon from "../assets/icons/browser.png";
import folderIcon from "../assets/icons/folder.png";
import linkIcon from "../assets/icons/export.png";
import imageIcon from "../assets/icons/picture.png";

export type Point = {
    x: number,
    y: number,
};

export function getIcon (type: AppType) {
    switch (type) {
        case "markdown":
            return browserIcon;
        case "folder":
            return folderIcon;
        case "link":
            return linkIcon;
        case "image":
            return imageIcon;
        default:
            return browserIcon;
    }
}