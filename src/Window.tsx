import React, { Component } from "react";
import { AppData } from "./AppData";
import { Point } from "./Utils";
import Markdown from "./Contents/Markdown";
import "./styles/Window.sass";

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

type WindowProps = {
	initialPos?: Point;
	initialSize?: Point;
	key: string;
	display: boolean;
	appData: AppData;
	zIndex: number;
	sendToFrontCallback: () => void; // program parameter bound in System component
	unmountCallback: () => void;
	minimizeCallback: () => void;
};

type WindowState = {
	pos: Point;
	size: Point;
};

/**
 * A draggable, resizable window that is able to minimize, maximize,
 * restore to previous size, and close itself.
 */
export default class Window extends Component<WindowProps, WindowState> {
	dragging: boolean;
	maximized: boolean;
	cursorPos: Point | null;
	restore: {
		size: Point;
		pos: Point;
	} | null;
	desktopSize: Point;
	ref: React.RefObject<HTMLInputElement>;

	constructor(props: WindowProps) {
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
		};

		this.dragging = false;
		this.maximized = false;

		// cursor position when dragging starts, updated when cursor move within component
		this.cursorPos = null;
		this.restore = null; // store previous size and pos when maximized

		// Desktop size:
		this.desktopSize = {
			x: window.innerWidth - 4, // 2*2px border
			y: window.innerHeight - 44, // Taskbar height = 40px
		};

		// This binding is necessary to make `this` work in the callback
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.stopWindowAction = this.stopWindowAction.bind(this);
		this.maximizeWindow = this.maximizeWindow.bind(this);
		this.restoreWindow = this.restoreWindow.bind(this);

		this.ref = React.createRef();
	}

	// handles window resizing and dragging
	handleMouseMove(event: React.MouseEvent<HTMLElement>) {
		// if window is currently being dragged, update pos
		if (this.dragging && this.cursorPos) {
			const newX = event.clientX - this.cursorPos.x;
			const newY = event.clientY - this.cursorPos.y;
			// if window is moving within bound
			if (
				newX >= 0 &&
				newY >= 0 &&
				newX + this.state.size.x <= this.desktopSize.x &&
				newY + this.state.size.y <= this.desktopSize.y
			) {
				this.setState({ pos: { x: newX, y: newY } });
			} else {
				this.dragging = false;
			}
		}
		// if window is not being dragged, only update cursorPos
		else {
			this.cursorPos = {
				x: event.clientX - this.state.pos.x,
				y: event.clientY - this.state.pos.y,
			};
		}
	}

	// if clicked on button, dont drag or send to front
	handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// event.target may not always be a dom
		if (event.target instanceof Element && event.target.tagName !== "BUTTON") {
			this.props.sendToFrontCallback();
			this.dragging = event.target.className.includes("WindowTopBar");
		}
	}

	stopWindowAction() {
		this.dragging = false;
	}

	// Make window fill the page
	maximizeWindow() {
		this.restore = {
			// ref.current will never be null because the target window
			// is always mounted when this method is called.
			size: {
				x: this.ref.current!.offsetWidth - 4,
				y: this.ref.current!.offsetHeight - 4,
			},
			pos: this.state.pos,
		};
		this.maximized = true;
		this.setState({
			pos: {
				x: 0,
				y: 0,
			},
			size: {
				x: this.desktopSize.x,
				y: this.desktopSize.y,
			},
		});
	}

	// Restore to size before maximizing
	restoreWindow() {
		this.maximized = false;
		// this method is only called when maximized is set to true
		// so this.restore will never be null when accessed here
		this.setState({
			pos: {
				x: this.restore!.pos.x,
				y: this.restore!.pos.y,
			},
			size: {
				x: this.restore!.size.x,
				y: this.restore!.size.y,
			},
		});
		this.restore = null;
	}

	// Link type contents are handled in System component
	renderWindowContents() {
		switch (this.props.appData.type) {
			case "document":
				return <Markdown appData={this.props.appData} />;
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
			<div
				className="Window"
				style={{
					left: this.state.pos.x + "px",
					top: this.state.pos.y + "px",
					width: this.state.size.x + "px",
					height: this.state.size.y + "px",
					zIndex: this.props.zIndex,
					display: this.props.display ? "block" : "none",
				}}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.stopWindowAction}
				onMouseLeave={this.stopWindowAction}
				ref={this.ref}
			>
				<div className="WindowTopBar">
					<div className={"WindowTopBarTitle"}>
						{this.props.appData.title || "Untitled"}
					</div>
					<button
						className="WindowTopBarButton"
						onClick={this.props.minimizeCallback}
					>
						-
					</button>
					{this.maximized ? (
						<button className="WindowTopBarButton" onClick={this.restoreWindow}>
							r
						</button>
					) : (
						<button
							className="WindowTopBarButton"
							onClick={this.maximizeWindow}
						>
							M
						</button>
					)}
					<button
						className="WindowTopBarButton"
						onClick={this.props.unmountCallback}
					>
						X
					</button>
				</div>
				<div className="WindowContent">{this.renderWindowContents()}</div>
			</div>
		);
	}
}