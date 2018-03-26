import React from 'react';
import { Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import OrderList from './component/orderList';
import Scroll from './component/scroll';
import Header from './component/header'; // eslint-disable-line
import { post } from '@util/http'; // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class OrderGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 8, // 当前向后台发送时所取的数量值
      pageNum: 1, // 设置当前的页数
      showTip: false, // 是否显示是否正在加载中。。。
      endTip: false, // 是否显示已经没有更多数据
      hasMore: true, // 当滚动到底部时是否还可以继续向后台请求更多数据的一个阀门
    };
  }
  componentWillMount() {
    /**
     * @constant goodListStore localstorage中存储用户点击选中的物料
     * @method saveCacheStore 把缓存的物料放入mobx中的goodListStore中
     */
    // 先判断localstorage里有没有存的着的点好的物料数量，如果有的话
    if (localStorage.goodListStore) {
      // 把缓存的物料放入mobx中的goodListStore中
      const goodListStore = JSON.parse(localStorage.goodListStore);
      this.props.goodStore.saveCacheStore(goodListStore);
    }
  }

  componentDidMount() {
    // 初始化的时候先进行loading加载
    Toast.loading('加载数据中', 0, () => { }, false);
    // 向后台发送请求，加载数据
    this.getShopList();
  }

  getShopList = () => {
    const {
      pageSize, // 需要加载的页数
      pageNum, // 当前加载第几页
      hasMore, // 是否还需要继续加载
    } = this.state;
    const { goodStore } = this.props;
    // 防止加载到底部的时候多次加载，初始化为true,当为false则不进行请求
    if (!hasMore) return;
    // 一旦通过加载，则马上把hasMore设置为false,否则会形成重复请求
    this.setState({
      hasMore: false,
    });
    // 向后台发送请求
    post('wap/quickordergoods/materiel', {}, {
      fsTreeItemId: 'all', // 困定死
      pageSize,
      pageNum,
      fsTreeItemType: 'Material', // 困定死
    }).then(({ data }) => {
      // 关闭toast
      Toast.hide();
      // isHasMore是一个总输纽，当请求来的数据长度大于等于页数的长度，说明后台还有更多的数据，则返回true
      const isHasMore = data.colContent.length >= pageSize;
      // 通过addGoodList方法把请求来的数据放入的到mobx中的goodList中
      goodStore.addGoodList(data.colContent);
      this.setState({
        pageNum: pageNum + (isHasMore ? 1 : 0), // 如果有更多数据，则把页码加1
        hasMore: isHasMore, // 是否还可以继续加载能过isHasMore来进行判断
        // 是否显示加载中。。如果isHasMore为true,说明还有更多数据，可以显示继续加载
        showTip: isHasMore ? true : false, // eslint-disable-line
        // 是否已经加载完毕, 如果 isHasMore为true,说明还有更多数据，则不显示加载完毕
        endTip: isHasMore ? false : true, // eslint-disable-line
      });
    });
  }

  render() {
    const { showTip, endTip } = this.state;
    const { goodStore } = this.props;
    const { goodList } = goodStore;
    return (
      <div className="order_goods">
        <Header onOpenChange={this.props.onOpenChange} />
        <InfiniteScroll
          ref={(scrollnode) => { this.scrollnode = scrollnode; }}
          height="11.46rem"
          next={this.getShopList}
          hasMore={this.state.hasMore}
          loader={
            showTip ?
              <p className="noMore">
                <b>加载更多物料中...</b>
              </p> : null
          }
          endMessage={
            endTip ?
              <p className="noMore">
                <b>没有更多数据了</b>
              </p>
              : null
          }
        >
          <div className="flex_lr_sb_n orderGoods">
            {goodList.map((item, index) => (
              <OrderList
                index={index}
                item={item}
                key={item.get('fsMaterialGuId')}
              />
            ))}
          </div>
          <Scroll
            node={this.scrollnode}
          />
        </InfiniteScroll>
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
OrderGoods.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};
OrderGoods.propTypes = {
  onOpenChange: PropTypes.func.isRequired,
};
export default OrderGoods;
