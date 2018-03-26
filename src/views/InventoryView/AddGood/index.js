import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { Route } from 'react-router-dom';
import ChooseGood from '../ChooseGood';
import InputList from './component/inputList';
import { post } from '@util/http'; // eslint-disable-line
import Button from '@components/Button';  // eslint-disable-line
import NavBar from '@components/NavBar'; // eslint-disable-line
import CustomIcon from '@components/CustomIcon'; // eslint-disable-line
import OrderGoodList from '@components/OrderGoodList' // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class AddGood extends React.Component {
  componentWillMount() {
    const materialList = JSON.parse(sessionStorage.enterMaterial);
    this.props.puchaseStore.addChooseMaterial(materialList);
  }

  componentWillUnmount() {
    this.props.puchaseStore.clearChooseMaterial();
    sessionStorage.removeItem('enterMaterial');
  }
  onChange = (e, index) => {
    const { value } = e.target;
    this.props.puchaseStore.changeChooseMaterial(value, 'fdCheckQty', index);
  }

  chooseGoodClick = () => {
    this.props.history.push({
      pathname: '/home/inventoryList/addInventory/inventoryDetail/addGood/chooseGood',
    });
  }

  rightDom = () => (
    <div key="AddGoodfirst">
      <CustomIcon type="goodadd" size="xs" key="AddGoodfirst" onClick={this.chooseGoodClick} />
    </div>
  );
  confirm = () => {
    // will
    const data = JSON.parse(sessionStorage.inventorySave);
    const { invbackupDtl } = data;
    const chooseMaterial = this.props.puchaseStore.chooseMaterial.toJS();
    for (let i = 0; i < chooseMaterial.length; i += 1) {
      for (let j = 0; i < invbackupDtl.length; j += 1) {
        if (invbackupDtl[j].fiId === chooseMaterial[i].fiId) {
          invbackupDtl[j].fdDiffQty = chooseMaterial[i].fdDiffQty;
          invbackupDtl[j].fdCheckQty = chooseMaterial[i].fdCheckQty;
          break;
        }
      }
    }
    sessionStorage.inventorySave = JSON.stringify(data);
    post('wap/invbackup/update', {}, data).then(() => {
      this.props.history.goBack();
      Toast.info('更新成功', 1);
    });
  }
  render() {
    const { chooseMaterial } = this.props.puchaseStore;
    return (
      <div className="add_good inner_body">
        <NavBar
          title="添加品项"
          right={this.rightDom()}
        />
        <div className="scroll_body">
          {
            chooseMaterial.map((item, index) => (
              <InputList
                item={item}
                key={index}
                onChange={e => this.onChange(e, index)}
              />
            ))
          }
        </div>
        <div onClick={this.confirm} >
          <Button
            text="保存"
          />
        </div>
        <Route path="/home/inventoryList/addInventory/inventoryDetail/addGood/chooseGood" component={ChooseGood} />
      </div>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
AddGood.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};
AddGood.propTypes = {
  history: PropTypes.object.isRequired,
};
export default AddGood;
