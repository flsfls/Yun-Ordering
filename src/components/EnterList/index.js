import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { post } from '@util/http'; // eslint-disable-line
import './assets/style.less';

@withRouter
class EnterList extends React.Component {
  componentDidMount() {
    // will
  }
  router = (route, location, enterFlag, status, text) => {
    // 保存不同入口的请求地址
    sessionStorage.location = location;
    sessionStorage.enterFlag = enterFlag;
    sessionStorage.status = status;
    if (text === '采购入库单') {
      const fiBillKind = 1;
      this.addBefore(route, location, { fiBillKind }, 3);
      return;
    } else if (text === '采购退货单') {
      const fiBillKind = 2;
      this.addBefore(route, location, { fiBillKind });
      return;
    } else if (text === '自采订单') {
      this.addBefore(route, location, {}, 1);
      return;
    } else if (text === '领料单') {
      const fiBillKind = 1;
      this.addBefore(route, location, { fiBillKind }, 6);
      return;
    } else if (text === '退料单') {
      const fiBillKind = 2;
      this.addBefore(route, location, { fiBillKind });
      return;
    }
    this.props.history.push({
      pathname: route,
    });
  }

  addBefore = (route, location, data, enterFlag) => {
    post(`wap/${location}/beforeAdd`, data, {}).then(({ data }) => {
      delete data.purchasedtlList;
      delete data.stockdtlList;
      delete data.pickingdtlList;
      const { cOrder, pOrder, getOrder } = sessionStorage;
      if (enterFlag === 1 && cOrder) {
        data = Object.assign({}, data, JSON.parse(cOrder));
      } else if (enterFlag === 3 && pOrder) {
        data = Object.assign({}, data, JSON.parse(pOrder));
      } else if (enterFlag === 6 && getOrder) {
        data = Object.assign({}, data, JSON.parse(getOrder));
      }
      sessionStorage.chooseOrder = JSON.stringify(data);
      this.props.history.push({
        pathname: route,
      });
    });
  }

  render() {
    const { item } = this.props;
    const { title, list } = item;
    return (
      <div className="enter_list">
        <p className="title">{title}</p>
        <ul className="list_item">
          {list.map(({
            img,
            text,
            route,
            location,
            enterFlag,
            status,
          }, index) => (
            <li
              key={index}
              style={{ height: '100%' }}
              className="flex_tb_sb_c"
              onClick={() => this.router(route, location, enterFlag, status, text)}
            >
              {
                img === '' ? <span className="img" /> : <img src={img} alt="" />
              }
              <span className="text">{text}</span>
            </li>
            ))}
        </ul>
      </div>
    );
  }
}

EnterList.propTypes = {
  item: PropTypes.object.isRequired,
  history: PropTypes.object,
};

EnterList.defaultProps = {
  history: {},
};

export default EnterList;
