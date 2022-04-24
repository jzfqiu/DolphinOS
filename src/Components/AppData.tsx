/*

Assets are placed in the public folder for expandability, since I don't want to 
add another require statement each time I add a file. 

Ref: https://create-react-app.dev/docs/using-the-public-folder/ 

*/
const contentPath = process.env.PUBLIC_URL + "/contents/";

export type AppType = "special" | "markdown" | "link" | "folder" | "image";

type BaseAppData = {
	type: AppType;
	title: string;
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

export const applications: { [pid: string]: AppData } = {
	desktop: {
		type: "folder",
		title: "Some Folder",
		files: ["a", "b"],
	},
	a: {
		type: "markdown",
		title: "test.md",
		filepath: contentPath + "test.md",
	},
	b: {
		type: "folder",
		title: "Some Folder",
		files: ["c", "d", "e"],
	},
	c: {
		type: "link",
		title: "Github",
		url: "https://github.com/jzfqiu",
	},
	d: {
		type: "folder",
		title: "Another Folder",
		files: [],
	},
	e: {
		type: "image",
		title: "Some Image",
		filepath: "",
	},
	f: {
		type: "markdown",
		title: "test2.md",
		filepath: contentPath + "test.md",
	},
	g: {
		type: "markdown",
		title: "test3.md",
		filepath: contentPath + "test.md",
	},
	h: {
		type: "markdown",
		title: "test4.md",
		filepath: contentPath + "test.md",
	},
};
