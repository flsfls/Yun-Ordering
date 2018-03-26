import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Toast, TextareaItem } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import { post, get } from '@util/http';  // eslint-disable-line
import SlideBar from './component/slideBar';
import PauchaseButton from '@components/PauchaseButtom'; // eslint-disable-line
import CustomIcon from '@components/CustomIcon';  // eslint-disable-line
import DatePickerComponent from '@components/DatePicker'; // eslint-disable-line
import ListItem from '@components/ListItem';  // eslint-disable-line
import PickerComponent from '@components/Picker'; // eslint-disable-line
import NavBar from '@components/NavBar' // eslint-disable-line
import AddGood from '../AddGood';
import './assets/style.less';

// fsPurchaseNo 彩购订单号
// fsArrivalAddr到货地点
// fsBillDate 单据日期
// fsArrivalDate 到货日期
// fsSupplierName
// fsSupplierId
// fsNote
// fdPurchaseTotAmt 加税合计
// purchasedtlList 所有选的物料
@inject(store => ({
  puchaseStore: store.puchaseStore,
})) @observer
class AddPuchaseLibrary extends React.Component {
  state = {
    open: false, // 供商商选择是否打开
    status: '0', // 采购定单的状态，
    fsSupplierName: '请选择', // 供应商名
    fsSupplierId: '',
    fsStorageName: '',
    fsStorageId: '',
    fsBillDate: '', // 单据日期
    fsArrivalDate: '', // 到货日期
    fsArrivalAddr: '', // 到货地点
    fsNote: '', // 备注
  }
  componentWillMount() {
    // const { chooseMaterial: chooseMaterialStore } = this.props.puchaseStore;
    const {
      location, // 进入的路由地址
      chooseOrder, // 保存所有的进入的暂时的订单状态
      chooseMaterial, // 采购订单的物料缓存, 防止页面刷新时做的缓存
      puchaseMaterial, // 采购入库单的物料缓存
      backMaterial, // 采购退货单的缓存
      enterMaterial, // 所有订单列表进入存的料物
      enterFlag, // 那个入口进入的标识
      // 订单的状态
      // 1表示采购订单未提交，生成了一个新的采购订单 或者 表示一个未提交的采购入库单
      // 2表示采购订单已提交, 等待审核状态 或者 表示一个采购入库单已经提交
      // 3表示采购订单已经审核完，准备变成一个采购入库单 或者 表示一个采购入库单已经审核完，已经入库
      // 4表示采购订单已经变成了一个采购入库单，进入待入库状态
      // 5表示采购入库单入库完毕，可以进行退货
      // 9表示采购订单已入库, 只展示
      status,
      orderIndex, // 定单index
    } = sessionStorage;
    // 单据进行的当前下标
    this.orderIndex = Number(orderIndex);
    // 单据进入的入口
    this.enterFlag = enterFlag;
    // 当前请求地址片段
    this.location = location;
    // 保存的状态,用来视图联动
    this.setState({
      status,
    });

    // 如果有定单状态的话
    if (chooseOrder) {
      const {
        fsPGUID,
        fsPurchaseNo,
        fsBillDate,
        fsArrivalDate,
        fsArrivalAddr,
        fsNote,
        fiId,
        fsSupplierName,
        fiVendorEdit,
        fsStorageId,
        fsStorageName,
        fiBillKind,
        fsStockNo,
        isPushStock,
        fiDirect,
        fiOrganize,
        fsSupplierId,
      } = JSON.parse(chooseOrder);
      const StorageId = typeof fsStorageId === 'string' ? [fsStorageId] : fsStorageId;
      this.setState({
        fsSupplierId: fsPGUID || fsSupplierId, // 供应商的编号
        fsSupplierName: fsSupplierName || '请选择',
        fsStorageId: fsStorageId ? StorageId : '', // 仓库的编号
        fsStorageName,
        fsBillDate: new Date(fsBillDate), // 音据日期
        fsArrivalDate: new Date(fsArrivalDate), // 到达时间
        fsArrivalAddr, // 到达地址
        fsNote, // 注示
      });
      this.fsPurchaseNo = fsPurchaseNo; // 采购订单编号
      this.fsSupplierId = fsSupplierId;
      this.fsSupplierName = fsSupplierName;
      this.fsStorageId = fsStorageId;
      this.fsStorageName = fsStorageName;
      this.fiId = fiId;
      this.fiVendorEdit = fiVendorEdit;
      this.fiOrganize = fiOrganize;
      this.fiBillKind = fiBillKind;
      this.fsStorageId = fsStorageId;
      this.fsStorageName = fsStorageName;
      this.fsStockNo = fsStockNo;
      this.isPushStock = isPushStock;
      this.fiDirect = fiDirect;
      sessionStorage.fiBillKind = fiBillKind;
      // 如果入口是采购订单新增，并且 有采购订单缓存物料
      if (enterFlag === '1' && chooseMaterial) {
        // 添加对应的物料到mobx中
        this.addChooseMaterial(chooseMaterial);
      // 如果入口是采购订单列表或者采购入库列表，并且 有采购订单缓存物料
      } else if ((enterFlag === '2' || enterFlag === '5') && enterMaterial) {
        this.addChooseMaterial(enterMaterial);
      // 如果入口是采购入库单新增 并且有 新增的购入库单缓存物料
      } else if (enterFlag === '3' && puchaseMaterial) {
        this.addChooseMaterial(puchaseMaterial);
      // 如果入口是采购退货单新增 并且有 新增的购退货单缓存物料
      } else if (enterFlag === '4' && backMaterial) {
        this.addChooseMaterial(backMaterial);
      }
      // 这里直接退出不进行调用beforeadd接口
    }
  }

