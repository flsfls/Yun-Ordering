import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd-mobile';
import './style.less';

class OrderSlideBar extends React.Component {
  componentWillMount() {
    // will did
  }
  render() {
    const { open, element } = this.props;
    return (
      <Drawer
        className="recepit-drawer"
        transitions={false}
        style={{
          minHeight: document.documentElement.clientHeight,
          zIndex: open ? '100' : 0,
          display: open ? 'inherit' : 'none',
        }}
        position="right"
        overlayStyle={{
          background: 'rgba(0, 0, 0, 0.3)',
        }}
        sidebar={element}
        enableDragHandle
        contentStyle={{ color: '#fff', textAlign: 'center', paddingTop: 42 }}
        open={open}
        onOpenChange={this.props.onOpenChange}
      >
        1
      </Drawer>
    );
  }
}

OrderSlideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  element: PropTypes.node.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};


export default OrderSlideBar;
