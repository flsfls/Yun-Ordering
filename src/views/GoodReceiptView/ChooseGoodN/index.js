import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import ChooseGoodItem from '../ChooseGoodItem';
import NavBar from '@components/NavBar'; // eslint-disable-line
import GoodClassfi from '@components/GoodClassfi'; // eslint-disable-line

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class ChooseGoodN extends React.Component {
  componentWillMount() {
    this.index = sessionStorage.GoodClassfiIndex;
  }
  render() {
    const list = this.props.puchaseStore.goodClassfi;
    const title = list.getIn([this.index, 'label']);
    const goodClassfititle = title ? `全部分类>${title}` : '';
    const goodClassfilist = list.size === 0 ? [] : list.getIn([this.index, 'children']).toJS();
    return (
      <div className="chooseGood inner_body">
        <NavBar
          title="选择品项"
        />
        <GoodClassfi
          title={goodClassfititle}
          list={goodClassfilist}
          jump="two"
        />
        <Route
          path="/home/libraryOrder/addPuchaseLibrary/addGood/chooseGood/chooseGoodN/chooseGoodItem"
          component={ChooseGoodItem}
        />
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
ChooseGoodN.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};

export default ChooseGoodN;
