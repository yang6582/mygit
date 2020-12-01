<template>
  <div>
    <Dropdown placement="bottom" trigger="click">
      <Button type="primary" :size="btnSize ? btnSize : 'small'">
        自定义列
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <Checkbox
          style="margin-left:10px;"
          :indeterminate="indeterminate"
          :value="checkAll"
          @click.prevent.native="handleCheckAll"
        >全选</Checkbox>
        <Divider size="small" style="margin: 2px 0;"></Divider>
        <CheckboxGroup v-model="selection" @on-change="checkBoxChange" style="margin-left: 10px;">
          <ul>
            <li v-for="item in columns" :key="item.key" style="list-style:none;">
              <Checkbox :label="item.key" :disabled="item._required">{{item.title}}</Checkbox>
            </li>
          </ul>
          <!--<Checkbox v-for="(item,index) in columns" :key="item.key" :label="item.key" :disabled="item._required" >{{item.title}}</Checkbox>-->
        </CheckboxGroup>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: "columnsSelect",
  data() {
    return {
      selection: localStorage.getItem(
        this.$route.path + `$table_${this.columnsNum}`
      )
        ? localStorage
            .getItem(this.$route.path + `$table_${this.columnsNum}`)
            .split(",")
        : this.columns.map(i => i.key),
      indeterminate: false,
      checkAll:
        this.columns.map(item => item.key).length === this.columns.length
      //selection: localStorage.getItem(this.$route.path + `$table_${this.columnsNum}`) ? localStorage.getItem(this.$route.path + `$table_${this.columnsNum}`).split(',') : ['ad_name', 'ad_id', 'custom_username', 'url', 'short_url_data', 'balance_type_str', 'price', 'day_budget', 'status_str', 'oppo_status_str', 'ad_scope', 'action', 'create_chain']
    };
  },
  props: ["columns", "columnsNum",'btnSize'],
  created() {
    this.checkBoxChange(this.selection);
  },
  methods: {
    checkBoxChange(checkedGroup) {
      if (checkedGroup.length === this.columns.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (checkedGroup.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
      this.$emit(
        "columns-change",
        this.columns.filter(i => checkedGroup.includes(i.key))
      );
      localStorage.setItem(
        this.$route.path + `$table_${this.columnsNum}`,
        this.selection.join(",")
      );
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.selection = this.columns.map(item => item.key);
      } else {
        this.selection = [];
      }
      localStorage.setItem(
        this.$route.path + `$table_${this.columnsNum}`,
        this.selection.join(",")
      );
      this.checkBoxChange(this.selection);
    }
  },
  watch: {
    columnsNum(newVal, oldVal) {
      this.selection = localStorage.getItem(
        this.$route.path + `$table_${this.columnsNum}`
      )
        ? localStorage
            .getItem(this.$route.path + `$table_${this.columnsNum}`)
            .split(",")
        : this.columns.map(i => i.key);
      this.checkBoxChange(this.selection);
    }
  }
};
</script>

<style scoped>
</style>
