import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import LazyLoad from 'vanilla-lazyload';
import lazyImg from '../assets/bg.jpg';
import ARButton from '../../components/ARButton';

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class classfiItem extends React.Component {
  componentDidMount() {
    new LazyLoad(); // eslint-disable-line
  }
  /**
   * @param material 当前点击选中的物料
   * @param flag 加操作还是减操作（-1或者1）
   * @constant outIndex 物料分类组的外层下标
   * @constant innerIndex 物料组的每个物料的内层下标
   * @method changeClassfiCount 改变ClassfiCount里的数量
   * @method changeClassfiCount 同时改变选中的存储数量
   */
  changeCount = (material, flag) => {
    const { outIndex, innerIndex } = this.props;
    this.props.goodStore.changeClassfiCount(outIndex, innerIndex, flag);
    this.props.goodStore.changeGoodListStore(material, flag);
  }

  render() {
    const { material } = this.props;
    const {
      fsImgUrl, // 图片
      fsMaterialName, // 物料名
      fsSaleUnitName, // 物料销售规格
      fdSaleUnitRate, // 物料销售换算率
      fsModelno, // 物料计量单位
      fdSalePrice, // 物料销售价格
      count, // 物料数量
    } = material.toJS();
    return (
      <div className="classif_item">
        <div className="flex_lr_fs_c">
          <img data-src={fsImgUrl} src={lazyImg} alt="" />
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

classfiItem.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};

classfiItem.propTypes = {
  material: PropTypes.object.isRequired,
  outIndex: PropTypes.number.isRequired,
  innerIndex: PropTypes.number.isRequired,
};

export default classfiItem;
