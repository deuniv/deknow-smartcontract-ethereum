import React, {Component} from "react";

interface NetworkErrorMessageProps {
    message: any,
    dismiss: any,
}
interface NetworkErrorMessageState {}

class NetworkErrorMessage extends Component<NetworkErrorMessageProps, NetworkErrorMessageState> {
    state: NetworkErrorMessageState;

    constructor(props: NetworkErrorMessageProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="alert alert-danger" role="alert">
                {this.props.message}
                <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={this.props.dismiss}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }
}

export default NetworkErrorMessage;