  componentWillUnmount() {
    const { status } = this.state;
    this.props.puchaseStore.clearChooseMaterial();
    sessionStorage.removeItem('chooseOrder');
    sessionStorage.removeItem('enterMaterial');
    sessionStorage.removeItem('orderIndex');
    sessionStorage.removeItem('status');
    // 如果是从新增采购订单进入，状态不等于保存的状态都清除保存的物料
    if (this.enterFlag === '1' && status !== '0') {
      sessionStorage.removeItem('chooseMaterial');
      sessionStorage.removeItem('cOrder');
    } else if (this.enterFlag === '3' && status !== '0') {
      sessionStorage.removeItem('puchaseMaterial');
      sessionStorage.removeItem('pOrder');
    } else if (this.enterFlag === '4' && status !== '0') {
      sessionStorage.removeItem('backMaterial');
    }
  }

  onChange = (e, flag, values) => {
    const { value, label } = e;
    if (flag === 'fsStorageId') {
      this.setState({
        fsStorageId: [value],
        fsStorageName: label,
      }, () => { this.cache(); });
    } else {
      this.setState({
        [flag]: values,
      }, () => { this.cache(); });
    }
  }


  onOpenChange = () => {
    const { status } = this.state;
    if ((this.enterFlag === '1' && status === '2') || (this.enterFlag === '2' && status === '9') || (this.enterFlag === '5' && status === '3')) {
      return;
    }
    this.setState({
      open: !this.state.open,
    });
  }

  getSupplier = (item) => {
    const { fsSupplierId, fsSupplierName } = item;
    this.setState({
      fsSupplierName,
      fsSupplierId,
      open: false,
    }, () => { this.cache(); });
  }

  cache = () => {
    const chooseOrder = JSON.parse(sessionStorage.chooseOrder);
    sessionStorage.chooseOrder = JSON.stringify(Object.assign({}, chooseOrder, this.state));
    if (this.enterFlag === '1' && this.state.status === '0') {
      sessionStorage.cOrder = JSON.stringify(this.state);
    } else if (this.enterFlag === '3' && this.state.status === '0') {
      sessionStorage.pOrder = JSON.stringify(this.state);
    }
  }

  addGoddHandler = () => {
    if (this.state.fsSupplierName === '请选择') {
      Toast.info('请填写供应商', 1);
      return;
    }
    this.props.history.push({
      pathname: '/home/libraryOrder/addPuchaseLibrary/addGood',
    });
  }
  addChooseMaterial = (materialList) => {
    this.props.puchaseStore.addChooseMaterial(JSON.parse(materialList));
  }

