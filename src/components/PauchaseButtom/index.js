import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

class ComfirmButton extends React.Component {
  componentDidMount() {
    // will
  }
  render() {
    const {
      first,
      second,
      third,
      firstHandler,
      secondHandler,
      thirdHandler,
    } = this.props;
    return (
      <ul className="pauchase_button">
        <li onClick={firstHandler}>{first}</li>
        <li onClick={secondHandler}>{second}</li>
        <li onClick={thirdHandler}>{third}</li>
      </ul>
    );
  }
}

ComfirmButton.propTypes = {
  first: PropTypes.string.isRequired,
  second: PropTypes.string.isRequired,
  third: PropTypes.string.isRequired,
  firstHandler: PropTypes.func.isRequired,
  secondHandler: PropTypes.func.isRequired,
  thirdHandler: PropTypes.func.isRequired,
};

export default ComfirmButton;
