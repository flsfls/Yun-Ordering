import { observable, action, computed } from 'mobx';
import { fromJS, Map } from 'immutable';

class PuchaseOrder {
  @observable fsSupplierList = fromJS([]);
  @observable warehouse = fromJS([])
  @observable department = fromJS([])
  @observable fspauchaseList = fromJS([]);
  @observable puchaseOrderList = fromJS([]);
  @observable goodClassfi = fromJS([]);
  @observable chooseMaterial = fromJS([]);
  @computed get totalMoney() {
    let money = 0;
    this.chooseMaterial.toJS().forEach(({
      fdQty,
      fdPrice,
      fdIncomeRate,
      fdTaxRate,
    }) => {
      const goodRate = fdIncomeRate === undefined ? fdTaxRate : fdIncomeRate;
      // 首先保证 夫格和音价都要存在而且必须大于0
      if (fdQty && fdPrice && fdPrice > 0 && fdQty > 0) {
        // 每个物料价格是  单价 * 数量
        const materialMoney = fdQty * fdPrice;
        console.log(materialMoney);
        // rate表示税额 物料的总价*税率
        const Rate = materialMoney * (goodRate / 100);
        console.log(Rate);
        // 总的价格是税额+上每个物料的总价
        money += Rate + materialMoney;
      }
    });
    return money;
  }
  @action addFsSupplierList(supplierList, flag) {
    this[flag] = fromJS(supplierList);
  }
  @action addWareHouse(warehouse) {
    this.warehouse = fromJS(warehouse);
  }
  @action clearFsSupplierList() {
    this.puchaseOrderList = this.puchaseOrderList.clear();
  }
  @action addPuchaseOrderList(puchaseOrderList) {
    this.puchaseOrderList = this.puchaseOrderList.concat(fromJS(puchaseOrderList));
  }
  // 删除单据
  @action deletePuchaseOrderList(index) {
    this.puchaseOrderList = this.puchaseOrderList.splice(index, 1);
  }
  // 添加新的单据到头部
  @action unshiftPuchaseOrderList(order) {
    this.puchaseOrderList = this.puchaseOrderList.unshift(Map(order));
  }
  // 改变单据
  @action changePuchaseOrderList(index, flag, value) {
    console.log(this.puchaseOrderList);
    console.log(index, flag, value);
    this.puchaseOrderList = this.puchaseOrderList.setIn([index, flag], value);
  }
  @action addGoodClassfi(goodClassfi) {
    this.goodClassfi = fromJS(goodClassfi);
  }
  @action addChooseMaterial(goodClassfi) {
    this.chooseMaterial = this.chooseMaterial.concat(fromJS(goodClassfi));
  }
  @action clearChooseMaterial() {
    this.chooseMaterial = this.chooseMaterial.clear();
  }
  @action changeChooseMaterial(value, flag, index) {
    const { enterFlag } = sessionStorage;

    // 能过不同的enterFlage进行不同的缓存和操作
    if (enterFlag === '1') {
      // 改变数量 和 价格
      this.chooseMaterial = this.chooseMaterial.setIn([index, flag], value);
      const JSONstrChooseMaterial = JSON.stringify(this.chooseMaterial);
      sessionStorage.chooseMaterial = JSONstrChooseMaterial;
    } else if (enterFlag === '2') {
      // 改变数量 和 价格
      this.chooseMaterial = this.chooseMaterial.setIn([index, flag], value);
      const JSONstrChooseMaterial = JSON.stringify(this.chooseMaterial);
      sessionStorage.enterMaterial = JSONstrChooseMaterial;
    } else if (enterFlag === '3') {
      // 这里需要fdQty因为没有，但是等于改变的值的数量，两者是等价的操作
      this.chooseMaterial = this.chooseMaterial.setIn([index, flag], value).setIn([index, 'fdQty'], value);
      const JSONstrChooseMaterial = JSON.stringify(this.chooseMaterial);
      sessionStorage.puchaseMaterial = JSONstrChooseMaterial;
    } else if (enterFlag === '4') {
      this.chooseMaterial = this.chooseMaterial.setIn([index, flag], value).setIn([index, 'fdQty'], value);
      const JSONstrChooseMaterial = JSON.stringify(this.chooseMaterial);
      sessionStorage.backMaterial = JSONstrChooseMaterial;
    } else if (enterFlag === '5' || enterFlag === '7') {
      this.chooseMaterial = this.chooseMaterial.setIn([index, flag], value).setIn([index, 'fdQty'], value);
      const JSONstrChooseMaterial = JSON.stringify(this.chooseMaterial);
      sessionStorage.enterMaterial = JSONstrChooseMaterial;
    } else if (enterFlag === '6') {
      this.chooseMaterial = this.chooseMaterial.setIn([index, flag], value).setIn([index, 'fdQty'], value);
      const JSONstrChooseMaterial = JSON.stringify(this.chooseMaterial);
      sessionStorage.getMaterial = JSONstrChooseMaterial;
    } else {
      const fdInvQty = this.chooseMaterial.getIn([index, 'fdInvQty']);
      this.chooseMaterial = this.chooseMaterial.setIn([index, flag], value).setIn([index, 'fdDiffQty'], value - fdInvQty);
      const JSONstrChooseMaterial = JSON.stringify(this.chooseMaterial);
      sessionStorage.enterMaterial = JSONstrChooseMaterial;
    }
  }
}

export default PuchaseOrder;
