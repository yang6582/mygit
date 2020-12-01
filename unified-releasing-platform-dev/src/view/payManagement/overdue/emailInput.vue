<template>
    <div class="emailInput">
        <input ref="input" :value="value" @input="updateVal(value, $event.target.value)" type="text" placeholder="邮箱" style="width: 100%;">
        <Button @click="saveEmails" type="primary" ghost style="margin-left: 8px;">保存</Button>
        <transition name="fade">
            <div class="tipBox" v-if="showList && listData.length">
                <span v-for="item in listData" class="select-item" @click="selectEmailHandler(item)">{{item}}</span>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'emailInput',
    props: ['value', 'splitString'],
    mounted() {
        let _this = this
        // 绑定事件--当点击body时隐藏下拉框
        document.addEventListener('click', (e) => {
            if (!_this.$el.contains(e.target)) {
                _this.showList = false
            } else {
            }
        })
    },
    data() {
        return {
            showList: false,
            allData: localStorage.getItem(this.$route.path + `$email_input`) 
                ? localStorage.getItem(this.$route.path + `$email_input`).split(this.splitString)
                : [], // 全部缓存的数据（已经去重）
            listData: [], // 展示的匹配数据
            oldArray: [],
            newArray: [],
            diffIndex: undefined
        }
    },
    computed: {
        // listData
    },
    watch: {

    },
    methods: {
        updateVal(oldVal, val) {
            this.oldArray = oldVal.split(this.splitString)
            this.newArray = val.split(this.splitString)
            // console.log('old: ' + oldVal)
            // console.log('new：' + val)

            this.newArray.map((item, index) => {
                if (item != this.oldArray[index]) {
                    this.diffIndex = index
                }
            })
            // console.log('diffIndex : ' + this.diffIndex)
            // 在这里做搜索，然后展示列表，如果末尾是分号则不进行匹配
            if (val.charAt(val.length - 1) == this.splitString && this.diffIndex == undefined) {
                return
            }
            let diffItem = this.newArray[this.diffIndex]
            this.listData = this.allData.filter(item => {
                return item.includes(diffItem)
            })
            this.showList = true
            // 手动触发父组件的input事件并将值传给父组件
            this.$emit('input', val);  
        },
        leaveTipBoxHandler() {
            this.showList = false
        },
        selectEmailHandler(val) {
            if (this.diffIndex != undefined) {
                this.newArray[this.diffIndex] = val
                this.showList = false
                this.$emit('input', this.newArray.join(this.splitString));  
            }
        },
        saveEmails() {
            this.$emit('save', this.value, (validated) => {
                if (validated) {
                    let oldSave = this.allData
                    let joinSave = oldSave.concat(this.value.split(this.splitString))
                    if (this.value.charAt(this.value.length - 1) == this.splitString) { //末尾是分隔符，删掉存储
                        joinSave.pop()
                    }
                    let newSave = Array.from(new Set(joinSave))
                    localStorage.setItem(
                        this.$route.path + `$email_input`,
                        newSave.join(this.splitString)
                    );
                    this.allData = newSave
                    this.$Message.info('邮箱本地保存成功！')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.emailInput {
    position: relative;
    display: flex;
    width: 117%;
    input {
        border-radius: 4px;
        border: 1px solid #ccc;
        text-indent: 8px;
        color: #555555;
    }
    input::-moz-input-placeholder {
        text-indent: 8px;
        color: #c2c2c3
    }
    input::-webkit-input-placeholder {
        text-indent: 8px;
        color: #c2c2c3
    }
    .tipBox {
        position: absolute;
        top: 34px;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        background-color: #fff;
        display: flex;
        flex-direction: column;
        z-index: 1000;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        color: #515a6e;
        max-height: 162px;
        overflow: scroll;
        .select-item {
            cursor: pointer;
            transition-property: background;
            transition-duration: 0.2s;
            transition-timing-function: ease-in-out;
            transition-delay: 0s;
            padding: 0 10px;
        }
        .select-item:hover {
            background: #f3f3f3;
            color: #2d8cf0;
        }
    }
}
</style>