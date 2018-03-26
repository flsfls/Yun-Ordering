import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import './style.less';

@withRouter
class ARButton extends React.Component {
  componentDidMount() {
    // will did
  }
  render() {
    const {
      addFunc,
      reduceFunc,
      count,
    } = this.props;
    return (
      <div className="flex_lr_fe_c arbutton">
        {
          count > 0 ?
            [
              <CustomIcon type="reduce" key="reduce" onClick={reduceFunc} />,
              <span key="count" >{count}</span>,
            ]
            :
            null
        }
        <CustomIcon
          type="add"
          onClick={addFunc}
        />
      </div>
    );
  }
}

/**
 * // 传入的props参数
 * @param {number} count 物料的数量
 * @param {func} addFunc 添加物料的操作，执行的函数
 * @param {func} reduceFunc 减去物料操作，执行的函数
 */
ARButton.propTypes = {
  count: PropTypes.number.isRequired,
  addFunc: PropTypes.func.isRequired,
  reduceFunc: PropTypes.func.isRequired,
};

export default ARButton;
