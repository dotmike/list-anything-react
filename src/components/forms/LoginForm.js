import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Segment } from "semantic-ui-react";
import isEmail from "validator/lib/isEmail";

import ErrorMessage from "../messages/ErrorMessage";
import InlineError from "../messages/InlineError";
import handleServerErrors from "../../utils/handleServerErrors";

class LoginForm extends React.Component {
  state = {
    data: {
      email: "",
      password: ""
    },
    loading: false,
    errors: {}
  };

  componentDidMount = () => {
    window.setTimeout(this.focusOnEmailInput, 0);
  };

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    this.focusOnEmailInput();
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      this.props.submit(this.state.data).catch(err =>
        this.setState({
          errors: handleServerErrors(err),
          loading: false
        })
      );
    }
  };

  focusOnEmailInput = () => {
    const $input = document.getElementById("login-email-input");
    if ($input) $input.focus();
  };

  validate = data => {
    const errors = {};
    if (!isEmail(data.email)) errors.email = "Invalid email";
    if (!data.password) errors.password = "Can't be blank";
    return errors;
  };

  render() {
    const { data, errors, loading } = this.state;

    return (
      <Form onSubmit={this.onSubmit} loading={loading} size="large">
        {errors.global && <ErrorMessage text={errors.global} />}
        <Segment stacked>
          <Form.Field error={!!errors.email}>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              type="email"
              placeholder="example@example.com"
              value={data.email}
              onChange={this.onChange}
              name="email"
              id="login-email-input"
            />
            {errors.email && <InlineError text={errors.email} />}
          </Form.Field>

          <Form.Field error={!!errors.password}>
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={data.password}
              onChange={this.onChange}
              name="password"
            />
            {errors.password && <InlineError text={errors.password} />}
          </Form.Field>
          <Button color="teal" fluid size="large">
            Login
          </Button>
        </Segment>
      </Form>
    );
  }
}

LoginForm.propTypes = {
  // ownProps
  submit: PropTypes.func.isRequired
};

export default LoginForm;
