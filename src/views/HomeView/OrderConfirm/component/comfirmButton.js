import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@withRouter @inject(store => ({
  goodStore: store.goodStore,
})) @observer
class TotalButton extends React.Component {
  componentDidMount() {
    // will did
  }

  commitOrder = () => {
    // 提交订单
    this.props.commitOrder().then(({ data }) => {
      /**
       * @constant  fdPurchaseTotAmt 提交定单后返回的订单价格
       * @constant  fsPurchaseGUIDList 提交定单后返回的订单流水号
       */
      const { fdPurchaseTotAmt, fsPurchaseGUIDList } = data;
      this.props.goodStore.cleanGoodListStore();
      localStorage.removeItem('goodListStore');
      this.props.history.push('/home/shopCard/orderConfirm/commitOrder', {
        fdPurchaseTotAmt,
        fsPurchaseGUIDList,
      });
    });
  }
  render() {
    return (
      <div className="fix_button flex_lr_sb_c confirm_button">
        <div className="flex_lr_fs_c">
          <span className="title">合计:</span>
          <span className="money">¥{this.props.money}</span>
        </div>
        <p className="confirm" onClick={this.commitOrder}>提交下单</p>
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
TotalButton.propTypes = {
  history: PropTypes.object,
  money: PropTypes.number.isRequired,
  commitOrder: PropTypes.func.isRequired,
};

TotalButton.defaultProps = {
  history: {},
};
export default TotalButton;
