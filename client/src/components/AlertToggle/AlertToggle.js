import React, { Component } from "react";
import Switch from "react-switch";
import "./AlertToggle.css";

class AlertToggle extends Component {
  render() {
    return (
      <div className="alertToggle">
        <label htmlFor="normal-switch">
          <span className="spanColor">Send a text?</span>
          <Switch
            onChange={this.props.handleIsAlert}
            checked={this.props.isAlert}
            id="normal-switch"
          />
        </label>
      </div>
    );
  }
}

export default AlertToggle;
