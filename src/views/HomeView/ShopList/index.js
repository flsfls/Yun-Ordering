import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import { getTotalMoney } from '@util/homeViewModule'; // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class ShopList extends React.Component {
  componentDidMount() {
    // will did
  }
  render() {
    // 拿到goupStore组合后的数据
    const { groupStore } = this.props.goodStore;
    let copyGoodStore = groupStore;
    // 过滤组合里数据，如果没有选中的，则去除
    copyGoodStore.forEach((goods, index) => {
      const newGoods = goods.get('material').filter((materialItem) => {
        if (materialItem.get('check')) {
          return true;
        }
        return false;
      });
      // 重新设置每一项的组合后的数据
      copyGoodStore = copyGoodStore.setIn([index, 'material'], newGoods);
    });
    return (
      <div className="inner_body shop_list">
        <HomeNavBar
          title="商品清单"
          path="/home/shopCard/orderConfirm"
        />
        <div className="scroll_body list_container">
          {
            copyGoodStore.toJS().map(({ fsSupplierName, material, fsSupplierId }) => (
              <div className="list_item" key={fsSupplierId} >
                <div className="flex_lr_sb_c item_header">
                  <div className="flex_lr_fs_c">
                    <CustomIcon type="shop" size="xxs" />
                    <span>{fsSupplierName}</span>
                  </div>
                  <p>共{material.length}件</p>
                </div>
                {
                  material.map(({
                    fsImgUrl,
                    fsMaterialName,
                    count,
                    fsMaterialGuId,
                  }) => (
                    <div className="flex_lr_sb_fs item_body" key={fsMaterialGuId} >
                      <div className="flex_lr_sb_fs item_inner">
                        <img src={fsImgUrl} alt="" />
                        <span className="body_content">{fsMaterialName}</span>
                      </div>
                      <span className="body_count">x{count}</span>
                    </div>
                    ))
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

ShopList.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};

export default ShopList;
