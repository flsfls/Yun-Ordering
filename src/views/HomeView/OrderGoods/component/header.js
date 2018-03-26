import React from 'react';
import PropTypes from 'prop-types';
import CustomIcon from '@components/CustomIcon'  // eslint-disable-line
import { Link, withRouter } from 'react-router-dom';

@withRouter
class Header extends React.Component {
  /**
   * @method onOpenChange 父组件中改变点击分类显示slidebar的方法
   */
  goclassification = () => {
    this.props.onOpenChange();
  }

  render() {
    return (
      <header className="flex_lr_sb_c nav_bar">
        <div className="flex_tb_sb_c" onClick={this.goclassification}>
          <CustomIcon size="sm" type="another" />
          <span className="icon_text">分类</span>
        </div>
        <Link to={{ pathname: '/home/search', state: { hasPguid: false } }}>
          <div className="center">
            <div className="flex_lr_fs_c search_box">
              <CustomIcon size="xxs" type="searchs" />
              <input placeholder="搜索商品" type="text" />
            </div>
          </div>
        </Link>
        <Link to="/home/shopCard" style={{ height: '100%' }}>
          <div className="flex_tb_sb_c right">
            <CustomIcon size="sm" type="card" />
            <span className="icon_text">购物车</span>
          </div>
        </Link>
      </header>
    );
  }
}

Header.propTypes = {
  onOpenChange: PropTypes.func.isRequired,
};
// const aa = inject(stores => (
//   { number: stores.goodStore.number }
// ))(observer(Header));

export default Header;
