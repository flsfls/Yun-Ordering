
import React from 'react';
import { Button, Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { post } from '@util/http';// eslint-disable-line
import { validationAddress } from '@util/homeViewModule'; // eslint-disable-line
import AddressEdit from '../components/AddressEdit';
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  infoStore: store.infoStore,
})) @observer
class EditAddress extends React.Component {
  state = {
    fsReceiver: '', // 地址总部名称
    fsCellphoneRr: '', // 地址电话
    fsAddress: '', // 地址全称
  }
  /**
   * marjar function 通过收货地址跳转过来时传入的item，在loacation里的state取到，然后赋值给state
   */
  componentWillMount() {
    this.setState({ ...this.props.location.state.item });
  }

  /**
   * @param {string} value 当前改变的值
   * @param {string} flag 对应的输入框input
   */
  onChange = (value, flag) => {
    this.setState({
      [flag]: value,
    });
  }

  /**
   * @param {string} flag 因为确定和删除的逻辑全在其中，用来标识是确定修改操作还是删除操作
   * @varaible _id 通过收货地址跳转过来时传入的item，在loacation里的state取到的_id
   * marjar function 如果edit确定修改操作的话，则先进行validationAddress方法的效验
   * 通过了效验后，调用infoStore里editAddress方法，改变地址列表中对应的数据，调用toast方案提示一下修改成功
   * 如果flag不是edit，那就是删除，调用调用infoStore里editAddress方法，把地址列表中的对应的数据删除，调用toast方案提示一下删除成功
   * 最后都返回到收货地址页
   */
  editAddress = (flag) => {
    const { fiAddrId } = this.props.location.state.item;
    if (flag === 'edit') {
      const validateFlag = validationAddress(this.state);
      if (!validateFlag) return;
      post('wap/deliverAddr/update', {}, { fiAddrId, ...this.state }).then(() => {
        this.props.infoStore.editAddress(fiAddrId, this.state);
        Toast.info('修改成功', 1);
        this.props.history.goBack();
      });
    } else {
      post('wap/deliverAddr/delete', { fiAddrId }).then(() => {
        Toast.info('删除成功', 1);
        this.props.infoStore.deleteAddress(fiAddrId);
        this.props.history.goBack();
      });
    }
  }
  render() {
    return (
      <div className="inner_body edit_address">
        <HomeNavBar
          title="编辑收货地址"
          path="/home/shopCard/orderConfirm/recevieAddress"
        />
        <AddressEdit
          {...this.state}
          onChange={this.onChange}
        />
        <Button
          onClick={() => this.editAddress('edit')}
          className="click_button confirm"
        >
          确定
        </Button>
        <Button
          className="click_button delete"
          onClick={() => this.editAddress()}
        >
          删除
        </Button>
      </div>
    );
  }
}

/**
  * @param {mobx} infoStore mobx中的地址存储与操作
  */
EditAddress.wrappedComponent.propTypes = {
  infoStore: PropTypes.object.isRequired,
};

/**
  * @param {router} location 路由信息
  * @param {router} history 路由信息
  */
EditAddress.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default EditAddress;
