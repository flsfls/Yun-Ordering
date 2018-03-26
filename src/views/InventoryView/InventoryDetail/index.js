import React from 'react';
import { Toast } from 'antd-mobile';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { inject, observer } from 'mobx-react';
import { post } from '@util/http'; // eslint-disable-line
import NavBar from '@components/NavBar'; // eslint-disable-line
import AddGood from '@inventoryView/AddGood';  // eslint-disable-line
import { formatDateTime } from '@util/common';  // eslint-disable-line
import ThreeButton from '@components/ThreeButton'; // eslint-disable-line
import DatePickerComponent from '@components/DatePicker'; // eslint-disable-line
import ListItem from '@components/ListItem';  // eslint-disable-line
import CustomIcon from '@components/CustomIcon'; // eslint-disable-line
import './assets/style.less';

// @inject(store => ({
//   puchaseStore: store.puchaseStore,
// })) @observer
class InventoryDetail extends React.Component {
  state = {
    fsCheckDate: '',
    fsCheckName: '',
    fsBackupDateTime: '',
    fsNote: '',
  }
  componentWillMount() {
    const { inventorySave } = sessionStorage;
    const {
      fsCheckDate,
      fsCheckName,
      fsBackupDateTime,
      fsNote,
      storages,
    } = JSON.parse(inventorySave);
    this.storages = storages;
    this.setState({
      fsCheckDate: new Date(fsCheckDate),
      fsCheckName,
      fsBackupDateTime,
      fsNote,
    });
  }

  onChange = (flag, values) => {
    this.setState({
      [flag]: values,
    });
  }

  startInventory = (fsStorageId2) => {
    const { inventorySave } = sessionStorage;
    const { invbackupDtl } = JSON.parse(inventorySave);
    const materialList = invbackupDtl.filter(({ fsStorageId }) => fsStorageId === fsStorageId2); // eslint-disable-line
    sessionStorage.enterMaterial = JSON.stringify(materialList);
    this.props.history.push({
      pathname: '/home/inventoryList/addInventory/inventoryDetail/addGood',
    });
  }

  threeHandler = () => {
    const data = Object.assign({}, JSON.parse(sessionStorage.inventorySave), { ...this.state });
    data.fsCheckDate = formatDateTime(data.fsCheckDate, 'line');
    delete data.storages;
    post('wap/invbackup/update', {}, data).then(() => {
      Toast.info('更新成功', 1);
    });
  }
  render() {
    const {
      fsCheckDate,
      fsCheckName,
      fsBackupDateTime,
      fsNote,
    } = this.state;
    return (
      <div className="inventory_detail inner_body">
        <NavBar
          title="盘点详情"
        />
        <div className="id_content">
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
              placeholder="请填写盘点名称"
              title="盘点名称"
              value={fsCheckName}
              onChange={(value) => { this.onChange('fsCheckName', value); }}
            />
          </div>
          <div>
            <ListItem
              type="text"
              disabled
              title="账存日期"
              value={fsBackupDateTime}
            />
          </div>
          <div>
            <ListItem
              type="input"
              title="备注"
              value={fsNote}
              placeholder="请填写备注"
              onChange={(value) => { this.onChange('fsNote', value); }}
            />
          </div>
          <div className="id_inventory">
            <div className="flex_lr_fs_c">
              <CustomIcon type="home" size="md" />
              <p className="id_title">请选择盘点仓库</p>
            </div>
            {
              this.storages.map(({
                fsStorageName,
                fsStorageId,
              }, index) => (
                <div className="flex_lr_sb_c" onClick={() => this.startInventory(fsStorageId)} key={index}>
                  <span>{fsStorageName}</span>
                  <button className="id_button">开始盘点</button>
                </div>
              ))
            }
          </div>
          <ThreeButton
            textOne="生成盘盈单"
            textTwo="生成盘亏单"
            textThree="保存"
            oneHandler={this.onHandler}
            twoHandler={this.twoHandler}
            threeHandler={this.threeHandler}
          />
        </div>
        <Route path="/home/inventoryList/addInventory/inventoryDetail/addGood" component={AddGood} />
      </div>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
// InventoryDetail.wrappedComponent.propTypes = {
//   puchaseStore: PropTypes.object.isRequired,
// };
InventoryDetail.propTypes = {
  history: PropTypes.object.isRequired,
};

export default InventoryDetail;
