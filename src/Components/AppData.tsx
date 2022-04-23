/*

Assets are placed in the public folder for expandability, since I don't want to 
add another require statement each time I add a file. 

Ref: https://create-react-app.dev/docs/using-the-public-folder/ 

*/
const contentPath = process.env.PUBLIC_URL + "/contents/";

type AppType = "special" | "document" | "link" | "folder" | "image";

export type AppData = {
	type: AppType;
	title: string;
	filepath?: string;
	url?: string;
	files?: string[];
};

export const applications: { [pid: string]: AppData } = {
	desktop: {
		type: "special",
		title: "Some Folder",
		files: ["a", "b"],
	},
	a: {
		type: "document",
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
	},
	f: {
		type: "document",
		title: "test2.md",
		filepath: contentPath + "test.md",
	},
	g: {
		type: "document",
		title: "test3.md",
		filepath: contentPath + "test.md",
	},
	h: {
		type: "document",
		title: "test4.md",
		filepath: contentPath + "test.md",
	},
};
