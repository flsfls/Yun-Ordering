import React from 'react';
import { List } from 'antd-mobile';
import InfoList from './component/InfoList';
import MyImg from './assets/my.jpg';
import './assets/style.less';
import One from './assets/21@2x.png';
import Two from './assets/22@2x.png';
import Three from './assets/23@2x.png';
import Four from './assets/24@2x.png';
import Five from './assets/25@2x.png';
import Six from './assets/26@2x.png';
import Seven from './assets/27@2x.png';

const { Item } = List;

class My extends React.Component {
  componentDidMount() {
    // will do
  }
  render() {
    const data = [
      {
        title: '报表',
        list: [
          {
            img: One,
            text: '收发明细',
          },
          {
            img: Two,
            text: '品项余额',
          },
          {
            img: Three,
            text: '成本差异',
          },
          {
            img: Four,
            text: '采购排行',
          },
        ],
      },
      {
        title: '基础档案',
        list: [
          {
            img: Five,
            text: '我的物料',
          },
          {
            img: Six,
            text: '供应商',
          },
          {
            img: Seven,
            text: '菜品成本卡',
          },
        ],
      },
    ];
    return (
      <div className="my">
        <div className="my_info flex_lr_fs_c">
          <img src={MyImg} alt="" />
          <p>周志祥</p>
        </div>
        {data.map((item, index) => <InfoList item={item} key={index} />)}
        <List className="my-list">
          <Item arrow="horizontal" onClick={() => { }}>设置</Item>
          <Item extra="99+" arrow="horizontal" onClick={() => { }}>系统消息</Item>
        </List>
      </div>
    );
  }
}

export default My;
