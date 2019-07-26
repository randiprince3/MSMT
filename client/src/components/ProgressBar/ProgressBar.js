import React from "react";
import "../ProgressBar/ProgressBar.css";

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0
    };
    this.nextStep = this.nextStep.bind(this);
  }

  nextStep() {
    if (this.state.percentage === 100) return;
    this.setState({ percentage: this.state.percentage + 20 });
  }

  render() {
    const ProgressBar = props => {
      return (
        <div className="progress-bar">
          <Filler percentage={props.percentage} />
        </div>
      );
    };

    const Filler = props => {
      return (
        <div className="filler" style={{ width: `${props.percentage}%` }} />
      );
    };
    return (
      <div>
        <h2>Check the status of your request!</h2>
        <ProgressBar percentage={this.state.percentage} />

        <div style={{ marginTop: "20px" }}>
          <button onClick={this.nextStep}>Next Step</button>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
