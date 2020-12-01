<template>
  <div class="relevanceCom">
    <div>
      <div
        style="height:40px;border-bottom: 1px solid #e9e9e9;line-height:40px;padding-left:20px;font-weight:bold;background:#eff1f2;"
      >一级页面</div>
      <div style="border-bottom: 1px solid #e9e9e9;height:40px;">
        <Checkbox
          :indeterminate="indeterminate1"
          :value="checkAll1"
          @click.prevent.native="handleCheckAll1"
          class="checkbox"
        >
          <span style="margin-left:10px;">全部</span>
        </Checkbox>
      </div>
      <CheckboxGroup
        style="flex:1;overflow:auto;"
        v-model="checkAllGroup1"
        @on-change="checkAllGroupChange1"
        size="large"
      >
        <Checkbox
          :label="item.id"
          class="checkbox"
          v-for="(item,index) in permissionList"
          :key="item.id"
        >
          <span style="margin-left:10px;">{{item.resourceName}}</span>
        </Checkbox>
      </CheckboxGroup>
    </div>
    <div v-if="secondList && secondList.length">
      <div
        style="height:40px;border-bottom: 1px solid #e9e9e9;line-height:40px;padding-left:20px;font-weight:bold;background:#eff1f2;"
      >二级页面</div>
      <div style="border-bottom: 1px solid #e9e9e9;height:40px;">
        <Checkbox
          :indeterminate="indeterminate2"
          :value="checkAll2"
          @click.prevent.native="handleCheckAll2"
          class="checkbox"
        >
          <span style="margin-left:10px;">全部</span>
        </Checkbox>
      </div>
      <CheckboxGroup
        style="flex:1;overflow:auto;"
        v-model="checkAllGroup2"
        @on-change="checkAllGroupChange2"
        size="large"
      >
        <Checkbox
          :label="item.id"
          class="checkbox"
          v-for="(item,index) in secondList"
          :key="item.id"
        >
          <span style="margin-left:10px;">{{item.resourceName}}</span>
        </Checkbox>
      </CheckboxGroup>
    </div>
    <div v-if="thirdList && thirdList.length" style="border-right: none;">
      <div
        style="height:40px;border-bottom: 1px solid #e9e9e9;line-height:40px;padding-left:20px;font-weight:bold;background:#eff1f2;"
      >按钮权限</div>
      <div style="border-bottom: 1px solid #e9e9e9;height:40px;">
        <Checkbox
          :indeterminate="indeterminate3"
          :value="checkAll3"
          @click.prevent.native="handleCheckAll3"
          class="checkbox"
        >
          <span style="margin-left:10px;">全部</span>
        </Checkbox>
      </div>
      <CheckboxGroup
        style="flex:1;overflow:auto;"
        v-model="checkAllGroup3"
        @on-change="checkAllGroupChange3"
        size="large"
      >
        <Checkbox
          :label="item.id"
          class="checkbox"
          v-for="(item,index) in thirdList"
          :key="item.id"
        >
          <span style="margin-left:10px;">{{item.resourceName}}</span>
        </Checkbox>
      </CheckboxGroup>
    </div>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import config from "../config";
