import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Segment } from "semantic-ui-react";
import forEach from "lodash.foreach";

import renderFieldComponent from "../../utils/renderFieldComponent";
import ActionBtnsContainer from "../containers/ActionBtnsContainer";
import ErrorMessage from "../messages/ErrorMessage";
import handleServerErrors from "../../utils/handleServerErrors";

class SubjectDataForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.getOriginalFormData(props),
      tabId: props.subjectData.tabId,
      loading: false,
      editing: false,
      errors: this.getCleanFormErrors(props)
    };
  }

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "tabId") this.setState({ tabId: value });
    else
      this.setState(prevState => {
        const _id = prevState.data[name]._id;
        return {
          data: {
            ...this.state.data,
            [name]: { _id, value }
          }
        };
      });
  };

  onSubmit = e => {
    if (!this.state.editing) {
      e.preventDefault();
      return;
    }
    const errors = this.validate(this.state.data);
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true, errors: {} });
      this.props
        .submit(this.state.tabId, this.state.data)
        .then(() =>
          this.setState({
            tabId: this.props.subjectData.tabId,
            data: this.getOriginalFormData(this.props),
            errors: this.getCleanFormErrors(this.props),
            loading: false,
            editing: false
          })
        )
        .catch(err =>
          this.setState({
            errors: handleServerErrors(err),
            loading: false
          })
        );
    } else this.setState({ errors });
  };

  onDelete = () =>
    this.props.delete().catch(() => {
      this.setState({
        errors: { global: "Internal server error" },
        loading: false
      });
    });

  getCleanFormErrors = props => {
    const errors = {};
    if (props.subjectData.data)
      forEach(Object.values(props.subjectData.data), elem => {
        errors[elem.fieldId] = "";
      });
    return errors;
  };

  getOriginalFormData = props => {
    const data = {};
    if (props.subjectData.data)
      forEach(Object.values(props.subjectData.data), elem => {
        data[elem.fieldId] = { _id: elem._id, value: elem.value };
      });
    return data;
  };

  startEditing = () => this.setState({ editing: true });

  cancelEditing = () => {
    this.setState({
      editing: false,
      data: this.getOriginalFormData(this.props),
      errors: this.getCleanFormErrors(this.props)
    });
  };

  validate = data => {
    const errors = {};
    const { fields } = this.props;

    // Not the best validation but...
    const flag = fields.reduce((prev, elem) => prev && !data[elem._id], true);
    if (flag) errors[fields[0]._id] = "You must enter at least one value";
    return errors;
  };

  renderField = field => {
    const { subjectData } = this.props;
    const { editing } = this.state;

    if (!subjectData || !subjectData.data) return null;

    const data = subjectData.data[field._id];
    if (!data) return null;

    const fieldData = {
      key: data._id,
      value: this.state.data[data.fieldId].value,
      editable: editing,
      field,
      error: this.state.errors[data.fieldId],
      onChange: this.onChange
    };
    return renderFieldComponent(fieldData);
  };

  render() {
    const { errors, loading, editing, tabId } = this.state;
    const { fields, tabs } = this.props;

    return (
      <Form
        onSubmit={this.onSubmit}
        loading={loading}
        error={!!errors.global}
        size="large"
        style={{ textAlign: "left" }}
      >
        {errors.global && <ErrorMessage text={errors.global} />}
        {!editing && (
          <ActionBtnsContainer
            onEdit={this.startEditing}
            onDelete={this.onDelete}
          />
        )}
        <Segment stacked>
          {editing && (
            <Form.Field
              label="Select the tab:"
              control="select"
              name="tabId"
              value={tabId}
              onChange={this.onChange}
            >
              {tabs.map(tab => (
                <option key={tab._id} value={tab._id}>
                  {tab.description}
                </option>
              ))}
            </Form.Field>
          )}
          {fields.map(field => this.renderField(field))}

          {editing && (
            <Button.Group size="medium" widths={2}>
              <Button color="blue">Save</Button>
              <Button color="red" onClick={this.cancelEditing}>
                Cancel
              </Button>
            </Button.Group>
          )}
        </Segment>
      </Form>
    );
  }
}

SubjectDataForm.propTypes = {
  // ownProps
  submit: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  subjectData: PropTypes.shape({
    _id: PropTypes.string,
    tabId: PropTypes.string,
    data: PropTypes.objectOf(
      PropTypes.shape({
        fieldId: PropTypes.string,
        value: PropTypes.string
      })
    )
  }).isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      description: PropTypes.string
    })
  ).isRequired
};

export default SubjectDataForm;
