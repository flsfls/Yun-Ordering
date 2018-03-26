import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';
import './style.less';


class OrderGoodList extends React.Component {
  componentWillUnmount() {
    // will
  }
  render() {
    const {
      enterFlag,
      status,
    } = sessionStorage;
    const {
      fsMaterialName,
      fsModelno,
      fsOrderUnitName,
      fdQty,
      fdQtyMust,
      fdPrice,
    } = this.props.item.toJS();
    const twoInput = enterFlag === '1' || enterFlag === '2' ? true : false; // eslint-disable-line
    const inputDisabled = status === '2' ||  status === '9' || status === '3' ? true : false; // eslint-disable-line
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
              {
                twoInput
                  ?
                    <div className="flex_tb_fs_fe">
                      <div className="flex_lr_fs_c">
                        <input
                          disabled={inputDisabled}
                          placeholder="数量"
                          onChange={(e) => { this.props.onChange(e, 'fdQty'); }}
                          value={fdQty || ''}
                        />
                        <span className="kg">{fsOrderUnitName}</span>
                      </div>
                      <div className="flex_lr_fs_c">
                        ¥<input
                          disabled={inputDisabled}
                          placeholder="单价"
                          value={fdPrice || ''}
                          onChange={(e) => { this.props.onChange(e, 'fdPrice'); }}
                        />
                        <span className="kg">{fsOrderUnitName}</span>
                      </div>
                    </div>
                  :
                    <div className="flex_lr_fs_c">
                      ¥<input
                        style={{ color: this.props.color }}
                        disabled={inputDisabled}
                        placeholder="入库数量"
                        value={fdQtyMust || ''}
                        onChange={(e) => { this.props.onChange(e, 'fdQtyMust'); }}
                      />
                      <span className="kg">{fsOrderUnitName}</span>
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
