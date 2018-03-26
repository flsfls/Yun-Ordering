import React from 'react';
import { inject, observer } from 'mobx-react';
import LazyLoad from 'vanilla-lazyload';
import PropTypes from 'prop-types';
import loadingSrc from '../assets/bg.jpg';
import ARButton from '../../components/ARButton';

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class searchList extends React.Component {
  componentDidMount() {
    new LazyLoad(); // eslint-disable-line
  }
  /**
   * @param material 选中的当前物料信息
   * @param flag 表示加或减的操作（-1， 1）
   * @method changeSearchStoreCount 改变SearchStore的数量，来进行视图更改
   * @method changeGoodListStore 同时改变所有选中的物料，也同步更改
   */
  changeCount = (material, flag) => {
    // 每个物料的index
    const { index } = this.props;
    this.props.goodStore.changeSearchStoreCount(index, flag);
    this.props.goodStore.changeGoodListStore(material, flag);
  }

  render() {
    /**
     * @constant {string} fsImgUrl 物料图片
     * @constant {string} fsMaterialName 物料名
     * @constant {string} fsModelno 物料计量单位
     * @constant {number} fdSalePrice 物料销售价格
     * @constant {number} fsSaleUnitName 物料销售规格
     * @constant {number} fdSalePrice 物料销售价格
     * @constant {number} count 物料数量
     */
    const { material } = this.props;
    const {
      fsImgUrl, // 图片
      fsMaterialName, // 物料名
      fsModelno, // 物料计量单位
      fsSaleUnitName, // 物料销售规格
      fdSaleUnitRate, // 物料销售换算率
      fdSalePrice, // 物料销售价格
      count, // 物料数量
    } = material.toJS();
    return (
      <div className="classif_item">
        <div className="flex_lr_fs_c">
          <img data-src={fsImgUrl} src={loadingSrc} alt="" />
          <div className="flex_tb_sb_fs item_name">
            <span>{fsMaterialName}</span>
            <span className="money">{fsModelno}</span>
          </div>
        </div>
        <div className="flex_lr_sb_c">
          <span className="money">¥{fdSalePrice * fdSaleUnitRate}<span className="until">/{fsSaleUnitName}</span></span>
          <ARButton
            count={count}
            addFunc={() => this.changeCount(material, 1)}
            reduceFunc={() => this.changeCount(material, -1)}
          />
        </div>
      </div>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
searchList.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};

/**
  * @param {obj} material 每一项物料的信息
  * @param {number} index 每一个物料的当前下标
  */
searchList.propTypes = {
  material: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
export default searchList;
