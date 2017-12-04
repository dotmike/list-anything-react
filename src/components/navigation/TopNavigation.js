import React from "react";
import PropTypes from "prop-types";
import { Menu, Dropdown, Image, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import gravatarUrl from "gravatar-url";
import isEmpty from "lodash.isempty";

import * as actions from "../../actions/auth";
import { getSubjectsArray } from "../../reducers/subjects";
import { getEmail } from "../../reducers/user";

const trigger = email => (
  <span>
    <Image avatar src={gravatarUrl(email, { size: 30 })} />
  </span>
);

const TopNavigation = ({
  email,
  logout,
  toggleMenu,
  hideMenu,
  hasSubjects
}) => (
  <Menu pointing size="small" attached="top" inverted>
    <Menu.Item onClick={toggleMenu}>
      <Icon name="sidebar" />Menu
    </Menu.Item>
    <Menu.Item as={Link} to="/dashboard" onClick={hideMenu}>
      Dashboard
    </Menu.Item>
    {hasSubjects && (
      <Menu.Item as={Link} to="/subjects/new" onClick={hideMenu}>
        Add new Subject
      </Menu.Item>
    )}

    <Menu.Menu position="right">
      <Dropdown item trigger={trigger(email)}>
        <Dropdown.Menu>
          <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  </Menu>
);

TopNavigation.propTypes = {
  email: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  hasSubjects: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  hideMenu: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    email: getEmail(state),
    hasSubjects: !isEmpty(getSubjectsArray(state))
  };
}

export default connect(mapStateToProps, { logout: actions.logout })(
  TopNavigation
);
