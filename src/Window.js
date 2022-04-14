import React, { Component } from "react";
import styled from "styled-components";
import Markdown from "./Contents/Markdown";

// Default window position in px
const DefaultPos = {
	x: 100,
	y: 100,
};

// Default window size in px
const DefaultSize = {
	x: 600,
	y: 600,
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
	display: ${(props) => (props.display ? "block" : "none")};
	z-index: ${(props) => props.zIndex};
	overflow: auto;
	resize: both;
    &::-webkit-scrollbar {
		width: 7px;
		height: 7px;
		display: block;
	}
	&::-webkit-scrollbar-track-piece {
		background: lightgray;
		margin-top: 28px; 
		border-top: 2px solid black;
	}
	&::-webkit-scrollbar-thumb {
		background: gray;
	}
`;

const StyledWindowContent = styled.div`
	top: 28px;
	width: 100%;
	height: calc(100% - 30px);
	position: absolute;
`;

const StyledWindowTopBar = styled.div`
	top: 0;
	height: 28px;
	width: 100%;
	position: sticky;
	display: flex;
	flex-direction: row;
	user-select: none;
	border-bottom: 2px solid black;
	background-color: white;
	z-index: 1;
`;

const StyledWindowTopBarTitle = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledWindowTopBarButton = styled.button`
	height: 25px;
	width: 25px;
	margin: auto 0 auto 4px;
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
		};

		this.program = this.props.key;

		// Change in class variable does not trigger re-render
		this.dragging = false;
		this.resizing = false;
		this.maximized = false;

		// cursor position when dragging starts, updated when cursor move within component
		this.cursorPos = null;
		this.restore = null; // store previous size and pos when maximized

		// Desktop size:
		this.desktopWidth = window.innerWidth - 4; // 2*2px border
		this.desktopHeight = window.innerHeight - 44; // Taskbar height = 40px

		// This binding is necessary to make `this` work in the callback
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.stopWindowAction = this.stopWindowAction.bind(this);
		this.minimizeWindow = this.minimizeWindow.bind(this);
		this.maximizeWindow = this.maximizeWindow.bind(this);
		this.restoreWindow = this.restoreWindow.bind(this);
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
			const newX = event.clientX - this.cursorPos.x;
			const newY = event.clientY - this.cursorPos.y;
			// if window is moving within bound
			if (newX >= 0 && newY >= 0 && 
				newX + this.state.size.x <= this.desktopWidth && 
				newY + this.state.size.y <= this.desktopHeight) {
					this.setState({pos: {x: newX, y: newY}});
			} else {
				this.dragging = false;
			}
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
		// if clicked on button, dont drag or send to front
		if (event.target.tagName !== "BUTTON"){
			this.props.sendToFrontCallbacks();
			this.resizing = this.state.resizable;
			this.dragging = event.target.className.includes("DragArea");
		}
	}

	stopWindowAction() {
		this.dragging = false;
		this.resizing = false;
	}

	minimizeWindow() {
		this.props.callbacks.minimize();
	}

	// Make window fill the page
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
				x: this.desktopWidth,
				y: this.desktopHeight,
			},
		});
	}

	// Restore to size before maximizing
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

	// Link type contents are handled in System component
	renderWindowContents() {
		switch (this.props.appData.type) {
			case "document":
				return <Markdown appData={this.props.appData}/>;
			case "folder":
				return <div>TODO</div>;
			case "image":
				return <div>TODO</div>;
			default:
				return <div>Unknown Contents</div>;
		}
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
				zIndex={this.props.zIndex}
				// styled-component specific tweak
				// https://stackoverflow.com/questions/49784294/warning-received-false-for-a-non-boolean-attribute-how-do-i-pass-a-boolean-f
				display={this.props.display ? 1 : 0}
			>
				<StyledWindowTopBar
					top={this.state.pos.y}
					>
					<StyledWindowTopBarTitle className={"DragArea"}>
						{this.props.appData.title || "Untitled"}
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
					{this.renderWindowContents()}
				</StyledWindowContent>
			</StyledWindow>
		);
	}
}
