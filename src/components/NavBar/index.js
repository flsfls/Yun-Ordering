import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import CustomIcon from '../CustomIcon';
import './style.less';

@withRouter
class HomeNavBar extends React.Component {
  componentDidMount() {
    // will do
  }

  render() {
    const { title, right } = this.props;
    return (
      <div className="nav_bar">
        <NavBar
          mode="light"
          icon={<CustomIcon type="back" size="xs" />}
          onLeftClick={() => { this.props.history.go(-1); }}
          rightContent={[
            right,
          ]}
        >
          {title}
        </NavBar>
      </div>
    );
  }
}

HomeNavBar.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  history: PropTypes.object,
  right: PropTypes.instanceOf(Object),
};

HomeNavBar.defaultProps = {
  title: '',
  history: {},
  right: null,
};

export default HomeNavBar;
