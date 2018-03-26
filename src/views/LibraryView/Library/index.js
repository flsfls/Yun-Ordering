import React from 'react';
import EnterList from '@components/EnterList'; // eslint-disable-line
import One from './assets/07@2x.png';
import Two from './assets/08@2x.png';
import Three from './assets/09@2x.png';
import Four from './assets/10@2x.png';
import Five from './assets/11@2x.png';
import Six from './assets/06@2x.png';

class Library extends React.Component {
  componentDidMount() {
    // will
  }

  render() {
    const data = [
      {
        title: '收银出库',
        list: [{
          img: One,
          text: '自动出货',
        }],
      },
      {
        title: '领料出库',
        list: [
          {
            img: Two,
            text: '领料单',
            route: '/home/libraryPost/addPuchaseLibrary',
            status: '0',
            enterFlag: '6',
            location: 'picking',
          },
          {
            img: Three,
            text: '退料单',
            route: '/home/libraryPost/addPuchaseLibrary',
            status: '0',
            enterFlag: '7',
            location: 'picking',
          },
          {
            img: Four,
            text: '报损单',
          },
          {
            img: Five,
            text: '出库列表',
            route: '/home/libraryPost',
            location: 'picking',
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

export default Library;
