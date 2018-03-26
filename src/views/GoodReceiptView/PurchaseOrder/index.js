import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { ActionSheet } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
/* eslint-disable */
import { post } from '@util/http';
import AddPuchaseLibrary from '@goodReceiptView/AddPuchaseLibrary'; // eslint-disable-line
import OrderNavBar from '@components/OrderNavBar';
import OrderList from '@components/OrderList';
import SlideBar from './component/slideBar';
/* eslint-disable */
import './assets/style.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class PruchaseOrder extends React.Component {
  state = {
    keyWord: '', // 搜索的值
    open: false,
    pageSize: 8, // 当前向后台发送时所取的数量值
    pageNum: 1, // 设置当前的页数
    showTip: false, // 是否显示是否正在加载中。。。
    endTip: false, // 是否显示已经没有更多数据
    hasMore: true, // 当滚动到底部时是否还可以继续向后台请求更多数据的一个阀门
  }
  // fiId 采购订单的唯一id
  // fsSupplierName 供就商 fsPurchaseGUID 网上订单号 fsArrivalDate 到货日期 fdPurchaseTotAmt 加税合计 fdPurchaseTaxAmt 税额
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
    post(`wap/${this.location}/list`, {}, { ...data }).then(({ data }) => {
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

  showActionSheet = () => {
    const BUTTONS = ['采购入库', '采购退货', '取消'];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        maskClosable: true,
        'data-seed': 'logId',
        wrapProps,
      },
      (buttonIndex) => {
        // 把状态单据状态都设为0
        sessionStorage.status = '0'
        // 如果是采购入库单的话
        if (buttonIndex === 0) {
          // 把入品标识设置为3
          sessionStorage.enterFlag = '3';
          this.addBefore({ fiBillKind: 1 }, 3);
          // 如果是采购退货单的话
        } else if (buttonIndex === 1) {
          // 把入品标识设置为4
          sessionStorage.enterFlag = '4';
          this.addBefore({ fiBillKind: 2 });
        }
      },
    );
  }

  addBefore = (data, enterFlag) => {
    return post(`wap/${this.location}/beforeAdd`, data, {}).then(({data}) => {
      delete data.purchasedtlList;
      delete data.stockdtlList;
      const { cOrder, pOrder } = sessionStorage;
      if (enterFlag === 1 && cOrder) {
        data = Object.assign({}, data, JSON.parse(cOrder));
      } else if (enterFlag === 3 && pOrder) {
        data = Object.assign({}, data, JSON.parse(pOrder));
      }
      sessionStorage.chooseOrder = JSON.stringify(data);
      this.props.history.push({pathname: '/home/libraryOrder/addPuchaseLibrary'});
    })
  }

  // 点击顶部 + 号入新增订单页
  addChange = () => {
    const location = this.location
    sessionStorage.orderIndex = '0';
    // 如果是采购订单进入的话，标识入口为1
    if (location === 'purchase') {
      sessionStorage.enterFlag = '1' // 采购订单新增入口
      sessionStorage.status = '0' // 把状态单据状态都设为0
      this.addBefore({}, 1);
    } else {
      // 如果是采入库列表进入的话
      this.showActionSheet()
    }
  }
  listItemHandler = (fiId, orderItem, index) => {
    let {
      fiBillKind, // 是入库还是退货
      fiBillStatus, // 单据状态
    } = orderItem;
    post(`wap/${this.location}/beforeAdd`, {fiId, fiBillKind}).then(({ data }) => {
      // 如果采购订单列表进入的话,标识为2
      if (this.location === 'purchase') {
        sessionStorage.enterFlag = '2';
        sessionStorage.enterMaterial = JSON.stringify(data.purchasedtlList.colContent);
        delete data.purchasedtlList;
        if (fiBillStatus === 0) {
          sessionStorage.status = '1'
        } else if (fiBillStatus === 1) {
          sessionStorage.status = '2'
        } else if (fiBillStatus === 9) {
          sessionStorage.status = '9';
        }
      // 如果是采购入库列表进入的话，标中为5
      } else {
        if (fiBillStatus === 0) {
          sessionStorage.status = '1'
        } else if (fiBillStatus === 1) {
          sessionStorage.status = '3'
        }
        const chooseMaterial = data.stockdtlList.colContent.map((item) => {
          const {
            fsUnitIdSelected,
            fsUnitId,
            fsUnitName,
            fsOrderUnitId,
            fsOrderUnitName,
            fsSaleUnitId,
            fsSaleUnitName,
          } = item;
          item.fdIncomeRate = item.fdTaxRate;
          if (fsUnitIdSelected === fsUnitId) {
            item.fsOrderUnitName = fsUnitName;
          } else if (fsUnitIdSelected === fsOrderUnitId) {
            item.fsOrderUnitName = fsOrderUnitName;
          } else if (fsUnitIdSelected === fsSaleUnitId) {
            item.fsOrderUnitName = fsSaleUnitName;
          }
          return item;
        });
        sessionStorage.enterMaterial = JSON.stringify(chooseMaterial);
        delete data.stockdtlList;
        sessionStorage.enterFlag = '5';
      }

      sessionStorage.chooseOrder = JSON.stringify(data);


      // 保存当前选中单据当前的下标
      sessionStorage.orderIndex = index;

      this.props.history.push({pathname: '/home/libraryOrder/addPuchaseLibrary'});
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
                puchaseOrderList.toJS().map((item, index) => (
                  <OrderList
                    orderItem={item}
                    key={item.fiId}
                    click={(fiId, orderItem) => this.listItemHandler(fiId, orderItem, index)}
                  />
                ))

            }
          </InfiniteScroll>

        </div>
        <SlideBar
          open={this.state.open}
          onOpenChange={this.onOpenChange}
          getOrderList={this.getOrderList}
        />
        <Route path="/home/libraryOrder/addPuchaseLibrary" component={AddPuchaseLibrary} />
      </div>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
PruchaseOrder.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};
export default PruchaseOrder;

