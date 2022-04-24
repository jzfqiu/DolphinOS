import React, { Component } from "react";
import { AppData } from "./AppData";
import { getIcon, Point } from "./Utils";
import "../styles/Icon.sass";

type IconProps = {
	initialPos: Point;
	appData: AppData;
	zIndex: number;
	active: boolean;
	sendToFrontCallbacks: () => void; // program parameter bound in System component
	doubleClickCallback: () => void;
};

type IconState = {
	pos: Point;
};

export default class Icon extends Component<IconProps, IconState> {
	ref: React.RefObject<HTMLInputElement>;
	dragging: boolean;
	cursorPos: Point;

	constructor(props: IconProps) {
		super(props);
		this.state = {
			pos: {
				x: this.props.initialPos ? this.props.initialPos.x : 100,
				y: this.props.initialPos ? this.props.initialPos.y : 100,
			},
		};
		this.ref = React.createRef();
		this.dragging = false;

		// cursor position when dragging starts, updated when cursor move within component
		this.cursorPos = { x: 0, y: 0 };
	}

	// handles window resizing and dragging
	handleMouseMove(event: React.MouseEvent<HTMLElement>) {
		// if window is currently being dragged, update pos
		if (this.dragging) {
			const newX = event.clientX - this.cursorPos.x;
			const newY = event.clientY - this.cursorPos.y;
			this.setState({ pos: { x: newX, y: newY } });
		}
		// if window is not being dragged, only update cursorPos
		else {
			this.cursorPos = {
				x: event.clientX - this.state.pos.x,
				y: event.clientY - this.state.pos.y,
			};
		}
	}

	handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
		event.stopPropagation();
		this.props.sendToFrontCallbacks();
		this.dragging = true;
	}

	stopDragging() {
		this.dragging = false;
	}

	render() {
		const image = getIcon(this.props.appData.type);
		return (
			<div
				className={"icon"}
				style={{
					left: this.state.pos.x + "px",
					top: this.state.pos.y + "px",
					zIndex: this.props.zIndex,
					background: this.props.active ? "lightblue" : "none",
				}}
				onMouseDown={this.handleMouseDown.bind(this)}
				onMouseMove={this.handleMouseMove.bind(this)}
				onMouseUp={this.stopDragging.bind(this)}
				onMouseLeave={this.stopDragging.bind(this)}
				onDoubleClick={this.props.doubleClickCallback}
				ref={this.ref}
			>
				<img src={image} alt={this.props.appData.title} draggable={"false"} />
				{this.props.appData.title}
			</div>
		);
	}
}
