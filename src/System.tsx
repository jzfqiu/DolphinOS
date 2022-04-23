import React, { Component } from "react";
import Window from "./Window";
import Icon from "./Icon";
import { applications } from "./AppData";
import "./styles/System.sass";

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

type SystemProps = {};

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
	constructor(props: SystemProps) {
		super(props);
		this.state = {
			processes: {},
			windowsOrder: [],
			windowInFocus: "",
			iconsOrder: Object.keys(applications),
			iconSelected: "",
		};
		this.mountWindow = this.mountWindow.bind(this);
		this.sendToFrontWindow = this.sendToFrontWindow.bind(this);
		this.sendToFrontIcon = this.sendToFrontIcon.bind(this);
		this.deselectIcon = this.deselectIcon.bind(this);
	}

	// If click happens on an icon, propagation stops at the icon dom
	// and this function is not called.
	deselectIcon() {
		this.setState({ iconSelected: "" });
	}

	// Un-minimize a process, which could be a new process or an existing minimized process
	mountWindow(program: string) {
		// add variable key to state object: https://stackoverflow.com/a/58652613
		// add element to state array: https://stackoverflow.com/a/26254086
		this.setState((prevState) => ({
			processes: {
				...prevState.processes,
				[program]: {
					minimized: false,
				},
			},
		}));
		// if program is already rendered, send the program to front
		// instead of adding it to the window order list
		if (this.state.windowsOrder.includes(program)) {
			this.sendToFrontWindow(program);
		} else {
			this.setState((prevState) => ({
				windowsOrder: [...prevState.windowsOrder, program],
				windowInFocus: program,
				iconSelected: "",
			}));
		}
	}

	// Remove program from processes list, destroy its state (size, pos)
	unmountWindow(program: string) {
		let updatedProcesses = this.state.processes;
		delete updatedProcesses[program];
		this.setState({
			processes: updatedProcesses,
			windowInFocus: "",
		});
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

	// remove the program from windowsOrder, then push to last (highest z-index)
	sendToFrontWindow(program: string) {
		let updatedWindowsOrder = this.state.windowsOrder.filter(
			(item) => item !== program
		);
		updatedWindowsOrder.push(program);
		this.setState({
			windowsOrder: updatedWindowsOrder,
			windowInFocus: program,
			iconSelected: "",
		});
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

	buildWindowComponent(program: string, programState: ProcessState) {
		const appData = applications[program];
		return (
			<Window
				key={program}
				appData={appData}
				display={!programState.minimized}
				zIndex={this.state.windowsOrder.indexOf(program) + 100}
				// https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
				unmountCallback={this.unmountWindow.bind(this, program)}
				minimizeCallback={this.minimizeWindow.bind(this, program)}
				sendToFrontCallback={this.sendToFrontWindow.bind(this, program)}
			/>
		);
	}

	buildTaskComponent(program: string) {
		return (
			<button
				className="Task"
				key={program}
				onClick={this.mountWindow.bind(this, program)}
				style={{
					background:
						program === this.state.windowInFocus ? "steelblue" : "white",
				}}
			>
				{applications[program].title}
			</button>
		);
	}

	buildIconComponent(program: string) {
		const appData = applications[program];
		const pos = {
			x: getRandomInt(500),
			y: getRandomInt(500),
		};
		let doubleClickCallback: () => void;
		if (appData.type === "link")
			doubleClickCallback = () => {window.open(appData.url, "_blank")?.focus();}
		else doubleClickCallback = this.mountWindow.bind(this, program);
		return (
			<Icon
				key={program}
				initialPos={pos}
				appData={appData}
				doubleClickCallback={doubleClickCallback}
				sendToFrontCallbacks={this.sendToFrontIcon.bind(this, program)}
				active={this.state.iconSelected === program}
				zIndex={this.state.iconsOrder.indexOf(program)}
			/>
		);
	}

	render() {
		let windows = [];
		let tasks = [];
		let icons = [];
		for (const program in this.state.processes) {
			windows.push(
				this.buildWindowComponent(program, this.state.processes[program])
			);
			tasks.push(this.buildTaskComponent(program));
		}
		for (const program in applications) {
			icons.push(this.buildIconComponent(program));
		}
		return (
			<div className="System">
				<div className="Desktop" onMouseDown={this.deselectIcon}>
					{icons}
					{windows}
				</div>
				<div className="Taskbar">
					<button className="Task">Start</button>
					{tasks}
				</div>
			</div>
		);
	}
}