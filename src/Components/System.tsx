import React, { useState } from "react";
import Window from "./Window";
import Icon from "./Icon";
import Markdown from "./Markdown";
import Folder from "./Folder";
import Browser from "./Browser";
import {
	AppData,
	FolderAppData,
	FileAppData,
	getIcon,
	applications,
} from "./Utils";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import "../styles/System.sass";
import homeIcon from "../assets/icons/house.png";
import cross from "../assets/icons/cross.svg";

type SystemProps = {
	initialProcesses?: { [pid: string]: ProcessState };
	initialWindowsOrder?: string[];
};

type ProcessState = {
	minimized: boolean;
};

export default function System(props: SystemProps) {

	// Component states
	const [iconsOrder, setIconsOrder] = useState(
		(applications.desktop as FolderAppData).files
	);
	const [iconSelected, setIconSelected] = useState("");

	// Redux
	const dispatch = useDispatch();
	const processes = useSelector((state: RootState) => state.system.processes);
	const windowsOrder = useSelector(
		(state: RootState) => state.system.windowsOrder
	);
	const windowInFocus = useSelector(
		(state: RootState) => state.system.windowInFocus
	);

	// Pop selected icon from order list, then push to end
	function sendToFrontIcon(program: string) {
		let updatedIconsOrder = iconsOrder.filter((item) => item !== program);
		updatedIconsOrder.push(program);
		setIconsOrder(updatedIconsOrder);
		setIconSelected("");
	}

	// Link type contents are handled in System component
	function buildWindowContent(program: string, appData: AppData) {
		switch (appData.type) {
			case "Document":
				return <Markdown appData={appData as FileAppData} />;
			case "Folder":
				return <Folder appData={appData as FolderAppData} />;
			case "Image":
				return <div>TODO</div>;
			case "HTML":
				return <Browser appData={appData as FileAppData} />;
			default:
				return <div>Unknown Contents</div>;
		}
	}

	function buildWindow(program: string, programState: ProcessState) {
		const appData = applications[program];
		const nProcesses = windowsOrder.length;
		return (
			<Window
				key={program}
				program={program}
				appData={appData}
				display={!programState.minimized}
				zIndex={windowsOrder.indexOf(program) + 100}
				initialPos={{ x: 100 + nProcesses * 20, y: 100 + nProcesses * 20 }}
			>
				{buildWindowContent(program, appData)}
			</Window>
		);
	}

	function buildTask(program: string) {
		const appData = applications[program];
		return (
			<button
				className={program === windowInFocus ? "Task Selected" : "Task"}
				key={program}
				onClick={() => dispatch({ type: "window/mount", payload: program })}
			>
				<img
					className="TaskIcon"
					src={getIcon(appData.type)}
					alt={appData.type}
				></img>
				<p>{appData.title}</p>
				<img
					className="TaskClose"
					src={cross}
					alt={"Close"}
					onClick={(e) => {
						// stop click event from propagating to mountWindow()
						e.stopPropagation();
						dispatch({ type: "window/unmount", payload: program });
					}}
				></img>
			</button>
		);
	}

	function buildIcons() {
		let desktopIcons = [];
		// special apps like desktop is guaranteed to exist in applications
		// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
		for (const [index, program] of (
			applications.desktop as FolderAppData
		).files.entries()) {
			const appData = applications[program];
			const pos = {
				x: 50,
				y: 120 * index + 50,
			};
			const icon = (
				<Icon
					key={program}
					program={program}
					initialPos={pos}
					appData={appData}
					sendToFrontCallback={() => sendToFrontIcon(program)}
					active={iconSelected === program}
					zIndex={iconsOrder.indexOf(program)}
				/>
			);
			desktopIcons.push(icon);
		}
		return desktopIcons;
	}

	let windows = [];
	let tasks = [];
	for (const program in processes) {
		windows.push(buildWindow(program, processes[program]));
		tasks.push(buildTask(program));
	}
	return (
		<div className="System">
			<div className="Desktop" onMouseDown={() => setIconSelected("")}>
				{buildIcons()}
				{windows}
			</div>
			<div className="Taskbar">
				<div>
					<button className="Task TaskDesktop" 
						onClick={() => dispatch({ type: "window/minimizeAll"})}>
						<img className="TaskIcon" src={homeIcon} alt={"Desktop"}></img>
						<p>Desktop</p>
					</button>
					{tasks}
				</div>
			</div>
		</div>
	);
}
