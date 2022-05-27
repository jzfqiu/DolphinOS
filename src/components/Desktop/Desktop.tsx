import React from "react";
import { Window } from "../Window";
import { Icon } from "../Icon";
import { FolderAppData, applications, buildContent } from "../Utils";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import "./Desktop.sass";
import { Taskbar } from "../Taskbar";

export function Desktop() {
	const dispatch = useDispatch();
	const processes = useSelector((state: RootState) => state.window.processes);

	let desktopIcons = [];
	// special apps like desktop is guaranteed to exist in applications
	// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
	for (const [index, program] of (
		applications.desktop as FolderAppData
	).files.entries()) {
		const pos = {
			x: 50,
			y: 120 * index + 50,
		};
		const icon = <Icon key={program} program={program} initialPos={pos} />;
		desktopIcons.push(icon);
	}

	let windows = [];
	// https://google.github.io/styleguide/tsguide.html#iterating-objects
	for (const program of Object.keys(processes)) {
		windows.push(
			<Window key={program} program={program}>
				{buildContent(applications[program])}
			</Window>
		);
	}
	return (
		<div className="System">
			<div
				className="Desktop"
				onMouseDown={() => dispatch({ type: "icon/deselect" })}
			>
				{desktopIcons}
				{windows}
			</div>
			<Taskbar />
		</div>
	);
}
