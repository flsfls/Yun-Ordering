import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchHeader from './component/searchHeader';
import { post } from '@util/http';  // eslint-disable-line
import SearchList from './component/searchList';
import HomeNavBar from '@components/NavBar';  // eslint-disable-line
import './assets/style.less';


@inject(store => ({
  goodStore: store.goodStore,
})) @observer
class Search extends React.Component {
  state = {
    value: '', // 当前搜索的值
    pageSize: 10, // 请求的数量
    pageNum: 1, // 当前请求的页数
    showTip: false, // 是否显示还有加载的提示
    endTip: false, // 是否加载完毕提示
    hasMore: true, // 是否加载完毕的阀门
  }

  componentDidMount() {
    // 是否是从分类里进行搜索的标识
    this.hasPugid = this.props.location.state.hasPguid;
    // 进行行一初始化的请求节流，一个闭包函数
    this.time = this.throttle(() => this.getFetchList('init'), 300);
    // 清除所有有searchStore中的数据
    this.props.goodStore.cleanSearchStore();
  }

  componentWillUnmount() {
    this.props.goodStore.comparsionGoodList();
  }

  /**
   * @param value 搜索的数据
   * @description 当改变搜索的时候进行向后台调用值
   */
  onChange = (value) => {
    // 改变搜索的时候，把值改变，页码变成1，是否加载完毕的阀门设为true
    this.setState({
      value,
      pageNum: 1,
      hasMore: true,
    }, () => {
      // 然后向后台调用接口
      this.time();
    });
  }
  /**
   * @param flag 是否清除SearchStore的数据的标识
   */
  getFetchList = (flag) => {
    const {
      pageSize, // 请求的数量
      pageNum, // 当前请求的页数
      value, // 当前搜索的值
      hasMore, // 是否加载完毕的阀门
    } = this.state;
    // 防止加载到底部的时候多次加载，初始化为true,当为false则不进行请求
    if (!hasMore) return;
    // 一旦通过加载，则马上把hasMore设置为false,否则会形成重复请求
    this.setState({
      hasMore: false,
    });
    // 如果是从分类搜索的标识的话，取sessionStorage.fsShopGUID 否则为 ‘’
    const fsShopGUID = this.hasPugid ? sessionStorage.fsShopGUID : '';
    // 向后台发送请求
    post('wap/quickordergoods/materiel', {}, {
      fsNodeCode: 'all',
      fsTreeItemId: '33',
      fsTreeItemType: 'Material',
      fsShopGUID,
      keyWord: value,
      pageSize,
      pageNum,
    }).then(({ data }) => {
      // 如果是flag是init说明是重新搜索了
      if (flag === 'init') {
        // 要清除所有有searchStore中的数据
        this.props.goodStore.cleanSearchStore();
      }
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
      // 把请求来的数据比对后再添入SearchStore中
      this.props.goodStore.addSearchStore(data.colContent);
    });
  }

  // 下拉加载的时候请求数据
  getSearchList = () => {
    this.getFetchList();
  }

  throttle = (func, wait) => {
    let time;
    function timer() {
      clearTimeout(time);
      time = setTimeout(() => {
        func();
      }, wait);
    }
    return timer;
  }

  render() {
    const {
      value,
      showTip,
      hasMore,
      endTip,
    } = this.state;
    const { searchStore } = this.props.goodStore;
    return (
      <div className="inner_body my_search">
        <SearchHeader
          value={value}
          onChange={this.onChange}
        />
        <div className="scroll_body search_content" ref={(node) => { this.container = node; }}>
          <InfiniteScroll
            height="12.44rem"
            next={this.getSearchList}
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
              searchStore.size === 0
                ?
                null
                :
                searchStore.map((material, index) => (
                  <SearchList
                    material={material}
                    key={material.get('fsMaterialGuId')}
                    index={index}
                  />
                ))
            }
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
Search.wrappedComponent.propTypes = {
  goodStore: PropTypes.object.isRequired,
};
Search.propTypes = {
  location: PropTypes.object.isRequired,
};
export default Search;
