import React, { Component } from "react";
import { AppData } from "./AppData";
import { getIcon, Point } from "./Utils";
import "../styles/Icon.sass";

type IconProps = {
	initialPos: Point;
	appData: AppData;
	zIndex: number;
	active: boolean;
	sendToFrontCallback: () => void; // program parameter bound in System component
	doubleClickCallback: () => void;
};

type IconState = {
	pos: Point;
};

export default class Icon extends Component<IconProps, IconState> {
	ref: React.RefObject<HTMLInputElement>;
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

		// cursor position when dragging starts, updated when cursor move within component
		this.cursorPos = { x: 0, y: 0 };

		this.dragStart = this.dragStart.bind(this);
		this.dragEnd = this.dragEnd.bind(this);
	}

	handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
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

	render() {
		const image = getIcon(this.props.appData.type);
		return (
			<div
				className={`icon ${this.props.active ? "active" : ""}`}
				style={{
					left: this.state.pos.x + "px",
					top: this.state.pos.y + "px",
					zIndex: this.props.zIndex,
				}}
				onMouseDown={this.handleMouseDown.bind(this)}
				onDoubleClick={this.props.doubleClickCallback}
				ref={this.ref}
			>
				<img
					src={image}
					alt={this.props.appData.title}
					draggable={"false"}
					// Firefox specific tweak on draggable img
					onDragStart={(e) => {
						e.preventDefault();
					}}
				/>
				<p>{this.props.appData.title}</p>
			</div>
		);
	}
}
