import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd-mobile';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { post } from '@util/http'; // eslint-disable-line
import InventoryDetail from '@inventoryView/InventoryDetail'; // eslint-disable-line
import Buttons from '@components/Button'; // eslint-disable-line
import NavBar from '@components/NavBar'; // eslint-disable-line
import DatePickerComponent from '@components/DatePicker'; // eslint-disable-line
import ListItem from '@components/ListItem';  // eslint-disable-line
import CustomIcon from '@components/CustomIcon'; // eslint-disable-line
import './assets/style.less';

const nowTimeStamp = Date.now() + (1000 * 60 * 60 * 24);
const now = new Date(nowTimeStamp);


@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class AddInventory extends React.Component {
  state = {
    fsCheckDate: now,
    fsCheckName: '',
    fsNote: '',
    fsStorageId: [],
  }
  componentWillMount() {
    this.setState({
      fsStorageId: this.props.puchaseStore.warehouse,
    });
  }
  componentWillReceiveProps() {
    this.setState({
      fsStorageId: this.props.puchaseStore.warehouse,
    });
  }
  onChange = (flag, values) => {
    this.setState({
      [flag]: values,
    });
  }
  checkOnchange = (e, index) => {
    const fsStorageId = this.state.fsStorageId.setIn([index, 'check'], e.target.checked);
    this.setState({
      fsStorageId,
    });
  }
  submit = () => {
    const fsStorageId = this.state.fsStorageId.toJS().reduce((result, item) => {
      if (item.check) {
        result.push(item.value);
      }
      return result;
    }, []);
    const data = Object.assign({}, { ...this.state }, { fsStorageId });
    post('wap/invbackup/add', {}, data).then(({ data }) => {
      data.invbackupDtl = data.invbackupDtl.colContent;
      sessionStorage.inventorySave = JSON.stringify(data);
      this.props.history.replace({
        pathname: '/home/inventoryList/addInventory/inventoryDetail',
      });
    });
  }
  render() {
    const {
      fsCheckDate,
      fsCheckName,
      fsNote,
      fsStorageId,
    } = this.state;
    return (
      <div className="add_inventory inner_body">
        <NavBar
          title="新增盘点单"
        />
        <div className="ai_content">
          <div>
            <DatePickerComponent
              title="盘点日期"
              pickerTitle="请选择盘点日期"
              time={fsCheckDate}
              onChange={(value) => { this.onChange('fsCheckDate', value); }}
            />
          </div>
          <div>
            <ListItem
              type="input"
              title="盘点名称"
              value={fsCheckName}
              placeholder="请输入"
              onChange={(value) => { this.onChange('fsCheckName', value); }}
            />
          </div>
          <div>
            <ListItem
              type="input"
              title="备注"
              value={fsNote}
              placeholder="请输入"
              onChange={(value) => { this.onChange('fsNote', value); }}
            />
          </div>
          <div className="ai_housing">
            <div className="flex_lr_fs_c">
              <CustomIcon type="home" size="md" />
              <p className="ai_title">请选择盘点仓库</p>
            </div>
            {fsStorageId.toJS().map(({ check, label }, index) => (
              <div className="flex_lr_sb_c" key={index}>
                <span>{label}</span>
                <Checkbox checked={check} onChange={e => this.checkOnchange(e, index)} />
              </div>
            ))}
          </div>
        </div>
        <div onClick={this.submit}>
          <Buttons
            text="确认"
          />
        </div>
        <Route path="/home/inventoryList/addInventory/inventoryDetail" component={InventoryDetail} />
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
AddInventory.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};

AddInventory.propTypes = {
  history: PropTypes.object.isRequired,
};
export default AddInventory;
