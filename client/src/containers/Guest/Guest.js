import React, { Component } from "react";
import Auxil from "../../hoc/Auxil";
import GuestAuth from "../../components/GuestAuth/GuestAuth";

class Guest extends Component {
  // for now, just redirects a guest to the work order page
  guestAuthClick = values => {
    this.props.history.replace("/create/");
  };

  render() {
    return (
      <Auxil>
        <GuestAuth guestAuthClick={this.guestAuthClick} />
      </Auxil>
    );
  }
}

export default Guest;
