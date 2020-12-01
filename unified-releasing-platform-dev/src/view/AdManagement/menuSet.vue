<template>
    <div class="menuSet">
        <Tabs type="card">
            <TabPane label="菜单">
                <Form :model="menuForm" :rules="ruleValidate" :label-width="100" ref="menuForm">
                    <FormItem label="选择商户：" prop="shops">
                        <Select v-model="shopsPre" style="width:80px" @on-change="changeSelectShopPre">
                            <Option v-for="(item, index) in shopPrefix" :value="item" :key="index">{{ item }}</Option>
                        </Select>
                        <Select style="width: 200px" ref="shopSelect"
                            v-model="menuForm.shops"
                            filterable
                            clearable
                            remote
                            :remote-method="getAllShops"
                            :loading="getShopsLoading"
                            @on-change="changeSelectedShop">
                            <Option v-for="item in allShops" :value="item.id" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="厂商：" prop="vendors">
                        <Select v-model="menuForm.vendors" filterable style="width: 200px" @on-change="changeSelectedVendor">
                            <Option v-for="item in allVendors" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="编辑菜单：" prop="menus">
                        <Button type="primary" icon="md-add-circle" @click="addNewMenu">新增菜单</Button>
                        <MenuEdit :menus="menus" @opt-menu="operateMenu" :shop="menuForm.shops" :vendor="menuForm.vendors"></MenuEdit>
                        <!-- <div v-show="menuForm.shops && menuForm.vendors && !menus.length" class="menuset-nomenu">目前没有配置菜单！</div> -->
                    </FormItem>
                </Form>
                <div class="nextButtonWrap">
                    <Button type="primary" @click="preStep" size="large" v-if="!isBack">上一步</Button>
                    <Button type="primary" @click="backList" size="large" v-else>返回</Button>
                    <Button type="success" @click="adsOnline" size="large" style="margin-left: 50px">上线</Button>
                </div>
            </TabPane>
            <!-- <TabPane label="中间页">中间页</TabPane>
            <TabPane label="下一步">下一步</TabPane> -->
            <!-- <Button @click="saveAllHandler" slot="extra">保存</Button> -->
        </Tabs>
    </div>
