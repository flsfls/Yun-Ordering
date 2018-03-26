import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Button, Toast } from 'antd-mobile';
import { post } from '@util/http'; // eslint-disable-line
import AddressEdit from '../components/AddressEdit';
import { validationAddress } from '@util/homeViewModule'; // eslint-disable-line
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  infoStore: store.infoStore,
})) @observer
class AddRcAddress extends React.Component {
  state = {
    fsReceiver: '', // 收货人
    fsCellphoneRr: '', // 收货人电话
    fsAddress: '', // 收货人地址
  }
  componentDidMount() {
    // will do
  }

  onChange = (value, flag) => {
    this.setState({
      [flag]: value,
    });
  }

  addAddress = () => {
    const validateFlag = validationAddress(this.state);
    if (!validateFlag) return;
    post('wap/deliverAddr/add', {}, { ...this.state, fiDefault: 0 }).then(({ data }) => {
      this.props.infoStore.editAddAddress(data);
      this.props.history.goBack();
      Toast.info('添加成功', 1);
    });
  }

  render() {
    return (
      <div className="inner_body addRC_address">
        <HomeNavBar title="新增收货地址" path="/home/shopCard/orderConfirm/recevieAddress" />
        <AddressEdit
          {...this.state}
          onChange={this.onChange}
        />
        <Button
          onClick={this.addAddress}
          className="click_button confirm"
        >
          确定
        </Button>
      </div>
    );
  }
}

AddRcAddress.wrappedComponent.propTypes = {
  infoStore: PropTypes.object.isRequired,
};

AddRcAddress.propTypes = {
  history: PropTypes.object.isRequired,
};
export default AddRcAddress;
