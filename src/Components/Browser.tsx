import React, { Component } from "react";
import { FileAppData } from "./Utils";

type BrowserProps = {
	appData: FileAppData;
};

type BrowserState = {
	content: string;
};

export default class Image extends Component<BrowserProps, BrowserState> {
	constructor(props: BrowserProps) {
		super(props);
		this.state = {
			content: "",
		};
	}

	// https://reactjs.org/docs/faq-ajax.html
	componentDidMount() {
		fetch(this.props.appData.filepath)
			.then((res) => res.text())
			.then(
				(result) => {
					this.setState({ content: result });
				},
				(error) => {
					this.setState({ content: error });
				}
			);
	}

	render() {
		return (
			<div
				className="Browser"
				dangerouslySetInnerHTML={{ __html: this.state.content }}
			></div>
		);
	}
}
