import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Modal } from 'antd-mobile';
import { Route } from 'react-router-dom';
import CardList from './component/cardList';
import TotalButton from './component/totalBottom';
import OrderConfirm from '../OrderConfirm';
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import './assets/style.less';


const { alert } = Modal;

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class ShopCard extends Component {
  componentWillMount() {
    // 防止用户刷新页面，如果有sessionStorage.groupStore的话，先用sessionStorage.groupStore保存的数据
    // 否则把选取的物料进行group组合化，进行保存到mobx的groupStore中
    this.props.goodStore.addGroupStore();
  }

  componentWillUnmount() {
    // 当页面销毁返回到主页面的时候，把下拉加载的物料和选取中的物料再进行一个数量比对
    this.props.goodStore.comparsionGoodList();
    // 把sessionStorage中的groupStore删除，进来后进行groupStore根据先中的物料进行重置
    sessionStorage.removeItem('groupStore');
  }

  cleanDom = () => (
    <div className="flex_lr_sb_c right_bar" key="first" onClick={this.cleanHandler} >
      <div>
        <CustomIcon type="delete" size="xxs" />
      </div>
      <span className="right_bar_text">清除</span>
    </div>
  )

  cleanShop = () => {
    localStorage.clear();
    this.props.goodStore.cleanGoodStore();
  }

  cleanHandler = () => {
    alert('提示', '确定是否删除购物车?', [
      { text: '取消' },
      { text: '确认', onPress: this.cleanShop },
    ]);
  }


  render() {
    const { groupStore } = this.props.goodStore;
    return (
      <div className="inner_body shopcard">
        <HomeNavBar
          title="购物车"
          right={this.cleanDom()}
        />
        <div className="scroll_body">
          {
            groupStore.map((item, outIndex) => (
              <CardList
                shopItem={item}
                outIndex={outIndex}
                key={item.get('fsSupplierId')}
              />
            ))
          }
        </div>
        <TotalButton />
        <Route
          path="/home/shopCard/orderConfirm"
          component={OrderConfirm}
        />
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
ShopCard.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};

export default ShopCard;