</template>
<script>
import MenuEdit from './components/menuEdit'
import axios from '@/libs/api.request'
export default {
  name: 'menuSet',
  components: { MenuEdit },
  props: [], //编辑状态需要传递商户/厂商
  data () {
    return {
      menuForm: {
        shops: this.$route.params.shopId || '', //商户
        vendors: this.$route.params.partnerId || '' //厂商
      },
      ruleValidate: {
          shops: [{required: true, message: '请选择商户！', trigger: 'change'}],
          vendors: [{required: true, message: '请选择厂商！', trigger: 'change'}]
      },
      allShops: [],
      shopPrefix: ['名称', 'shopid'],
      shopsPre: '名称',
      allVendors: [],
      menus: [],
      originMenus: [], //保存一份初始的列表数据，菜单移动的时候如果是和空的列表移动不发请求，如果是两个原始菜单相互移动需要找到原始位置
      baseMenus: {
        1: {"menuInfo": {}},
        2: {"menuInfo": {}},
        3: {"menuInfo": {}}
      },
      getShopsLoading: false,
      isBack: this.$route.params.isBack || false
    }
  },
  created () {
    this.updateMenusLists()
    this.getAllVendors()
    this.menuForm.shops && this.menuForm.vendors && this.getMenus(this.menuForm.shops, this.menuForm.vendors)
  },
  mounted() {
    this.$nextTick(() => {
        // 初始值
        this.$refs['shopSelect'].$data.query = this.$route.params.shopName || ''
    })
  },
  methods: {
    updateMenusLists () {
        let _this = this
        this.Observer.$on('updateMenusList', (data) => {
            data.shopId && data.partnerId &&
            _this.getMenus(data.shopId, data.partnerId)
        })
    },
    getMenus(shopId, partnerId) {
        // this.$refs['menuForm'].validate((valid) => {
        //     if (valid) {
                let _this = this;
                axios.request({
                    url: '/ad/menus/detail/list',
                    method: 'post',
                    data: {
                        partnerId,
                        shopId
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        _this.originMenus = JSON.parse(JSON.stringify(res.data.data))
                        _this.menus = res.data.data
                        _this.menus.map((item, index) => {
                            item.index = Date.now() + index
                            // 如果没有基础菜单，手动配置基础菜单
                            if (!item.baseMenus
                                || item.baseMenus && !Object.keys(item.baseMenus).length) {
                                item.baseMenus = JSON.parse(JSON.stringify(this.baseMenus))
                            }
                            item.baseMenus && !item.baseMenus[1] && (item.baseMenus[1] = {"menuInfo": {}})
                            item.baseMenus && !item.baseMenus[2] && (item.baseMenus[2] = {"menuInfo": {}})
                            item.baseMenus && !item.baseMenus[3] && (item.baseMenus[3] = {"menuInfo": {}})
                            item.queuedMenus && !item.queuedMenus[1] && (item.queuedMenus[1] = [])
                            item.queuedMenus && !item.queuedMenus[2] && (item.queuedMenus[2] = [])
                            item.queuedMenus && !item.queuedMenus[3] && (item.queuedMenus[3] = [])
                        })
                    } else {
                        _this.$Message.error('获取菜单失败，请稍后再试！')
                    }
                }).catch(err => {
                    this.$Message.error('请求失败，' + err + '，请稍后再试！')
                })
        //     }
        // })
    },
    /** 获取所有商户 */
    getAllShops (query) {
        this.getShopsLoading = true
        let param = this.shopsPre === '名称' ? {"shopName": query} : {"shopId": query}
        axios.request({
            url: '/ad/shops/names',
            method: 'post',
            data: param
        }).then(res => {
            if (res.data.code === 0) {
                this.allShops = res.data.data
                this.getShopsLoading = false
            } else {
                // this.$Message.error('请求异常，请稍后再试！')
            }
        }).catch(err => {
            this.$Message.error('请求失败，' + err + '，请稍后再试！')
            this.getShopsLoading = false
        })
    },
    /** 获取所有厂商 */
    getAllVendors () {
        let _this = this
        axios.request({
            url: '/sys/utils/all',
            method: 'get'
        }).then(res => {
            if (res.data.code === 0) {
                _this.allVendors = res.data.data.sysConfig.partnerName
            } else {
            this.$Message.error(res.data.msg)
            }
        }).catch(err => {
            this.$Message.error('请求失败，' + err + '，请稍后再试！')
        })
    },

    /** 选择商户筛选条件 */
    changeSelectShopPre (val) {
        // this.menuForm.shops = this.$route.params.shopId
        // this.menuForm.vendors = this.$route.params.partnerId
    },
    /** 选择厂商筛选条件 */
    changeSelectedVendor (val) {
        this.menuForm.vendors = val
        this.menuForm.shops && this.getMenus(this.menuForm.shops, val)
    },
    changeSelectedShop (val) {
        this.menuForm.shops = val
        this.menuForm.vendors && this.getMenus(val, this.menuForm.vendors)
    },
    /** 保存全部 当前菜单、下一步、中间页的配置信息 */
    // saveAllHandler () {

    // },
    /** 新增菜单 */
    addNewMenu () {
        this.$refs['menuForm'].validate((valid) => {
            if (valid) {
                this.menus.push({ruleInfo: '', queuedMenus:{}, ruleIndex: this.menus.length, newMenu: true,
                    index: Date.now() + this.menus.length + 1, baseMenus: JSON.parse(JSON.stringify(this.baseMenus))})
            }
        })
    },
    updateMenuPos (params) {
        let _this = this
        axios.request({
            url: '/ad/menus/edit/index/limitrule',
            method: 'post',
            data: params
        }).then(res => {
            if (res.data.code === 0) {
                _this.getMenus(_this.menuForm.shops, _this.menuForm.vendors)
            }
        }).catch(err => {
            this.$Message.error('请求失败，' + err + '，请稍后再试！')
        })
    },
    operateMenu (data) {
        let {type, index} = data
        let curMenus = this.menus
        let moveMenu = []
        let params = []
        // 上移--上边的数据不是新建的则发送请求
        // 下移--下边的数据不是新建的发送请求
        if (type === 'up' && +index !== 0) {
            moveMenu = curMenus.splice(index, 1)
            curMenus.splice(index - 1, 0, moveMenu[0])
            if (curMenus[index].newMenu || curMenus[index-1].newMenu) { return false }
            // 如果需要发送请求，找到移动的菜单在原始菜单数组中的index
            let movedIndex = this.findMovedIndex(moveMenu)
            params = [
                {
                    "partnerId": this.menuForm.vendors,
                    "shopId": this.menuForm.shops,
                    "ruleInfo": moveMenu[0].ruleInfo,
                    "ruleIndex": movedIndex - 1
                },
                {
                    "partnerId": this.menuForm.vendors,
                    "shopId": this.menuForm.shops,
                    "ruleInfo": curMenus[index].ruleInfo,
                    "ruleIndex": movedIndex
                }
            ]
            this.updateMenuPos(params)
        }
        if (type === 'down' && +index !== curMenus.length - 1) {
            moveMenu = curMenus.splice(index, 1)
            curMenus.splice(index + 1, 0, moveMenu[0])
            if (curMenus[index].newMenu || curMenus[index+1].newMenu) { return false }
            let movedIndex = this.findMovedIndex(moveMenu)
            params = [
                {
                    "partnerId": this.menuForm.vendors,
                    "shopId": this.menuForm.shops,
                    "ruleInfo": curMenus[index].ruleInfo,
                    "ruleIndex": movedIndex
                },{
                    "partnerId": this.menuForm.vendors,
                    "shopId": this.menuForm.shops,
                    "ruleInfo": moveMenu[0].ruleInfo,
                    "ruleIndex": movedIndex + 1
                }
            ]
            this.updateMenuPos(params)
        }
        if (type === 'add') { // 直接改成在最后新增了，不然没有办法移动发请求
            // curMenus.splice(index + 1, 0, {ruleInfo: '', queuedMenus:{}, index: Date.now() + curMenus.length + 1})
            curMenus.splice(index + 1, 0, {ruleInfo: '', queuedMenus:{}, ruleIndex: this.menus.length, newMenu: true,
                index: Date.now() + this.menus.length + 1, baseMenus: JSON.parse(JSON.stringify(this.baseMenus))})
        }
        if (type === 'del') {
            if (curMenus[index].newMenu) {
                curMenus.splice(index, 1)
            } else {
                axios.request({
                    url: '/ad/menus/delete/rule',
                    method: 'post',
                    data: {
                        "partnerId": this.menuForm.vendors,
                        "shopId": this.menuForm.shops,
                        "ruleInfo": curMenus[index].ruleInfo
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.getMenus(this.menuForm.shops, this.menuForm.vendors)
                    }
                }).catch(err => {})
            }
        }
    },
    findMovedIndex (moveMenu) {
        let moveIndex = 0
        this.originMenus.filter((item, index) => {
            if (moveMenu[0].ruleInfo === item.ruleInfo) {
                moveIndex = index
            }
        })
        return moveIndex
    },
    backList() {
      this.$router.push({path: '/adList/adTypeList'})
    },
    preStep () {
      this.$emit('pre-step')
    },
    adsOnline () {
      axios.request({
        url: '/ad/puton/ads/online/total',
        method: 'post',
        data: {
            "partnerId": this.menuForm.vendors,
            "shopId": this.menuForm.shops,
            "adPositionType": 1
        }
      }).then(res => {
          if (res.data.code === 0) {
              this.$Message.success('上线成功！')
          } else {
              this.$Message.error('上线失败！')
          }
      }).catch(err => {

      })
    }
  }
}
</script>
<style lang="less" scoped>
.menuSet {
    width: 100%;
    padding-left: 30px;
    .ivu-tabs {
        height: 100%;
    }
    .nextButtonWrap {
        text-align: center;
        margin-top: 50px;
    }
    .menuset-nomenu {
        margin-top: 20px;
        font-size: 18px;
    }
}
</style>
