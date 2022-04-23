import React, { Component } from "react";
import { applications, FolderAppData } from "./AppData";
import "../styles/Folder.sass";
import { getIcon } from "./Utils";

type FolderProps = {
	appData: FolderAppData;
};

type FolderState = {
	active: string;
};

const FolderListItem = (program: string) => {
    const appData = applications[program];
	return (
		<div key={program} className="FolderItem">
            <div>
                <img src={getIcon(appData.type)} alt={appData.type}></img>
                {applications[program].title}
            </div>
            <div>April 23, 2022</div>
		</div>
	);
};

export default class Folder extends Component<FolderProps, FolderState> {
	constructor(props: FolderProps) {
		super(props);
		this.state = {
			active: "",
		};
	}

	render() {
		let items = [];
		for (const program of this.props.appData.files) {
			items.push(FolderListItem(program));
		}
		return (
        <div className="Folder">
            <div className="FolderItem FolderHeader">
                <div>
                    <span></span>
                    Name
                </div>
                <div>Time Modified</div>
            </div>
            {items}
        </div>
        );
	}
}
