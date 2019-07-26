import Select from "react-select";
import React from "react";
import "./UserSelect.css";

let UserSelect = props => {
  return (
    <div className="userSelect">
      <Select
        value={props.value}
        onChange={props.changed}
        options={props.options}
      />
    </div>
  );
};

export default UserSelect;
