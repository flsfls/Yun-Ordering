import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import CustomIcon from '@components/CustomIcon'  // eslint-disable-line

@withRouter @inject(store => ({
  goodStore: store.goodStore,
})) @observer
class SearchHeader extends React.Component {
  // 让搜索输入框进入页面自动获取焦点
  componentDidMount() {
    this.autoFocusInst.focus();
  }
  // 返回到上个页面
  gofanhui = () => {
    this.props.history.goBack();
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <div className="search_top flex_lr_sb_c">
        <div className="search_box">
          <div className="flex_lr_fs_c">
            <CustomIcon size="xxs" type="searchs" />
            <input
              placeholder="搜索商品"
              ref={(node) => { this.autoFocusInst = node; }}
              value={value}
              onChange={e => onChange(e.target.value)}
              type="search"
            />
          </div>
        </div>
        <div className="cancel" onClick={this.gofanhui}>
          取消
        </div>
      </div>
    );
  }
}

/**
  * @param  value 输入框的值
  * @param  onChange 改变输入框的值
  * @param  history 路由源信息
  */
SearchHeader.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  history: PropTypes.object,
};

SearchHeader.defaultProps = {
  history: {},
};

export default SearchHeader;