export default {
  name: "relevanceCom",
  props: ["permissionList", "rowPermission"],
  components: {},
  data() {
    return {
      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkAllGroup1: [],
      checkAllGroup2: [],
      checkAllGroup3: [],
      permissionListOld: [
        {
          id: "1",
          resourceName: "一级页面1",
          sonResources: [
            {
              id: "11",
              resourceName: "二级页面11",
              sonResources: [
                {
                  id: "111",
                  resourceName: "按钮111"
                },
                {
                  id: "112",
                  resourceName: "按钮112"
                }
              ]
            },
            {
              id: "12",
              resourceName: "二级页面12",
              sonResources: [
                {
                  id: "121",
                  resourceName: "按钮121"
                }
              ]
            }
          ]
        },
        {
          id: "2",
          resourceName: "一级页面2",
          sonResources: [
            {
              id: "21",
              resourceName: "二级页面21",
              sonResources: [
                {
                  id: "211",
                  resourceName: "按钮211"
                },
                {
                  id: "212",
                  resourceName: "按钮212"
                }
              ]
            },
            {
              id: "22",
              resourceName: "二级页面22",
              sonResources: [
                {
                  id: "221",
                  resourceName: "按钮221"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  computed: {
    secondList() {
      let arr = [];
      this.checkAllGroup1.forEach(item => {
        this.permissionList.forEach(pitem => {
          if (item == pitem.id) {
            arr = [...arr, ...pitem.sonResources];
          }
        });
      });
      return arr;
    },
    thirdList() {
      let arr = [];
      this.checkAllGroup2.forEach(item => {
        this.secondList.forEach(pitem => {
          if (item == pitem.id) {
            arr = [...arr, ...pitem.sonResources];
          }
        });
      });
      return arr;
    }
  },
  created() {},
  methods: {
    clearData() {
      this.indeterminate1 = false;
      this.indeterminate2 = false;
      this.indeterminate3 = false;
      this.checkAll1 = false;
      this.checkAll2 = false;
      this.checkAll3 = false;
      this.checkAllGroup1 = [];
      this.checkAllGroup2 = [];
      this.checkAllGroup3 = [];
    },
    handleCheckAll1() {
      if (this.indeterminate1) {
        this.checkAll1 = false;
      } else {
        this.checkAll1 = !this.checkAll1;
      }
      this.indeterminate1 = false;
      if (this.checkAll1) {
        let idArr = this.permissionList.map(item => {
          return item.id;
        });
        this.checkAllGroup1 = idArr;
      } else {
        this.checkAllGroup1 = [];
        this.checkAll2 = false;
        this.indeterminate2 = false;
        this.checkAllGroup2 = [];
        this.checkAll3 = false;
        this.indeterminate3 = false;
        this.checkAllGroup3 = [];
      }
    },
    handleCheckAll2() {
      if (this.indeterminate2) {
        this.checkAll2 = false;
      } else {
        this.checkAll2 = !this.checkAll2;
      }
      this.indeterminate2 = false;

      if (this.checkAll2) {
        let idArr = this.secondList.map(item => {
          return item.id;
        });
        this.checkAllGroup2 = idArr;
      } else {
        this.checkAllGroup2 = [];
        this.checkAll3 = false;
        this.indeterminate3 = false;
        this.checkAllGroup3 = [];
      }
    },
    handleCheckAll3() {
      if (this.indeterminate3) {
        this.checkAll3 = false;
      } else {
        this.checkAll3 = !this.checkAll3;
      }
      this.indeterminate3 = false;

      if (this.checkAll3) {
        let idArr = this.thirdList.map(item => {
          return item.id;
        });
        this.checkAllGroup3 = idArr;
      } else {
        this.checkAllGroup3 = [];
      }
    },
    checkAllGroupChange1(data) {
      if (data.length === this.permissionList.length) {
        this.indeterminate1 = false;
        this.checkAll1 = true;
      } else if (data.length > 0) {
        this.indeterminate1 = true;
        this.checkAll1 = false;
      } else {
        this.indeterminate1 = false;
        this.checkAll1 = false;
        this.checkAll2 = false;
        this.indeterminate2 = false;
        this.checkAllGroup2 = [];
        this.checkAll3 = false;
        this.indeterminate3 = false;
        this.checkAllGroup3 = [];
      }
      if (this.checkAllGroup1.length) {
        let arr = [];
        for (let i = 0; i < this.checkAllGroup2.length; i++) {
          for (let j = 0; j < this.secondList.length; j++) {
            if (
              this.secondList[j].id == this.checkAllGroup2[i] &&
              this.checkAllGroup1.indexOf(this.secondList[j].parentId) > -1
            ) {
              arr.push(this.checkAllGroup2[i]);
              break;
            }
          }
        }
        this.checkAllGroup2 = arr;
        this.checkAllGroupChange2(this.checkAllGroup2);
      }
    },
    checkAllGroupChange2(data) {
      if (data.length === this.secondList.length) {
        this.indeterminate2 = false;
        this.checkAll2 = true;
      } else if (data.length > 0) {
        this.indeterminate2 = true;
        this.checkAll2 = false;
      } else {
        this.indeterminate2 = false;
        this.checkAll2 = false;
        this.checkAll3 = false;
        this.indeterminate3 = false;
        this.checkAllGroup3 = [];
      }
      if (this.checkAllGroup2.length) {
        let arr = [];
        for (let i = 0; i < this.checkAllGroup3.length; i++) {
          for (let j = 0; j < this.thirdList.length; j++) {
            if (
              this.thirdList[j].id == this.checkAllGroup3[i] &&
              this.checkAllGroup2.indexOf(this.thirdList[j].parentId) > -1
            ) {
              arr.push(this.checkAllGroup3[i]);
              break;
            }
          }
        }
        this.checkAllGroup3 = arr;

        this.checkAllGroupChange3(this.checkAllGroup3);
      }
    },
    checkAllGroupChange3(data) {
      if (data.length === this.thirdList.length) {
        this.indeterminate3 = false;
        this.checkAll3 = true;
      } else if (data.length > 0) {
        this.indeterminate3 = true;
        this.checkAll3 = false;
      } else {
        this.indeterminate3 = false;
        this.checkAll3 = false;
      }
    }
  },
  watch: {
    rowPermission(newVal, oldVal) {
      this.checkAllGroup1 = newVal.first;
      this.checkAllGroup2 = newVal.second;
      this.checkAllGroup3 = newVal.third;
      if (this.checkAllGroup1.length) {
        this.checkAllGroupChange1(this.checkAllGroup1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.relevanceCom {
  display: flex;
  border: 1px solid rgb(215, 217, 222);

  > div {
    width: 33.3%;
    border-right: 1px solid rgb(215, 217, 222);
    height: 500px;
    display: flex;
    flex-direction: column;
    .checkbox {
      width: 100%;
      height: 40px;
      padding-left: 20px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
