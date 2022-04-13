import React, { Component } from "react";
import styled from "styled-components";
import Window from "./Window";
import Icon from "./Icon";
import { applications } from "./AppData";

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }


const StyledSystem = styled.div`
	width: 100%;
	height: 100vh;
	font-family: sans-serif;
`;

const StyledDesktop = styled.div`
	width: 100%;
	height: calc(100% - 42px);
`;

const StyledTaskbar = styled.div`
	height: 40px;
	width: 100%;
	border-top: 2px solid black;
	background-color: white;
	position: absolute;
`;

const StyledTask = styled.button`
	height: 40px;
	min-width: 70px;
	/* transition-duration: 0.4s; */
	&:hover {
		background-color: lightblue;
	}
	background: ${(props) => (props.active ? "steelblue" : "white")};
	border: 0;
	border-right: 2px solid black;
`;

export default class System extends Component {
	constructor(props) {
		super(props);
		this.state = {
			processes: [],
			windowsOrder: [],
			windowInFocus: "",
			iconsOrder: Object.keys(applications),
			iconSelected: "",
		};
		this.mountWindow = this.mountWindow.bind(this);
		this.sendToFrontWindow = this.sendToFrontWindow.bind(this);
		this.sendToFontIcon = this.sendToFrontIcon.bind(this);
		this.deselectIcon = this.deselectIcon.bind(this);
	}

	// If click happens on an icon, propagation stops at the icon dom 
	// and this function is not called.
	deselectIcon() {
		this.setState({iconSelected: ""});
	}

	// Un-minimize a process, which could be a new process or an existing minimized process
	mountWindow(program) {
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
	unmountWindow(program) {
		let updatedProcesses = this.state.processes;
		delete updatedProcesses[program];
		this.setState({
			processes: updatedProcesses,
			windowInFocus: "",
		});
	}

	// Set program to be minimized
	minimizeWindow(program) {
		let updatedProcesses = this.state.processes;
		updatedProcesses[program].minimized = true;
		this.setState({
			processes: updatedProcesses,
			windowInFocus: "",
		});
	}

	// remove the program from windowsOrder, then push to last (highest z-index)
	sendToFrontWindow(program) {
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

	sendToFrontIcon(program) {
		let updatedIconsOrder = this.state.iconsOrder.filter(
			(item) => item !== program
		);
		updatedIconsOrder.push(program);
		this.setState({
			iconsOrder: updatedIconsOrder,
			iconSelected: program,
		});
	}

	buildWindowComponent(program, programState) {
		const appData = applications[program];
		return (
			<Window
				key={program}
				appData={appData}
				display={!programState.minimized}
				zIndex={this.state.windowsOrder.indexOf(program)+100}
				// https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
				unmountCallbacks={this.unmountWindow.bind(this, program)}
				minimizeCallbacks={this.minimizeWindow.bind(this, program)}
				sendToFrontCallbacks={this.sendToFrontWindow.bind(this, program)}
			/>
		);
	}

	buildTaskComponent(program) {
		return (
			<StyledTask
				key={program}
				onClick={this.mountWindow.bind(this, program)}
				active={program === this.state.windowInFocus ? 1 : 0}
			>
				{applications[program].title}
			</StyledTask>
		);
	}

	buildIconComponent(program) {
		const appData = applications[program];
		const pos = {
			x: getRandomInt(500),
			y: getRandomInt(500),
		}
		let doubleClickCallback;
		if (appData.type === "link")
			doubleClickCallback = () => window.open(appData.url, '_blank').focus();
		else
			doubleClickCallback = this.mountWindow.bind(this, program);
		return (
			<Icon
				key={program}
				initialPos={pos}
				appData={appData}
				doubleClickCallback={doubleClickCallback}
				sendToFrontCallbacks={this.sendToFrontIcon.bind(this, program)}
				active={this.state.iconSelected===program ? 1 : 0}
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
			<StyledSystem>
				<StyledDesktop onMouseDown={this.deselectIcon}>
					{icons}
					{windows}
				</StyledDesktop>
				<StyledTaskbar>
					<StyledTask>Start</StyledTask>
					{tasks}
				</StyledTaskbar>
			</StyledSystem>
		);
	}
}