  addBefore = (data) => {
    post(`wap/${this.fetchUrl}/beforeAdd`, data, {}).then(({ data }) => {
      const {
        fsPurchaseNo,
        fsArrivalAddr,
        fsBillDate,
        fsArrivalDate,
        fsStockNo,
        isPushStock,
        fiDirect,
      } = data;
      this.setState({
        fsArrivalAddr,
        fsBillDate: new Date(fsBillDate),
        fsArrivalDate: new Date(fsArrivalDate),
      });
      this.fsPurchaseNo = fsPurchaseNo;
      this.fsStockNo = fsStockNo;
      this.isPushStock = isPushStock;
      this.fiDirect = fiDirect; // 是否直番
    });
  }

  formateDate = (list) => {
    const {
      totalMoney: fdPurchaseTotAmt,
      chooseMaterial: purchasedtlList,
    } = this.props.puchaseStore;
    const newpurchasedtlList = purchasedtlList.toJS().map((item) => {
      const {
        fsOrderUnitId,
        fdPrice,
        fdOrderPrice,
        fdQty,
        fdIncomeRate,
        fdTaxRate,
      } = item;
      let rate;
      const price = fdPrice || fdOrderPrice;
      if (!item.fsUnitIdSelected) {
        item.fsUnitIdSelected = fsOrderUnitId; // 规格id
      }
      if (fdIncomeRate === undefined) {
        rate = fdTaxRate;
      } else {
        rate = fdIncomeRate;
      }
      item.fdTaxPrice = (price * (rate / 100)) + Number(price); // 含税单价
      item.fdTax = price * (rate / 100); // 单价税率
      item.fdMoney = price * fdQty; // 金额
      item.fdTotal = (price * fdQty) + (price * (rate / 100)); // 价税合计
      item.fdTaxRate = rate; // 税率
      return item;
    });
    const data = Object.assign({}, { ...this.state }, {
      fsPurchaseNo: this.fsPurchaseNo, // 自采订单编号
      fdPurchaseTotAmt,
      fsStorageId: this.state.fsStorageId[0],
      [list]: newpurchasedtlList,
    });
    return data;
  }

  savebefore = (data) => {
    const flag = this.check();
    if (!flag) {
      Toast.info('请写完所有的数量和单价', 1);
    } else {
      post(`wap/${this.location}/add`, {}, data).then(({ data }) => {
        sessionStorage.chooseOrder = JSON.stringify(data);
        this.fiId = data.fiId;
        this.fiVendorEdit = data.fiVendorEdit;
        sessionStorage.status = '1';
        this.setState({
          status: '1',
        });
        Toast.info('保存成功', 1);
        this.props.puchaseStore.unshiftPuchaseOrderList(data);
      });
    }
  }

  save = () => {
    // 保存定单的时候必须要保证有物料，如果没有物料的话，不能通过
    if (this.props.puchaseStore.chooseMaterial.size === 0) {
      Toast.info('请选择物料', 1);
      return;
    }
    if (this.enterFlag === '1') {
      // 新增采购订单的时候进行整合的数据，purchasedtlList这个参数是为了传过去整个物料的字段不一样
      const data = this.formateDate('purchasedtlList');
      data.fiOrganize = this.fiOrganize;
      this.savebefore(data);
      // 如果是采购入库单新增的话
    } else if (this.enterFlag === '3' || this.enterFlag === '4') {
      const data = this.formateDate('stockdtlList');
      data.fiBillKind = this.fiBillKind;
      data.fsStockNo = this.fsStockNo;
      data.isPushStock = this.isPushStock;
      data.fiDirect = this.fiDirect;
      this.savebefore(data);
    }
  }
  ruku= () => {
    post('wap/purchase/stock', { fiId: this.fiId }).then(({ data }) => {
      this.title = '新增采购入库单';
      this.setState({
        status: '4',
      });
      sessionStorage.status = '4';
      sessionStorage.enterFlag = '3';
      const {
        fsBillDate,
        fsStorageId,
        fsStorageName,
        fsStockNo,
        fsNote,
        isPushStock,
        fiDirect,
        fiBillKind,
      } = data;
      this.setState({
        fsBillDate: new Date(fsBillDate),
        fsStorageId,
        fsStorageName,
        fsStockNo,
        fsNote,
      });
      this.fiBillKind = fiBillKind;
      this.fsStockNo = fsStockNo;
      this.isPushStock = isPushStock;
      this.fiDirect = fiDirect; // 是否直番
      this.props.puchaseStore.clearChooseMaterial();
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
      this.props.puchaseStore.addChooseMaterial(chooseMaterial);
      delete data.stockdtlList;
      sessionStorage.chooseOrder = JSON.stringify(data);
    });
  }

