import React, { Component } from "react";
// import styled from "styled-components";
import Window from './Window';


// const windows = {
//   1 :{
//    title: "Window 1",
//    initialSize: {
//      x: 300,
//      y: 300
//    }, 
//    initialPos: {
//      x: 200, 
//      y: 200
//    },
//    contents: "",
//    state: 
//  }
// }

export default class Desktop extends Component {
  constructor (props) {
    super(props);
    this.state = {

    };
  }

  render () {
    return (
      <Window 
        title={"Test"}
      ></Window>
    );
  }
}
