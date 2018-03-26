import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Drawer } from 'antd-mobile';
import { post } from '@util/http'; // eslint-disable-line
import CustomIcon from '@components/CustomIcon'  // eslint-disable-line

@withRouter @inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class SlideBar extends React.Component {
  state = {
    shop: [],
  }
  componentWillMount() {
    // 向后台发送请求，请求供应商例表
    post('wap/quickordergoods/index').then(({ data }) => {
      // 通过过滤只拿到fsTreeItemId为33的总部，暂时只有这个
      let shop = data.filter((item) => {
        const { fsTreeItemId } = item;
        // 通过过滤暂时只取id为33的供应商
        return fsTreeItemId === '33';
      });
      // 然后把总部所有供应商给提取出来成一个list
      shop = shop[0].data.map(({
        fullName,
        fsShopGUID,
        value,
        label,
      }) => ({
        fullName,
        fsShopGUID,
        value,
        label,
      }));
      this.setState({
        shop,
      });
      // 再传入到puchaseStore中，在后面采购订单和入库需要添写
      this.props.puchaseStore.addFsSupplierList(shop);
    });
  }
  /**
   * @param {String}  fsShopGUID 供应商门主店的id
   * @method onOpenChange 父组件传入改变slidebar的toggle
   * @description 当点击slidebar里供应商的分类门店时，跳到分类页面，把当前店铺id保存到session中，再调用onOpenChange关闭slidebar
   */
  goClassification = (fsShopGUID) => {
    this.props.onOpenChange();
    sessionStorage.fsShopGUID = fsShopGUID;
    sessionStorage.fsTreeItemId = '33';
    this.props.history.push('/home/classification');
  }

  render() {
    const slidebar = this.state.shop.map(({ fullName, fsShopGUID }) => (
      <div
        key={fsShopGUID}
        onClick={() => this.goClassification(fsShopGUID)}
        className="flex_lr_fs_fs slide_bar"
      >
        <CustomIcon type="shop" size="xs" />
        <span>{fullName}</span>
      </div>
    ));
    const { open } = this.props;
    return (
      <Drawer
        className="my-drawer"
        transitions={false}
        style={{
          minHeight: document.documentElement.clientHeight,
          zIndex: open ? '100' : 0,
          display: open ? 'inherit' : 'none',
        }}
        overlayStyle={{
          background: 'rgba(255, 255, 255, 0)',
        }}
        sidebar={slidebar}
        enableDragHandle
        contentStyle={{ color: '#fff', textAlign: 'center', paddingTop: 42 }}
        open={open}
        onOpenChange={this.props.onOpenChange}
      >
        1
      </Drawer>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
SlideBar.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};

/**
 * @param {boolean}  open 初始化是否打开slidebar
 * @param {object}  history 非路由组件，中的路由信息
 * @method onOpenChange 父组件传入改变slidebar的toggle
 */
SlideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  history: PropTypes.object,
  onOpenChange: PropTypes.func.isRequired,
};
SlideBar.defaultProps = {
  history: {},
};

export default SlideBar;
