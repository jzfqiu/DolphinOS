import React, { Component } from "react";
import { AppData } from "./AppData";
import { Point } from "./Utils";
import "../styles/Window.sass";

// Default window position in px
const DefaultPos = {
	x: 100,
	y: 100,
};

// Default window size in px
const DefaultSize = {
	x: 800,
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
	children?: JSX.Element;
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
	cursorPos: Point;
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
		this.cursorPos = { x: 0, y: 0 };
		this.restore = null; // store previous size and pos when maximized

		// Desktop size:
		this.desktopSize = {
			x: window.innerWidth - 2, // 2*2px border
			y: window.innerHeight - 2, // Taskbar height
		};

		this.ref = React.createRef();

		this.dragStart = this.dragStart.bind(this);
		this.dragEnd = this.dragEnd.bind(this);
	}

	handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
		if (event.target instanceof Element && event.target.className.includes("WindowTopBar")){
			event.stopPropagation();
			this.props.sendToFrontCallback();
			this.cursorPos = {
				x: event.clientX - this.state.pos.x,
				y: event.clientY - this.state.pos.y,
			};
			// https://stackoverflow.com/questions/10444077/javascript-removeeventlistener-not-working
			document.addEventListener("mousemove", this.dragStart);
			document.addEventListener("mouseup", this.dragEnd);	
		}
	}

	dragStart(event: MouseEvent) {
		const newX = event.clientX - this.cursorPos.x;
		const newY = event.clientY - this.cursorPos.y;
		const newPos = { x: newX, y: newY };
		if (newPos !== this.state.pos) {
			this.setState({ pos: newPos });
		}
	}

	dragEnd(event: MouseEvent) {
		document.removeEventListener("mousemove", this.dragStart);
		document.removeEventListener("mouseup", this.dragEnd);
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
				onMouseDown={this.handleMouseDown.bind(this)}
				ref={this.ref}
			>
				<div className="WindowTopBar">
					<button
						className="WindowTopBarButton WindowClose"
						onClick={this.props.unmountCallback}
					></button>
					<button
						className="WindowTopBarButton WindowMinimize"
						onClick={this.props.minimizeCallback.bind(this)}
					></button>
					{this.maximized ? (
						<button
							className="WindowTopBarButton WindowRestore"
							onClick={this.restoreWindow.bind(this)}
						></button>
					) : (
						<button
							className="WindowTopBarButton WindowMaximize"
							onClick={this.maximizeWindow.bind(this)}
						></button>
					)}

					<div className={"WindowTopBarTitle"}>
						{this.props.appData.title || "Untitled"}
					</div>
				</div>
				<div className="WindowContent">{this.props.children}</div>
			</div>
		);
	}
}
