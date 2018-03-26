import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import ComfirmButton from './component/comfirmButton';
import ReceiveAddress from '../ReceiveAddress';
import ShopList from '../ShopList';
import CommitOrder from '../commitOrder';
import DatePickerComponent from '@components/DatePicker'; // eslint-disable-line
import ListItem from '@components/ListItem'; // eslint-disable-line
import { formatDateTime } from '@util/common'; // eslint-disable-line
import { onChange } from '@util/decoratorMixin'; // eslint-disable-line
import { post } from '@util/http'; // eslint-disable-line
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  infoStore: store.infoStore,
})) @observer
class OrderConfirm extends React.Component {
  constructor(props) {
    super(props);
    /**
    * @constant nowTimeStamp 当前时间加一天
    * @constant now 转成日期格式
    */
    const nowTimeStamp = Date.now() + (1000 * 60 * 60 * 24);
    const now = new Date(nowTimeStamp);
    this.state = {
      fsArrivalDate: now,
      fsNote: '',
    };
  }

  componentWillMount() {
    // 请求拿到收货地址，收货地址中通过fiDefault来判断那个是默认地址
    post('wap/deliverAddr/selectList').then(({ data }) => {
      const initAddress = data.colContent.filter(item => item.fiDefault === 1);
      // 再向infoStore写入默认地址
      this.props.infoStore.changeInitAddress(initAddress[0]);
      // 把请求来的地址列表添加到infoStore里的addresslist中
      this.props.infoStore.addAddress(data.colContent);
    });

    const { groupStore } = sessionStorage;
    /**
     * @constant countOrder 订单数量的初始值
     * @description 通过格式化之后，只要内层有任何一个物料打勾，就算一个清单，先通过外层判断
     * 如果外层是true,说明全勾选，则是一个清单，如果外层没有打勾，则内层只有有一个物料打勾也是一个清单
     */
    let countOrder = 0;
    let money = 0;
    let flag = false;
    JSON.parse(groupStore).forEach((good) => {
      const isCountOrder = (() => {
        good.material.forEach((materialItem) => {
          const {
            check,
            count,
            fdSalePrice,
            fdSaleUnitRate,
          } = materialItem;
          if (check) {
            flag = true;
            // 钱是通过数量* 销售单价 * 换算率
            money += count * (fdSalePrice * fdSaleUnitRate);
          }
        });
        return flag;
      })();
      if (isCountOrder) {
        flag = false;
        countOrder += 1;
      }
    });
    this.countOrder = countOrder;
    this.money = money;
  }

  onChange = (value, flag) => {
    this.setState({
      [flag]: value,
    });
  }
  /**
   * @param id 地址id
   * @description 把地址id存在sessionStorage中，带到收货地址展示页，再通过路由跳转到收货地址展示页
   */
  goReceiveAddress = (fiAddrId) => {
    this.props.infoStore.formatAddressList(fiAddrId);
    this.props.history.push('/home/shopCard/orderConfirm/recevieAddress');
  }
  // 提交下单
  commitOrder = () => {
    // fsCellphoneRr 手机 fsArrivalAddr 地址
    // fsArrivalDate 到货日期 fsMaterialIdList 物料list fsNote备注 fsReceiver收货人
    const {
      fsAddress: fsArrivalAddr,
      fsCellphoneRr,
      fsReceiver,
    } = this.props.infoStore.initAddress.toJS();
    const { fsArrivalDate, fsNote } = this.state;
    const { groupStore } = sessionStorage;
    // 把sessionStoreage中组合的group进行反格式化，格式化成一个单个list,通过reduce方法
    const fsMaterialIdList = JSON.parse(groupStore).reduce((box, item) => {
      // 循环里面的每一个物料
      for (let i = 0; i < item.material.length; i += 1) {
        const { check, count } = item.material[i];
        // 如果物料是被选中的话，把数量变成fdQty字段，再添加到box数组中返回出去
        if (check) {
          item.material[i].fdQty = count;
          box.push(item.material[i]);
        }
      }
      return box;
    }, []);
    return post('wap/purchase/shoppingAdd', {}, {
      fsArrivalAddr, // 地址
      fsCellphoneRr, // 收货号码
      fsReceiver, // 收货人
      fsArrivalDate: formatDateTime(fsArrivalDate, 'line'), // 收货时间,并进行时间的格式化
      fsNote, // 提交时添写的备注
      fsMaterialIdList, // 提交选中物料的例表
    });
  }

  render() {
    /**
     * @constant fiAddrId 地址id
     * @constant fsAddress 具体地址
     * @constant fsReceiver 收货人
     * @constant fsCellphoneRr 收货人电话
     * @description 这个是要通过用户请求来的，我在mobx中写死
     */
    const {
      fiAddrId,
      fsAddress,
      fsReceiver,
      fsCellphoneRr,
    } = this.props.infoStore.initAddress.toJS();
    const { fsArrivalDate, fsNote } = this.state;
    return (
      <div className="inner_body order_confirm">
        <HomeNavBar title="订单确认" />
        <div className="orderConfirm_container">
          <div className="flex_lr_sb_c orderConfirm_address" onClick={() => this.goReceiveAddress(fiAddrId)}>
            <div className="address_info">
              <p>
                <span className="name">{fsReceiver}</span>
                <span>{fsCellphoneRr}</span>
              </p>
              <p className="address">{fsAddress}</p>
            </div>
            <div className="line" />
          </div>
          <div className="orderConfirm_inner">
            <DatePickerComponent
              fsArrivalDate={fsArrivalDate}
              onChange={this.onChange}
            />
            <ListItem
              title="备注"
              type="input"
              value={fsNote}
              placeholder="请添写备注"
              onChange={(value) => { this.onChange(value, 'fsNote'); }}
            />
            <Link to="/home/shopCard/orderConfirm/shopList">
              <ListItem
                title="商品清单"
                value={`共${this.countOrder}张订单`}
              />
            </Link>
          </div>
        </div>
        <ComfirmButton
          money={this.money}
          commitOrder={this.commitOrder}
        />
        <Route
          path="/home/shopCard/orderConfirm/recevieAddress"
          component={ReceiveAddress}
        />
        <Route
          path="/home/shopCard/orderConfirm/shopList"
          component={ShopList}
        />
        <Route
          path="/home/shopCard/orderConfirm/commitOrder"
          component={CommitOrder}
        />
      </div>
    );
  }
}

/**
  * @param {mobx} infoStore mobx中的地址存储与操作
  */
OrderConfirm.wrappedComponent.propTypes = {
  infoStore: PropTypes.object.isRequired,
};

/**
  * @param {router} history 路由信息
  */
OrderConfirm.propTypes = {
  history: PropTypes.object.isRequired,
};

export default OrderConfirm;
