import React, { Component } from "react";
import "../styles/Folder.sass";
import { getIcon, FolderAppData, Applications } from "./Utils";
import applications_data from "../assets/appData.json";

const applications = applications_data as Applications;

type FolderProps = {
	appData: FolderAppData;
	mountCallback: (program: string) => void;
};

type FolderState = {
	selected: string;
};

export default class Folder extends Component<FolderProps, FolderState> {
	constructor(props: FolderProps) {
		super(props);
		this.state = {
			selected: "",
		};
	}

	selectFolderItem(program: string, event: React.MouseEvent<HTMLElement>) {
		event.stopPropagation();
		this.setState({ selected: program });
	}

	buildFolderItems(program: string) {
		const appData = applications[program];
		return (
			<div
				key={program}
				className={`FolderItem ${program === this.state.selected ? "selected" : ""}`}
				onDoubleClick={this.props.mountCallback.bind(this, program)}
				onClick={this.selectFolderItem.bind(this, program)}
			>
				<img src={getIcon(appData.type)} alt={appData.type}></img>
				<div className="FolderItemName">
					{applications[program].title}
				</div>
				<div>{applications[program].type}</div>
				<div>April 23, 2022</div>
			</div>
		);
	}

	render() {
		let items = [];
		for (const program of this.props.appData.files) {
			items.push(this.buildFolderItems(program));
		}
		return (
			<div className="Folder" onClick={this.selectFolderItem.bind(this, "")}>
				<div className="FolderItem FolderHeader">
					<div></div>
					<div className="FolderItemName">Name</div>
					<div>Type</div>
					<div>Date Modified</div>
				</div>
				{items}
			</div>
		);
	}
}
