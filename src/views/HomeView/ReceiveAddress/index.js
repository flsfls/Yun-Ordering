import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd-mobile';
import { Link, Route } from 'react-router-dom';
import AddRcAddress from '../AddRcAddress';
import EditAddress from '../EditAddress';
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import { get } from '@util/http' // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  infoStore: store.infoStore,
})) @observer
class ReceiveAddress extends React.Component {
  /**
    * @variable id 地址id
    * @variable data 请求后的用户地址列表
    * @variable NewData 通过请求来的用户地址列表和seesionStorage里地址id进行比较，如果相当则设计check=true,其它全为false
    * @marjar function 通过上个订单确认页面带来id数据进行和请求来的地址列表进行比对，如果是相当的则设置check为true,否则为false
    * 再通过mobx infoStore里addAddress方法存储改变后的newData（地址列表）,但是如果存在数据列表则不需要向后台请求，可以节省一次请求
    * 两者都要通过调用formatAddressList方法去标识当时选中的地址项
    * 如果用户进行页面刷新mobx的数据会清空，则可以正常向后台请求
    */
  // componentWillMount() {
  //   const { addressList } = this.props.infoStore;
  //   if (addressList.size > 0) {
  //     this.props.infoStore.addAddress(this.formatAddressList(addressList.toJS()));
  //   } else {
  //     get('api/address/getAddress').then(({ data }) => {
  //       this.props.infoStore.addAddress(this.formatAddressList(data));
  //     });
  //   }
  // }
  /**
    * @param data 数据（可能是请求来的列表数据，也有可能是当前mobx已经有的列表数据
    * @marjar function 通过上个订单确认页面带来id数据进行和请求来的地址列表进行比对，如果是已经有数据的则用已经有的数据进行对比
    */
  formatAddressList = (data) => {
    const { id } = sessionStorage;
    return data.map((item) => {
      const newItem = item;
      if (item._id === id) {
        newItem.check = true;
      } else {
        newItem.check = false;
      }
      return newItem;
    });
  }

  /**
    * @param item 选中的当前需要编辑地址的所有信息
    * @marjar function 跳到编辑的地址页，通过loaction把item带入到editAddress页面
    */
  goEditAddress = (item) => {
    this.props.history.push('/home/shopCard/orderConfirm/recevieAddress/editAddress', {
      item,
    });
  }

  /**
    * @param item 选中后所有地址的信息
    * @marjar function 通过infoStore里的changeInitAddress方法把mobx initAddress数据改变选中的，再返回到订单确认页
    */
  changeAddress = (item) => {
    this.props.infoStore.changeInitAddress(item);
    this.props.history.go(-1);
  }

  render() {
    const { addressList } = this.props.infoStore;
    return (
      <div className="inner_body receive_address">
        <HomeNavBar title="收货地址" path="/home/shopCard/orderConfirm" />
        <div className="scroll_body receive_list">
          {addressList.toJS().map((item) => {
            const {
              fsAddress, // 收货地址
              fsCellphoneRr, // 收货人手机号码
              fsReceiver, // 收货人
              fiAddrId, // 地址唯一的id
              fiDefault, // 是否选中或者可以理解为设置默认地址
            } = item;
            return (
              <div className="flex_lr_sb_c list_item" key={fiAddrId}>
                <Checkbox
                  checked={fiDefault === 1}
                  onChange={() => this.changeAddress(item)}
                />
                <div className="item_info" onClick={() => this.changeAddress(item)}>
                  <p>
                    <span>{fsReceiver}</span>
                    <span>{fsCellphoneRr}</span>
                  </p>
                  <p className="info_address">{fsAddress}</p>
                </div>
                <CustomIcon type="edit" onClick={() => this.goEditAddress(item)} />
              </div>
            );
          })}
        </div>
        <Link to="/home/shopCard/orderConfirm/recevieAddress/addRcAddress">
          <div className="fix_button flex_lr_c_c add_receive">
            <CustomIcon type="addButton" className="add" size="xxs" />
            <span>新增收货地址</span>
          </div>
        </Link>
        <Route
          path="/home/shopCard/orderConfirm/recevieAddress/addRcAddress"
          component={AddRcAddress}
        />
        <Route
          path="/home/shopCard/orderConfirm/recevieAddress/editAddress"
          component={EditAddress}
        />
      </div>
    );
  }
}

/**
  * @param {mobx} infoStore mobx中的地址存储与操作
  */
ReceiveAddress.wrappedComponent.propTypes = {
  infoStore: PropTypes.object.isRequired,
};

/**
  * @param {router} history 路由信息
  */
ReceiveAddress.propTypes = {
  history: PropTypes.object.isRequired,
};


export default ReceiveAddress;

