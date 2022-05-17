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
			<tr
				key={program}
				className={`FolderItem ${program === this.state.selected ? "selected" : ""}`}
				onDoubleClick={this.props.mountCallback.bind(this, program)}
				onClick={this.selectFolderItem.bind(this, program)}
			>
				<td><img src={getIcon(appData.type)} alt={appData.type}></img></td>
				<td>
					{applications[program].title}
				</td>
				<td>{applications[program].type}</td>
				<td>April 23, 2022</td>
			</tr>
		);
	}

	render() {
		let items = [];
		for (const program of this.props.appData.files) {
			items.push(this.buildFolderItems(program));
		}
		return (
			<table className="Folder" onClick={this.selectFolderItem.bind(this, "")}>
				<tbody>
					<tr className="FolderItem FolderHeader">
						<th></th>
						<th>Name</th>
						<th>Type</th>
						<th>Date Modified</th>
					</tr>
					{items}
				</tbody>
			</table>
		);
	}
}
