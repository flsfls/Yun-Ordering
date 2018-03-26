import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

class OrderGoodButton extends React.Component {
  componentWillUnmount() {
    // will
  }
  render() {
    const {
      count,
      money,
      hasReduce,
      showMoney,
    } = this.props;
    const reduce = hasReduce ? '-' : '';
    return (
      <div className="order_good_button flex_lr_sb_c">
        <p className="flex_lr_fs_c">
          <span>共{count}款</span>
          {
            showMoney
              ?
                [
                  <span>合计:</span>,
                  <span>¥{reduce}{money}</span>,
                ]
              :
                null
          }
        </p>
        <button onClick={this.props.confirm}>
          确认
        </button>
      </div>
    );
  }
}

OrderGoodButton.propTypes = {
  showMoney: PropTypes.bool,
  count: PropTypes.number.isRequired,
  money: PropTypes.number.isRequired,
  confirm: PropTypes.func.isRequired,
  hasReduce: PropTypes.string.isRequired,
};
OrderGoodButton.defaultProps = {
  showMoney: true,
};
export default OrderGoodButton;
