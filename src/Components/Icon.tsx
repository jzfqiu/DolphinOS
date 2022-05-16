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
	}

	handleDragStart(event: React.MouseEvent<HTMLElement>) {
		this.cursorPos = {
			x: event.clientX - this.state.pos.x,
			y: event.clientY - this.state.pos.y,
		};
	}

	handleDragOver(event: React.MouseEvent<HTMLElement>) {
		event.preventDefault();
		const newX = event.clientX - this.cursorPos.x;
		const newY = event.clientY - this.cursorPos.y;
		// console.log(event.pageX, event.pageY, newX, newY, this.cursorPos);
		const newPos = { x: newX, y: newY };
		if (newPos !== this.state.pos) {
			this.setState({ pos: newPos });
		}
	}

	handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
		event.stopPropagation();
		this.props.sendToFrontCallbacks();
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
				draggable={"true"}
				onMouseDown={this.handleMouseDown.bind(this)}
				onDragStart={this.handleDragStart.bind(this)}
				onDragOver={this.handleDragOver.bind(this)}
				onDoubleClick={this.props.doubleClickCallback}
				ref={this.ref}
			>
				<img
					src={image}
					alt={this.props.appData.title}
					draggable={"false"}
					onDragStart={(e) => {
						e.preventDefault();
					}}
				/>
				{this.props.appData.title}
			</div>
		);
	}
}
