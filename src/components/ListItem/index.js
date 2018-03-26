import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

class ListItem extends React.Component {
  componentWillMount() {
    // will
  }
  render() {
    const {
      placeholder,
      value,
      onChange,
      type,
      title,
      textStyle,
      centerNode,
      disabled,
    } = this.props;
    return (
      <div className="flex_lr_sb_c list_item_comp">
        <span>{title}</span>
        {centerNode}
        {
          type === 'text'
            ?
              <span style={textStyle}>{value}</span>
            :
              <input
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onChange={(e) => { onChange(e.target.value); }}
              />
        }
      </div>
    );
  }
}

ListItem.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.string,
  textStyle: PropTypes.object,
  centerNode: PropTypes.node,
};

ListItem.defaultProps = {
  disabled: false,
  type: 'text',
  placeholder: '',
  onChange: () => { },
  textStyle: {},
  centerNode: null,
};


export default ListItem;
