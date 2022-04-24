import React, { Component } from "react";
import { applications, FolderAppData } from "./AppData";
import "../styles/Folder.sass";
import { getIcon } from "./Utils";

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
				className="FolderItem"
				style={{
					background: program === this.state.selected ? "lightblue" : "none",
				}}
				onDoubleClick={this.props.mountCallback.bind(this, program)}
				onClick={this.selectFolderItem.bind(this, program)}
			>
				<div>
					<img src={getIcon(appData.type)} alt={appData.type}></img>
					{applications[program].title}
				</div>
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
					<div>
						<span></span>
						Name
					</div>
					<div>Date Modified</div>
				</div>
				{items}
			</div>
		);
	}
}
