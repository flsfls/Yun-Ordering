import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import LazyLoad from 'vanilla-lazyload';
import lazyImg from '../assets/bg.jpg';
import ARButton from '@homeView/components/ARButton'; // eslint-disable-line

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class OrderList extends React.Component {
  componentDidMount() {
    // 第三方图片懒加载的插件
    new LazyLoad(); // eslint-disable-line
  }
  /**
   * @param {obj} item 每个物料的所有数据
   * @param {number} flag 标识是点减少还是增加
   * @method changeGoodCount 点击加减按扭执行mobx,changeGoodCount的action,改变下拉列表的数量，进行同步更新
   * @method changeGoodListStore 改变存储选中的下拉数据
   */
  changeGoodCount = (item, flag) => {
    this.props.goodStore.changeGoodCount(item, flag);
    this.props.goodStore.changeGoodListStore(item, flag);
  }

  render() {
    const { item } = this.props;
    /**
     * @constant {string} fsImgUrl 物料图片
     * @constant {string} fsMaterialName 物料名
     * @constant {string} fsSaleUnitName 物料销售规格
     * @constant {number} fdSaleUnitRate 物料销售换算率
     * @constant {number} fdSalePrice 物料销售价格
     * @constant {number} fsModelno 物料计量单位
     * @constant {number} count 物料数量
     */
    const {
      fsImgUrl,
      fsMaterialName,
      fsSaleUnitName,
      fdSalePrice,
      fsModelno,
      fdSaleUnitRate,
      count,
    } = item.toJS();
    return (
      <div className="order_item">
        <img className="item_img" data-src={fsImgUrl} src={lazyImg} alt="" />
        <div className="flex_tb_sb_n item_info">
          <p className="info_goodName">{fsMaterialName} {fsModelno}</p>
          <p className="price_kg"><span>¥{fdSalePrice * fdSaleUnitRate}</span>／{fsSaleUnitName}</p>
          <ARButton
            count={count}
            addFunc={() => this.changeGoodCount(item, 1)}
            reduceFunc={() => this.changeGoodCount(item, -1)}
          />
        </div>
      </div>
    );
  }
}

/**
 * @param {obj} item 每个物料的所有数据
 */
OrderList.propTypes = {
  item: PropTypes.object.isRequired,
};

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
OrderList.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};

export default OrderList;
