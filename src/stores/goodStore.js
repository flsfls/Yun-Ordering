import { observable, action, computed } from 'mobx';
import { fromJS, List } from 'immutable';

/**
 * @constant {Immutable fromJS} goodList 首页下拉物料的所有数据
 * @constant {Immutable fromJS} goodListStore 存储选中后的物料数据
 * @constant {Immutable fromJS} groupStore 购物车转化格式后选中的所有物料数据
 * @return {number} totalMoney totalMoney是一个监听的数据，监听最后返回的值groupStore购选中的money相加
 */
class ShopStore {
  @observable goodList = fromJS([]);
  @observable goodListStore = List();
  @observable groupStore = fromJS([]);
  @observable classfiStore = fromJS([])
  @observable searchStore = fromJS([])
  @computed get totalMoney() {
    // 总钱初始化为0
    let money = 0;
    // 循环groupStore物料的组合组
    this.groupStore.forEach((good) => {
      // 再循环每个物料组中的所有物料
      good.get('material').forEach((materialItem) => {
        // 如果是购选的则把这个钱给加上去
        if (materialItem.get('check') === true) {
          money += materialItem.get('count') * (materialItem.get('fdSalePrice') * materialItem.get('fdSaleUnitRate'));
        }
      });
    });
    // 返回最后的钱
    return money;
  }

  // -----------------------------------------------------------------------------
  @action addGoodList(goodList) {
    // 把请求来的数据，继续添加到goodList中
    this.goodList = this.goodList.concat(fromJS(goodList));
    // 然后把下拉加载的所有数据和选中存着的数据进行一个比对
    this.comparsionGoodList();
  }

  @action comparsionGoodList() {
    // 循环goodList的数据
    for (let i = 0; i < this.goodList.size; i += 1) {
      const flag = (() => {
        // 把选中的goodListStore进行一个循环
        for (let j = 0; j < this.goodListStore.size; j += 1) {
          /**
           * @constant  goodId 下拉数据中的id
           * @constant  storeId 存储物料中循环的当前id
           * @constant  storeCount 存储物料中循环的当前数量
           */
          const goodId = this.goodList.getIn([i, 'fsMaterialGuId']);
          const storeId = this.goodListStore.getIn([j, 'fsMaterialGuId']);
          const storeCount = this.goodListStore.getIn([j, 'count']);
          // 如果下拉数据中的id === 存储物料中循环的当前id
          if (goodId === storeId) {
            // 把当前下拉加载的物料数量变改一下，再返回false
            this.goodList = this.goodList.setIn([i, 'count'], storeCount);
            return false;
          }
        }
        // 以上条件不满足则返回true
        return true;
      })();
      // 如果上面返回true,说明有些物料已经删除光了，把下拉加载的物料数量设为 0
      if (flag) {
        this.goodList = this.goodList.setIn([i, 'count'], 0);
      }
    }
  }


  @action cleanGoodListStore() {
    this.goodListStore = this.goodListStore.clear();
  }

  // -----------------------------------------------------------------------------
  /**
   * @param {object} good 当前选中传入的物料，每个物料的基本属性全在其中
   * @param {number} flag 标实当前点击的是加物料操作（值为-1）,还是减物料操作 （值为1)
   * @description 选择的物类和（册除或者增加）物料放入goodListStore中进行长时间的存储
   */
  @action changeGoodListStore(good, flag) {
    // 把物料的数量设为1，因为一开始为0
    let addGood = good;
    addGood = addGood.set('count', 1);
    // 如果存储选择的物料为空的时,直接把选择的物料push到存储选择的物料中
    if (this.goodListStore.size === 0) {
      this.goodListStore = this.goodListStore.push(addGood);
    } else {
      /**
       * @constant goodListStoreId {obj} 当前循环存储选择的物料主健id
       * @constant goodListStoreCount {stirng} 当前循环存储选择的物料主健数量
       * 如果不为空，则进行循环比对，如果有相同的料物，则在此物料基础上加1，然后跳出循环
       * 如果数量==1 并且是减少操作，则把当前物料从储存物料数组中删除 把操作的储存物料存在localStorage中
       */
      for (let i = 0; i < this.goodListStore.size; i += 1) {
        const goodListStoreId = this.goodListStore.getIn([i, 'fsMaterialGuId']);
        const goodListStoreCount = this.goodListStore.getIn([i, 'count']);
        if (goodListStoreId === good.get('fsMaterialGuId')) {
          if (goodListStoreCount === 1 && flag === -1) {
            this.goodListStore = this.goodListStore.splice(i, 1);
            localStorage.goodListStore = JSON.stringify(this.goodListStore);
            return;
          }
          this.goodListStore = this.goodListStore.setIn([i, 'count'], goodListStoreCount + flag);
          localStorage.goodListStore = JSON.stringify(this.goodListStore);
          return;
        }
      }
      // 如果没有相同的物料则向储选择的物料数组push选中的物料
      this.goodListStore = this.goodListStore.push(addGood);
    }
    localStorage.goodListStore = JSON.stringify(this.goodListStore);
  }

