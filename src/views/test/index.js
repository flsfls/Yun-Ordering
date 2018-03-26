/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

class Test extends React.Component {

  componentDidMount() {
    // will did
  }

  fetchData = () => {
    console.log(1)
  }

  render() {
    return (
      <InfiniteScroll
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
        next={this.fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }>
        <div style={{overflowY:'scroll'}}>
        {[1,2,3,4,5,6,7,8,9,10].map(i=> {
          return (
            <h1  style={{marginTop:60}}key={i} >{i}</h1>
          )
        })}
        </div>
      </InfiniteScroll>
    )
  }
}

export default Test;

