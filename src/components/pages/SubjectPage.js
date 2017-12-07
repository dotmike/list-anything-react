import React, { Component } from "react";
import { Header, Segment, Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import SubjectDataContainer from "../containers/SubjectDataContainer";
import { fetchSubject } from "../../actions/subjects";
import { fetchSubjectData } from "../../actions/subjectData";
import {
  getSubjectDescription,
  getFieldsArray,
  getTabsArray
} from "../../reducers/currentSubject";
import { getSubjectDataArray } from "../../reducers/subjectData";
import SubjectDataTable from "../tables/SubjectDataTable";

class SubjectPage extends Component {
  state = {
    loadingSubject: false,
    loadingData: false,
    menuVisible: false,
    currentTabId: "",
    activeTab: ""
  };

  componentDidMount = () => this.loadSubjects(this.props);

  componentWillReceiveProps(nextProps) {
    const currentId = this.props.match.params._id;
    const nextId = nextProps.match.params._id;
    if (currentId !== nextId) {
      this.loadSubjects(nextProps);
    }

    if (this.props.firstTab !== nextProps.firstTab) {
      this.loadSubjectData(nextProps, nextProps.firstTab._id);
    }
  }

  onMenuClick = (e, { tabid }) => {
    this.setState({ menuVisible: false });
    this.loadSubjectData(this.props, tabid);
  };

  loadSubjects = props => {
    this.setState({ loadingSubject: true });
    props
      .fetchSubject(props.match.params._id)
      .then(() => this.setState({ loadingSubject: false }));
  };

  loadSubjectData = (props, tabId) => {
    this.setState({ loadingData: true, activeTab: tabId });
    props
      .fetchSubjectData(tabId)
      .then(() => this.setState({ loadingData: false, currentTabId: tabId }));
  };

  toggleMenu = () =>
    this.setState(prevState => ({ menuVisible: !prevState.menuVisible }));

  render() {
    const {
      loadingData,
      loadingSubject,
      menuVisible,
      currentTabId,
      activeTab
    } = this.state;
    const { subjectDescription, fields } = this.props;

    let { subjectDataArray } = this.props;
    if (subjectDataArray.length > 0 && currentTabId !== "") {
      subjectDataArray = subjectDataArray.filter(d => d.tabId === currentTabId);
    }

    return (
      <Segment
        style={{ maxWidth: "90%", margin: "10px auto", height: "96.5%" }}
        loading={loadingSubject}
      >
        <Header as="h2" color="teal" textAlign="center">
          {subjectDescription} Data
        </Header>
        <Button icon="sidebar" onClick={this.toggleMenu} />
        <Button icon="add" positive primary as={Link} to="/subject-data/new" />
        {!loadingSubject && (
          <SubjectDataContainer
            menuVisible={menuVisible}
            onMenuClick={this.onMenuClick}
            activeTab={activeTab}
          >
            <SubjectDataTable
              fields={fields}
              subjectDataArray={subjectDataArray}
              loading={loadingData}
            />
          </SubjectDataContainer>
        )}
      </Segment>
    );
  }
}

SubjectPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  fetchSubject: PropTypes.func.isRequired,
  fetchSubjectData: PropTypes.func.isRequired,
  subjectDescription: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  subjectDataArray: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired
    })
  ).isRequired,
  firstTab: PropTypes.shape({
    _id: PropTypes.string.isRequired
  })
};

SubjectPage.defaultProps = {
  firstTab: {
    _id: ""
  }
};

function mapStateToProps(state) {
  return {
    subjectDescription: getSubjectDescription(state),
    fields: getFieldsArray(state),
    subjectDataArray: getSubjectDataArray(state),
    firstTab: getTabsArray(state)[0]
  };
}

export default connect(mapStateToProps, { fetchSubject, fetchSubjectData })(
  SubjectPage
);
