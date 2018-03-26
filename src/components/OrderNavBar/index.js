import React from 'react';
/* eslint-disable */
import PropTypes from 'prop-types';
import CustomIcon from '@components/CustomIcon';
import HomeNavBar from '@components/NavBar';
import './style.less';
import { propTypes } from 'mobx-react';

class OrderNavBar extends React.Component {
  componentWillMount() {
    // will did
  }
  rightEle = () => [
    <CustomIcon type="filter" size="xs" key='first' onClick={this.props.onOpenChange} />,
    <CustomIcon type="filterAdd" size="xs" style={{marginLeft: '.3rem'}} key='second' onClick={this.props.addChange} />,
  ]
  render() {
    const Search = (
      <div className="flex_lr_fs_c order_navBar_search">
        <CustomIcon type="blackSearch" size="xxs" />
        <input
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={(e) => this.props.onChange(e.target.value)}
        />
      </div>
    )
    return (
      <div>
         <HomeNavBar
          title={Search}
          right={this.rightEle()}
        />
      </div>
    );
  }
}

OrderNavBar.propTypes = {
  onOpenChange: PropTypes.func.isRequired,
  addChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OrderNavBar;
