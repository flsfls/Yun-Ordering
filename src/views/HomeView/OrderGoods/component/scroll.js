import React from 'react';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';

/* eslint-disable */
function debounce(method, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      method.apply(context, args);
    }, delay);
  }
}
/* eslint-disable */

class Scroll extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.currentScroll = 0;
  }
  state = {
    showScroll: true, // 是否显示返回顶部的按纽是否显示操作
  }
  // 当组件更新的时候拿到父无素的节点
  componentDidUpdate() {
    const { node } = this.props;
    // 因为取到的是一个组件无素，真正的节点是挂在根无素的el的节点上的
    const scrollNode = node.el;
    // 当有节点的时候，把节点监听滚动
    if (scrollNode) {
      // debounce进行一个滚动优化做节流
      scrollNode.onscroll = debounce(() => {
        //scrollDistance,滚动节容器的滚动高度
        const scrollDistance = scrollNode.scrollTop
        // 当滚动高度大于2000的时候，并且容器的滚动高度小于等于上一次滚动高度记录的值的话
        if (scrollDistance > 2000 && scrollDistance <= this.currentScroll) {
          // 把返回顶部给隐藏
          this.setState({
            showScroll: false,
          });
        } else {
          // 否则就显示
          this.setState({
            showScroll: true,
          });
        }
        // 并且记录上一次滚动高度
        this.currentScroll = scrollDistance
      }, 20)
    }
  }

  // 当点击返回顶部的时候，把滚动无素设置为 0，回到顶部
  goTop = () => {
    this.props.node.el.scrollTop = 0;
  }

  render() {
    const { showScroll } = this.state;
    return (
      <div
        onClick={this.goTop}
        style={{ display: showScroll ? 'none' : '' }}
        className="scrollTop"
      >
        返回顶部
      </div>
    );
  }
}

/**
  * @param {element} node 滚动元素节点
  */
Scroll.propTypes = {
  node: PropTypes.object,
};
Scroll.defaultProps = {
  node: {},
};
export default Scroll;