  newRkOrder = (status) => {
    const flag = this.check();
    if (!flag) {
      Toast.info('请写完所有的数量和单价', 1);
    } else {
      const data = this.formateDate('stockdtlList');
      data.fiBillKind = this.fiBillKind;
      data.fsStockNo = this.fsStockNo;
      data.isPushStock = this.isPushStock;
      data.fiDirect = this.fiDirect;
      post('wap/stock/add', {}, data).then(({ data }) => {
        this.props.puchaseStore.changePuchaseOrderList(this.orderIndex, 'fiBillStatus', 9);
        if (status === 2) {
          post('wap/stock/audit', { fiId: data.fiId }).then(() => {
            Toast.info('新增采购订单成功', 1);
            this.props.history.goBack();
          });
          return;
        }
        Toast.info('新增采购订单成功', 1);
        this.props.history.goBack();
      });
    }
  }


  check = () => {
    let flag;
    const chooseMaterial = this.props.puchaseStore.chooseMaterial.toJS();
    if (this.enterFlag === '1' || this.enterFlag === '2') {
      flag = chooseMaterial.every(({ fdQty, fdPrice }) => fdQty && fdPrice && fdPrice >= 0 && fdPrice >= 0);// eslint-disable-line
    } else {
      flag = chooseMaterial.every(({ fdQtyMust }) => fdQtyMust && fdQtyMust >= 0);// eslint-disable-line
    }
    return flag;
  }

  deleteHandler = () => {
    get(`wap/${this.location}/delete`, { fiId: this.fiId }).then(() => {
      if (this.location === 'purchase') {
        sessionStorage.removeItem('chooseMaterial');
      } else {
        sessionStorage.removeItem('puchaseMaterial');
      }
      sessionStorage.removeItem('pauchaseStatus');
      sessionStorage.removeItem('chooseOrder');
      this.props.puchaseStore.clearChooseMaterial();
      this.props.puchaseStore.deletePuchaseOrderList(this.orderIndex);
      Toast.info('删除成功', 1);
      this.props.history.goBack();
    });
  }
  beforemodifty = (data) => {
    const flag = this.check();
    if (!flag) {
      Toast.info('请写完所有的数量和单价', 1);
    } else {
      post(`wap/${this.location}/update`, {}, data).then(({ data }) => {
        const {
          fdPurchaseTotAmt,
          fdTotAmt,
        } = data;
        Toast.info('修改成功', 1);
        if (this.location === 'purchase') {
          this.props.puchaseStore.changePuchaseOrderList(this.orderIndex, 'fdPurchaseTotAmt', fdPurchaseTotAmt);
        } else {
          this.props.puchaseStore.changePuchaseOrderList(this.orderIndex, 'fdTotAmt', fdTotAmt);
        }
        sessionStorage.chooseOrder = JSON.stringify(data);
      });
    }
  }

  modifty = () => {
    if (this.location === 'purchase') {
      const data = this.formateDate('purchasedtlList');
      data.fsSupplierId = JSON.parse(sessionStorage.chooseOrder).fsSupplierId;
      data.fiVendorEdit = this.fiVendorEdit;
      data.fiId = this.fiId;
      data.fiOrganize = this.fiOrganize;
      this.beforemodifty(data);
    } else {
      const data = this.formateDate('stockdtlList');
      data.fiId = this.fiId;
      data.fiBillKind = this.fiBillKind;
      data.fsStockNo = this.fsStockNo;
      data.isPushStock = this.isPushStock;
      data.fiDirect = this.fiDirect;
      this.beforemodifty(data);
    }
  }

