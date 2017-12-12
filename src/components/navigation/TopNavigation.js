import React from "react";
import PropTypes from "prop-types";
import { Menu, Dropdown, Image, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import gravatarUrl from "gravatar-url";
import isEmpty from "lodash.isempty";

import * as actions from "../../actions/auth";
import requestSearch from "../../actions/search";
import { getSubjectsArray } from "../../reducers/subjects";
import { getEmail } from "../../reducers/user";
import SearchInput from "../forms/SearchInput";

class TopNavigation extends React.Component {
  search = query =>
    this.props.requestSearch(query).then(() => console.log(this.props.history));

  trigger = email => (
    <span>
      <Image avatar src={gravatarUrl(email, { size: 30 })} />
    </span>
  );

  render() {
    const {
      toggleMenu,
      hideMenu,
      activeItem,
      email,
      hasSubjects,
      logout
    } = this.props;

    return (
      <Menu pointing size="small" attached="top" inverted>
        <Menu.Item onClick={toggleMenu}>
          <Icon name="sidebar" />Menu
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/dashboard"
          active={activeItem === "/dashboard"}
          onClick={hideMenu}
        >
          Dashboard
        </Menu.Item>
        {hasSubjects && (
          <Menu.Item
            as={Link}
            to="/subjects/new"
            active={activeItem === "/subjects/new"}
            onClick={hideMenu}
          >
            Add new Subject
          </Menu.Item>
        )}

        <Menu.Menu position="right">
          <Menu.Item>
            <SearchInput onSearch={this.search} />
          </Menu.Item>
          <Dropdown item trigger={this.trigger(email)}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }
}

TopNavigation.propTypes = {
  // ownProps
  toggleMenu: PropTypes.func.isRequired,
  hideMenu: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  activeItem: PropTypes.string,
  // mapStateToProps
  email: PropTypes.string.isRequired,
  hasSubjects: PropTypes.bool.isRequired,
  // mapDispatchToProps
  logout: PropTypes.func.isRequired,
  requestSearch: PropTypes.func.isRequired
};

TopNavigation.defaultProps = {
  activeItem: ""
};

const mapStateToProps = state => ({
  email: getEmail(state),
  hasSubjects: !isEmpty(getSubjectsArray(state))
});

export default connect(mapStateToProps, {
  logout: actions.logout,
  requestSearch
})(TopNavigation);
