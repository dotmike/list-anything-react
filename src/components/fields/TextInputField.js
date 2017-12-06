import React from "react";
import PropTypes from "prop-types";
import { Form } from "semantic-ui-react";

import InlineError from "../messages/InlineError";

const TextInputField = ({ value, editable, error, field, onChange }) => {
  if (editable)
    return (
      <Form.Field error={!!error}>
        <Form.Input
          fluid
          type="text"
          label={field.description}
          value={value}
          onChange={onChange}
          name={field._id}
          placeholder={field.description}
        />
        {error && <InlineError text={error} />}
      </Form.Field>
    );
  return value;
};

TextInputField.propTypes = {
  value: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  error: PropTypes.string,
  field: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string
  }),
  onChange: PropTypes.func
};

TextInputField.defaultProps = {
  editable: false,
  error: "",
  field: {},
  onChange: () => {}
};

export default TextInputField;
