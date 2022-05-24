import React, { useState } from "react";
import "../styles/Folder.sass";
import { getIcon, FolderAppData, Applications, LinkAppData } from "./Utils";
import applications_data from "../assets/appData.json";
import { useDispatch } from "react-redux";

const applications = applications_data as Applications;

type FolderProps = {
	appData: FolderAppData;
    mobile?: boolean;
};

export default function Folder(props: FolderProps) {
	const [selected, setSelected] = useState("");

	function selectFolderItem(
		program: string,
		event: React.MouseEvent<HTMLElement>
	) {
		event.stopPropagation();
		setSelected(program);
	}
	const dispatch = useDispatch();

	function mount(program: string) {
		// if program is a link, open it in a new tab in the browser
		if (applications[program].type === "Link") {
			window
				.open((applications[program] as LinkAppData).url, "_blank")
				?.focus();
		} else {
			dispatch({ type: "window/mount", payload: program });
		}
	}

	function buildFolderItems(program: string) {
		const appData = applications[program];
		return (
			<div
				key={program}
				className={`FolderItem ${program === selected ? "selected" : ""}`}
				onDoubleClick={() => props.mobile ? undefined : mount(program)}
				onClick={() => props.mobile ?  mount(program) : undefined}
				onMouseDown={(e) => selectFolderItem(program, e)}
			>
				<img src={getIcon(appData.type)} alt={appData.type}></img>
				<div>{applications[program].title}</div>
				<div>{applications[program].type}</div>
				<div>{applications[program].date}</div>
			</div>
		);
	}

	let items = [];
	for (const program of props.appData.files) {
		items.push(buildFolderItems(program));
	}
	return (
		<div className="Folder" onMouseDown={(e) => selectFolderItem("", e)}>
			<div className="FolderItem FolderHeader">
				<div></div>
				<div>Name</div>
				<div>Type</div>
				<div>Date Modified</div>
			</div>
			{items}
		</div>
	);
}
