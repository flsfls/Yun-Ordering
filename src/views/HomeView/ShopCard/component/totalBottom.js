import React from 'react';
import { Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

@withRouter @inject(store => ({
  goodStore: store.goodStore,
})) @observer
class TotalButton extends React.Component {
  /**
   * @constant {number} totalMoney totalMoney是一个监听的数据，监听最后返回的值groupStore购选中的money相加
   * @description 点击下单，进行跳转到订单确认页的页面
   */
  confirmHandler = () => {
    const { totalMoney } = this.props.goodStore;
    // 如果整合的全为0,说明去除了所有的购选，则提示用户，选择物料，然后退出
    if (totalMoney === 0) {
      Toast.info('请选择物料商品', 1);
    } else {
      // 否则则进行页面跳转
      this.props.history.push('/home/shopCard/orderConfirm');
    }
  }

  render() {
    const { totalMoney } = this.props.goodStore;
    return (
      <div className="fix_button flex_lr_sb_c total_button">
        <div className="flex_lr_fs_c">
          <span className="title">合计:</span>
          <span className="money">¥{totalMoney}</span>
        </div>
        <p
          style={{ background: totalMoney === 0 ? '#a5a5a5' : '#FF6050' }}
          className="confirm"
          onClick={this.confirmHandler}
        >
          下单
        </p>
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
TotalButton.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};
/**
  * @param {router} history 路由信息
  */
TotalButton.propTypes = {
  history: PropTypes.object,
};
TotalButton.defaultProps = {
  history: {},
};

export default TotalButton;
