import React from "react";
import { reduxForm, Field } from "redux-form";

let GuestAuth = props => {
  /* handleSubmit is given to use by Redux Forms, it helps us 
            determine what happens after the form is submitted */

  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit(props.guestAuthClick)}>
      <div>
        <label htmlFor="firstName">Last Name</label>
        <Field name="firstName" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="location">Room Number</label>
        <Field name="location" component="input" type="text" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

GuestAuth = reduxForm({
  form: "guestAuth",
  destroyOnUnmount: false
})(GuestAuth);

export default GuestAuth;
