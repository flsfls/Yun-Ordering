import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { post, get } from '@util/http'; // eslint-disable-line
import addInventory from '@inventoryView/AddInventory'; // eslint-disable-line
import OrderNavBar from '@components/OrderNavBar'; // eslint-disable-line
import SlideBar from './component/slideBar'; // eslint-disable-line
import ListItem from '@components/ListItem'; // eslint-disable-line
import './assets/style.less';


@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class InventoryList extends React.Component {
  state = {
    keyWord: '', // 搜索的值
    open: false,
    pageSize: 30, // 当前向后台发送时所取的数量值
    pageNum: 1, // 设置当前的页数
    showTip: false, // 是否显示是否正在加载中。。。
    endTip: false, // 是否显示已经没有更多数据
    hasMore: true, // 当滚动到底部时是否还可以继续向后台请求更多数据的一个阀门
  }
  // fiId 采购订单的唯一id
  // fdPurchaseMoneyAmt 不函税
  // fiBillStatus 1 代表已提交 0 未提交
  // fiSaleClose 1 代表代确认 2 已拒绝  4 已确认
  // 已提交并且已确认才有确认入库
  componentDidMount() {
    const { pageNum, pageSize } = this.state;
    // 请求地址的标识不同
    this.location = sessionStorage.location;
    this.time = this.throttle(this.getOrderList, 300);
    this.props.puchaseStore.clearFsSupplierList();
    this.getOrderList('noClear', { pageNum, pageSize });
  }

  onOpenChange = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  getOrderList = (flag, data) => {
    if (flag === 'clear') {
      this.setState({
        pageNum: 1,
        hasMore: true,
      });
      this.props.puchaseStore.clearFsSupplierList();
    }
    const {
      pageSize, // 需要加载的页数
      pageNum, // 当前加载第几页
      hasMore, // 是否还需要继续加载
    } = this.state;
    // 防止加载到底部的时候多次加载，初始化为true,当为false则不进行请求
    if (!hasMore) return;
    // 一旦通过加载，则马上把hasMore设置为false,否则会形成重复请求
    this.setState({
      hasMore: false,
    });
    // 向后台发送请求
    post('wap/invbackup/list', {}, { ...data }).then(({ data }) => {
      this.props.puchaseStore.addPuchaseOrderList(data.colContent);
      // isHasMore是一个总输纽，当请求来的数据长度大于等于页数的长度，说明后台还有更多的数据，则返回true
      const isHasMore = data.colContent.length >= pageSize;
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

  searchPuchaseStore = (keyWord) => {
    this.setState({
      keyWord,
      pageNum: 1,
    }, () => {
      const { keyWord, pageSize, pageNum } = this.state;
      this.time('clear', {
        keyWord,
        pageSize,
        pageNum,
      });
    });
  }

  throttle = (func, wait) => {
    let time;
    function timer(flag, data) {
      clearTimeout(time);
      time = setTimeout(() => {
        func(flag, data);
      }, wait);
    }
    return timer;
  }

  // 点击顶部 + 号入新增订单页
  addChange = () => {
    this.props.history.push({
      pathname: '/home/inventoryList/addInventory',
    });
  }
  listHandler = (fsCheckNo) => {
    get('wap/invbackup/show', { fsCheckNo }).then(({ data }) => {
      data.invbackupDtl = data.invbackupDtl.colContent;
      sessionStorage.inventorySave = JSON.stringify(data);
      this.props.history.replace({
        pathname: '/home/inventoryList/addInventory/inventoryDetail',
      });
    });
  }
  render() {
    const {
      showTip,
      hasMore,
      endTip,
      keyWord,
      pageNum,
      pageSize,
    } = this.state;
    const { puchaseOrderList } = this.props.puchaseStore;
    return (
      <div className="purchaseOrder inner_body">
        <OrderNavBar
          onOpenChange={this.onOpenChange}
          addChange={this.addChange}
          placeholder="供应商 单号 单据日期"
          onChange={this.searchPuchaseStore}
          value={keyWord}
        />
        <div>
          <InfiniteScroll
            height="12.44rem"
            next={() => this.getOrderList('noClear', { pageNum, pageSize })}
            hasMore={hasMore}
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
            {
              puchaseOrderList.size === 0
                ?
                  null
                :
                  <div>
                    {
                      puchaseOrderList.toJS().map(({
                        fsCheckDate,
                        fsCheckNo,
                        fsStorageName,
                      }, index) => (
                        <div
                          style={{ marginTop: '.2rem' }}
                          onClick={() => this.listHandler(fsCheckNo)}
                          key={index}
                        >
                          <ListItem
                            title={fsCheckDate}
                            type="text"
                            value={`${fsStorageName}盘点`}
                          />
                        </div>
                      ))
                    }
                  </div>
            }
          </InfiniteScroll>

        </div>
        <SlideBar
          open={this.state.open}
          onOpenChange={this.onOpenChange}
          getOrderList={this.getOrderList}
        />
        <Route path="/home/inventoryList/addInventory" component={addInventory} />
      </div>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
InventoryList.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};
InventoryList.propTypes = {
  history: PropTypes.object.isRequired,
};
export default InventoryList;

