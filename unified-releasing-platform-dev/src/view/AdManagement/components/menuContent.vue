 <template>
    <!--修改弹窗-->
      <div class="modal__content">
        <div class="con_left">
          <div class="left_header">
              <h3 style="display:inline-block;margin-left:10px;">{{middleTitle}}</h3>
              <div style="margin-right:6px;">
                <Button type="primary" size="small" title="新增一级菜单" @click="editMenu('add')">新增</Button>
              </div>
          </div>
          <div style="padding-left:8px;">
            <span>选择广告投放位置</span>
            
            <div v-for="(fitem,findex) in resData.queuedMenus[position]" :key="findex" style="position:relative">
              <div class="first-menu-index" @click="toggleAdOnline(findex, fitem)" style="cursor: pointer;" :class="{'first-menu-list-online': fitem.menuInfo && fitem.menuInfo.onlineStatus == 1}">{{findex + 1}}</div>
              <div class="first-menu">
              <div class="first-menu-list" @click="editMenu(findex,fitem)" :class="{'first-menu-list-choice': findex == choiceItem}">
                <div class="first-menu-item">
                  <div
                    @click.stop="toggleShowArrow(fitem.menuInfo)"
                    v-if="fitem.subMenus && fitem.subMenus.length"
                  >
                    <Icon
                      type="md-arrow-dropright"
                      size="18"
                      style="margin-right:6px;"
                      v-if="!fitem.menuInfo.show_click_style"
                    />
                    <Icon
                      type="md-arrow-dropdown"
                      size="18"
                      style="margin-right:6px;"
                      v-if="!!fitem.menuInfo.show_click_style"
                    />
                  </div>
                  <div v-else style="margin:0 14px 0 6px;;">
                    <span>•</span>
                  </div>
                  <span>{{fitem.menuInfo.menuName}}</span>
                  
                </div>

                <div class="first-menu-item">
                  <div
                    class="show_icon"
                    v-if="fitem.menuInfo.menuType == 'menu'"
                    @click.stop="editMenu(findex+'~', fitem)"
                  >
                    <Icon type="md-add-circle" size="17" />
                  </div>
                  <div class="show_icon" @click.stop="delItem(findex,fitem.menuInfo)" v-if="fitem.menuInfo.onlineStatus != 1">
                    <Icon type="ios-trash" size="17" />
                  </div>
                  <div v-if="fitem.putonAds != null && fitem.menuInfo.menuType != 'menu'" style="margin-right:3px;color:#f38e05;cursor:pointer;">广告</div>
                </div>
              </div>
              <div v-if="fitem.menuInfo.show_click_style">
                <div
                  v-for="(sitem,sindex) in fitem.subMenus"
                  :key="sindex"
                  class="first-menu-list secend-menu-list"
                   :class="{'first-menu-list-choice': findex+'-'+sindex == choiceItem}"
                  @click="editMenu(findex+'-'+sindex, sitem)"
                >
                  <div class="first-menu-item">
                    <span style="margin-right:14px;">•</span>
                    <span>{{sitem.menuInfo.menuName}}</span>
                  </div>
                  <div>
                    <div class="show_icon" @click.stop="delItem(findex+'-'+sindex,sitem.menuInfo)" v-if="sitem.menuInfo.onlineStatus != 1">
                      <Icon type="ios-trash" size="17" />
                    </div>
                    <div v-if="sitem.putonAds != null && sitem.menuInfo.menuType != 'menu'" style="margin-right:3px;color:#f38e05;cursor:pointer;display:inline-block;">广告</div>
                  </div>
                </div>
              </div>
              </div>
              <div class="menu-opt">
                <Icon type="md-arrow-round-up" size="18" @click="operateMenu('up', findex)"/>
                <Icon type="md-arrow-round-down" size="18" @click="operateMenu('down', findex)"/>
                <!-- <Icon type="md-add-circle" size="18"  @click="operateMenu('up')"/>
                <Icon type="ios-trash" size="18"  @click="operateMenu('up')"/> -->
              </div>
            </div>
            <!-- 基础菜单 -->
            <!--  -->
            <div style="position:relative" v-if="resData.baseMenus && resData.baseMenus[+position] && resData.baseMenus[+position].menuInfo">
              <div><span style="color:red">*</span>基础菜单</div>
              <div class="first-menu">
              <div class="first-menu-list" :class="{'first-menu-list-choice': 'base' == choiceItem}" @click="editMenu('base', resData.baseMenus[position])">
                <div class="first-menu-item">
                  <div
                    @click.stop="toggleShowArrow(resData.baseMenus[+position].menuInfo)"
                    v-if="resData.baseMenus[+position].subMenus && resData.baseMenus[+position].subMenus.length"
                  >
                    <Icon
                      type="md-arrow-dropright"
                      size="18"
                      style="margin-right:6px;"
                      v-if="!resData.baseMenus[+position].menuInfo.show_click_style"
                    />
                    <Icon
                      type="md-arrow-dropdown"
                      size="18"
                      style="margin-right:6px;"
                      v-if="!!resData.baseMenus[+position].menuInfo.show_click_style"
                    />
                  </div>
                  <div v-else style="margin:0 14px 0 6px;;">
                    <span>•</span>
                  </div>
                  <span>{{resData.baseMenus[+position].menuInfo.menuName}}</span>
                </div>
                <div class="first-menu-item">
                  <div>
                    <div
                      class="show_icon"
                      v-if="resData.baseMenus[+position].menuInfo.menuType == 'menu'"
                      @click.stop="editMenu('base'+'~', resData.baseMenus[+position])"
                    >
                      <Icon type="md-add-circle" size="17" />
                    </div>
                    <div v-if="resData.baseMenus[+position].putonAds != null && resData.baseMenus[+position].menuInfo.menuType != 'menu'" style="margin-right:3px;color:#f38e05;cursor:pointer;display:inline-block;">广告</div>
                  </div>
                  <!-- <div class="show_icon" @click.stop="delItem(findex,resData.baseMenus[position].menuInfo)" v-if="resData.baseMenus[position].menuType != 'menu'">
                    <Icon type="ios-trash" size="17" />
                  </div> -->
                </div>
              </div>
              <div v-if="!!resData.baseMenus[+position].menuInfo.show_click_style">
                <div
                  v-for="(sitem,sindex) in resData.baseMenus[+position].subMenus"
                  v-if="resData.baseMenus[+position].subMenus && resData.baseMenus[+position].subMenus.length"
                  :key="sindex"
                  class="first-menu-list secend-menu-list"
                   :class="{'first-menu-list-choice': 'base'+'-'+sindex == choiceItem}"
                  @click="editMenu('base'+'-'+sindex,sitem)"
                >
                  <div class="first-menu-item">
                    <span style="margin-right:14px;">•</span>
                    <span>{{sitem.menuInfo.menuName}}</span>
                  </div>
                  <div>
                    <!-- 线上菜单不能删除 -->
                    <div class="show_icon" @click.stop="delItem('base'+'-'+sindex,sitem.menuInfo)" v-if="sitem.menuInfo.onlineStatus != 1">
                      <Icon type="ios-trash" size="17" />
                    </div>
                    <div v-if="sitem.putonAds != null && sitem.menuInfo.menuType != 'menu'" style="margin-right:3px;color:#f38e05;cursor:pointer;display:inline-block;">广告</div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div class="con_right">
          <div class="right_line_1 clearfix">
            <div class="left_header right_header">
              <div class="title" style="margin-left: 8px">{{formData.title}}</div>
              <div class="left_header_create">
                <Button
                  type="primary"
                  size="small"
                  :disabled="!formData.menuType"
                  @click="confirmBtn"
                >确定</Button>
              </div>
            </div>
            <div class="form-opt-header">
              <div>
                <Button type="primary" size="small" @click="showAdListSelect = !showAdListSelect" v-show="!showAdListSelect && formData.menuType != 'menu'">编辑</Button>
              </div>
              <div v-show="showAdListSelect && formData.menuType != 'menu'">
                <Button type="primary" size="small" @click="showAdListSelect = !showAdListSelect">选择广告</Button>
                <!-- <Select v-model="selectedAd" style="width:200px;margin-left:24px;" clearable>
                  <Button type="primary" slot="prefix" size="small">选择广告</Button>
                  <Option v-for="item in adList" :value="item.adId" :key="item.adId">{{ item.adName }}</Option>
                </Select> -->
                <Select style="width: 200px;margin-left:28px;"
                    v-model="selectedAd"
                    filterable
                    clearable
                    remote
                    :remote-method="getAllAds"
                    :loading="getAdsLoading"
                    >
                    <Option v-for="item in allSerachAds" :value="item.adId" :key="item.adId">{{item.adName}}</Option>
                </Select>
                <div v-show="selectedAd && vendor=='1'" style="margin-top:10px;">
                  <span><i class="red-star">*</i>oppo送审备注：</span>
                  <Input type="textarea" v-model="adDesc" :autosize="true" style="width: 200px;"/>
                  <div style="color:red" v-if="showOPPOError">请填写oppo送审备注！</div>
                </div>
              </div>
              <div>
                <Button type="primary" size="small" v-if="formData.putonAds != null && formData.menuType != 'menu'" style="margin-right:6px" @click="checkAdDetails(formData.putonAds)">查看广告</Button>
              </div>
            </div>
            <div>
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">
                    <i class="red-star">*</i>名称:
                  </span>
                  <Input
                    v-model="formData.menuName"
                    placeholder="名称"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">菜单前置图片:</span>
                  <Input
                    v-model="formData.menuLogo.logo_front"
                    placeholder="菜单前置图片"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">菜单后置图片:</span>
                  <Input
                    v-model="formData.menuLogo.logo_back"
                    placeholder="菜单后置图片"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">
                    <i class="red-star">*</i>类型:
                  </span>
                  <RadioGroup v-model="formData.menuType">
                    <Radio label="url"></Radio>
                    <Radio label="menu" v-if="!menu.includes('~') && !menu.includes('-')"></Radio>
                    <Radio label="app" disabled></Radio>
                    <Radio label="phone" disabled></Radio>
                    <Radio label="sms" disabled></Radio>
                    <Radio label="快应用" disabled></Radio>
                  </RadioGroup>
                </label>
              </div>
              <div class="form-list" v-if="formData.menuType == 'app'">
                <label class="form-label">
                  <span class="form-title">
                    <!-- <i class="red-star">*</i> -->
                    应用名称:
                  </span>
                  <Input
                    v-model="formData.menuData.appName"
                    placeholder="应用名称"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.menuType == 'app' || formData.menuType == '快应用'">
                <label class="form-label">
                  <span class="form-title">
                    <!-- <i class="red-star">*</i> -->
                    包名:
                  </span>
                  <Input
                    v-model="formData.menuData.packageName"
                    placeholder="包名"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.menuType == 'app' || formData.menuType == '快应用'">
                <label class="form-label">
                  <span class="form-title">直达页面:</span>
                  <Input
                    v-model="formData.menuData.deepLink"
                    placeholder="直达页面"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.menuType == 'phone'">
                <label class="form-label">
                  <span class="form-title">电话号码:</span>
                  <Input
                    v-model="formData.menuData.phoneNumber"
                    placeholder="电话号码."
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.menuType == 'sms'">
                <label class="form-label">
                  <span class="form-title">运营商及短信码:</span>
                  <Input
                    v-model="formData.menuData.sms"
                    placeholder="运营商及短信码"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.menuType == '快应用'">
                <label class="form-label">
                  <span class="form-title">
                    <!-- <i class="red-star">*</i> -->
                    支持最小引擎版本号:
                  </span>
                  <Input
                    v-model="formData.menuData.versionNumber"
                    placeholder="支持最小引擎版本号"
                    style="min-width: 200px; width: 40%"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.menuType == 'url' && formData.putonAds && formData.putonAds.adShortUrl">
                <div class="form-label" style="display:flex;align-item:center;line-height:32px;justify-content:center;">
                  <span class="form-title">
                    <!-- <i class="red-star">*</i> -->
                    广告链接:
                  </span>
                  <p>
                    <Input v-model="formData.putonAds.adShortUrl" style="width:200px;" disabled />
                  </p>
                </div>
              </div>
              <div
                class="form-list"
                v-if="formData.menuType == 'app' || formData.menuType == '快应用'"
              >
                <div class="form-label" style="display:flex;align-item:center;line-height:32px;justify-content:center;">
                  <span class="form-title">
                    <!-- <i class="red-star">*</i> -->
                    链接:
                  </span>
                  <p>
                    <Input v-model="formData.menuData.url" style="width:200px;" clearable>
                      <Select v-model="formData.prepend" slot="prepend" style="width: 80px">
                        <Option value="http">http://</Option>
                        <Option value="https">https://</Option>
                      </Select>
                    </Input>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal v-model="showAdDetailsDialog" draggable scrollable title="广告详情">
            <div>
              <!-- <template v-for="(value, key, index) in adDetailsFields">
                <span class="ad-details-label" :key="index">{{value}}</span>
                <span class="ad-details-content" :key="index">
                  {{key==='positionNames' ? putonAds[key].join(',') : putonAds[key]}}
                  {{key === 'adPrice' ? '元' : ''}}
                </span><br :key="index">
              </template> -->
              <span class="ad-details-label">广告名称</span>
              <span class="ad-details-content">{{putonAds.adName}}</span><br>
              <span class="ad-details-label">单价</span>
              <span class="ad-details-content">{{putonAds.adPrice}}元</span><br>
              <span class="ad-details-label">结算方式</span>
              <span class="ad-details-content">{{putonAds.adChargedTypeName}}</span><br>
              <span class="ad-details-label">链接（短链）</span>
              <span class="ad-details-content">{{putonAds.adShortUrl}}</span><br>
              <span class="ad-details-label">链接（原链）</span>
              <span class="ad-details-content">{{putonAds.adUrl}}</span><br>
              <span class="ad-details-label">预算</span>
              <span class="ad-details-content">{{putonAds.adBudget}}</span><br>
              <span class="ad-details-label">广告位</span>
              <span class="ad-details-content">{{putonAds.positionNames && putonAds.positionNames.join(',')}}</span><br>
              <span class="ad-details-label">投放类型</span>
              <span class="ad-details-content">{{putonAds.adPutonTypeName}}</span><br>
              <span class="ad-details-label">客户名称</span>
              <span class="ad-details-content">{{putonAds.customerName}}</span><br>
            </div>
        </Modal>
      </div>
