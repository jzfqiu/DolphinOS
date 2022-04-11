import React, { Component } from "react";
import styled from "styled-components";
import Window from "./Window";

const programData = {
	a: {
		title: "Window 1",
		contents: "",
	},
	b: {
		title: "Window 2",
		contents: "",
	},
	c: {
		title: "Window 3",
		contents: "",
	},
};

const StyledSystem = styled.div`
	width: 100%;
	height: 100vh;
`;

const StyledDesktop = styled.div`
	width: 100%;
	height: calc(100% - 42px);
	z-index: -1;
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
    min-width: 40px;
    background-color: ${(props) => props.active ? "blue" : "gray"};
`;

export default class System extends Component {
	constructor(props) {
		super(props);
		this.state = {
			processes: [],
			windowsOrder: [],
		};
		this.mountWindow = this.mountWindow.bind(this);
		this.sendToFront = this.sendToFront.bind(this);
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
			windowsOrder: [...prevState.windowsOrder, program],
		}));
	}

	// Remove program from processes list, destroy its state (size, pos)
	unmountWindow(program) {
		let updatedProcesses = this.state.processes;
		delete updatedProcesses[program];
		this.setState({ processes: updatedProcesses });
	}

	// Set program to be minimized
	minimizeWindow(program) {
		let updatedProcesses = this.state.processes;
		updatedProcesses[program].minimized = true;
		this.setState({ processes: updatedProcesses });
	}

	// remove the program from windowsOrder, then push to last (highest z-index)
	sendToFront(program) {
		let updatedWindowsOrder = this.state.windowsOrder.filter(
			(item) => item !== program
		);
		updatedWindowsOrder.push(program);
		this.setState({ windowsOrder: updatedWindowsOrder });
	}

	buildWindowComponent(program, programState) {
		const data = programData[program];
		return (
			<Window
				key={program}
				title={data.title}
				display={!programState.minimized}
				zIndex={this.state.windowsOrder.indexOf(program)}
				// https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
				unmountCallbacks={this.unmountWindow.bind(this, program)}
				minimizeCallbacks={this.minimizeWindow.bind(this, program)}
				sendToFrontCallbacks={this.sendToFront.bind(this, program)}
			/>
		);
	}

	buildTaskComponent(program) {
		return (
			<StyledTask
				key={program}
				onClick={this.mountWindow.bind(this, program)}
				active={program === this.state.windowsOrder[-1] ? 1 : 0}
			>
				{program}
			</StyledTask>
		);
	}

	render() {
		let windows = [];
		let tasks = [];
		for (const program in this.state.processes) {
			windows.push(
				this.buildWindowComponent(program, this.state.processes[program])
			);
			tasks.push(this.buildTaskComponent(program));
		}
		return (
			<StyledSystem>
				<StyledDesktop>
					<button onClick={this.mountWindow.bind(this, "a")}>1</button>
					<button onClick={this.mountWindow.bind(this, "b")}>2</button>
					<button onClick={this.mountWindow.bind(this, "c")}>3</button>
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
