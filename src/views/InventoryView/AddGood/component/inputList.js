import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';


class OrderGoodList extends React.Component {
  componentWillUnmount() {
    // will
  }
  render() {
    const {
      fsMaterialName,
      fsModelno,
      fsUnitName,
      fdDiffQty,
      fdCheckQty,
    } = this.props.item.toJS();
    return (
      <div className="order_good_list">
        <div className="flex_lr_sb_c">
          <div className="flex_lr_fs_fs">
            <div className="flex_tb_fs_fs">
              <span className="good">{fsMaterialName}</span>
              <span className="util">{fsModelno}</span>
            </div>
          </div>
          <div className="flex_lr_fs_c">
            <div className="flex_tb_fs_fe">
              <div className="flex_lr_fs_c">
                <input
                  style={{ color: this.props.color }}
                  placeholder="盘点数量"
                  value={fdCheckQty}
                  onChange={e => this.props.onChange(e)}
                />
                <span className="kg">{fsUnitName}</span>
              </div>
              {
                fdCheckQty == 0 // eslint-disable-line
                  ?
                  null
                  :
                  <div>
                    <span>差异</span>
                    <span>{fdDiffQty}</span>
                  </div>
              }
            </div>
            <Icon type="right" size="lg" color="#C5C5C5" />
          </div>
        </div>
      </div>
    );
  }
}

OrderGoodList.propTypes = {
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

OrderGoodList.defaultProps = {
  color: '#333333',
};

export default OrderGoodList;
