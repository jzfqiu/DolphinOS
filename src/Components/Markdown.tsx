import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/Markdown.sass"
import { MarkdownAppData } from "./Utils";

type MarkdownProps = {
	appData: MarkdownAppData,
}

type MarkdownState = {
	content: string,
}

/**
 * Markdown contents inside of a window
 */
export default class Markdown extends Component<MarkdownProps, MarkdownState> {
	constructor(props: MarkdownProps) {
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
			<div className="Markdown">
				<ReactMarkdown>{this.state.content}</ReactMarkdown>
			</div>
		);
	}
}
