import React, { Component } from "react";
import styled from "styled-components";


// Default window position in px
const DefaultPos = {
	x: 100,
	y: 100,
};

// Default window size in px
const DefaultSize = {
	x: 400,
	y: 300,
};

// Size of resize corner
const DraggableCornerSize = 10;

// https://styled-components.com/docs/basics#attaching-additional-props
// Props pass through attrs constructor for frequently updated attribute
const StyledWindow = styled.div.attrs((props) => ({
	style: {
		width: props.size.x + "px",
		height: props.size.y + "px",
		left: props.pos.x + "px",
		top: props.pos.y + "px",
		cursor: props.resizable ? "nwse-resize" : "auto",
	},
}))`
	min-width: 200px;
	min-height: 100px;
	border: 2px solid black;
	position: absolute;
  background-color: white;
  display: ${props => props.display ? "block" : "none"};
  z-index: ${props => props.zIndex};
`;

const StyledWindowContent = styled.div`
	top: 28px;
	width: 100%;
	height: calc(100% - 30px);
	border-top: 2px solid black;
	position: absolute;
`;

const StyledWindowTopBar = styled.div`
	height: 28px;
	width: 100%;
	position: absolute;
	display: flex;
	flex-direction: row;
`;

const StyledWindowTopBarTitle = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledWindowTopBarButton = styled.button`
	height: 100%;
	width: 28px;
`;

/**
 * A draggable, resizable window that is able to minimize, maximize,
 * restore to previous size, and close itself.
 * @param {Object} initialPos Initial position of the window in the format `{x: left, y: top}`
 * @param {Object} initialSize Initial size of the window in the format `{x: width, y: height}`
 * @param {string} title
 */
export default class Window extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pos: {
				x: this.props.initialPos ? this.props.initialPos.x : DefaultPos.x,
				y: this.props.initialPos ? this.props.initialPos.y : DefaultPos.y,
			},
			size: {
				x: this.props.initialSize ? this.props.initialSize.x : DefaultSize.x,
				y: this.props.initialSize ? this.props.initialSize.y : DefaultSize.y,
			},
			resizable: false,
      display: true,
		};

    this.program = this.props.program;

		// Change in class variable does not trigger re-render
		this.dragging = false;
		this.resizing = false;
		this.maximized = false;

		// cursor position when dragging starts, updated when cursor move within component
		this.cursorPos = null;
		this.restore = null; // store previous size and pos when maximized

		// This binding is necessary to make `this` work in the callback
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.stopWindowAction = this.stopWindowAction.bind(this);
		this.minimizeWindow = this.minimizeWindow.bind(this);
		this.maximizeWindow = this.maximizeWindow.bind(this);
		this.restoreWindow = this.restoreWindow.bind(this);
		// this.closeWindow = this.closeWindow.bind(this);
	}

	// Check if cursor is in the resize corner
	isResizable() {
		return (
			this.cursorPos &&
			DraggableCornerSize > this.state.size.x - this.cursorPos.x &&
			DraggableCornerSize > this.state.size.y - this.cursorPos.y
		);
	}

	// handles window resizing and dragging
	handleMouseMove(event) {
		// if window is currently being dragged, update pos
		if (this.dragging) {
			this.setState({
				pos: {
					x: event.clientX - this.cursorPos.x,
					y: event.clientY - this.cursorPos.y,
				},
			});
		}
		// if window is currently being resized, update size
		else if (this.resizing) {
			// margin in case cursor move too fast for update to catch up
			const resizeMargin = DraggableCornerSize / 2;
			this.setState({
				size: {
					x: Math.max(event.clientX - this.state.pos.x + resizeMargin, 100),
					y: Math.max(event.clientY - this.state.pos.y + resizeMargin, 100),
				},
			});
		}
		// if window is not being dragged, only update cursorPos
		else {
			this.cursorPos = {
				x: event.clientX - this.state.pos.x,
				y: event.clientY - this.state.pos.y,
			};
		}

		// set resizable state because we may need to update cursor style
		this.setState({ resizable: this.isResizable() });
	}

	handleMouseDown(event) {
    this.props.sendToFrontCallbacks();
		this.resizing = this.state.resizable;
		this.dragging = event.target.className.includes("DragArea");
	}

	stopWindowAction(event) {
		this.dragging = false;
		this.resizing = false;
	}

	minimizeWindow() {
    this.props.callbacks.minimize();
  }

	maximizeWindow() {
		this.restore = {
			size: this.state.size,
			pos: this.state.pos,
		};
		this.maximized = true;
		this.setState({
			pos: {
				x: 0,
				y: 0,
			},
			size: {
				x: window.innerWidth - 4, // 2*2 border size
				y: window.innerHeight - 4,
			},
		});
	}

	restoreWindow() {
		this.maximized = false;
		this.setState({
			pos: {
				x: this.restore.pos.x,
				y: this.restore.pos.y,
			},
			size: {
				x: this.restore.size.x,
				y: this.restore.size.y,
			},
		});
		this.restore = null;
	}

	render() {
		return (
			<StyledWindow
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.stopWindowAction}
				onMouseLeave={this.stopWindowAction}
				pos={this.state.pos}
				size={this.state.size}
				resizable={this.state.resizable}
        // styled-component specific tweak
        // https://stackoverflow.com/questions/49784294/warning-received-false-for-a-non-boolean-attribute-how-do-i-pass-a-boolean-f
        display={this.state.display ? 1 : 0} 
        zIndex={this.props.zIndex}
			>
				<StyledWindowTopBar>
					<StyledWindowTopBarTitle className={"DragArea"}>
						{this.props.title || "Untitled"}
					</StyledWindowTopBarTitle>
					<StyledWindowTopBarButton onClick={this.props.minimizeCallbacks}>
						-
					</StyledWindowTopBarButton>
					{this.maximized ? (
						<StyledWindowTopBarButton onClick={this.restoreWindow}>
							r
						</StyledWindowTopBarButton>
					) : (
						<StyledWindowTopBarButton onClick={this.maximizeWindow}>
							M
						</StyledWindowTopBarButton>
					)}
					<StyledWindowTopBarButton onClick={this.props.unmountCallbacks}>
						X
					</StyledWindowTopBarButton>
				</StyledWindowTopBar>
				<StyledWindowContent>
          {this.props.children}
        </StyledWindowContent>
			</StyledWindow>
		);
	}
}
