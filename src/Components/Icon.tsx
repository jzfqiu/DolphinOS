import React, { Component } from "react";
import { AppData } from "./AppData";
import { Point } from "./Utils";
import browserIcon from "../assets/icons/browser.png";
import folderIcon from "../assets/icons/folder.png";
import linkIcon from "../assets/icons/export.png";
import imageIcon from "../assets/icons/picture.png";
import "../styles/Icon.sass";


type IconProps = {
	initialPos: Point,
	appData: AppData,
	zIndex: number,
	active: boolean,
	sendToFrontCallbacks: () => void, // program parameter bound in System component
	doubleClickCallback: () => void,
};

type IconState = {
	pos: Point,
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
		this.cursorPos = {x: 0, y: 0};

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.stopWindowAction = this.stopWindowAction.bind(this);
	}

	// handles window resizing and dragging
	handleMouseMove(event: React.MouseEvent<HTMLElement>){
		// if window is currently being dragged, update pos
		if (this.dragging) {
			const newX = event.clientX - this.cursorPos.x;
			const newY = event.clientY - this.cursorPos.y;
			// if window is moving within bound
			if (
				this.ref.current && 
				newX >= 0 &&
				newY >= 0 &&
				newX + this.ref.current.offsetWidth <= window.innerWidth &&
				newY + this.ref.current.offsetHeight <= window.innerHeight - 40 // Taskbar height = 40px
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

	handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
		event.stopPropagation();
		this.props.sendToFrontCallbacks();
		this.dragging = true;
	}

	stopWindowAction() {
		this.dragging = false;
	}

	render() {
		let image;
		switch (this.props.appData.type) {
			case "document":
				image = browserIcon;
				break;
			case "folder":
				image = folderIcon;
				break;
			case "link":
				image = linkIcon;
				break;
			case "image":
				image = imageIcon;
				break;
			default:
				image = browserIcon;
		}

		return (
			<div
				className={"icon"}
				style={{
					left: this.state.pos.x + "px",
					top: this.state.pos.y + "px",
					zIndex: this.props.zIndex,
					background: this.props.active ? "lightblue" : "none",
				}}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.stopWindowAction}
				onMouseLeave={this.stopWindowAction}
				onDoubleClick={this.props.doubleClickCallback}
				ref={this.ref}
			>
				<img src={image} alt={this.props.appData.title} draggable={"false"} />
				{this.props.appData.title}
			</div>
		);
	}
}
