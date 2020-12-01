<template>
    <!--修改弹窗-->
      <div class="modal__content">
        <div class="con_left">
          <div class="left_header">
            <div class="title">菜单管理</div>
            <div class="left_header_create">
              <!-- <i-button
                type="primary"
                size="small"
                title="新增一级菜单"
                @click="editMenu('add')"
                :disabled="resData.info.sms_menus.length >= 3"
              >新增</i-button>-->
              <i-button type="primary" size="small" title="新增一级菜单" @click="editMenu('add')">新增</i-button>
            </div>
          </div>
          <div>
            <div v-for="(fitem,findex) in resData.info.sms_menus" :key="findex" style="overflow:hidden">
              <div class="first-menu">
              <div class="first-menu-list" @click="editMenu(findex,fitem)" :class="{'first-menu-list-choice': findex == choiceItem}">
                <div class="first-menu-item">
                  <div
                    @click.stop="fitem.show_click_style = !fitem.show_click_style"
                    v-if="fitem.submenu && fitem.submenu.length"
                  >
                    <Icon
                      type="md-arrow-dropright"
                      size="18"
                      style="margin-right:6px;"
                      v-if="!fitem.show_click_style"
                    />
                    <Icon
                      type="md-arrow-dropdown"
                      size="18"
                      style="margin-right:6px;"
                      v-if="fitem.show_click_style"
                    />
                  </div>
                  <div v-else style="margin:0 14px 0 6px;;">
                    <span>•</span>
                  </div>
                  <span>{{fitem.name}}</span>
                </div>
                <div class="first-menu-item">
                  <div
                    class="show_icon"
                    v-if="fitem.type == 'menu'"
                    @click.stop="editMenu(findex+'~')"
                  >
                    <Icon type="md-add-circle" size="17" />
                  </div>
                  <div class="show_icon" @click.stop="delItem(findex,fitem)">
                    <Icon type="ios-trash" size="17" />
                  </div>
                </div>
              </div>
              <div v-if="fitem.show_click_style">
                <div
                  v-for="(sitem,sindex) in fitem.submenu"
                  :key="sindex"
                  class="first-menu-list secend-menu-list"
                   :class="{'first-menu-list-choice': findex+'-'+sindex == choiceItem}"
                  @click="editMenu(findex+'-'+sindex,sitem)"
                >
                  <div class="first-menu-item">
                    <span style="margin-right:14px;">•</span>
                    <span>{{sitem.name}}</span>
                  </div>
                  <div class="show_icon" @click.stop="delItem(findex+'-'+sindex,sitem)">
                    <Icon type="ios-trash" size="17" />
                  </div>
                </div>
              </div>
              </div>
              <div clsss="menu-opt">
                <Icon type="md-add-circle" size="18" />
                <Icon type="ios-trash" size="18" />
                <Icon type="md-arrow-round-up" size="18"/>
                <Icon type="md-arrow-round-down" size="18"/>
              </div>
            </div>
          </div>
        </div>
        <div class="con_right">
          <div class="right_line_1 clearfix">
            <div class="left_header right_header">
              <div class="title">{{formData.title}}</div>
              <div class="left_header_create">
                <i-button
                  type="primary"
                  size="small"
                  :disabled="!formData.type"
                  @click="confirmBtn"
                >确定</i-button>
              </div>
            </div>
            <div v-if="formData.type">
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">
                    <i class="red-star">*</i>名称:
                  </span>
                  <Input
                    v-model="formData.name"
                    placeholder="名称"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">菜单前置图片:</span>
                  <Input
                    v-model="formData.beforeImg"
                    placeholder="菜单前置图片"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">菜单后置图片:</span>
                  <Input
                    v-model="formData.afterImg"
                    placeholder="菜单后置图片"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list">
                <label class="form-label">
                  <span class="form-title">
                    <i class="red-star">*</i>类型:
                  </span>
                  <RadioGroup v-model="formData.type">
                    <Radio label="url"></Radio>
                    <Radio label="app"></Radio>
                    <Radio label="menu" v-if="!menu.includes('~') && !menu.includes('-')"></Radio>
                    <Radio label="phone"></Radio>
                    <Radio label="sms"></Radio>
                    <Radio label="快应用"></Radio>
                  </RadioGroup>
                </label>
              </div>
              <div class="form-list" v-if="formData.type == 'app'">
                <label class="form-label">
                  <span class="form-title">
                    <i class="red-star">*</i>应用名称:
                  </span>
                  <Input
                    v-model="formData.appName"
                    placeholder="应用名称"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.type == 'app' || formData.type == '快应用'">
                <label class="form-label">
                  <span class="form-title">
                    <i class="red-star">*</i>包名:
                  </span>
                  <Input
                    v-model="formData.packageName"
                    placeholder="包名"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.type == 'app' || formData.type == '快应用'">
                <label class="form-label">
                  <span class="form-title">直达页面:</span>
                  <Input
                    v-model="formData.throughPage"
                    placeholder="直达页面"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.type == 'phone'">
                <label class="form-label">
                  <span class="form-title">电话号码:</span>
                  <Input
                    v-model="formData.phoneNumber"
                    placeholder="电话号码."
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.type == 'sms'">
                <label class="form-label">
                  <span class="form-title">运营商及短信码:</span>
                  <Input
                    v-model="formData.operator"
                    placeholder="运营商及短信码"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div class="form-list" v-if="formData.type == '快应用'">
                <label class="form-label">
                  <span class="form-title">
                    <i class="red-star">*</i>支持最小引擎版本号:
                  </span>
                  <Input
                    v-model="formData.versionNumber"
                    placeholder="支持最小引擎版本号"
                    style="width: 300px"
                    clearable
                  />
                </label>
              </div>
              <div
                class="form-list"
                v-if="formData.type == 'url' || formData.type == 'app' || formData.type == '快应用'"
              >
                <div class="form-label" style="display:flex;align-item:center;line-height:32px;">
                  <span class="form-title">
                    <i class="red-star">*</i>链接:
                  </span>
                  <p>
                    <Input v-model="formData.url" style="width:300px;" clearable>
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
      </div>
