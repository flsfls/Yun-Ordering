import React from 'react';
import { inject, observer } from 'mobx-react';
import { fromJS } from 'immutable';
import QueryString from 'query-string';
import PropTypes from 'prop-types';
import { List, Checkbox } from 'antd-mobile';
import { post } from '@util/http'; // eslint-disable-line
import NavBar from '@components/NavBar'; // eslint-disable-line
import GoodClassfi from '@components/GoodClassfi'; // eslint-disable-line
import './assets/style.less';

const { Item } = List;

@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class ChooseGoodItem extends React.Component {
  state = {
    list: fromJS([]),
  }
  componentWillMount() {
    const { enterFlag } = sessionStorage;
    const { fsNodeCode } = QueryString.parse(this.props.location.search);
    post('wap/quickordergoods/materiel', {}, {
      fsNodeCode,
      fsTreeItemId: '30',
      fsTreeItemType: 'Material',
      pageSize: 8,
      pageNum: 1,
    }).then(({ data }) => {
      const newData = data.colContent.map((item) => {
        item.choose = false;
        if (enterFlag === '3' || enterFlag === '4' || enterFlag === '5') {
          item.fdPrice = item.fdOrderPrice;
        }
        return item;
      });
      this.setState({
        list: fromJS(newData),
      });
    });
  }

  onChange = (e, index) => {
    const { checked } = e.target;
    const list = this.state.list.setIn([index, 'choose'], checked);
    this.setState({
      list,
    });
  }

  submit = () => {
    // 点击选中物料的时候，把选中的通过filter过滤choose为true的拿出来
    const choosedList = this.state.list.filter(item => item.get('choose') === true);
    // 然后再存入选中的物料mobox中
    this.props.puchaseStore.addChooseMaterial(choosedList);
    // 拿到进入点的标识
    const { enterFlag } = sessionStorage;
    // 把chooseMaterial进行一个string
    const JSONstrChooseMaterial = JSON.stringify(this.props.puchaseStore.chooseMaterial);
    // 通过不同的进入点存在不同的session中
    if (enterFlag === '1') {
      sessionStorage.chooseMaterial = JSONstrChooseMaterial;
    } else if (enterFlag === '2' || enterFlag === '4') {
      sessionStorage.enterMaterial = JSONstrChooseMaterial;
    } else if (enterFlag === '3') {
      sessionStorage.puchaseMaterial = JSONstrChooseMaterial;
    }
    // 返回页面
    this.props.history.go(-3);
  }
  render() {
    const count = this.state.list.toJS().reduce((total, item) => {
      if (item.choose) {
        total += 1;
      }
      return total;
    }, 0);
    return (
      <div className="chooseGoodItem inner_body">
        <NavBar
          title="选择品项"
        />
        <div>
          <p className="title">全部分类d未分类</p>
          <List>
            {this.state.list.toJS().map(({
              fsMaterialName,
              fsModelno,
              choose,
              fsMaterialGuId,
            }, index) => (
              <Item key={fsMaterialGuId}>
                <Checkbox
                  onChange={e => this.onChange(e, index)}
                  checked={choose}
                  style={{ marginRight: '.2rem' }}
                />
                <span>{fsMaterialName}{fsModelno}{index}</span>
              </Item>
            ))}
          </List>
          <div className="choose_button flex_lr_sb_c">
            <span>已选{count}种物料</span>
            <button onClick={this.submit}>确定</button>
          </div>
        </div>
      </div >
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
ChooseGoodItem.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};
ChooseGoodItem.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default ChooseGoodItem;
