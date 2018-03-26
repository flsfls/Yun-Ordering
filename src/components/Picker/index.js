import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'antd-mobile';
import './style.less';

class PickerComponent extends React.Component {
  componentDidMount() {
    // will
  }

  transFormOnChange = (v) => {
    const { select } = this.props;
    const value = v[0];
    for (let i = 0; i < select.length; i += 1) {
      if (select[i].value === value) {
        const { label } = select[i];
        this.props.onChange({ value, label }, v);
        break;
      }
    }
  }
  render() {
    const {
      value,
      select,
      title,
      disabled,
    } = this.props;
    const OrderDate = ({ left, extra, onClick }) => (
      <div onClick={onClick} className="picker_item">
        <div className="flex_lr_sb_c extra">
          <span>{left}</span>
          <span className="item">{extra}</span>
        </div>
      </div>
    );
    return (
      <Picker
        disabled={disabled}
        value={value}
        onChange={v => this.transFormOnChange(v)}
        title={title}
        cols={1}
        data={select}
        className="forss"
      >
        <OrderDate left={title} />
      </Picker>
    );
  }
}

PickerComponent.propTypes = {
  disabled: PropTypes.bool,
  // 当前select的默认值
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  // 当点击选中后改变的事件
  onChange: PropTypes.func.isRequired,
  // slect的列表数据
  select: PropTypes.array,
  // list和picker同用的title
  title: PropTypes.string.isRequired,
};
PickerComponent.defaultProps = {
  select: [],
  disabled: false,
};

export default PickerComponent;
