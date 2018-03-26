import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

class ThreeButton extends React.Component {
  componentDidMount() {
    // will
  }
  render() {
    const {
      textOne,
      textTwo,
      textThree,
      oneHandler,
      twoHandler,
      threeHandler,
    } = this.props;
    return (
      <div className="three_button flex_lr_fs_c">
        <div className="button" onClick={oneHandler}>{textOne}</div>
        <div className="button" onClick={twoHandler}>{textTwo}</div>
        <div className="button" onClick={threeHandler}>{textThree}</div>
      </div>
    );
  }
}

ThreeButton.propTypes = {
  textOne: PropTypes.string.isRequired,
  textTwo: PropTypes.string.isRequired,
  textThree: PropTypes.string.isRequired,
  oneHandler: PropTypes.func.isRequired,
  twoHandler: PropTypes.func.isRequired,
  threeHandler: PropTypes.func.isRequired,
};

export default ThreeButton;
