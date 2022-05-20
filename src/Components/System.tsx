import React, { Component } from "react";
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
} from "./Utils";
import "../styles/System.sass";
import applications_data from "../assets/appData.json";
import homeIcon from "../assets/icons/house.png";
import cross from "../assets/icons/cross.svg";

const applications = applications_data as Applications;

type SystemProps = {
	initialProcesses?: { [pid: string]: ProcessState };
	initialWindowsOrder?: string[];
};

type SystemState = {
	processes: { [pid: string]: ProcessState };
	windowsOrder: string[];
	windowInFocus: string;
	iconsOrder: string[];
	iconSelected: string;
};

type ProcessState = {
	minimized: boolean;
};

export default class System extends Component<SystemProps, SystemState> {
	baseUrl: string;
	constructor(props: SystemProps) {
		super(props);
		this.state = {
			processes: props.initialProcesses ? props.initialProcesses : {},
			windowsOrder: props.initialWindowsOrder ? props.initialWindowsOrder : [],
			windowInFocus: "",
			iconsOrder: (applications.desktop as FolderAppData).files,
			iconSelected: "",
		};
		this.baseUrl = "";
	}

	componentDidMount() {
		const paths = getPaths();
		this.baseUrl = paths.baseUrl;
		if (paths.program === "") {
			// dont mount anything if there is no program
		} else if (paths.program in applications) {
			this.mountWindow(paths.program);
		} else {
			this.mountWindow("404");
		}
	}

	// If click happens on an icon, propagation stops at the icon dom
	// and this function is not called.
	deselectIcon() {
		this.setState({ iconSelected: "" });
	}

	// Mount a new program or restore a minimized program
	mountWindow(program: string) {
		// if program is a link, open it in a new tab in the browser
		if (applications[program].type === "Link") {
			window
				.open((applications[program] as LinkAppData).url, "_blank")
				?.focus();
			return;
		}
		// add variable key to state: https://stackoverflow.com/a/58652613
		// add element to state array: https://stackoverflow.com/a/26254086
		this.setState((prevState) => ({
			processes: {
				...prevState.processes,
				[program]: {
					minimized: false,
				},
			},
		}));
		this.focusWindow(program);
	}

	// Remove program from processes list, destroy its state (size, pos)
	unmountWindow(program: string) {
		let updatedProcesses = this.state.processes;
		let updatedWindowsOrder = this.state.windowsOrder.filter(
			(item) => item !== program
		);
		delete updatedProcesses[program];
		this.setState({
			processes: updatedProcesses,
			windowInFocus: "",
			windowsOrder: updatedWindowsOrder,
		});
		updateAddressBar(this.baseUrl);
	}

	// Set program to be minimized
	minimizeWindow(program: string) {
		let updatedProcesses = this.state.processes;
		updatedProcesses[program].minimized = true;
		this.setState({
			processes: updatedProcesses,
			windowInFocus: "",
		});
	}

	minimizeAll() {
		for (const program in this.state.processes) {
			this.minimizeWindow(program);
		}
	}

	// if program is already rendered, remove the program from windowsOrder,
	// then push to last (highest z-index) otherwise just add it to the end of
	// the list. Update browser address bar if needed
	focusWindow(program: string) {
		let updatedWindowsOrder;
		if (!this.state.windowsOrder.includes(program)) {
			updatedWindowsOrder = [...this.state.windowsOrder, program];
		} else {
			updatedWindowsOrder = this.state.windowsOrder.filter(
				(item) => item !== program
			);
			updatedWindowsOrder.push(program);
		}
		this.setState({
			windowsOrder: updatedWindowsOrder,
			windowInFocus: program,
			iconSelected: "",
		});
		updateAddressBar(this.baseUrl + "/" + program);
	}

	sendToFrontIcon(program: string) {
		let updatedIconsOrder = this.state.iconsOrder.filter(
			(item) => item !== program
		);
		updatedIconsOrder.push(program);
		this.setState({
			iconsOrder: updatedIconsOrder,
			iconSelected: program,
		});
	}

	// Link type contents are handled in System component
	buildWindowContent(program: string, appData: AppData) {
		switch (appData.type) {
			case "Document":
				return <Markdown appData={appData as FileAppData} />;
			case "Folder":
				return (
					<Folder
						appData={appData as FolderAppData}
						mountCallback={this.mountWindow.bind(this)}
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

	buildWindow(program: string, programState: ProcessState) {
		const appData = applications[program];
		const nProcesses = this.state.windowsOrder.length;
		return (
			<Window
				key={program}
				appData={appData}
				display={!programState.minimized}
				zIndex={this.state.windowsOrder.indexOf(program) + 100}
				initialPos={{ x: 100 + nProcesses * 20, y: 100 + nProcesses * 20 }}
				// https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
				unmountCallback={this.unmountWindow.bind(this, program)}
				minimizeCallback={this.minimizeWindow.bind(this, program)}
				sendToFrontCallback={this.focusWindow.bind(this, program)}
			>
				{this.buildWindowContent(program, appData)}
			</Window>
		);
	}

	buildTask(program: string) {
		const appData = applications[program];
		return (
			<button
				className={
					program === this.state.windowInFocus ? "Task Selected" : "Task"
				}
				key={program}
				onClick={this.mountWindow.bind(this, program)}
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
						this.unmountWindow(program);
					}}
				></img>
			</button>
		);
	}

	buildIcons() {
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
					doubleClickCallback={this.mountWindow.bind(this, program)}
					sendToFrontCallback={this.sendToFrontIcon.bind(this, program)}
					active={this.state.iconSelected === program}
					zIndex={this.state.iconsOrder.indexOf(program)}
				/>
			);
			desktopIcons.push(icon);
		}
		return desktopIcons;
	}

	render() {
		let windows = [];
		let tasks = [];
		for (const program in this.state.processes) {
			windows.push(this.buildWindow(program, this.state.processes[program]));
			tasks.push(this.buildTask(program));
		}
		return (
			<div className="System">
				<div className="Desktop" onMouseDown={this.deselectIcon.bind(this)}>
					{this.buildIcons()}
					{windows}
				</div>
				<div className="Taskbar">
					<div>
						<button
							className="Task TaskDesktop"
							onClick={this.minimizeAll.bind(this)}
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
}
