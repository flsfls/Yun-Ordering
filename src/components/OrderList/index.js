import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable */
import { formatDateTime } from '@util/common';
/* eslint-disable */
import './style.less';

class OrderList extends React.Component {
  componentWillMount() {
    // 标识进入的入口
    this.location = sessionStorage.location;
  }
  render() {
    const {
      fiId, // 每笔单的全局主健id,
      fiBillStatus, // 订单的状态
      fsPurchaseGUID, // 采购订单的guid 网上流水号
      fsStockNo, // 采购入库单的编号
      fdPurchaseTotAmt, // 采购订单的价税合计
      fdTotAmt, // 采购入库单的价税合计
      fsSupplierName, // 供应商
      fsBillDate, // 单据日期
      fdMoneyAmt, // 领料单或者退单价格
      fsDepartmentName,  // 部门
      fsPickingNo, // 领料单编号
    } = this.props.orderItem;
    let color = '';
    let text = '';
    if (this.location === 'purchase') {
      if (fiBillStatus === 1 ) {
        text = '已提交';
        color = '#FF6050';
      } else if (fiBillStatus === 0) {
        text = '未提交';
        color = '#70BC46';
      } else if (fiBillStatus === 9) {
        text = "已入库";
        color = '#2C9AFF';
      }
    } else if (this.location === 'stock' || this.location === 'picking') {
      if (fiBillStatus === 0) {
        text = '未审核';
        color = '#FF6050';
      } else if (fiBillStatus === 1) {
        text = '已审核';
        color = '#70BC46';
      }
    }

    return (
      <ul onClick={() => this.props.click(fiId, this.props.orderItem)}>
        <li className="c_order_list">
          <p className="first flex_lr_sb_c">
            <span>{fsSupplierName || fsDepartmentName}</span>
            <span style={{ color: color }}>{text}</span>
          </p>
          <p className="second flex_lr_sb_c">
            <span>{fsPurchaseGUID || fsStockNo || fsPickingNo}</span>
            <span>{fsBillDate}</span>
          </p>
          <p className="third flex_lr_sb_c">
            {
              text === '已提交' ? <span className="confirm">确认入库</span> : null
            }
            <span className="fdPurchaseTotAmt">¥{fdPurchaseTotAmt || fdTotAmt || fdMoneyAmt}</span>
          </p>
        </li>
      </ul>
    );
  }
}

OrderList.propTypes = {
  click: PropTypes.func.isRequired,
  orderItem: PropTypes.object.isRequired,
};

export default OrderList;
