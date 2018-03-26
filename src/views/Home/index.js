import React from 'react';
import { inject, observer } from 'mobx-react';
import { TabBar } from 'antd-mobile';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import CustomIcon from '@components/CustomIcon'; // eslint-disable-line
import SlideBar from './component/slideBar';
import { post } from '@util/http'; // eslint-disable-line
import ShopCard from '@homeView/ShopCard'; // eslint-disable-line
import GoodReceipt from '@goodReceiptView/GoodReceipt' // eslint-disable-line
import PurchaseOrder from '@goodReceiptView/PurchaseOrder'; // eslint-disable-line
import LibraryPost from '@libraryView/PurchaseOrder'; // eslint-disable-line
import Library from '@libraryView/Library' // eslint-disable-line
import Inventory from '@inventoryView/Inventory' // eslint-disable-line
import InventoryList from '@inventoryView/InventoryList'; // eslint-disable-line
import My from '@myView/My'// eslint-disable-line
import OrderGoods from '@homeView/OrderGoods'; // eslint-disable-line
import Classification from '@homeView/classification'; // eslint-disable-line
import Search from '@homeView/Search' // eslint-disable-line
import './assets/style.less';

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'goodOrder', // 选中的当前table
      open: false, // 分类的slidebar是否在打开状态
    };
  }
  componentDidMount() {
    post('wap/supplier/list', {}, {
      fsTreeItemType: 'Supplier',
      fsTreeItemId: '',
      pageNum: 1,
      pageSize: 1000,
    }).then(({ data }) => {
      this.props.puchaseStore.addFsSupplierList(data.colContent, 'fspauchaseList');
    });
  }
  // 点击分类的时候，对slidebar显示的值进行取反，这样就可以做成一个toggle效果
  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  renderContent = (pageText) => {
    console.log(2);
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <p><Link to="/home/shopCard">{pageText}</Link></p>
      </div>
    );
  }

  render() {
    const { open } = this.state;
    return (
      <div className="inner_body home">
        <div
          ref={(node) => { this.scrollnode = node; }}
          className="home_container"
        >
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#F04841"
            barTintColor="white"
          >
            <TabBar.Item
              title="订货"
              key="goodOrder"
              icon={<CustomIcon type="goodOrderNo" />
              }
              selectedIcon={<CustomIcon type="goodOrder" />
              }
              selected={this.state.selectedTab === 'goodOrder'}
              onPress={() => {
                this.setState({
                  selectedTab: 'goodOrder',
                });
              }}
              data-seed="logId"
            >
              <OrderGoods onOpenChange={this.onOpenChange} />
            </TabBar.Item>
            <TabBar.Item
              icon={
                <CustomIcon type="receiveOrderNo" />
              }
              selectedIcon={
                <CustomIcon type="receiveOrder" />
              }
              title="收货"
              key="receiveOrder"
              selected={this.state.selectedTab === 'receiveOrder'}
              onPress={() => {
                this.setState({
                  selectedTab: 'receiveOrder',
                });
              }}
              data-seed="logId1"
            >
              <GoodReceipt />
            </TabBar.Item>
            <TabBar.Item
              icon={
                <CustomIcon type="libraryNo" />
              }
              selectedIcon={
                <CustomIcon type="library" />
              }
              title="出库"
              key="library"
              selected={this.state.selectedTab === 'library'}
              onPress={() => {
                this.setState({
                  selectedTab: 'library',
                });
              }}
            >
              <Library />
            </TabBar.Item>
            <TabBar.Item
              icon={<CustomIcon type="inventoryNo" />}
              selectedIcon={<CustomIcon type="inventory" />}
              title="盘点"
              key="inventory"
              selected={this.state.selectedTab === 'inventory'}
              onPress={() => {
                this.setState({
                  selectedTab: 'inventory',
                });
              }}
            >
              <Inventory />
            </TabBar.Item>
            <TabBar.Item
              icon={<CustomIcon type="myNo" />}
              selectedIcon={<CustomIcon type="my" />}
              title="我的"
              key="my"
              selected={this.state.selectedTab === 'my'}
              onPress={() => {
                this.setState({
                  selectedTab: 'my',
                });
              }}
            >
              <My />
            </TabBar.Item>
          </TabBar>
        </div>
        <SlideBar
          open={open}
          onOpenChange={this.onOpenChange}
        />
        <Route path="/home/shopCard" component={ShopCard} />
        <Route path="/home/classification" component={Classification} />
        <Route path="/home/search" component={Search} />
        <Route path="/home/libraryPost" component={LibraryPost} />
        <Route path="/home/libraryOrder" component={PurchaseOrder} />
        <Route path="/home/inventoryList" component={InventoryList} />
      </div>
    );
  }
}


/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
Home.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};

export default Home;
