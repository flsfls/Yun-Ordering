import React from 'react';
import { inject, observer } from 'mobx-react';
import { autorun } from 'mobx';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd-mobile';
import ARButton from '@homeView/components/ARButton'; // eslint-disable-line
import pic from '../assets/pic.jpg';

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class CardList extends React.Component {
  componentWillMount() {
    // 只要groupStore发生变化，则存在sessionStorage中，因为是子路由，当用户刷新页面，会导致据重质
    autorun(() => {
      sessionStorage.groupStore = JSON.stringify(this.props.goodStore.groupStore);
    });
  }

  /**
   * @param good 物料组中点击的当前物料
   * @param flag 是减不是加的标识
   * @param outIndex 每个物料组的下标
   * @param innerIndex 每个物料组中每个物料的下标
   * @method changeGoodListStore 改变Mobx 中 goodListStore中选中的存储数据
   * @method changeGroupStoreCount 改变mobx中 groupStore中的数据，同步更新视图
   */
  changeGood = (good, flag, outIndex, innerIndex) => {
    this.props.goodStore.changeGoodListStore(good, flag);
    this.props.goodStore.changeGroupStoreCount(outIndex, innerIndex, flag);
  }

  render() {
    /**
     * @method warpCheck 改变mobx中 groupStore中的物料组的视图，同步更新视图
     * @method innerCheck 改变mobx中 groupStore中物料组中点击物料的数据，同步更新视图
     */
    const { shopItem, outIndex } = this.props;
    return (
      <div className="cardList">
        <div className="list_header">
          <div className="flex_lr_fs_c list_inner">
            <Checkbox
              checked={shopItem.get('check')}
              onChange={e => this.props.goodStore.warpCheck(e, outIndex)}
            />
            <p>{shopItem.get('fsSupplierName')}</p>
          </div>
        </div>
        {
          shopItem.get('material').map((materialItem, innerIndex) => {
            const {
              fsImgUrl, // 物料图片
              fsMaterialName, // 物料名
              fsMaterialGuId, // 物料id
              fdSalePrice, // 物料单位
              fsSaleUnitName, // 物料销售规格
              fdSaleUnitRate, // 物料销售换算率
              count, // 物料数量
              check, // 是否勾选
            } = materialItem.toJS();
            return (
              <div className="flex_lr_fs_c list_info" key={fsMaterialGuId} >
                <Checkbox
                  checked={check}
                  onChange={e => this.props.goodStore.innerCheck(e, outIndex, innerIndex)}
                />
                <div className="flex_lr_fs_c info_item">
                  <img src={fsImgUrl || pic} alt="" />
                  <div className="flex_tb_sb_n infos">
                    <p>{fsMaterialName}</p>
                    <div className="flex_lr_sb_n">
                      <p>${fdSalePrice * fdSaleUnitRate}/{fsSaleUnitName}</p>
                      <ARButton
                        count={count}
                        addFunc={() => this.changeGood(materialItem, 1, outIndex, innerIndex)}
                        reduceFunc={() => this.changeGood(materialItem, -1, outIndex, innerIndex)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
CardList.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};

/**
  * @param {object} shopItem 每个物料组的数据
  * @param {number} outIndex 每个物料组的下外层下标
  */
CardList.propTypes = {
  shopItem: PropTypes.object.isRequired,
  outIndex: PropTypes.number.isRequired,
};

export default CardList;

