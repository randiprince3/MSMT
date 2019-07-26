import React, { Component } from "react";
import Camera, { FACING_MODES } from "./lib";
import "react-html5-camera-photo/build/css/index.css";

// camera app component used to take picture of a work order (WorkOrder container)
// link to documentation for the camera component:
// https://www.npmjs.com/package/react-html5-camera-photo
class CameraApp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      idealFacingMode: FACING_MODES.ENVIRONMENT
    };
    this.renderButtons = this.renderButtons.bind(this);
  }

  renderButtons() {
    return (
      <div>
        <button
          onClick={e => {
            this.setState({ idealFacingMode: FACING_MODES.USER });
          }}
        >
          Front Camera
        </button>

        <button
          onClick={e => {
            this.setState({ idealFacingMode: FACING_MODES.ENVIRONMENT });
          }}
        >
          Back Camera
        </button>
      </div>
    );
  }

  render() {
    console.log(this.props);
    return (
      <div className="App">
        {this.renderButtons()}
        <Camera
          idealFacingMode={this.state.idealFacingMode}
          onTakePhoto={dataUri => {
            this.props.onTakePhoto(dataUri);
          }}
        />
      </div>
    );
  }
}

export default CameraApp;
