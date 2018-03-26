import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { post } from '@util/http'; // eslint-disable-line
import EnterList from '@components/EnterList'; // eslint-disable-line
import One from './assets/01@2x.png';
import Two from './assets/02@2x.png';
import Three from './assets/03@2x.png';
import Four from './assets/04@2x.png';
import Five from './assets/05@2x.png';
import Six from './assets/06@2x.png';

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class GoodReceipt extends React.Component {
  componentDidMount() {
    post('wap/warehouse/selectList', {}, {}).then(({ data }) => {
      const warehouse = data.colContent.map(({ fsStorageName, fsStorageId }) => ({
        value: fsStorageId,
        label: fsStorageName,
      }));
      this.props.puchaseStore.addWareHouse(warehouse);
    });
  }

  render() {
    const data = [
      {
        title: '购管理',
        list: [
          {
            img: One,
            text: '自采订单',
            route: '/home/libraryOrder/addPuchaseLibrary',
            status: '0',
            enterFlag: '1',
            location: 'purchase',
          },
          {
            img: Two,
            text: '采购订单',
            route: '/home/libraryOrder',
            location: 'purchase',
          },
        ],
      },
      {
        title: '入库管理',
        list: [
          {
            img: Three,
            text: '采购入库单',
            route: '/home/libraryOrder/addPuchaseLibrary',
            location: 'stock',
            enterFlag: '3',
            status: '0',
          },
          {
            img: Four,
            text: '采购退货单',
            route: '/home/libraryOrder/addPuchaseLibrary',
            location: 'stock',
            enterFlag: '4',
            status: '0',
          },
          {
            img: Five,
            route: '/home/libraryOrder',
            text: '入库列表',
            location: 'stock',
          },
          {
            img: '',
            text: '暂无资料',
          },
          {
            img: '',
            text: '暂无资料',
          },
          {
            img: '',
            text: '暂无资料',
          },
          {
            img: '',
            text: '暂无资料',
          },
          {
            img: Six,
            text: '即时库存',
          },
        ],
      },
    ];
    return (
      <div>
        {data.map((item, index) => <EnterList item={item} index={index} key={index} />)}
      </div>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
GoodReceipt.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};
export default GoodReceipt;

