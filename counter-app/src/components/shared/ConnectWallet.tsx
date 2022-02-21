import React, {Component} from "react";
import NetworkErrorMessage from "./NetworkErrorMessage";

interface ConnectWalletProps {
    connectWallet: any,
    networkError: any,
    dismiss: any
}
interface ConnectWalletState {}

class ConnectWallet extends Component<ConnectWalletProps, ConnectWalletState> {
    state: ConnectWalletState;

    constructor(props: ConnectWalletProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-12 text-center">
                        {/* Metamask network should be set to Localhost:8545. */}
                        {this.props.networkError && (
                            <NetworkErrorMessage
                                message={this.props.networkError}
                                dismiss={this.props.dismiss}
                            />
                        )}
                    </div>
                    <div className="col-6 p-4 text-center">
                        <p>Please connect to your wallet.</p>
                        <button
                            className="btn btn-warning"
                            type="button"
                            onClick={this.props.connectWallet}
                        >
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConnectWallet;
