import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import ChooseGoodN from '../ChooseGoodN';
import { post } from '@util/http'; // eslint-disable-line
import NavBar from '@components/NavBar'; // eslint-disable-line
import GoodClassfi from '@components/GoodClassfi'; // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class ChooseGood extends React.Component {
  componentDidMount() {
    post('wap/quickordergoods/index', {}, {}).then(({ data }) => {
      data.forEach((item) => {
        if (item.fsTreeItemId === '30') {
          this.props.puchaseStore.addGoodClassfi(item.data);
        }
      });
    });
  }
  render() {
    return (
      <div className="chooseGood inner_body">
        <NavBar
          title="选择品项"
        />
        <GoodClassfi
          list={this.props.puchaseStore.goodClassfi.toJS()}
          jump="one"
        />
        <Route
          component={ChooseGoodN}
          path="/home/libraryPost/addPuchaseLibrary/addGood/chooseGood/chooseGoodN"
        />
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
ChooseGood.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};

export default ChooseGood;
