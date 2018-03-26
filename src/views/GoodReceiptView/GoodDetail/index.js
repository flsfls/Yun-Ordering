import React from 'react';
import NavBar from '@components/NavBar' // eslint-disable-line

class GoodDetail extends React.Component {
  componentDidMount() {
    // will
  }
  render() {
    return (
      <div className="inner_body">
        <NavBar
          title="品项详情"
        />
        <div className="good_detail">
          <div>
            <span>北海道带子</span>
            <span>1kg/盒</span>
          </div>
        </div>
      </div>
    );
  }
}

export default GoodDetail;
