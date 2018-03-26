import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { List } from 'antd-mobile';
import './style.less';

const { Item } = List;

@withRouter
class GoodClassfi extends React.Component {
  componentWillMount() {
    // will
  }
  nextGoodList = (index, value) => {
    const { jump } = this.props;
    let location;
    if (sessionStorage.location === 'stock' || sessionStorage.location === 'puchase') {
      location = 'libraryOrder';
    } else if (sessionStorage.location === 'picking') {
      location = 'libraryPost';
    }
    if (jump === 'one') {
      this.props.history.push({
        pathname: `/home/${location}/addPuchaseLibrary/addGood/chooseGood/chooseGoodN`,
      });
      sessionStorage.GoodClassfiIndex = index;
    } else {
      this.props.history.push({
        pathname: `/home/${location}/addPuchaseLibrary/addGood/chooseGood/chooseGoodN/chooseGoodItem`,
        search: `?fsNodeCode=${value}`,
      });
    }
  }
  render() {
    return (
      <div className="good_classfi">
        <p className="title">{this.props.title}</p>
        <List>
          { this.props.list.map((item, index) => (
            <Item
              key={item.value}
              onClick={() => this.nextGoodList(index, item.value)}
            >
              {item.label} 【{item.children.length}】
            </Item>
          ))}
        </List>
      </div>
    );
  }
}

GoodClassfi.propTypes = {
  list: PropTypes.array.isRequired,
  history: PropTypes.object,
  title: PropTypes.string,
  jump: PropTypes.string.isRequired,
};

GoodClassfi.defaultProps = {
  history: { },
  title: '全部分类',
};

export default GoodClassfi;
