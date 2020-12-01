<template>
    <div style="margin-left:-76px;">
        <div v-for="(item, index) in menus" :key="item.index" style="display:flex;align-items:flex-end;">
            <div class="menuEdit" >
                <div class="menuSet">
                    <div class="menuLeft">
                        <h3>菜单</h3>
                        <Button v-for="(value, key) in memuPos" :key="key"
                            :style="{'background-color':currentMenu[index] === key ? '#2d8cf0':'#fff', 'color': currentMenu[index] === key ? '#fff' : '#515a6e'}"
                            @click="choiceMenuPos(key, index)">{{value}}</Button>
                    </div>
                    <MenuContent :middleTitle="memuPos[currentMenu[index]]" :menus="filterMenus(item)"
                        :position="+currentMenu[index]" :shop="shop" :vendor="vendor" :ruleInfo="limitValue[index]"></MenuContent>
                </div>
                <div class="menuLimit">
                    <Select v-model="limitCondition[index]" style="width:150px" placeholder="限制条件" @on-change="((val) => {selectLimitConditions(val, index)})">
                        <Option v-for="item in limitOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="limitValue[index]" placeholder="请输入限制条件，不输入对所有用户生效" style="width: 300px" clearable/>
                </div>
            </div>
            <div class="menuOpt">
                <!-- 因为移动要发请求，新建的空数据没法传值，故新建的不能移动 -->
                <Icon type="md-arrow-round-up" size="18" @click="operateMenu('up', index)"/>
                <Icon type="md-arrow-round-down" size="18" @click="operateMenu('down', index)"/>
                <Icon type="md-add-circle" size="18"  @click="operateMenu('add', index)"/>
                <Icon type="ios-trash" size="18"  @click="operateMenu('del', index)"/>
            </div>
        </div>
    </div>
</template>
<script>
import MenuContent from './menuContent'
import config from '../config.js'
export default {
  name: 'menuEdit',
  props: ['menus', 'shop', 'vendor'],
  components: { MenuContent },
  data () {
    return {
      memuPos: {
        '1': '左菜单',
        '2': '中菜单',
        '3': '右菜单'
      },
      limitOptions: config.limitOptions,
      limitCondition: [],
      limitValue: [],
      currentMenu: []
    }
  },
  created() {
  },
  watch: {
      menus() {
            this.menus && this.menus.map((item, index) => {
            !this.currentMenu[index] && (this.currentMenu[index] = '1')
            this.$set(this.limitValue, index, item.ruleInfo)
        })
      }
  },
  methods: {
    choiceMenuPos (val, index) {
      this.$set(this.currentMenu, index, val)
    },
    selectLimitConditions(val, limit) {
        if (val) {       
            let express = this.limitValue[limit] ? (this.limitValue[limit] + val) : val
            this.$set(this.limitValue, limit, express)
        }
        this.$nextTick(() => {
            this.$set(this.limitCondition, limit, '')
        })
    },
    operateMenu (type, index) {
        this.$emit('opt-menu', {type, index})
    },
    /** 
     * 过滤掉 queuedMenus中包含的基础菜单
     * */
    filterMenus (item) {
        let copyItem = JSON.parse(JSON.stringify(item))
        copyItem.queuedMenus && Object.keys(copyItem.queuedMenus).map(index => {
            let subMenu = copyItem.queuedMenus[index]
            for (var pos = 0; pos < subMenu.length; pos++) {
                if (subMenu[pos].menuInfo && subMenu[pos].menuInfo.isBaseMenu === 1) {
                    subMenu.splice(pos, 1)
                    pos--
                }
            }
        })
        return copyItem
    }
  }
}
</script>
<style lang="less" scoped>
.menuEdit {
    // width: 100%;
    min-width: 700px;
    border: 1px solid #a0a0a0;
    border-radius: 6px;
    overflow-x: scroll;
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 10px;
    .menuSet {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #a0a0a0;
        h3 {
            border-bottom: 1px solid #a0a0a0;
            height: 48px;
            line-height: 48px;
            background: #f2f3f5;
        }
        .menuLeft {
            border-right: 1px solid #a0a0a0;
            width: 90px;
            text-align: center;
            button {
                margin: 16px 4px 4px 0px;
            }
            button:last-child {
                margin-bottom: 16px
            }
        }
        .menuMiddle {
            width: 100%;
            display: flex;
        }
    }
    .menuLimit {
        margin: 10px;
    }
}
.menuOpt {
    width: 50px;
    margin-bottom: 10px;
    line-height: 16px;
    cursor: pointer;
    color: rgb(42, 135, 235);
}
</style>
