import React from 'react';
import { ActivityIndicator } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PropTypes from 'prop-types';
import Bscroll from 'better-scroll';
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import ClassfiItem from './component/classfiItem';
import Search from '@homeView/Search'; // eslint-disable-line
import { post } from '@util/http' // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class Classification extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  state = {
    currentIndex: 0, // 当前左侧选中的落到那一栏的下标
    animating: true, // loading 动画的显示开关
  }

  componentDidMount() {
    // 先取到从slidebar点击进入的存的shopid
    const { fsTreeItemId } = sessionStorage;
    // 通过shopId 向后台请求分类数据
    post('wap/quickordergoods/materiel', {}, {
      fsNodeCode: 'all', // 固定死
      fsTreeItemId,
      fsTreeItemType: 'Material', // 固定死
    }).then(({ data }) => {
      // 请求完毕之后把loading要关闭
      this.setState({
        animating: false,
      });
      // 把整合后的物料转化成分类组
      this.props.goodStore.addClassfiStore(data.colContent);
      // 计算每一个右边栏的分组的高度，然后添加到数组中
      this.calculateHeight();
      // 初始化的滚动设置
      this.initScroll();
    });
  }

  componentWillUnmount() {
    // 一旦组件销毁的时候要把滚动监听要销除，不然页面销毁，滚动元素在滚动中就会监听节点失败，而报错
    this.foodScroll.destroy();
    // 把ClassfiStore里的数据进行清除，因为下次入要重新组合数据，或者加载数据
    this.props.goodStore.cleanClassfiStore();
    // 返回到下拉加载主页面时，同时还是要比较数据，让下拉加载数据保持最新更改的数据
    this.props.goodStore.comparsionGoodList();
  }

  /**
   * @param index 左侧的侧栏下标
   * @constant foodList 右侧每个物料组的节点容器
   * @constant height 当前右侧确认那个物料组
   * @description 通过点击左侧的菜单把右侧滚动到对应的区域
   */
  selectMenu = (index) => {
    const foodList = this.food.getElementsByClassName('food-list-hook');
    const height = foodList[index];
    // 通过scrollToElement bscroll里抽内制方法，滚动到对应的物料组
    this.foodScroll.scrollToElement(height, 300);
  }

  initScroll = () => {
    // 左边菜单栏进行bscroll滚动
    this.meunScroll = new Bscroll(this.menu, {
      click: true,
      probeType: 3,
    });
    // 右边分组栏进行bscroll滚动
    this.foodScroll = new Bscroll(this.food, {
      click: true,
      probeType: 3,
    });
    // 右边分组栏进行滚动时人监听
    this.foodScroll.on('scroll', (pos) => {
      // 拿到y轴滚动的坐标
      this.scrollY = Math.abs(Math.round(pos.y));
      for (let i = 0; i < this.listHeight.length; i += 1) {
        const height1 = this.listHeight[i];
        const height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          const munelist = this.menu.getElementsByClassName('meun-list-hook');
          if (i > 3) {
            this.meunScroll.scrollToElement(munelist[i - 2], 300);
          } else {
            this.meunScroll.scrollToElement(munelist[0], 300);
          }
          this.setState({
            currentIndex: i,
          });
          return;
        }
      }
      this.setState({
        currentIndex: 0,
      });
    });
  }

  // 计算每一个右边栏的分组的高度，然后添加到数组中
  calculateHeight = () => {
    // 先声明一个高度空数组
    this.listHeight = [];
    // 整个右边栏的物料分类组的容器
    const foodList = this.food.getElementsByClassName('food-list-hook');
    // 声明一个高度
    let height = 0;
    // 首先向高度数组中添加一个初始高度 0
    this.listHeight.push(height);
    // 把容器里的每个组年节点
    for (let i = 0; i < foodList.length; i += 1) {
      const item = foodList[i];
      // 这样可以得知每一个组的离顶部的高度
      height += item.clientHeight;
      // 然后一一向高度数组中添加
      this.listHeight.push(height);
    }
  }
  // pathname: "/home/classification/search",
  searchDom = () => (
    <Link key="first" to={{ pathname: '/home/classification/search', state: { hasPguid: true } }}>
      <span className="right_bar my_search_bar">
        搜索
      </span>
    </Link>
  )

  render() {
    const { classfiStore } = this.props.goodStore;
    const meunList = classfiStore.toJS().map(({ fsTreeName, fsTreeCode }) => ({
      fsTreeCode,
      fsTreeName,
    }));
    const { currentIndex } = this.state;
    return (
      <div className="inner_body classification ">
        <ActivityIndicator
          toast
          text="Loading..."
          animating={this.state.animating}
        />
        <HomeNavBar
          title="商品分类"
          path="/home"
          right={this.searchDom()}
        />
        <div className="menu_wrap" ref={(menu) => { this.menu = menu; }}>
          <ul>
            {
              meunList.map(({ fsTreeCode, fsTreeName }, index) => (
                <li
                  key={fsTreeCode}
                  className="meun-list-hook"
                  onClick={() => this.selectMenu(index)}
                  style={{
                    background: index === currentIndex ? '#fff' : '#FAFAFA',
                    borderLeft: index === currentIndex ? '3px solid #FF6050' : '0 solid #FF6050',
                    borderRight: index === currentIndex ? '1px solid #fff' : '0 solid #FF6050',
                  }}
                >
                  <span>{fsTreeName}</span>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="foods_wrap" ref={(food) => { this.food = food; }}>
          <ul>
            {
              classfiStore.map((item, outIndex) => (
                <li className="warp_li food-list-hook" key={item.get('fsTreeCode')} >
                  <p className="classfi_name">{item.get('fsTreeName')}</p>
                  <ul className="classfi_item_box">
                    {item.get('material').map((material, innerIndex) => (
                      <div key={material.get('fsMaterialGuId')}>
                        <ClassfiItem
                          material={material}
                          outIndex={outIndex}
                          innerIndex={innerIndex}
                        />
                      </div>
                    ))}
                  </ul>
                </li>
              ))
            }
          </ul>
        </div>
        <Route path="/home/classification/search" component={Search} />
      </div>
    );
  }
}
/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
Classification.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};

export default Classification;
