import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import { post, get } from '@util/http';  // eslint-disable-line
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
    status: '0', // 采购定单的状态，
    fsDepartmentName: '', // 部门名称
    fsDepartmentId: '', // 部门id
    fsStorageName: '', // 仓库名称
    fsStorageId: '', // 仓库id
    fsBillDate: '', // 单据日期
    fsArrivalAddr: '', // 到货地点
    fsNote: '', // 备注
  }
  componentWillMount() {
    // const { chooseMaterial: chooseMaterialStore } = this.props.puchaseStore;
    const {
      location, // 进入的路由地址
      chooseOrder, // 保存所有的进入的暂时的订单状态
      getMaterial, // 领料单物料缓存，防止页面刷新时做的缓存
      enterFlag, // 那个入口进入的标识
      enterMaterial,
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
    this.orderIndex = enterFlag === '6' || enterFlag === '7' ? 0 : Number(orderIndex);
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
        fsDepartmentId, // 部门id
        fsBillDate, // 单据日是期
        fsNote, // 备注
        fiId, // 主健
        fsStorageId, // 仓库id
        fsStorageName, // 他库名
        fsDepartmentName,
        fiBillKind, // 领料还是退料
        isPushPicking, // 票识从那里退料
      } = JSON.parse(chooseOrder);
      const DepartmentId = typeof fsDepartmentId === 'string' ? [fsDepartmentId] : fsDepartmentId;
      const StorageId = typeof fsStorageId === 'string' ? [fsStorageId] : fsStorageId;
      this.setState({
        fsStorageId: fsStorageId ? StorageId : '', // 仓库的编号
        fsStorageName,
        fsDepartmentName,
        fsDepartmentId: fsDepartmentId ? DepartmentId : '', // 部门编号
        fsBillDate: new Date(fsBillDate), // 音据日期
        fsNote, // 注示
      });
      this.fsStorageId = fsStorageId;
      this.fsStorageName = fsStorageName;
      this.fiId = fiId;
      this.fiBillKind = fiBillKind;
      this.fsStorageId = fsStorageId;
      this.isPushPicking = isPushPicking;
      this.fsStorageName = fsStorageName;
      sessionStorage.fiBillKind = fiBillKind;
      // 如果入口是采购订单新增，并且 有采购订单缓存物料
      if (enterFlag === '6' && getMaterial) {
        // 添加对应的物料到mobx中
        this.addChooseMaterial(getMaterial);
      } else if (enterMaterial) {
        this.addChooseMaterial(enterMaterial);
      }
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
    if (this.enterFlag === '6' && status !== '0') {
      sessionStorage.removeItem('getMaterial');
      sessionStorage.removeItem('getOrder');
    }
  }

  onChange = (e, flag, values) => {
    const { value, label } = e;
    if (flag === 'fsStorageId') {
      this.setState({
        fsStorageId: [value],
        fsStorageName: label,
      }, () => { this.cache(); });
    } else if (flag === 'fsDepartmentId') {
      this.setState({
        fsDepartmentId: [value],
        fsDepartmentName: label,
      }, () => { this.cache(); });
    } else {
      this.setState({
        [flag]: values,
      }, () => { this.cache(); });
    }
  }


  cache = () => {
    const chooseOrder = JSON.parse(sessionStorage.chooseOrder);
    sessionStorage.chooseOrder = JSON.stringify(Object.assign({}, chooseOrder, this.state));
    if (this.enterFlag === '6') {
      sessionStorage.getOrder = JSON.stringify(this.state);
    }
  }

  addGoddHandler = () => {
    this.props.history.push({
      pathname: '/home/libraryPost/addPuchaseLibrary/addGood',
    });
  }
  addChooseMaterial = (materialList) => {
    this.props.puchaseStore.addChooseMaterial(JSON.parse(materialList));
  }
  formateDate = () => {
    const { chooseMaterial } = this.props.puchaseStore;
    const { chooseOrder } = sessionStorage;
    const { fsDepartmentId, fsStorageId } = this.state;
    const data = Object.assign({}, JSON.parse(chooseOrder), { ...this.state });
    data.fsDepartmentId = fsDepartmentId[0]; // eslint-disable-line
    data.fsStorageId = fsStorageId[0]; // eslint-disable-line
    const newChooseMater = chooseMaterial.toJS().map((item) => {
      item.fdPrice = 0;
      item.fdMoney = 0;
      item.fsUnitIdSelected = item.fsUnitId;
      return item;
    });
    data.pickingdtlList = newChooseMater;
    return data;
  }

  save = () => {
    // 保存定单的时候必须要保证有物料，如果没有物料的话，不能通过
    if (this.props.puchaseStore.chooseMaterial.size === 0) {
      Toast.info('请选择物料', 1);
      return;
    }
    const data = this.formateDate();
    post('wap/picking/add', {}, data).then(({ data }) => {
      this.setState({
        status: '1',
      });
      sessionStorage.status = '1';
      this.fiId = data.fiId;
      delete data.pickingdtlList;
      sessionStorage.chooseOrder = JSON.stringify(data);
      this.props.puchaseStore.unshiftPuchaseOrderList(data);
    });
  }


  check = () => {
    const chooseMaterial = this.props.puchaseStore.chooseMaterial.toJS();
    const flag = chooseMaterial.every(({ fdQty }) => fdQty && fdQty >= 0);// eslint-disable-line
    return flag;
  }

  deleteHandler = () => {
    get('wap/picking/delete', { fiId: this.fiId }).then(() => {
      sessionStorage.removeItem('getMaterial');
      sessionStorage.removeItem('status');
      sessionStorage.removeItem('chooseOrder');
      sessionStorage.removeItem('getOrder');
      this.props.puchaseStore.clearChooseMaterial();
      this.props.puchaseStore.deletePuchaseOrderList(this.orderIndex);
      Toast.info('删除成功', 1);
      this.props.history.goBack();
    });
  }

  modifty = () => {
    const flag = this.check();
    if (!flag) {
      Toast.info('请写完所有的数量和单价', 1);
    } else {
      const data = this.formateDate();
      data.fiId = this.fiId;
      post('wap/picking/update', {}, data).then(({ data }) => {
        delete data.pickingdtlList;
        sessionStorage.chooseOrder = JSON.stringify(data);
        this.props.puchaseStore.unshiftPuchaseOrderList(data);
        Toast.info('修改成功', 1);
      });
    }
  }

  examine = () => {
    post('wap/picking/audit', { fiId: this.fiId }).then(() => {
      const status = this.fiBillKind === '1' ? '2' : '9';
      this.setState({
        status,
      });
      sessionStorage.status = status;
      if (this.enterFlag === '6') {
        this.props.puchaseStore.changePuchaseOrderList(0, 'fiBillStatus', 1);
        Toast.info('新增领料单成功', 1);
        this.props.history.goBack();
        return;
      } else if (this.enterFlag === '8') {
        this.props.puchaseStore.changePuchaseOrderList(this.orderIndex, 'fiBillStatus', 1);
      }
      Toast.info('审核成功', 1);
    });
  }


  render() {
    const {
      chooseMaterial,
      warehouse,
      department,
    } = this.props.puchaseStore;
    const {
      fsDepartmentId,
      status,
      fsStorageId,
      fsBillDate,
      fsNote,
    } = this.state;

    // 设置title的状态
    // 初始化进入的时候，如果是从采购订单新增进入的话
    if (this.enterFlag === '6') {
      if (status === '0') {
        this.title = '新增领料单';
        this.orderStatus = '未审核';
      } else if (status === '1') {
        this.title = '修改领料单';
        this.orderStatus = '未审核';
      } else if (status === '2') {
        this.title = '采购订单';
        this.orderStatus = '已提交';
      }
    } else if (this.enterFlag === '7') {
      if (status === '0') {
        this.title = '新增退料单';
        this.orderStatus = '未审核';
      } else if (status === '1') {
        if (this.fiBillKind === 2) {
          this.title = '修改退料单';
          this.orderStatus = '未审核';
        }
      }
    } else if (this.enterFlag === '8') {
      if (status === '2') {
        if (this.fiBillKind === 1) {
          this.title = '领料单';
          this.orderStatus = '已审核';
        } else {
          this.title = '退料单';
          this.orderStatus = '已审核';
        }
      } else if (status === '1') {
        if (this.fiBillKind === 2) {
          this.title = '修改退料单';
          this.orderStatus = '未审核';
        } else {
          this.title = '领料单';
          this.orderStatus = '未审核';
        }
      } else {
        this.title = '退料单';
        this.orderStatus = '已审核';
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
      Buttons = (<button className="apl_button" onClick={this.ruku}>退料</button>);
    }
    const supplierDisabled = status === '0' || status == '4' ? false : true; // eslint-disable-line
    const fsBillDateDisabled = status === '2' || status === '3' || status === '9' ? true : false; // eslint-disable-line
    const fsNoteDisabled = fsBillDateDisabled;
    const storageDisabled = fsBillDateDisabled;

    const fsArrivalDateShow = (this.enterFlag === '1' || this.enterFlag === '2') && status !== '4' ? true : false; // eslint-disable-line
    return (
      <div className="inner_body add_puchase_library">
        <NavBar
          title={this.title}
        />
        <div className="puchase_library_content">
          <div>
            <div>
              <PickerComponent
                disabled={storageDisabled}
                title="部门"
                value={fsDepartmentId}
                onChange={(v, value) => { this.onChange(v, 'fsDepartmentId', value); }}
                select={department.toJS()}
              />
            </div>
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
          <div>
            <PickerComponent
              disabled={storageDisabled}
              title="仓库"
              value={fsStorageId}
              onChange={(v, value) => { this.onChange(v, 'fsStorageId', value); }}
              select={warehouse.toJS()}
            />
          </div>
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
          {status === '2' && this.fiBillKind === 2 ? null : Buttons}
        </div>
        <Route path="/home/libraryPost/addPuchaseLibrary/addGood" component={AddGood} />
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
