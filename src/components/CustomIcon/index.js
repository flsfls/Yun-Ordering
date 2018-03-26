import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd-mobile';

const CustomIcon = ({
  type,
  className,
  size,
  ...restProps
}) => {
  type = require(`./svg/${type}.svg`); // eslint-disable-line
  if (!type) {
    return <Icon type={type} className={className} size={size} {...restProps} />;
  }
  const cls = classNames('am-icon', `am-icon-${type.default.id}`, `am-icon-${size}`, className);
  return (
    <svg className={cls} {...restProps} >
      <use xlinkHref={`#${type.default.id}`} />
    </svg>
  );
};

CustomIcon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
};

CustomIcon.defaultProps = {
  type: '',
  className: '',
  size: 'md',
};

export default CustomIcon;
