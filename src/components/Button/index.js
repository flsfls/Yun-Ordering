import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

class Buttons extends React.Component {
  componentDidMount() {
    // will
  }
  render() {
    const {
      text,
      style,
    } = this.props;
    return (
      <div className="my_button" style={style}>{text}</div>
    );
  }
}

Buttons.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

Buttons.defaultProps = {
  style: { },
};
export default Buttons;
