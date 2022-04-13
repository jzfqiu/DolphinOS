import React, { Component } from "react";
import styled from "styled-components";
import browserIcon from "./assets/icons/browser.png";
import folderIcon from "./assets/icons/folder.png";
import linkIcon from "./assets/icons/export.png";
import imageIcon from "./assets/icons/picture.png";

// Default window position in px
const DefaultPos = {
	x: 100,
	y: 100,
};

// https://styled-components.com/docs/basics#attaching-additional-props
// Props pass through attrs constructor for frequently updated attribute
const StyledIcon = styled.div.attrs((props) => ({
	style: {
		left: props.pos.x + "px",
		top: props.pos.y + "px",
	},
}))`
	max-width: 200px;
	max-height: 200px;
	padding: 10px;
	position: absolute;
	z-index: ${(props) => props.zIndex};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	user-select: none;
	text-align: center;
	background: ${(props) => (props.active ? "lightblue" : "none")};
	& img {
		margin: 5px;
	}
`;

const StyledIconImg = styled.img.attrs((props) => ({
	src: props.src,
	alt: props.alt,
	draggable: "false",
}))`
	width: 50px;
`;

export default class Icon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pos: {
				x: this.props.initialPos ? this.props.initialPos.x : DefaultPos.x,
				y: this.props.initialPos ? this.props.initialPos.y : DefaultPos.y,
			},
		};
		this.ref = React.createRef();

		this.size = this.props.size ? this.props.size : { x: 100, y: 100 };

		this.program = this.props.key;
		this.dragging = false;

		// cursor position when dragging starts, updated when cursor move within component
		this.cursorPos = null;

		// Desktop size:
		this.desktopWidth = window.innerWidth - 4; // 2*2px border
		this.desktopHeight = window.innerHeight - 44; // Taskbar height = 40px

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.stopWindowAction = this.stopWindowAction.bind(this);
	}

	// handles window resizing and dragging
	handleMouseMove(event) {
		// if window is currently being dragged, update pos
		if (this.dragging) {
			const newX = event.clientX - this.cursorPos.x;
			const newY = event.clientY - this.cursorPos.y;
			// if window is moving within bound
			if (
				newX >= 0 &&
				newY >= 0 &&
				newX + this.size.x <= this.desktopWidth &&
				newY + this.size.y <= this.desktopHeight
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

	handleMouseDown(event) {
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
			<StyledIcon
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.stopWindowAction}
				onMouseLeave={this.stopWindowAction}
				onDoubleClick={this.props.doubleClickCallback}
				pos={this.state.pos}
				size={this.size}
				zIndex={this.props.zIndex}
				ref={this.ref}
				active={this.props.active}
			>
				<StyledIconImg
					src={image}
					alt={this.props.appData.title}
				/>
				{this.props.appData.title}
			</StyledIcon>
		);
	}
}