  examine = () => {
    const submit = this.location === 'purchase' ? 'submit' : 'audit';
    post(`wap/${this.location}/${submit}`, { fiId: this.fiId }).then(() => {
      if (this.location === 'purchase') {
        this.setState({
          status: '2',
        });
        sessionStorage.status = '2';
        if (this.enterFlag === '1') {
          this.props.puchaseStore.changePuchaseOrderList(0, 'fiBillStatus', 1);
        } else if (this.enterFlag === '2') {
          this.props.puchaseStore.changePuchaseOrderList(this.orderIndex, 'fiBillStatus', 1);
        }
      } else if (this.location === 'stock') {
        this.setState({
          status: '3',
        });
        sessionStorage.status = '3';
        if (this.enterFlag === '3') {
          this.props.puchaseStore.changePuchaseOrderList(0, 'fiBillStatus', 1);
        } else if (this.enterFlag === '5') {
          this.props.puchaseStore.changePuchaseOrderList(this.orderIndex, 'fiBillStatus', 1);
        }
        if (this.enterFlag === '3') {
          this.props.history.goBack();
        }
      }
      Toast.info('审核成功', 1);
    });
  }


  render() {
    const {
      totalMoney,
      chooseMaterial,
      warehouse,
    } = this.props.puchaseStore;
    const {
      open,
      status,
      fsSupplierName,
      fsStorageId,
      fsBillDate,
      fsArrivalDate,
      fsNote,
      fsArrivalAddr,
    } = this.state;

    console.log(this.fiBillKind);
    // 设置title的状态
    // 初始化进入的时候，如果是从采购订单新增进入的话
    if (this.enterFlag === '1') {
      if (status === '0') {
        this.title = '新增采购订单';
        this.orderStatus = '未提交';
      } else if (status === '1') {
        this.title = '修改采购订单';
      } else if (status === '2') {
        this.title = '采购订单';
        this.orderStatus = '已提交';
      }
    } else if (this.enterFlag === '2') {
      if (status === '1') {
        this.orderStatus = '未提交';
        this.title = '修改采购订单';
      } else if (status === '2') {
        this.title = '采购订单';
        this.orderStatus = '已提交';
      } else if (status === '9') {
        this.title = '入库单';
      }
    } else if (this.enterFlag === '3') {
      if (status === '4' || status === '0') {
        this.title = '新增采购入库单';
        this.orderStatus = '未审核';
      } else if (status === '3') {
        this.title = '采购入库单';
        this.orderStatus = '已审核';
      }
    } else if (this.enterFlag === '4') {
      if (status === '0') {
        this.orderStatus = '未审核';
        this.title = '新增采购退货单';
      } else if (status === '1') {
        this.title = '修改采购退货单';
      } else if (status === '3') {
        this.title = '采购退货单';
      }
    } else if (this.enterFlag === '5') {
      if (status === '3') {
        this.orderStatus = '已审核';
        if (this.fiBillKind === 2) {
          this.title = '采购退货单';
        } else {
          this.title = '采购入库单';
        }
      } else if (status === '1') {
        this.orderStatus = '未审核';
        this.title = '修改采购退货单';
      }
    }


    let Buttons;
    if (status === '0') {
      Buttons = (<button className="apl_button" onClick={this.save}>保存</button>);
    } else if (status === '1') {
      Buttons = (
        <PauchaseButton
          first="删除单据"
          second="保存"
          third="审核"
          firstHandler={this.deleteHandler}
          secondHandler={this.modifty}
          thirdHandler={this.examine}
        />
      );
    } else if (status === '2') {
      Buttons = (<button className="apl_button" onClick={this.ruku}>确认入库</button>);
    } else if (status === '3' && this.fiBillKind === 1) {
      Buttons = (<button className="apl_button" onClick={this.backGood}>退货</button>);
    } else if (status === '4') {
      Buttons = (
        <div className="apl_two_button flex_lr_sb_c">
          <button onClick={() => this.newRkOrder(1)}>保存</button>
          <button onClick={() => this.newRkOrder(2)}>审核</button>
        </div>
      );
    }
    const supplierDisabled = status === '0' || status == '4'? false : true; // eslint-disable-line
    const fsBillDateDisabled = status === '2' || status === '3' || status === '9'? true : false; // eslint-disable-line
    const fsArrivalDateDisabled = fsBillDateDisabled;
    const fsArrivalAddrDisabled = fsBillDateDisabled;
    const fsNoteDisabled = fsBillDateDisabled;
    const storageDisabled = fsBillDateDisabled;
    console.log(this.fiBillKind);
    const moneyflag = this.fiBillKind === 2 ? '-' : '';

    const fsArrivalDateShow = (this.enterFlag === '1' || this.enterFlag === '2') && status !== '4'? true : false; // eslint-disable-line
    return (
      <div className="inner_body add_puchase_library">
        <NavBar
          title={this.title}
        />
        <div className="puchase_library_content">
          <div onClick={this.onOpenChange}>
            <ListItem
              type="text"
              title="供应商"
              value={fsSupplierName}
            />
          </div>
          <div>
            <DatePickerComponent
              disabled={fsBillDateDisabled}
              title="单据日期"
              pickerTitle="请选择单据日期"
              time={fsBillDate}
              onChange={(value) => { this.onChange({}, 'fsBillDate', value); }}
            />
          </div>
          {fsArrivalDateShow
            ?
              <div>
                <div>
                  <DatePickerComponent
                    disabled={fsArrivalDateDisabled}
                    title="到货日期"
                    pickerTitle="请选择到货日期"
                    time={fsArrivalDate}
                    onChange={(value) => { this.onChange({}, 'fsArrivalDate', value); }}
                  />
                </div>
                <div style={{ marginTop: '.2rem' }}>
                  <TextareaItem
                    disabled={fsArrivalAddrDisabled} // eslint-disable-line
                    style={{ padding: '0 .3rem' }}
                    onChange={value => this.onChange({}, 'fsArrivalAddr', value)}
                    value={fsArrivalAddr}
                    title="到货地点"
                    data-seed="logId"
                    rows={2}
                  />
                </div>
              </div>
            :
              <div>
                <PickerComponent
                  disabled={storageDisabled}
                  title="仓库"
                  value={fsStorageId}
                  onChange={(v, value) => { this.onChange(v, 'fsStorageId', value); }}
                  select={warehouse.toJS()}
                />
              </div>
          }

          <div>
            <ListItem
              disabled={fsNoteDisabled}
              type="input"
              title="备注"
              value={fsNote}
              onChange={(value) => { this.onChange({}, 'fsNote', value); }}
              placeholder="请填写备注"
            />
          </div>
          <div>
            <ListItem
              type="text"
              title="订单金额"
              textStyle={{ color: '#FF6050' }}
              value={`¥${moneyflag}${totalMoney}`}
            />
          </div>
          <div onClick={this.addGoddHandler}>
            <ListItem
              type="text"
              title="品项清单"
              textStyle={{ color: '#333333' }}
              value={`共${chooseMaterial.size}款`}
              centerNode={
                <div className="flex_lr_c_c">
                  <CustomIcon type="libraryadd" size="xs" />
                  <span className="apl_addgood">点击添加品项</span>
                </div>
              }
            />
          </div>
          <div>
            <ListItem
              type="text"
              title="订单状态"
              value={this.orderStatus}
            />
          </div>
          {status === '9' ? null : Buttons}
        </div>
        <SlideBar
          open={open}
          onOpenChange={this.onOpenChange}
          getOrderList={this.getSupplier}
        />
        <Route path="/home/libraryOrder/addPuchaseLibrary/addGood" component={AddGood} />
      </div>
    );
  }
}

/**
  * @param {mobx} goodStore mobx中的所有物料操作
  */
AddPuchaseLibrary.wrappedComponent.propTypes = {
  puchaseStore: PropTypes.object.isRequired,
};

AddPuchaseLibrary.propTypes = {
  history: PropTypes.object.isRequired,
};
export default AddPuchaseLibrary;
