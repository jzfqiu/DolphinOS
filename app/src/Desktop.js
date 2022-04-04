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
      windowsOrder: []
		};
		this.mountWindow = this.mountWindow.bind(this);
		this.restoreWindow = this.restoreWindow.bind(this);
    this.sendToFront = this.sendToFront.bind(this);
	}

	mountWindow(program) {
		// add variable key to state object: https://stackoverflow.com/a/58652613
    // add element to state array: https://stackoverflow.com/a/26254086
		this.setState(prevState => ({ 
      activePrograms: {
        ...prevState.activePrograms,
        [program]: { 
          minimized: false,
        }
      }, 
      windowsOrder: [...prevState.windowsOrder, program]
    }));
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

  // remove the program from windowsOrder, then push to last
  sendToFront(program) {
    let updatedWindowsOrder = this.state.windowsOrder.filter(item => item !== program);
    updatedWindowsOrder.push(program);
    this.setState({windowsOrder: updatedWindowsOrder})
  }

  renderWindowComponent(program, programState) {
		const data = programData[program];
		return (
			<Window
				key={program}
				title={data.title}
				display={programState.minimized}
        zIndex={this.state.windowsOrder.indexOf(program)}
        // https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers 
        unmountCallbacks={this.unmountWindow.bind(this, program)}
        minimizeCallbacks={this.minimizeWindow.bind(this, program)}
        sendToFrontCallbacks={this.sendToFront.bind(this, program)}
			></Window>
		);
	}

	render() {
		let windows = [];
		for (const program in this.state.activePrograms) {
			windows.push(
				this.renderWindowComponent(program, this.state.activePrograms[program])
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