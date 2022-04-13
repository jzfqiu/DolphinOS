/*

Assets are placed in the public folder for expandability, since I don't want to 
add another require statement each time I add a file. 

Ref: https://create-react-app.dev/docs/using-the-public-folder/ 

*/
const contentPath = process.env.PUBLIC_URL + "/contents/";

export const applications = {
	a: {
		type: "document",
		title: "test.md",
        filepath: contentPath + "test.md",
	},
	b: {
		type: "folder",
		title: "Some Folder",
	},
	c: {
		type: "link",
		title: "Github",
		url: "https://github.com/jzfqiu",
	},
	d: {
		type: "folder",
		title: "Another Folder",
	},
	e: {
		type: "image",
		title: "Some Image",
	},
};