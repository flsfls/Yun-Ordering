import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { DatePicker, Picker } from 'antd-mobile';
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import OrderSlideBar from '@components/OrderSlideBar'; // eslint-disable-line

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class SlideBar extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @constant nowTimeStamp 当前时间加一天
     * @constant now 转成日期格式
     */
    const nowTimeStamp = Date.now() + (1000 * 60 * 60 * 24);
    const now = new Date(nowTimeStamp);
    this.state = {
      fsBillDateStart: now, // 开始单据日期
      fsBillDateEnd: now, // 结束单据日期
      fsArrivalDate: now, // 到货日期
      fsPGUID: '', // 供应商id
      status: [
        { text: '全部', choose: false },
        { text: '已提交', choose: false },
        { text: '未提交', choose: false },
        { text: '已取消', choose: false },
        { text: '已入库', choose: false },
      ],
    };
  }
  chooseStatus = (index) => {
    const newStatus = this.state.status.map((item, mapIndex) => {
      const listItem = item;
      if (index === mapIndex) {
        listItem.choose = true;
        return listItem;
      }
      listItem.choose = false;
      return listItem;
    });
    this.setState({
      status: newStatus,
    });
  }
  submit = () => {
    // fsBillDateStart 开始单据日期
    // fsBillDateEnd  结束单据日期
    // fsArrivalDateEnd (string, optional): 到货日期结束
    // fsArrivalDateStart (string, optional): 到货日期开始
    // fiBillStatus 单据日期 全部 '' 已提交 1  未提交 0 已取消。。。
    // fiStockClose 已入库 4
    const {
      fsBillDateStart,
      fsBillDateEnd,
      fsArrivalDate,
      fsPGUID,
    } = this.state;
    const { fsSupplierList } = this.props.puchaseStore;
    let NewSupplierName;
    for (let i = 0; i < fsSupplierList.size; i += 1) {
      if (fsSupplierList.getIn([i, 'value']) === fsPGUID[0]) {
        NewSupplierName = fsSupplierList.getIn([i, 'label']);
        break;
      }
    }
    this.props.getOrderList('clear', {
      fsBillDateStart,
      fsBillDateEnd,
      fsArrivalDateEnd: fsArrivalDate,
      fsArrivalDateStart: fsArrivalDate,
      fsSupplierName: NewSupplierName,
      fsPGUID: fsPGUID[0],
      pageSize: 8,
      pageNum: 1,
    });
  }
  // this.setState({ fsSupplierName: v.label, fsPGUID: v.value })
  cancel = () => {
    const cancelStatus = this.state.status.map((item) => {
      const listItem = item;
      listItem.choose = false;
      return listItem;
    });
    this.setState({
      fsBillDateStart: '',
      fsBillDateEnd: '',
      fsArrivalDate: '',
      fsPGUID: '',
      status: cancelStatus,
    });
  }
  render() {
    const { fsSupplierList } = this.props.puchaseStore;
    const {
      fsBillDateStart,
      fsBillDateEnd,
      fsArrivalDate,
      fsPGUID,
    } = this.state;
    const { open } = this.props;
    const OrderDate = ({ left, extra, onClick }) => (
      <div onClick={onClick} className="list_item">
        <div className="flex_lr_sb_c list_item_inner">
          <span>{left}</span>
          <span className="item">{extra}</span>
        </div>
      </div>
    );
    const Slidebar = () => (
      <div className="receipt_sildebar">
        <p className="title">查询</p>
        <div className="content">
          <DatePicker
            mode="date"
            title="开始单据日期"
            value={fsBillDateStart}
            onChange={fsBillDateStart => this.setState({ fsBillDateStart })}
          >
            <OrderDate left="开始单据日期" />
          </DatePicker>
          <DatePicker
            mode="date"
            title="结束单据日期"
            value={fsBillDateEnd}
            onChange={fsBillDateEnd => this.setState({ fsBillDateEnd })}
          >
            <OrderDate left="结束单据日期" />
          </DatePicker>
          <Picker
            value={fsPGUID}
            onChange={v => this.setState({ fsPGUID: v })}
            title="请选择供应商"
            cols={1}
            data={fsSupplierList.toJS()}
            className="forss"
          >
            <OrderDate left="请选择供应商" />
          </Picker>

          <DatePicker
            mode="date"
            title="到货日期"
            value={fsArrivalDate}
            onChange={fsArrivalDate => this.setState({ fsArrivalDate })}
          >
            <OrderDate left="到货日期" />
          </DatePicker>
          <p className="portStatus">单据状态</p>
          <ul className="status">
            {this.state.status.map((item, index) => (
              <li
                className={item.choose ? 'active' : ''}
                onClick={() => this.chooseStatus(index)}
                key={item.text}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="button_box">
          <button onClick={this.cancel} >
            清除
          </button>
          <button onClick={this.submit}>
            确定
          </button>
        </div>
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
