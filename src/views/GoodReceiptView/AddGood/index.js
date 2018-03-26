import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { Route } from 'react-router-dom';
import ChooseGood from '../ChooseGood';
import NavBar from '@components/NavBar'; // eslint-disable-line
import CustomIcon from '@components/CustomIcon'; // eslint-disable-line
import OrderGoodList from '@components/OrderGoodList' // eslint-disable-line
import OrderGoodButton from '@components/OrderGoodButton'; // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class AddGood extends React.Component {
  componentWillMount() {
    const {
      puchaseMaterial,
      chooseMaterial,
      location,
      enterFlag,
    } = sessionStorage;
    const { chooseMaterial: chooseMaterialStore } = this.props.puchaseStore;
    this.location = location;
    this.enterFlag = enterFlag;
    if (location === 'purchase') {
      if (chooseMaterial && chooseMaterialStore.size === 0) {
        this.props.puchaseStore.addChooseMaterial(JSON.parse(chooseMaterial));
      }
    } else if (this.location === 'stock') {
      if (puchaseMaterial && chooseMaterialStore.size === 0) {
        this.props.puchaseStore.addChooseMaterial(JSON.parse(puchaseMaterial));
      }
    }
  }

  onChange = (e, flag, index) => {
    this.props.puchaseStore.changeChooseMaterial(e.target.value, flag, index);
    console.log(this.props.puchaseStore.chooseMaterial.toJS());
  }
  chooseGoodClick = () => {
    this.props.history.push({
      pathname: '/home/libraryOrder/addPuchaseLibrary/addGood/chooseGood',
    });
  }
  rightDom = () => {
    const { status } = sessionStorage;
    return (
      <div key="AddGoodfirst">
        {
          status === '2' || status === '9' || status === '3'
           ?
              null
           :
              <CustomIcon type="goodadd" size="xs" key="AddGoodfirst" onClick={this.chooseGoodClick} />
        }
      </div>
    );
  }
  confirm = () => {
    const chooseMaterial = this.props.puchaseStore.chooseMaterial.toJS();
    let flag;
    if (this.enterFlag === '1' || this.enterFlag === '2') {
      flag = chooseMaterial.every(({ fdQty, fdPrice }) => fdQty && fdPrice && fdPrice >= 0 && fdPrice >= 0);// eslint-disable-line
    } else {
      flag = chooseMaterial.every(({ fdQtyMust }) => fdQtyMust && fdQtyMust >= 0);// eslint-disable-line
    }
    if (!flag) {
      Toast.info('请写完所有的数量和单价', 1);
    } else {
      this.props.history.goBack();
    }
  }
  render() {
    const { chooseMaterial, totalMoney } = this.props.puchaseStore;
    const count = chooseMaterial.size;
    return (
      <div className="add_good inner_body">
        <NavBar
          title="添加品项"
          right={this.rightDom()}
        />
        <div className="scroll_body">
          {
            chooseMaterial.map((item, index) => (
              <OrderGoodList
                color={sessionStorage.fiBillKind === '2' ? 'red' : '#33333'}
                item={item}
                key={index}
                onChange={(e, flag) => this.onChange(e, flag, index)}
              />
            ))
          }
        </div>
        <OrderGoodButton
          hasReduce={sessionStorage.fiBillKind === '2'} // eslint-disable-line
          count={count}
          money={totalMoney}
          confirm={this.confirm}
        />
        <Route path="/home/libraryOrder/addPuchaseLibrary/addGood/chooseGood" component={ChooseGood} />
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
