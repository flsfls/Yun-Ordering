import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import OrderSlideBar from '@components/OrderSlideBar'; // eslint-disable-line

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class SlideBar extends React.Component {
  render() {
    const { fspauchaseList } = this.props.puchaseStore;
    const { open } = this.props;
    const Slidebar = () => (
      <div className="addpuchase_slidebar">
        {
          fspauchaseList.toJS().map(item => (
            <div
              onClick={() => this.props.getOrderList(item)}
              key={item.fsSupplierLvlId}
            >
              {item.fsSupplierName}
            </div>
          ))
        }
      </div>
    );
    return (
      <OrderSlideBar
        onOpenChange={this.props.onOpenChange}
        element={<Slidebar />}
        open={open}
      />
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
SlideBar.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};
/**
 * @param {boolean}  open 初始化是否打开slidebar
 * @param {object}  history 非路由组件，中的路由信息
 * @method onOpenChange 父组件传入改变slidebar的toggle
 */
SlideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  getOrderList: PropTypes.func.isRequired,
};

export default SlideBar;