  @action saveCacheStore(goodListStore) {
    this.goodListStore = fromJS(goodListStore);
  }

  // -----------------------------------------------------------------------------
  /**
   * @param {object} good 当前选中传入的物料，每个物料的基本属性全在其中
   * @param {number} flag 标实当前点击的是加物料操作（值为-1）,还是减物料操作 （值为1)
   * @description 点击添加物料和减少物料的操作
   */
  @action changeGoodCount(good, flag) {
    // 添加或者减少物料时，把下拉的加载所有的物料进行同样视图改变
    for (let i = 0; i < this.goodList.size; i += 1) {
      /**
       * @constant goodlistItem {obj} 当前循环下拉物料数组中的物料
       * @constant goodlistItemId {stirng} 物料中的_id主健值
       * @constant goodlistItemCount {number} 物料中的选中数量
       */
      const goodlistItem = this.goodList.get(i);
      const goodlistItemId = goodlistItem.get('fsMaterialGuId');
      const goodlistItemCount = goodlistItem.get('count');
      // 如果传入的选中物料主健id 等于 循环出来的物料主健_id值,则下拉物料数组中比对成功的加1或1，退出循环
      if (goodlistItemId === good.get('fsMaterialGuId')) {
        this.goodList = this.goodList.setIn([i, 'count'], goodlistItemCount + flag);
        break;
      }
    }
  }

  // -----------------------------------------------------------------------------
  /**
   * @constant  groupStore 转化后的选中的group分组的物料
   * @constant  item 转化前每个item项，因为eslint的问题，重新赋值
   * @constant  obj 每个item整合后的整体数据
   */
  @action addGroupStore() {
    // 防止用户刷新页面，如果有sessionStorage.groupStore的话，先用sessionStorage.groupStore保存的数据
    if (sessionStorage.groupStore) {
      const groupStore = JSON.parse(sessionStorage.groupStore);
      this.groupStore = fromJS(groupStore);
      return;
    }
    const groupGood = this.goodListStore.toJS().reduce((box, next) => {
      const item = next;
      // 把每个item加上一个check属性为true
      item.check = true;
      // fsSupplierName 供应商名， fsSupplierId 供应商id
      const { fsSupplierName, fsSupplierId } = item;
      // 把obj进行一个整合
      const obj = {
        fsSupplierName,
        fsSupplierId,
        check: true,
        material: [item],
      };
      // reduce方法初始化是一个空数组，向数组中push第一个整合的obj对象
      if (box.length === 0) {
        box.push(obj);
      } else {
        // 否则开始循环box
        for (let i = 0; i < box.length; i += 1) {
          // 如果下一个item的shopid 等于其实中的一个id
          if (box[i].fsSupplierId === item.fsSupplierId) {
            // 把item push到其实中的一个物料组中
            const materialItem = box[i].material;
            materialItem.push(item);
            return box;
          }
        }
        // 如果没有相同的shopid,则重新添加分类组
        box.push(obj);
        return box;
      }
      return box;
    }, []);
    // 把最后组合面的物料组放入groupStore中，再immutable的fromJS一下
    this.groupStore = fromJS(groupGood);
  }
  // ---------------------------------------------------------------------------
  /**
   * @major function 当点击清除购物车的时候把groupStore分组后数据与goodListStore选中的数据一并全部清除
   */
  @action cleanGoodStore() {
    this.groupStore = this.groupStore.clear();
    this.goodListStore = this.goodListStore.clear();
  }

