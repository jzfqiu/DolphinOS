import React, { useState } from "react";
import Window from "./Window";
import Icon from "./Icon";
import Markdown from "./Markdown";
import Folder from "./Folder";
import Browser from "./Browser";
import {
	Applications,
	AppData,
	FolderAppData,
	LinkAppData,
	FileAppData,
	getPaths,
	updateAddressBar,
	getIcon,
	applications
} from "./Utils";
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

	const [processes, setProcesses] = useState(props.initialProcesses ? props.initialProcesses : {})
	const [windowsOrder, setWindowsOrder] = useState(props.initialWindowsOrder ? props.initialWindowsOrder : [])
	const [windowInFocus, setWindowInFocus] = useState("")
	const [iconsOrder, setIconsOrder] = useState((applications.desktop as FolderAppData).files)
	const [iconSelected, setIconSelected] = useState("")

	// const paths = getPaths();
	// if (paths.program === "") {
	// 	// dont mount anything if there is no program
	// } else if (paths.program in applications) {
	// 	// mountWindow(paths.program);
	// } else {
	// 	// mountWindow("404");
	// }
	

	// Mount a new program or restore a minimized program
	function mountWindow(program: string) {
		// if program is a link, open it in a new tab in the browser
		if (applications[program].type === "Link") {
			window
				.open((applications[program] as LinkAppData).url, "_blank")
				?.focus();
			return;
		}
		// add variable key to state: https://stackoverflow.com/a/58652613
		// add element to state array: https://stackoverflow.com/a/26254086
		setProcesses(prevState => {
			return {
				...prevState,
				[program]: {minimized: false}
			}
		});
		focusWindow(program);
	}

	// Remove program from processes list, destroy its state (size, pos)
	function unmountWindow(program: string) {
		let updatedProcesses = processes;
		let updatedWindowsOrder = windowsOrder.filter(
			(item) => item !== program
		);
		delete updatedProcesses[program];
		setProcesses(updatedProcesses);
		setWindowInFocus("");
		setWindowsOrder(updatedWindowsOrder)
		updateAddressBar(getPaths().baseUrl);
	}

	// Set program to be minimized
	function minimizeWindow(program: string) {
		let updatedProcesses = processes;
		updatedProcesses[program].minimized = true;
		setProcesses(updatedProcesses);
		setWindowInFocus("");
	}

	function minimizeAll() {
		for (const program in processes) {
			minimizeWindow(program);
		}
	}

	// if program is already rendered, remove the program from windowsOrder,
	// then push to last (highest z-index) otherwise just add it to the end of
	// the list. Update browser address bar if needed
	function focusWindow(program: string) {
		let updatedWindowsOrder;
		if (!windowsOrder.includes(program)) {
			updatedWindowsOrder = [...windowsOrder, program];
		} else {
			updatedWindowsOrder = windowsOrder.filter(
				(item) => item !== program
			);
			updatedWindowsOrder.push(program);
		}
		setWindowsOrder(updatedWindowsOrder)
		setWindowInFocus(program);
		setIconSelected("");
		updateAddressBar(getPaths().baseUrl + "/" + program);
	}

	// pop selected icon from order list, then push to end
	function sendToFrontIcon(program: string) {
		let updatedIconsOrder = iconsOrder.filter(
			(item) => item !== program
		);
		updatedIconsOrder.push(program);
		setIconsOrder(updatedIconsOrder)
		setIconSelected("");
	}

	// Link type contents are handled in System component
	function buildWindowContent(program: string, appData: AppData) {
		switch (appData.type) {
			case "Document":
				return <Markdown appData={appData as FileAppData} />;
			case "Folder":
				return (
					<Folder
						appData={appData as FolderAppData}
						mountCallback={mountWindow}
					/>
				);
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
				appData={appData}
				display={!programState.minimized}
				zIndex={windowsOrder.indexOf(program) + 100}
				initialPos={{ x: 100 + nProcesses * 20, y: 100 + nProcesses * 20 }}
				// https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
				unmountCallback={() => unmountWindow(program)}
				minimizeCallback={() => minimizeWindow(program)}
				sendToFrontCallback={() => focusWindow(program)}
			>
				{buildWindowContent(program, appData)}
			</Window>
		);
	}

	function buildTask(program: string) {
		const appData = applications[program];
		return (
			<button
				className={
					program === windowInFocus ? "Task Selected" : "Task"
				}
				key={program}
				onClick={() => mountWindow(program)}
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
						unmountWindow(program);
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
					initialPos={pos}
					appData={appData}
					doubleClickCallback={() => mountWindow(program)}
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
					<button
						className="Task TaskDesktop"
						onClick={() => minimizeAll()}
					>
						<img className="TaskIcon" src={homeIcon} alt={"Desktop"}></img>
						<p>Desktop</p>
					</button>
					{tasks}
				</div>
			</div>
		</div>
	);
}