</template>
<script>
// import axios from "axios";
// import createSign from '@/utils/interceptors'
export default {
  data () {
    return {
      formData: {
        title: '',
        name: '',
        beforeImg: '',
        afterImg: '',
        type: '',
        prepend: 'http',
        url: '',
        appName: '',
        throughPage: '',
        packageName: '',
        phoneNumber: '',
        operator: '',
        versionNumber: '',
        show_click_style: true
      },
      defaultFormData: {
        title: '',
        name: '一级菜单',
        beforeImg: '',
        afterImg: '',
        type: 'url',
        prepend: 'http',
        url: '',
        appName: '',
        throughPage: '',
        packageName: '',
        phoneNumber: '',
        operator: '',
        versionNumber: ''
      },
      resData: {
        info: {
          id: '21544',
          company_id: '1',
          batch_id: '201908161843050',
          merchant_name: '曾熊测试',
          manual_intervention: '2',
          // sms_menus: [],
          sms_menus: [
          //   {
          //     name: 'A83测试111--112',
          //     beforeImg: '0-a',
          //     afterImg: '0-b',
          //     type: 'url',
          //     prepend: 'http',
          //     url: 'www.0.com',
          //     appName: '',
          //     throughPage: '',
          //     packageName: '',
          //     phoneNumber: '',
          //     operator: '',
          //     versionNumber: '',
          //     show_click_style: true
          //   },
          //   {
          //     name: 'xy-zi',
          //     show_click_style: false,
          //     beforeImg: '',
          //     afterImg: '',
          //     type: 'app',
          //     prepend: 'http',
          //     url: '',
          //     appName: '',
          //     throughPage: '',
          //     packageName: '',
          //     phoneNumber: '',
          //     operator: '',
          //     versionNumber: ''
          //   },
            {
              name: 'xy-meun',
              type: 'menu',
              submenu: [
                {
                  name: 'url',
                  beforeImg: '',
                  afterImg: '',
                  type: 'url',
                  prepend: 'http',
                  url: '',
                  appName: '',
                  throughPage: '',
                  packageName: '',
                  phoneNumber: '',
                  operator: '',
                  show_click_style: false,
                  isCommercial: 0
                },
                {
                  name: 'app',
                  beforeImg: '',
                  afterImg: '',
                  type: 'app',
                  prepend: 'http',
                  url: '',
                  appName: '',
                  throughPage: '',
                  packageName: '',
                  phoneNumber: '',
                  operator: ''
                },
                {
                  name: 'phone',
                  beforeImg: '',
                  afterImg: '',
                  type: 'phone',
                  prepend: 'http',
                  url: '',
                  appName: '',
                  throughPage: '',
                  packageName: '',
                  phoneNumber: '',
                  operator: '',
                  show_click_style: false
                },
                {
                  name: 'sms',
                  beforeImg: '',
                  afterImg: '',
                  type: 'sms',
                  prepend: 'http',
                  url: '',
                  appName: '',
                  throughPage: '',
                  packageName: '',
                  phoneNumber: '',
                  operator: '',
                  show_click_style: false
                },
                {
                  name: '快应用',
                  beforeImg: '',
                  afterImg: '',
                  type: '快应用',
                  prepend: 'http',
                  url: '',
                  appName: '',
                  throughPage: '',
                  packageName: '',
                  phoneNumber: '',
                  operator: '',
                  show_click_style: false
                }
              ],
              show_click_style: true
            }
          ],
          asn: '0',
          merchant_status: '2',
          custom_time: '0',
          create_time: '2019-04-18 15:51:55',
          update_time: '2019-08-16 18:43:05'
        }
      },
      menu: ''
    }
  },
  computed: {
    choiceItem () {
      let str = ''
      if (this.menu && this.menu != 'add') {
        if (this.menu.includes('-')) {
          str = this.menu
        } else {
          str = this.menu.split('~')[0]
        }
      }
      //console.log(str)
      return str
    }
  },
  mounted () {},
  methods: {
    // ok_change () {},
    // cancel_change () {},
    // openMenuDialog () {
    //   this.modal_change = true
    // },
    editMenu (type, params) {
      this.menu = type.toString()
      if (this.menu == 'add') {
        this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
        this.formData.title = '增加一级菜单'
      } else if (this.menu.includes('~')) {
        this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
        this.formData.title = '增加二级菜单'
      } else {
        this.formData = JSON.parse(JSON.stringify(params))
        this.formData.title = params.name
      }
    },
    confirmBtn () {
      let firstMenu = JSON.parse(JSON.stringify(this.formData))
      //console.log(firstMenu, this.menu)
      if (this.menu == 'add') {
        this.resData.info.sms_menus.push(firstMenu)
        this.menu = (this.resData.info.sms_menus.length - 1).toString()
        this.$set(this.formData, 'title', firstMenu.name + '[新增]')
      } else {
        if (this.menu.includes('-')) {
          this.$set(this.resData.info.sms_menus[this.menu.split('-')[0]].submenu,
            this.menu.split('-')[1], firstMenu
          )
          this.formData.title = firstMenu.name + '[已修改]'
        } else if (this.menu.includes('~')) {
          if (this.resData.info.sms_menus[this.menu.split('~')[0]].submenu) {
            this.resData.info.sms_menus[this.menu.split('~')[0]].submenu.push(
              firstMenu
            )
            //console.log(this.resData)
          } else {
            this.$set(this.resData.info.sms_menus[this.menu.split('~')[0]], 'submenu', [])
            this.resData.info.sms_menus[this.menu.split('~')[0]].submenu.push(
              firstMenu
            )
          }
          this.$set(this.resData.info.sms_menus[this.menu.split('~')[0]], 'show_click_style', true)
          this.menu =
            this.menu.split('~')[0] +
            '-' +
            (this.resData.info.sms_menus[this.menu.split('~')[0]].submenu
              .length -
              1)
          this.$set(this.formData, 'title', firstMenu.name + '[新增]')
        } else {
          if (firstMenu.type != 'menu') {
            delete (firstMenu['submenu'])
            delete (this.formData['submenu'])
          }
          this.$set(this.resData.info.sms_menus, Number(this.menu), firstMenu)
          this.$set(this.formData, 'title', firstMenu.name + '[已修改]')
        }
      }
    },
    delItem (index, params) {
      //console.log(index, params)
      let i = index.toString()
      this.formData = JSON.parse(JSON.stringify(params))
      this.formData.title = params.name + '[已删除]'
      if (i.includes('-')) {
        this.resData.info.sms_menus[i.split('-')[0]].submenu.splice(i.split('-')[1], 1)
        this.menu = i.split('-')[0] + '~'
      } else {
        this.resData.info.sms_menus.splice(i, 1)
        this.menu = 'add'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.menu-dialog {
}
.modal__content {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: 900px;
  .con_left {
    width: 300px;
    border: 1px solid rgb(239, 239, 242);
  }
  .con_right {
    width: 600px;
    border: 1px solid rgb(239, 239, 242);
    border-left: 0;
  }
  .left_header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: rgb(242, 243, 245);
  }
  .title {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
  }
  .menu-opt {
    float: left;
    width: 50px;
  }
  .first-menu {
    border: 1px solid #a0a0a0;
    border-radius: 4px;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 210px;
    float: left;
    .first-menu-list {
      //background: rgb(220, 221, 222);
      height: 30px;
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
    padding-left: 70px;
    margin-bottom: 15px;
  }
  .show_icon {
    visibility: hidden;
    margin-right: 20px;
  }
}
</style>
