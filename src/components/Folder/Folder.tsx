import React, { useState } from "react";
import "./Folder.sass";
import { getIcon, FolderData, LinkData, getAppData } from "../Utils";
import { useDispatch } from "react-redux";


type FolderProps = {
	appData: FolderData;
	mobile?: boolean;
};

export function Folder(props: FolderProps) {
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
		const appData = getAppData(program);
		if (appData.type === "Link") {
			window
				.open((appData as LinkData).url, "_blank")
				?.focus();
		} else {
			dispatch({ type: "window/mount", payload: program });
		}
	}

	function buildFolderItems(program: string) {
		const appData = getAppData(program);
		return (
			<div
				key={program}
				className={`FolderItem ${program === selected ? "selected" : ""}`}
				onDoubleClick={() => (props.mobile ? undefined : mount(program))}
				onClick={() => (props.mobile ? mount(program) : undefined)}
				onMouseDown={(e) => selectFolderItem(program, e)}
			>
				<img
					className="FolderItemIcon"
					src={getIcon(appData.type)}
					alt={appData.type}
				></img>
				<div className="FolderItemTitle">{appData.title}</div>
				<div className="FolderItemType">{appData.type}</div>
				<div className="FolderItemDate">{appData.date}</div>
			</div>
		);
	}

	let items = [];
	for (const program of props.appData.files) {
		items.push(buildFolderItems(program));
	}

	const folderHeader = (
		<div className="FolderItem FolderHeader">
			<div className="FolderItemIcon"></div>
			<div className="FolderItemTitle">Name</div>
			<div className="FolderItemType">Type</div>
			<div className="FolderItemDate">Date Modified</div>
		</div>
	);
	return (
		<div className="Folder" onMouseDown={(e) => selectFolderItem("", e)}>
			{props.mobile ? undefined : folderHeader}
			{items}
		</div>
	);
}