</template>
<script>
import axios from '@/libs/api.request'
import config from '../../adList/config';
const defaultData = {
  title: '',
  menuName: '', //菜单名称-》menuName
  menuLogo: {},
  menuData: {}, // 建议让后端把这个字段改成统一的，目前不处理该字段了
  menuType: '',//菜单类型-》menuType
  prepend: 'http', // url选择的时候选项http或者https
  url: '', //url类型的url输入
  isBaseMenu: 0,
  show_click_style: true
}
const typeIncludesFields = {
  url: [],
  app: ['appName', 'packageName', 'deepLink', 'url'],
  menu: [],
  phone: ['phoneNumber'],
  sms: ['sms'],
  '快应用': ['packageName', 'deepLink', 'versionName', 'url']
}
export default {
  props: ['middleTitle', 'menus', 'position', 'shop', 'vendor', 'ruleInfo'], // menus：当前菜单整体数据；positon:选中的左中右1、2、3; ruleInfo:限制条件
  data () {
    return {
      adDetailsFields: config.adDetailsFields,
      showAdListSelect: false,
      selectedAd: '', // 选择的要投放的广告
      formData: this.getDefaultFormData(),
      defaultFormData: JSON.parse(JSON.stringify(defaultData)),
      resData: JSON.parse(JSON.stringify(this.menus)),
      menu: '',
      showAdDetailsDialog: false,
      putonAds: {},
      parentData: {},
      adDesc: '', // oppo送审备注
      showOPPOError: false,
      getAdsLoading: false,
      allSerachAds: []
    }
  },
  created() {
  },
  watch: {
    position(val, oldVal) {
      let firstMenu = this.resData.queuedMenus[+this.position]
      this.formData = firstMenu && firstMenu.length && firstMenu[0].menuInfo ? JSON.parse(JSON.stringify(firstMenu[0].menuInfo)) : {}
      this.formData.title = this.formData.menuName ? this.formData.menuName : ''
      this.formData.menuLogo = this.formData.menuLogo ? this.formData.menuLogo : {}
      this.formData.menuData = this.formData.menuData ? this.formData.menuData : {}
      this.formData.putonAds = firstMenu && firstMenu.length && firstMenu[0].putonAds ? firstMenu[0].putonAds : null
      this.recoverAdsSelect()
    }
  },
  computed: {
    choiceItem () {
      let str = ''
      // 如果没有其他菜单，默认选中基础菜单
      if (!this.resData.queuedMenus 
        || !this.resData.queuedMenus[+this.position]
        || this.resData.queuedMenus[+this.position] && !this.resData.queuedMenus[+this.position].length) {
          this.formData.isBaseMenu = 1
          return 'base'
      }
      if (this.menu && this.menu != 'add') {
        if (this.menu.includes('-')) {
          str = this.menu
        } else {
          str = this.menu.split('~')[0]
        }
      }
      return str
    },
  },
  mounted () {},
  methods: {
    getDefaultFormData () {
      if (this.menus.queuedMenus &&  this.menus.queuedMenus[+this.position] && this.menus.queuedMenus[+this.position].length) {
        let curMenu = this.menus.queuedMenus[+this.position][0]
        let menuData = JSON.parse(JSON.stringify(curMenu.menuInfo))
        menuData.title = defaultData.menuName ? defaultData.menuName : ''
        menuData.menuLogo = menuData.menuLogo != '' ? JSON.parse(menuData.menuLogo) : {}
        // 等于url的时候后端数据返回的直接一个字符串，其他类型返回JSON串，后端不改，让这样处理。。。。。。。。。。
        menuData.menuData = menuData.menuData ? (menuData.menuType != 'url' ? JSON.parse(menuData.menuData) : {}) : {}
        menuData.putonAds = curMenu.putonAds ? curMenu.putonAds : null
        this.parentData = menuData
        return menuData
      }
      return JSON.parse(JSON.stringify(defaultData))
    },
    toggleShowArrow(item) {
      this.$set(item, 'show_click_style', !item.show_click_style)
    },
    // 每次切换的时候恢复广告选择和oppo送审
    recoverAdsSelect () {
      this.adDesc = ''
      this.selectedAd = ''
      this.showAdListSelect = false
    },
    editMenu (type, params) {
      this.menu = type.toString()
      this.recoverAdsSelect()
      if (this.menu == 'add') { //增加一级
        this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
        this.formData.title = '增加一级菜单'
        this.parentData = this.resData // 保存的时候需要传递父的信息
      } else if (this.menu.includes('~')) { // 增加二级
        this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
        this.formData.title = '增加二级菜单'
        this.parentData = params.menuInfo
      } else { // 编辑
        this.formData = JSON.parse(JSON.stringify(params.menuInfo))
        this.formData.putonAds = params.putonAds ? params.putonAds : null
        this.formData.menuLogo = this.formData.menuLogo ? this.formData.menuLogo : {}
        this.formData.menuData = this.formData.menuData ? this.formData.menuData : {}
        this.formData.title = params.menuName
        this.parentData = {
          ruleInfo: params.menuInfo.ruleInfo,
          ruleIndex: params.menuInfo.ruleIndex,
          menuId: this.menu.includes('-') ? params.menuInfo.parentMenuId : 0
        }
      }
      this.formData.isBaseMenu = this.menu.includes('base') ? 1 : 0
    },
    confirmBtn () {
      if (!this.shop) {
        this.$Message.error('请选择商户！')
        return
      }
      if (!this.vendor) {
        this.$Message.error('请选择厂商！')
        return
      }
      let firstMenu = JSON.parse(JSON.stringify(this.formData))
      // 如果是新建的整个大菜单
      if (this.resData.newMenu) {
        this.parentData = this.resData
        this.submitSaveMenu(firstMenu)
        return
      }
      let posMenus = this.menu.includes('base') 
        ? this.resData.baseMenus[+this.position] : this.resData.queuedMenus[+this.position]
      if (this.menu == 'add') { // 增加一级菜单
        posMenus.push({"menuInfo": firstMenu})
        this.menu = (posMenus.length - 1).toString()
        this.$set(this.formData, 'title', firstMenu.menuName + '[新增]')
      } else {
        if (this.menu.includes('-')) { // 编辑子菜单
          this.$set(this.menu.includes('base') 
            ? posMenus.subMenus : posMenus[this.menu.split('-')[0]].subMenus, this.menu.split('-')[1], {"menuInfo": firstMenu})
          this.formData.title = firstMenu.menuName + '[已修改]'
        } else if (this.menu.includes('~')) { // 增加子菜单
          let curPosMenus = this.menu.includes('base') ? posMenus.subMenus : posMenus[this.menu.split('~')[0]].subMenus
          if (curPosMenus) {
            curPosMenus.push(
              {"menuInfo": firstMenu}
            )
          } else {
            this.$set(curPosMenus, 'subMenus', [])
            curPosMenus.push(
              {"menuInfo": firstMenu}
            )
          }
          this.$set(this.menu.includes('base') ? posMenus.menuInfo : posMenus[this.menu.split('~')[0]].menuInfo, 'show_click_style', true)
          this.menu = this.menu.split('~')[0] + '-' + (curPosMenus.length -1)
          this.$set(this.formData, 'title', firstMenu.menuName + '[新增]')
        } else {  // 编辑一级菜单
          if (firstMenu.menuType != 'menu') {
            delete (firstMenu['subMenus'])
            delete (this.formData['subMenus'])
          }
          this.menu === 'base' ? this.$set(posMenus, "menuInfo", firstMenu) : this.$set(posMenus, Number(this.menu), {"menuInfo": firstMenu})
          this.$set(this.formData, 'title', firstMenu.menuName + '[已修改]')
        }
      }
      this.submitSaveMenu(this.formData)
    },
    /** 发请求保存当前菜单 */
    submitSaveMenu (data) {
      // oppo厂商下投放广告必须填写送审备注
      if (this.selectedAd && this.vendor == '1' && !this.adDesc) {
        this.showOPPOError = true
        return
      }
      data.partnerId = this.vendor
      data.shopId = this.shop
      data.ruleInfo = this.ruleInfo || ''
      // data.ruleInfo = this.parentData && this.parentData.ruleInfo ? this.parentData.ruleInfo : ''
      data.ruleIndex = this.parentData &&  this.parentData.ruleIndex ? this.parentData.ruleIndex : 0
      data.positionIndex = +this.position
      data.parentMenuId = this.parentData && this.parentData.menuId ? this.parentData.menuId : 0
      // let menuData = typeof data.menuData == 'object' ? data.menuData : JSON.parse(data.menuData)
      // Object.keys(menuData).map(item => {
      //   !typeIncludesFields[data.menuType].includes(item) &&
      //   delete menuData[item]
      // })
      delete data.putonAds
      data.adPositionType = 1
      data.isBaseMenu = this.menu.includes('base') ? 1 : 0
      let url = !data.menuId ? '/ad/menus/add/withads' : '/ad/menus/edit/withads'
      if (this.selectedAd) {
        data.adId = this.selectedAd
        data.adDesc = this.adDesc
      }
      axios.request({
        url: url,
        method: 'post',
        data: data
      }).then(res => {
        if (res.data.code === 0) {
          this.$Message.success('修改成功！')
          this.Observer.$emit('updateMenusList', {shopId: this.shop, partnerId: this.vendor})
        } else if (res.data.code === 200003) {
          this.$Message.error('选择投放的广告不存在！')
        } else {
          this.$Message.error('保存失败，请重新再试！')
        }
      }).catch(err => {
        this.$Message.error('请求失败，' + err + '，请稍后再试！')
      })
    },
    delItem (index, params) {
      // 老库里的数据menuId都等于0，如果是menuId=0,后端没有办法删除该数据，此处处理只有非0的才去发请求吧
      params.menuId !== 0 && axios.request({
        url: '/ad/menus/delete/' + params.menuId,
        method: 'get'
      }).then(res => {
        // 改成单条操作，删除之后立马发送请求，所以后续的前端数据处理可以不要，直接重新拉列表数据
        if (res.data.code === 0) {
          let i = index.toString()
          this.formData = JSON.parse(JSON.stringify(params))
          this.formData.title = params.menuName + '[已删除]'
          let optData = i.includes('base') ? this.resData.baseMenus[+this.position] : this.resData.queuedMenus[+this.position]
          if (i.includes('-')) {
            this.resData.queuedMenus[+this.position][i.split('-')[0]].subMenus.splice(i.split('-')[1], 1)
            this.menu = i.split('-')[0] + '~'
          } else {
            this.resData.queuedMenus[+this.position].splice(i, 1)
            this.menu = 'add'
          }
          this.$Message.success('删除成功！')
          this.Observer.$emit('updateMenusList', {shopId: this.shop, partnerId: this.vendor})
        }
      }).catch(err => {

      })
    },
    /** 单个菜单上下移动 */
    operateMenu (type, index) {
      let curMenus = this.resData.queuedMenus[+this.position]
      let moveMenu = []
      let params = {}

      if (type === 'up' && +index !== 0 || type === 'down' && +index !== curMenus.length - 1) {
        moveMenu = curMenus.splice(index, 1)
        let optIndex = type === 'up' && +index !== 0 ? (index - 1) : (index + 1)
        curMenus.splice(optIndex, 0, moveMenu[0])
        params[curMenus[optIndex].menuInfo.menuId] = optIndex + ''
        params[curMenus[index].menuInfo.menuId] = index + ''
        axios.request({
          url: '/ad/menus/edit/index/online',
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.code !== 0) {
            this.$Message.error('请求异常，请稍后再试！')
          } else {
            this.Observer.$emit('updateMenusList', {shopId: this.shop, partnerId: this.vendor})
          }
        }).catch(err => {
          this.$Message.error('请求失败，' + err + '，请稍后再试！')
        })
      }
    },
    checkAdDetails(item) {
      let _this = this
      if (item.adId === 0) {
        this.$Message.error('此菜单时线上同步菜单，没有绑定广告！')
        return
      }
      axios.request({
        url: '/ad/management/ads/adsGroupDetail',
        method: 'post',
        data: {
          adId: item.adId
        }
      }).then(res => {
        if (res.data.code === 0 && res.data.data != null) {
          _this.putonAds = res.data.data
          _this.$nextTick(() => {
            _this.showAdDetailsDialog = true
          }) 
        } else {
          _this.$Message.error('请求异常，请稍后再试！')
        }
        if (res.data.data == null) {
          _this.$Message.error('该广告没有详情！')
        }
      }).catch(err => {
        _this.$Message.error('请求失败，' + err + '，请稍后再试！')
      })
    },
     /** 获取所有商户 */
    getAllAds (query) {
        this.getAdsLoading = true
        axios.request({
            url: '/ad/management/ads/search',
            method: 'post',
            data: {adName: query}
        }).then(res => {
            if (res.data.code === 0) {
                this.allSerachAds = res.data.data
                this.getAdsLoading = false
            } else {
                // this.$Message.error('请求商户失败，请稍后再试！')
            }
        }).catch(err => {
            this.$Message.error('请求失败，' + err + '，请稍后再试！')
            this.getAdsLoading = false
        })
    },
    /** 单个上下线 */
    toggleAdOnline (index, item) {
      // 要求选中该菜单
      this.editMenu(index, item)
      let onlineId = ''
      if (item.putonAds == null || item.putonAds && !item.putonAds.id) {
        let subMenus = item.subMenus || []
        if (!subMenus.length) {
          this.$Message.error('此菜单不能上线！')
          return
        }
        let hasAdsSub = subMenus.filter(sub => {
          return sub.putonAds != null
        })
        if (hasAdsSub.length) {
          onlineId = hasAdsSub[0].putonAds.id
        } else {
          this.$Message.error('此菜单不能上线！')
          return
        }
      } else {
        onlineId = item.putonAds.id
      }
      axios.request({
        url: '/ad/puton/ads/online/manual/' + onlineId,
        method: 'post'
      }).then(res => {
        if (res.data.code === 200013) {
          this.$Message.error('oppo审核未通过')
          return
        }
        if (res.data.code === 0) {
          this.$Message.success('上线成功！')
          this.Observer.$emit('updateMenusList', {shopId: this.shop, partnerId: this.vendor})
        } else {
          this.$Message.success('上线失败！')
        }
      }).catch(err => {
          this.$Message.error('请求失败，' + err + '，请稍后再试！')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.menu-dialog {
}
.modal__content {
  display: flex;
  width: 100%;
  .con_left {
    min-width: 300px;
    display: inline-block;
    border-right: 1px solid #a0a0a0;
  }
  .con_right {
    flex: 1;
    min-width: 500px;
    display: inline-block;
    border: 1px solid rgb(239, 239, 242);
    border-left: 0;
    .left_header_create {
      margin-right: 6px;
    }
    .form-opt-header {
      margin-left: 20px;
      justify-content: space-between;
      display: flex;
      margin-top: 8px;
    }
  }
  .left_header {
    display: flex;
    height: 48px;
    line-height: 48px;
    justify-content: space-between;
    border-bottom:1px solid #a0a0a0;
    background: rgb(242, 243, 245);
  }
  .title {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
  }
  .menu-opt {
    width: 50px;
    position: absolute;
    bottom: 0px;
    right: -8px;
    line-height: 16px;
    cursor: pointer;
    color: rgb(42, 135, 235);
  }
  .first-menu-index {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 0px 1px 3px #888888;
    text-align: center;
    line-height: 20px;
    top: 6px;
  }
  .first-menu-list-online {
    color: white;
    background-color: rgb(45, 140, 240);
  }
  .first-menu {
    border: 1px solid #a0a0a0;
    border-radius: 4px;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 218px;
    margin-left: 25px;
    .first-menu-list {
      //background: rgb(220, 221, 222);
      min-height: 30px;
      display: flex;
      align-items: center;
      padding-left: 15px;
      font-weight: bold;
      justify-content: space-between;
      .first-menu-item {
        display: flex;
        align-items: center;
      }
    }
    .first-menu-list:hover {
      background: rgb(242, 243, 245);
      cursor: pointer;
      color: rgb(42, 135, 235);
      .show_icon {
        visibility: visible;
      }
    }
    .first-menu-list-choice{
        background: rgb(230, 230, 230);
        color: rgb(33, 103, 250);
    }
    .secend-menu-list {
      padding-left: 40px;
      font-weight: normal;
    }
  }
  .red-star {
    font-style: normal;
    color: red;
  }
  .form-title {
    display: inline-block;
    width: 120px;
    text-align: right;
    margin-right: 20px;
  }
  .form-label {
    margin: 0 auto;
  }
  .form-list:nth-child(1) {
    margin-top: 15px;
  }
  .form-list {
    // padding-left: 70px;
    margin-bottom: 15px;
    text-align: center;
  }
  .show_icon {
    visibility: hidden;
    margin-right: 4px;
    display: inline-block;
  }
}
.ad-details-label {
  font-weight: bold;
  margin-right: 20px;
  width: 90px;
  display: inline-block;
}
</style>
