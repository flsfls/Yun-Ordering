import React from 'react';
import EnterList from '@components/EnterList'; // eslint-disable-line
import One from './assets/12@2x.png';
import Two from './assets/13@2x.png';
import Three from './assets/14@2x.png';
import Four from './assets/15@2x.png';
import Six from './assets/06@2x.png';

class Inventory extends React.Component {
  componentDidMount() {
    // will
  }

  render() {
    const data = [
      {
        title: '盘点管理',
        list: [
          {
            img: One,
            text: '新增盘点',
          },
          {
            img: Two,
            text: '盘点列表',
            route: '/home/inventoryList',
            location: 'invbackup',
          },
          {
            img: Three,
            text: '盘盈单',
          },
          {
            img: Four,
            text: '盘亏单',
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
        {data.map((item, index) => <EnterList item={item} key={index} />)}
      </div>
    );
  }
}

export default Inventory;

