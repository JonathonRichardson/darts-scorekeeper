import * as React from "react";
import * as ReactDOM from "react-dom";

interface IProps {
    text: string;
}

export class HTMLComment extends React.Component<IProps> {
    private node: Comment;
    private ref$rootDiv = React.createRef<HTMLDivElement>();

    constructor(props: IProps) {
        super(props);

        this.node = window.document.createComment(props.text);
    }

    componentDidMount() {
        if (this.ref$rootDiv && this.ref$rootDiv.current) {
            let divElement = this.ref$rootDiv.current;

            // Tell React not to update/control this node
            ReactDOM.unmountComponentAtNode(divElement);

            // Replace the div with our comment node
            this.ref$rootDiv.current.replaceWith(this.node);
        }
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.text !== this.props.text) {
            this.node.textContent = this.props.text;
        }
    }

    componentWillUnmount() {
        this.node.remove();
    }

    render() {
        return (
            <div
                ref={this.ref$rootDiv}
                style={{
                    display: "none",
                }}
            />
        );
    }
}
