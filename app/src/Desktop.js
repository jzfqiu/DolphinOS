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

const StyledDesktop = styled.div`
	width: 100%;
	height: 100%;
`;

export default class Desktop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePrograms: [],
		};
		this.mountWindow = this.mountWindow.bind(this);
		this.restoreWindow = this.restoreWindow.bind(this);
	}

	renderProgram(program, programState) {
		const data = programData[program];
		return (
			<Window
				key={program}
				title={data.title}
				display={programState.minimized}
        // https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers 
        unmountCallbacks={this.unmountWindow.bind(this, program)}
        minimizeCallbacks={this.minimizeWindow.bind(this, program)}
			></Window>
		);
	}

	mountWindow(program) {
		// add variable key to state object: https://stackoverflow.com/a/58652613
		const updatedActivePrograms = {
			...this.state.activePrograms,
			[program]: { minimized: false },
		};
		this.setState({ activePrograms: updatedActivePrograms });
	}

	restoreWindow(program) {}

  // Remove program from active
  unmountWindow(program) {
    let updatedActivePrograms = this.state.activePrograms;
    delete updatedActivePrograms[program];
    this.setState({activePrograms: updatedActivePrograms})
  }

  minimizeWindow(program) {
    console.log("minimizing", program);
  }

	render() {
		let windows = [];
		for (const program in this.state.activePrograms) {
			windows.push(
				this.renderProgram(program, this.state.activePrograms[program])
			);
		}
		return (
			<StyledDesktop>
				<button onClick={this.mountWindow.bind(this, 'a')}>
					1
				</button>
				<button onClick={this.mountWindow.bind(this, 'b')}>
					2
				</button>
				<button onClick={this.mountWindow.bind(this, 'c')}>
					3
				</button>
				{windows}
			</StyledDesktop>
		);
	}
}
