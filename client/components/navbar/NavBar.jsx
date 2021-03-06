import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router";

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isCollapsed: false };
    this.onToggleCollapse = this.onToggleCollapse.bind(this);
  }

  onToggleCollapse() {
    this.setState(({ isCollapsed }) => ({ isCollapsed: !isCollapsed }));
  }

  render() {
    const { isCollapsed } = this.state;
    const { self, authenticated } = this.props;

    return (
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ background: "#fff", boxShadow: "0 1px 2px rgba(178, 178, 178, 0.5)" }}
      >
        <div className="container">
          <Link className="navbar-brand text-primary" to="/">
            Pensieve
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={this.onToggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={cx("navbar-collapse", { collapse: !isCollapsed })}>
            {self &&
            authenticated && (
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link
                    to="/study"
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.onToggleCollapse}
                  >
                    Study
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/decks"
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.onToggleCollapse}
                  >
                    Decks
                  </Link>
                </li>
              </ul>
            )}
            {self && authenticated ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/logout" className="nav-link" onClick={this.onToggleCollapse}>
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={this.onToggleCollapse}>
                    Login
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

NavBar.propTypes = {
  self: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default NavBar;
