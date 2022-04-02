import React, { Component } from 'react';
import styled from 'styled-components';

/*

Resizable & draggable component using React and Styled-Components

*/

// Default window position in px
const DefaultPos = {
    x: 100,
    y: 100
};

// Default window size in px
const DefaultSize = {
    x: 400,
    y: 300
};

// Size of resize corner
const DraggableCornerSize = {
    x: 20,
    y: 20
}

// https://styled-components.com/docs/basics#attaching-additional-props
// Props pass through attrs constructor for frequently updated attribute
const StyledWindow = styled.div.attrs(props => ({
    style: {
        width: props.size.x + "px",
        height: props.size.y + "px",
        left: props.pos.x + "px",
        top: props.pos.y + "px",
        cursor: props.resizable ? "nwse-resize" : "auto"
      }
  }))`
  border: 2px solid black;
  position: absolute;
`;


class Window extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: {
                x: this.props.initialPos ? this.props.initialPos.x : DefaultPos.x, 
                y: this.props.initialPos ? this.props.initialPos.y : DefaultPos.y
            },
            size: {
                x: this.props.initialSize ? this.props.initialSize.x : DefaultSize.x, 
                y: this.props.initialSize ? this.props.initialSize.y : DefaultSize.y
            },
            dragging: false,
            resizable: false,
            resizing: false,
            relPos: null, // cursor position when dragging starts
        }
        // This binding is necessary to make `this` work in the callback
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind 
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.outOfFrame = this.outOfFrame.bind(this)
    }



    handleMouseDown (event) {
        this.setState({
            resizing: this.state.resizable,
            dragging: !this.state.resizable,
            relPos: {
                x: this.state.pos.x - event.clientX, 
                y: this.state.pos.y - event.clientY,
            }
        })
    }

    handleMouseMove (event) {
        const resizable = (
            event.clientX - this.state.pos.x > this.state.size.x - DraggableCornerSize.x &&
            event.clientY - this.state.pos.y > this.state.size.y - DraggableCornerSize.y
        )
        this.setState({resizable: resizable})
        if (this.state.dragging) {
            this.setState({
                pos: {
                    x: event.clientX + this.state.relPos.x,
                    y: event.clientY + this.state.relPos.y
                }
            });
        } else if (this.state.resizing) {
            this.setState({
                size: {
                    x: event.clientX - this.state.pos.x,
                    y: event.clientY - this.state.pos.y
                }
            });
        }
    }

    outOfFrame (event) {
        this.setState({
            resizable: false,
            resizing: false,
            dragging: false,
            basePos: null
        })
    }


    render() {
        return <StyledWindow 
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.outOfFrame}
            onMouseLeave={this.outOfFrame}
            pos = {this.state.pos}
            size = {this.state.size}
            resizable = {this.state.resizable}>
            Hi
            </StyledWindow>;
    }
}

export default Window;
