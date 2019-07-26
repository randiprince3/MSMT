import React from "react";
import { reduxForm, Field } from "redux-form";
import DropdownList from "react-widgets/lib/DropdownList";
import "react-widgets/dist/css/react-widgets.css";
import Auxil from "../../hoc/Auxil";

const renderDropdownList = ({
  input,
  data,
  valueField,
  textField,
  label,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <DropdownList
        {...input}
        data={data}
        valueField={valueField}
        textField={textField}
        onChange={input.onChange}
      />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

let AuthForm = props => {
  // block of text below is logic for rendering the CREATE USER button
  // depending on the permissions of the user that is logged in

  const { handleSubmit, submitting } = props;

  // this users object is used for the dropdown (via Redux Form)
  const users = [
    { user: "Admin", value: "ADMIN" },
    { user: "Supervisor", value: "SUPERVISOR" },
    { user: "User", value: "USER" }
  ];

  // provided by the documentation from Redux Form (using react-widgets)
  // https://redux-form.com/7.4.2/examples/react-widgets/

  const required = value =>
    value || typeof value === "number" ? undefined : "Required";

  return (
    <Auxil>
      {/* handleSubmit is given to use by Redux Form, it helps us 
            determine what happens after the form is submitted */}

      <form onSubmit={handleSubmit(props.authClick)}>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
          validate={[required]}
        />

        <Field
          name="password"
          component={renderField}
          label="Password"
          type="password"
          validate={[required]}
        />

        {/* Below fields only show up when the user is signing up 
             (when the CREATE USER button is clicked)    */}
        {props.isSignup ? (
          <Auxil>
            <Field
              name="phoneNumber"
              component={renderField}
              label="Phone Number"
              type="text"
              validate={[required]}
            />

            <Field
              name="userType"
              component={renderDropdownList}
              data={users}
              valueField="value"
              label="User Type"
              textField="user"
              validate={[required]}
            />
          </Auxil>
        ) : null}

        <button type="submit" disabled={submitting}>
          {props.isSignup ? "CREATE USER" : "LOGIN"}
        </button>
      </form>
    </Auxil>
  );
};

AuthForm = reduxForm({
  form: "AuthForm",
  destroyOnUnmount: false
})(AuthForm);

export default AuthForm;
