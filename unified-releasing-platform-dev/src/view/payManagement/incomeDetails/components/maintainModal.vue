<template>
  <div>
    <Modal
      title="回款维护"
      :value="visiableModal"
      :mask-closable="false"
      width="500"
      :styles="{top: '100px'}"
      @on-visible-change="visibleChangeHandler"
    >
      <div style="padding:0 40px 0 20px" class="maintainForm">
        <Form
          ref="maintainForm"
          :model="maintainForm"
          :label-width="80"
          style="margin-top: 20px"
          :rules="ruleValidate"
        >
          <FormItem label="客户名称:">
            <Input v-model="maintainForm.customName" placeholder="客户名称" disabled readonly />
          </FormItem>
          <FormItem label="公司名称:">
            <Input v-model="maintainForm.companyName" placeholder="公司名称" disabled readonly />
          </FormItem>
          <FormItem label="欠款金额:">
            <Input v-model="maintainForm.remainDebt" placeholder="欠款金额" disabled readonly>
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="回款金额:" prop="returnAmount">
            <Input v-model="maintainForm.returnAmount" placeholder="回款金额" clearable>
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="回款日期:" prop="returnDate">
            <DatePicker
              v-model="maintainForm.returnDate"
              type="date"
              placeholder="选择回款日期"
              style="width: 200px"
              format="yyyy年MM月dd日"
              @change="dateTimeChangeReturnMonyDate"
              clearable
            ></DatePicker>
          </FormItem>
          <FormItem label="回款凭证:" prop="returnProof">
            <Upload
              action="/finance/uploadCpcStatementProofImage"
              ref="uploadVoucher"
              :on-remove="voucherRemove"
              accept="image/*"
              :before-upload="voucherBeforeUpload"
              :on-success="imgUploadSuccess"
              :on-error="imgUploadError"
              :headers="headers"
            >
              <div
                v-if="maintainForm.returnProof"
                style="position:relative;border-raduis:4px;border: 2px dotted gray;line-height: 0;"
                class="mask-wrap"
              >
                <img
                  :src="maintainForm.returnProof"
                  style="max-height:150px;max-width:400px;"
                />
                <div class="mask">重新上传</div>
              </div>
              <Icon
                v-else
                type="ios-cloud-upload-outline"
                size="60"
                style="border-radius:5px;border: 2px dotted gray;cursor:pointer;"
              />
            </Upload>
          </FormItem>
          <FormItem label="备注:" prop="returnMemo">
            <Input
              v-model="maintainForm.returnMemo"
              placeholder="请填写备注"
              maxlength="30"
              show-word-limit
              type="textarea"
            />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="$emit('closeModal')">取消</Button>
        <Button @click="voucherSubmit" style="margin-left:20px" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getToken, uuid } from "@/libs/util";
export default {
  name: "maintainModal",
  props: ["formData", "visiableModal"],
  data() {
    const validPricePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写回款金额！"));
      } else if (isNaN(value)) {
        callback(new Error("回款金额必须为数字！"));
      }
      if (
        !/^(([^0-][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0-]([0-9]{0,7})?|0)$/.test(
          value
        )
      ) {
        callback(new Error("回款金额只支持小数点前最多8位，小数点后最多4位"));
      }
      callback();
    };
    const validateLicense = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请上传回款凭证"));
      }
      callback();
    };
    return {  
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTg3Nzc5NjM3MDE1LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4Nzc3OTYzNzAxNSIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==",

        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      maintainForm: {},
      ruleValidate: {
        returnDate: [
          {
            required: true,
            type: "date",
            message: "请选择回款日期",
            trigger: "change"
          }
        ],
        returnAmount: [
          {
            required: true,
            validator: validPricePass,
            trigger: "blur"
          }
        ],
        returnMemo: [{
          required: true,
          message: "请填写备注",
          trigger: "change"
        }]
        // returnProof: [
          // { required: true, message: '营业执照未上传,请上传', trigger: 'blur' },
        //   { validator: validateLicense, trigger: "blur", required: true }
        // ]
      }
    };
  },
  watch: {
      formData: {
          handler(newValue, oldValue) {
            this.maintainForm = Object.assign({}, newValue)
          },
          immediate: true,
          deep: true
      },
      // visiableModal(newValue, oldValue) {
        // if (newValue) {
        //   this.$refs.uploadVoucher.clearFiles() 
        //   this.$refs.maintainForm.resetFields()   
        // }
      // }
  },
  created () {
  },
  methods: {
    dateTimeChangeReturnMonyDate(time) {
      this.maintainForm.returnDate = time;
    },
    voucherRemove() {
      this.$refs.uploadVoucher.clearFiles();
      this.maintainForm.returnProof = "";
    },
    imgUploadError() {
      this.$Notice.error({
        title: "图片上传失败",
        desc: "图片上传失败请检查网络"
      });
    },
    imgUploadSuccess(res, file) {
      if (res.code === 0) {
        this.maintainForm.returnProof = res.data;
        this.$Notice.success({
          title: "图片上传成功",
          desc: "图片上传成功"
        });
      }
    },
    voucherBeforeUpload(file) {
      if (file.size > 2048000) {
        this.$Message.error("图片大小限制为2M");
        return false;
      }
      this.$refs.uploadVoucher.clearFiles();
    },
    voucherSubmit() {
        this.$refs["maintainForm"].validate(valid => {
        if (valid) {
          this.$emit('closeModal', this.maintainForm)
        }
      });
    },
    visibleChangeHandler(flag) {
      if(!flag) {
        this.$refs.uploadVoucher.clearFiles() 
        this.$refs.maintainForm.resetFields()   
        this.$emit('closeModal')
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
/deep/ .ivu-input-word-count {
  text-align: center;
  position: absolute;
  right: 7px;
  top: 1px;
  bottom: 1px;
  padding-left: 7px;
  background: #fff;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  color: #808695;
  font-size: 12px;
}
</style>