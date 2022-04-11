import React, { Component } from "react";
import styled from "styled-components";

// Default window position in px
const DefaultPos = {
	x: 100,
	y: 100,
};

// https://styled-components.com/docs/basics#attaching-additional-props
// Props pass through attrs constructor for frequently updated attribute
const StyledIcon = styled.div.attrs((props) => ({
	style: {
		width: props.size.x + "px",
		height: props.size.y + "px",
		left: props.pos.x + "px",
		top: props.pos.y + "px",
	},
}))`
	border: 2px solid black;
	position: absolute;
	z-index: ${(props) => props.zIndex};
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

        this.size = this.props.size ? this.props.size : {x: 50, y: 50};

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
			if (newX >= 0 && newY >= 0 && 
				newX + this.size.x <= this.desktopWidth && 
				newY + this.size.y <= this.desktopHeight) {
					this.setState({pos: {x: newX, y: newY}});
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
		this.props.sendToFrontCallbacks();
		this.dragging = true;
	}

	stopWindowAction() {
		this.dragging = false;
	}


	render() {
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
			>
            {this.props.children}
			</StyledIcon>
		);
	}
}
