import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, TextareaItem } from 'antd-mobile';
import './style.less';

class AddressEdit extends React.Component {
  componentDidMount() {
    // will do
  }
  render() {
    const {
      fsReceiver,
      fsCellphoneRr,
      fsAddress,
      onChange,
    } = this.props;
    return (
      <div className="add_info">
        <List>
          <InputItem
            value={fsReceiver}
            clear
            placeholder="请输入收货人姓名"
            onChange={value => onChange(value, 'fsReceiver')}
          >收货人
          </InputItem>
          <InputItem
            onChange={value => onChange(value, 'fsCellphoneRr')}
            value={fsCellphoneRr}
            clear
            placeholder="请输入收货人手机号码"
          >手机号码
          </InputItem>
          <TextareaItem
            onChange={value => onChange(value, 'fsAddress')}
            value={fsAddress}
            title="收货地址"
            placeholder="请输入收货地址"
            data-seed="logId"
            rows={2}
          />
        </List>
      </div>
    );
  }
}

AddressEdit.propTypes = {
  fsReceiver: PropTypes.string.isRequired,
  fsCellphoneRr: PropTypes.string.isRequired,
  fsAddress: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AddressEdit;

