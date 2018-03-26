import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd-mobile';
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import './asset/style.less';
import Ok from './asset/commit.jpg';


class CommitOrder extends React.Component {
  componentWillMount() {
    // 后台最后完成的总价 结和各种税率
    this.fdPurchaseTotAmt = this.props.location.state.fdPurchaseTotAmt;
    // 后台返回的订单号list
    this.fsPurchaseGUIDList = this.props.location.state.fsPurchaseGUIDList;
  }

  completeOrder = () => {
    this.props.history.go(-3);
  }

  render() {
    return (
      <div className="commitOrder inner_body">
        <HomeNavBar
          title="订单页"
        />
        <div className="scroll_body commitContainer">
          <img className="commit_img" src={Ok} alt="ok" />
          <p className="commit_text">确定提交成功</p>
          <div className="content">
            <div className="flex_lr_sb_fs">
              <p className="left">网上单号</p>
              <div>
                {this.fsPurchaseGUIDList.map((item, index) => (
                  <p className="right" key={index}>{item}</p>
                ))}
              </div>
            </div>
            <span className="commit_line" />
            <div className="flex_lr_sb_fs order_money">
              <p className="left">订单金额</p>
              <p className="right_money">¥{this.fdPurchaseTotAmt}</p>
            </div>
            <Button onClick={this.completeOrder}>完成</Button>
          </div>
        </div>
      </div>
    );
  }
}


CommitOrder.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
export default CommitOrder;
