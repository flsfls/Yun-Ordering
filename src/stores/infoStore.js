import { observable, action } from 'mobx';
import { fromJS, Map } from 'immutable';

class Info {
  @observable addressList = fromJS([]);
  @observable initAddress = Map({})
  @action changeInitAddress(address) {
    this.initAddress = Map(address);
  }
  @action addAddress(address) {
    this.addressList = fromJS(address);
  }
  @action formatAddressList(fiAddrId) {
    this.addressList.forEach((item, index) => {
      const addressId = item.get('fiAddrId');
      if (addressId === fiAddrId) {
        this.addressList = this.addressList.setIn([index, 'fiDefault'], 1);
      } else {
        this.addressList = this.addressList.setIn([index, 'fiDefault'], 0);
      }
    });
  }
  @action editAddress(fiAddrId, state) {
    this.addressList.forEach((item, index) => {
      if (item.get('fiAddrId') === fiAddrId) {
        const fiDefault = item.get('fiDefault');
        this.addressList = this.addressList.set(index, Map({ fiAddrId, ...state, fiDefault }));
      }
    });
  }
  @action deleteAddress(fiAddrId) {
    this.addressList.forEach((item, index) => {
      if (item.get('fiAddrId') === fiAddrId) {
        this.addressList = this.addressList.splice(index, 1);
      }
    });
  }
  @action editAddAddress(data) {
    this.addressList = this.addressList.push(Map({ fiAddrId: data.fiAddrId, ...data }));
  }
}

export default Info;