  // -----------------------------------------------------------------------------
  /**
   * @example groupStore分组后进行数量的改变时进行的操作，整体分组的数据格式为
   * 【
   *    {
   *     shoId: '1',shopName: '沙县总部',
   *     material: [
   *       {count: 0, name: '大白菜‘，...省略。}
   *       {count: 1, name: '大白菜2‘，...省略。}
   *     ]
   *    },
   *    {
   *     shoId: '2',shopName: '新疆拉面总部',
   *     material: [
   *       {count: 0, name: '大白菜‘，...省略。}
   *       {count: 1, name: '大白菜2‘，...省略。}
   *     ]
   *    }
   *  】
   *  @param {number} outIndex 选中分组据格式的最外层数组的index下标
   *  @param {number} innerIndex 选中分组据格式materil的index下标
   *  @param {number} flag 标识是加还是减的操作
   */
  @action changeGroupStoreCount(outIndex, innerIndex, flag) {
    /**
     * @constant goodMaterial 当前点击选中分组的当前项的关联的总部组的物料组
     * @constant goodCount  当前点选中物料组中的物料的数量
     */
    const goodMaterial = this.groupStore.getIn([outIndex, 'material']);
    const goodCount = this.groupStore.getIn([outIndex, 'material', innerIndex, 'count']);
    // 如果goodMaterial长度等于1 并且是减的操作，并且goodCount等于1的时候，把整个最外层的item项全部删除
    if (goodMaterial.size === 1 && flag === -1 && goodCount === 1) {
      this.groupStore = this.groupStore.splice(outIndex, 1);
    } else {
      // 如果goodCount = 1，并且是减的操作，把当前物料组中的当前选中的物料删除，退出
      if (goodCount === 1 && flag === -1) {
        this.groupStore = this.groupStore.updateIn([outIndex, 'material'], material => material.splice(innerIndex, 1));
        return;
      }
      // 否则最后改变当前的物料数量，根据flag
      this.groupStore = this.groupStore.setIn([outIndex, 'material', innerIndex, 'count'], goodCount + flag);
    }
  }
  // -----------------------------------------------------------------------
  /**
   * @description 点击总店选择的勾选
   * @param {object} e checkbox event对象
   * @param {number} outIndex 当前勾选总店外层index下标
   */
  @action warpCheck(e, outIndex) {
    /**
     * @constant checked 点击勾选后返回的值
     * @constant currentMaterial 当前勾选总部的所有物料
     */
    const { checked } = e.target;
    const currentMaterial = this.groupStore.getIn([outIndex, 'material']);
    this.groupStore = this.groupStore.setIn([outIndex, 'check'], checked);
    // 循环当前勾选总部的所有物料,把勾选总部的所有物料的check值等于总部的check值
    currentMaterial.forEach((item, materialIndex) => {
      this.groupStore = this.groupStore.setIn([outIndex, 'material', materialIndex, 'check'], checked);
    });
  }
  // --------------------------------------------------------------------------
  /**
   * @description 点击总店选择的勾选
   * @param {object} e checkbox event对象
   * @param {number} outIndex 当前勾选总店外层index下标
   * @param {number} innerIndex 当前勾选物料层index内层下标
   */
  @action innerCheck(e, outIndex, innerIndex) {
    /**
     * @constant checked 点击勾选后返回的值
     * @constant materials 当前勾选总部的所有物料组
     * @constant {boolean} isAllchecked 判断总部对应的所有物料组是否全部是勾选状态
     */
    const { checked } = e.target;
    this.groupStore = this.groupStore.setIn([outIndex, 'material', innerIndex, 'check'], checked);
    const materials = this.groupStore.getIn([outIndex, 'material']);
    const isAllchecked = materials.every(material => material.get('check') === true);
    // 如果是购选状态，则把外层的总部勾选全设为true,否则全为false
    if (isAllchecked) {
      this.groupStore = this.groupStore.setIn([outIndex, 'check'], true);
    } else {
      this.groupStore = this.groupStore.setIn([outIndex, 'check'], false);
    }
  }
  /**
   * @param classfi 请求来的分类数据
   */
  @action addClassfiStore(classfi) {
    const fromClassfi = classfi;
    // 循环请求来的分类数据，然和再循环goodListStore选中的的物料
    for (let i = 0; i < fromClassfi.length; i += 1) {
      // 都加上一个数量
      fromClassfi[i].count = 0;
      for (let j = 0; j < this.goodListStore.size; j += 1) {
        /**
          * @constant goodListStoreId 存储选中物料的每一项id
          * @constant goodListStoreId 存储选中物料的每一项id
          */
        const goodListStoreId = this.goodListStore.getIn([j, 'fsMaterialGuId']);
        const goodListStoreCount = this.goodListStore.getIn([j, 'count']);
        // 如果每一项分类id等于存储选中物料的每一项id，则改变分类其中的数量，做一个比对
        if (fromClassfi[i].fsMaterialGuId === goodListStoreId) {
          fromClassfi[i].count = goodListStoreCount;
          break;
        }
      }
    }
    // 再进行一个数据展示的格式化物料分类组
    const groupClass = fromClassfi.reduce((totalClassfi, item) => {
      // fsTreeCode 大分类代码， fsTreeName大分类名
      const { fsTreeCode, fsTreeName } = item;
      // 整合物料组的每一项
      const obj = {
        fsTreeCode,
        fsTreeName,
        material: [item],
      };
      // 如果物料组的长度为0
      if (totalClassfi.length === 0) {
        // 直接向里添加
        totalClassfi.push(obj);
      } else {
        // 再循环物料组
        for (let i = 0; i < totalClassfi.length; i += 1) {
          // 如果物料组和当前比对的物料id一样的话
          if (totalClassfi[i].fsTreeCode === item.fsTreeCode) {
            // 把当前比对的物料添加到物料组的物料中
            const materialItem = totalClassfi[i].material;
            materialItem.push(item);
            return totalClassfi;
          }
        }
        // 如果没有的话，则向物料组整个往里添加
        totalClassfi.push(obj);
        return totalClassfi;
      }
      return totalClassfi;
    }, []);
    // 最后把整个一的物料分类组放入classfiStore中
    this.classfiStore = fromJS(groupClass);
  }
  /**
   * @param {any} outIndex 物料分类组的外层下标
   * @param {any} innerIndex 物料组的每个物料的内层下标
   * @param {any} flag 加操作还是减操作（-1或者1）
   * @constant classfiStoreCount 当前改变的物料的数量
   */
  @action changeClassfiCount(outIndex, innerIndex, flag) {
    const classfiStoreCount = this.classfiStore.getIn([outIndex, 'material', innerIndex, 'count']);
    // 当前点击的物料进行加减操作
    this.classfiStore = this.classfiStore.setIn([outIndex, 'material', innerIndex, 'count'], classfiStoreCount + flag);
  }
  // 清除classfiStore里的数据
  @action cleanClassfiStore() {
    this.classfiStore = this.classfiStore.clear();
  }

