import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd-mobile';
import './style.less';

class DatePickerComponent extends React.Component {
  componentDidMount() {
    // will
  }
  render() {
    const {
      title,
      pickerTitle,
      time,
      disabled,
    } = this.props;
    const OrderDate = ({ extra, onClick }) => (
      <div onClick={onClick} className="flex_lr_sb_c date_pick_comp">
        <span>{title}</span>
        <span className="extra">{extra}</span>
      </div>
    );
    return (
      <DatePicker
        disabled={disabled}
        mode="date"
        title={pickerTitle}
        value={time}
        onChange={time => this.props.onChange(time)}
      >
        <OrderDate />
      </DatePicker>
    );
  }
}

DatePickerComponent.propTypes = {
  disabled: PropTypes.bool,
  pickerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};
DatePickerComponent.defaultProps = {
  disabled: false,
};
export default DatePickerComponent;