  // searchStore -------------------------------------------------
  // 清除searchStore里的数据
  @action cleanSearchStore() {
    this.searchStore = this.searchStore.clear();
  }
  /**
   * @param {array} search 请求来的serach数据
   */
  @action addSearchStore(search) {
    const searchStore = search;
    // 循环请求来数据
    for (let i = 0; i < searchStore.length; i += 1) {
      searchStore[i].count = 0;
      // 再循环选中的数据例表
      for (let j = 0; j < this.goodListStore.size; j += 1) {
        /**
         * @constant {id} goodListStoreId 当前循环的选中的存储数据id
         * @constant {id} goodListStoreId 当前循环的选中的存储数据的数量
         */
        const goodListStoreId = this.goodListStore.getIn([j, 'fsMaterialGuId']);
        const goodListStoreCount = this.goodListStore.getIn([j, 'count']);
        // 如果搜索的数据id === 等于当前循环的选中的存储数据id
        if (searchStore[i].fsMaterialGuId === goodListStoreId) {
          // 把当前数量改变
          searchStore[i].count = goodListStoreCount;
          break;
        }
      }
    }
    // 比对完成后把数据添加到searchStore中
    this.searchStore = this.searchStore.concat(fromJS(searchStore));
  }

  @action changeSearchStoreCount(index, flag) {
    const currentCount = this.searchStore.getIn([index, 'count']);
    this.searchStore = this.searchStore.setIn([index, 'count'], currentCount + flag);
  }
}


export default ShopStore;
