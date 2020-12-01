<template>
  <div class="shopCustomEdit" ref="shopCustomEdit">
    <div>
      <div style="display: flex; margin-bottom: 10px">
        <div
          style="
            font-size: 14px;
            font-weight: bold;
            width: 140px;
            text-align: right;
            padding-right: 20px;
            line-height: 32px;
          "
        >
          商户名称:
        </div>
        <div style="display: flex; align-items: center">
          <span style="font-size: 14px">{{ responseData.shopName }}</span>
        </div>
      </div>
      <div style="margin-bottom: 10px">
        <div style="display: flex; margin-bottom: 5px">
          <div
            style="
              line-height: 80px;
              font-size: 14px;
              font-weight: bold;
              width: 140px;
              text-align: right;
              padding-right: 20px;
            "
          >
            <span style="color: red">*</span>Logo:
          </div>
          <div
            class="demo-upload-list"
            v-for="(item, index) in uploadList"
            :key="index"
          >
            <template v-if="item.status === 'finished'">
              <img :src="item.url" />
              <!-- <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>-->
            </template>
            <template v-else>
              <Progress
                v-if="item.showProgress"
                :percent="item.percentage"
                hide-info
              ></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg', 'jpeg', 'png', 'gif']"
            :max-size="2048"
            :headers="headers"
            name="image"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-error="handleUploadError"
            :data="uploadLogoData"
            multiple
            type="drag"
            action="/ad/customizedshops/uploadLogo"
            style="display: inline-block; width: 78px"
          >
            <div style="width: 78px; height: 78px; line-height: 80px">
              <Icon type="ios-camera" size="24"></Icon>
            </div>
          </Upload>
          <Button
            style="max-height: 32px; margin-top: 24px; margin-left: 20px"
            type="warning"
            v-if="responseData.logoCustomed"
            @click="cancelCustom"
            >取消定制</Button
          >
        </div>
        <div>
          <span style="margin-left: 140px; color: #bbb"
            >图片格式只支持jpg、jpeg、png、gif</span
          >
        </div>
      </div>
      <div style="display: flex; margin-bottom: 10px">
        <div
          style="
            font-size: 14px;
            font-weight: bold;
            width: 140px;
            text-align: right;
            padding-right: 20px;
          "
        >
          <span style="color: red">*</span>商业化菜单数量:
        </div>
        <div style="display: flex; color: #a1a1a1">
          <div
            style="
              font-size: 14px;
              font-weight: bold;
              margin-right: 30px;
              width: 130px;
            "
          >
            上次定制或商户自带商业化菜单数量:{{ responseData.asn }}
          </div>
          <div style="font-size: 14px; font-weight: bold; width: 130px">
            暂存定制商业化菜单数量:{{ isCommercialNu ? isCommercialNu : 0 }}
          </div>
        </div>
      </div>
      <div style="display: flex; margin-bottom: 10px">
        <div
          style="
            font-size: 14px;
            font-weight: bold;
            width: 140px;
            text-align: right;
            padding-right: 20px;
            line-height: 32px;
          "
        >
          规则:
        </div>
        <div style="display: flex">
          <Button
            type="primary"
            @click="handleAdd"
            style="margin-right: 10px"
            :disabled="list.length > 9"
            >新增规则</Button
          >
          <Tooltip
            placement="right"
            max-width="220"
            content="• 从上到下依次检测，只要命中当前规则，则得到该规则对应的菜单。
• 拖动可上下调整顺序
• 要取消菜单的定制，请删除所有的规则并同步上线"
          >
            <img
              src="../../../../public/help.svg"
              style="
                height: 20px;
                width: 20px;
                padding-top: 5px;
                margin-left: 5px;
              "
            />
            <span
              style="
                margin-left: 5px;
                justify-content: center;
                align-items: center;
              "
              >填写帮助</span
            >
          </Tooltip>
        </div>
      </div>
      <div style="min-width: 1050px">
        <draggable
          v-bind="draggableOptions"
          v-model="list"
          @change="change"
          @start="start"
          @end="end"
          :move="move"
          style="width: 100%; overflow: auto"
        >
          <li v-for="(item, index) in list" :key="index" class="dragLi">
            <div style="display: flex; width: 100%">
              <div
                style="
                  display: flex;
                  width: 60%;
                  border-right: #cccccc 1px solid;
                "
              >
                <div
                  style="
                    width: 35%;
                    border-right: #cccccc 1px solid;
                    min-width: 170px;
                  "
                >
                  <div class="itemHeader">
                    <h4>规则{{ index + 1 }}</h4>
                  </div>
                  <div style="padding: 10px">
                    <Select
                      v-model="item.ruleSelect"
                      style="width: 150px"
                      placeholder="表达式"
                      @on-change="
                        (val) => {
                          selectLimitConditions(val, index);
                        }
                      "
                    >
                      <Option
                        v-for="item in limitOptions"
                        :value="item.value"
                        :key="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                    <Input
                      type="textarea"
                      style="margin-top: 10px"
                      v-model="item.rules"
                      placeholder
                      :rows="4"
                    />
                    <!-- <div
                      v-if="item.rulesBlurFlag"
                      style="color:red;margin-top:10px;"
                    >同一商户菜单不可存在相同的规则</div>-->
                    <div>
                      <h3 style="margin-top: 10px">推荐配置</h3>
                      <Form
                        :ref="'rcmd' + index"
                        :model="item"
                        :rules="rcmdRuleValidate"
                        :label-width="0"
                      >
                        <FormItem prop="rcmd">
                          <Input
                            type="textarea"
                            style="margin-top: 10px"
                            v-model.trim="item.rcmd"
                            placeholder
                            :rows="4"
                          />
                        </FormItem>
                      </Form>
                    </div>
                  </div>
                </div>
                <div style="width: 65%">
                  <div
                    class="itemHeader"
                    style="border-bottom: 1px solid #c5c5c5"
                  >
                    <h4>菜单管理</h4>
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        :disabled="item.oldMenu.sms_menus.length >= 3"
                        @click.stop="addFirstItem(index, 'addFirst')"
                        >新增</Button
                      >
                      <Button
                        type="success"
                        size="small"
                        style="margin-left: 20px"
                        :disabled="item.oldMenu.sms_menus.length >= 3"
                        @click.stop="
                          copyMenu(index, item.oldMenu.sms_menus.length)
                        "
                        >复制</Button
                      >
                    </div>
                  </div>
                  <div
                    style="
                      display: flex;
                      height: calc(100% - 40px);
                      width: 100%;
                    "
                  >
                    <div style="width: 50%; border-right: #cccccc 1px solid">
                      <h5
                        style="
                          text-align: center;
                          height: 30px;
                          line-height: 30px;
                          border-bottom: 1px solid #c5c5c5;
                        "
                      >
                        一级菜单
                      </h5>
                      <div
                        v-if="
                          item.oldMenu &&
                          item.oldMenu.sms_menus &&
                          item.oldMenu.sms_menus.length
                        "
                      >
                        <draggable
                          v-bind="draggableOptionsS"
                          v-model="item.oldMenu.sms_menus"
                          @change="changeS"
                          @start="startS"
                          @end="
                            (event) => {
                              endS(index, event);
                            }
                          "
                          :move="moveS"
                          style="width: 100%; overflow: auto"
                        >
                          <div
                            v-for="(fitem, findex) in item.oldMenu.sms_menus"
                            :key="findex"
                            class="firstItem"
                            @click="clickFirstItem(index, fitem, findex)"
                            :style="{
                              background:
                                findex == item.choiceFirstIndex
                                  ? '#dcddde'
                                  : '',
                            }"
                          >
                            <div
                              style="
                                width: 20px;
                                text-align: center;
                                margin-right: 10px;
                              "
                              class="dragFirstItem"
                            >
                              <Icon
                                type="md-menu"
                                style="font-size: 14px; margin-top: -2px"
                              />
                            </div>
                            <h5>{{ fitem.name }}</h5>
                            <div class="firstItemRight">
                              <div>
                                <div
                                  style="width: 100%; height: 100%"
                                  v-if="fitem.type == 'menu'"
                                  @click.stop="addSecondItem(index, findex)"
                                >
                                  <Icon type="md-add-circle" size="17" />
                                </div>
                              </div>
                              <div>
                                <div
                                  style="width: 100%; height: 100%"
                                  @click.stop="delFirstItem(index, findex)"
                                >
                                  <Icon type="ios-trash" size="17" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </draggable>
                      </div>
                      <h5
                        style="
                          text-align: center;
                          height: 30px;
                          line-height: 30px;
                          border-bottom: 1px solid #c5c5c5;
                          border-top: 1px solid #c5c5c5;
                        "
                        v-if="rcmdMenuFormat(item.rcmdInit).length"
                      >
                        推荐菜单
                      </h5>
                      <div
                        v-for="(fitem, findex) in rcmdMenuFormat(item.rcmdInit)"
                        :key="findex"
                      >
                        <div
                          v-if="
                            fitem.rcmdMenu &&
                            fitem.rcmdMenu.rcmdData &&
                            fitem.rcmdMenu.rcmdData.length
                          "
                        >
                          <div
                            style="
                              height: 40px;
                              line-height: 40px;
                              border-bottom: 1px solid #bbb;
                              text-align: center;
                              background: #ebeef5;
                              cursor: pointer;
                            "
                            @click="setRcmdMenuShow(index, findex, fitem.show)"
                          >
                            {{
                              "菜单" +
                              fitem.index +
                              "（ " +
                              fitem.options.group +
                              " ）"
                            }}
                          </div>
                          <div v-if="fitem.show">
                            <div
                              v-for="(ritem, rindex) in fitem.rcmdMenu.rcmdData"
                              :key="rindex"
                            >
                              <div
                                style="
                                  height: 40px;
                                  line-height: 40px;
                                  border-bottom: 1px solid #eee;
                                  text-align: center;
                                  background: #f2f6fc;
                                  overflow: auto;
                                  white-space: nowrap;
                                "
                              >
                                {{ ritem.url ? ritem.url : "（ url 空 )" }}
                              </div>
                              <!-- <div style="max-height:200px;overflow:auto;"> -->
                              <div
                                style="
                                  height: 30px;
                                  line-height: 30px;
                                  border-bottom: 1px solid #eee;
                                  text-align: center;
                                "
                                v-for="(vitem, vindex) in ritem.value"
                                :key="vindex"
                              >
                                {{ vitem }}
                              </div>
                              <!-- </div> -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style="
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                        max-height: 620px;
                        overflow: hidden;
                      "
                    >
                      <h5
                        style="
                          text-align: center;
                          height: 30px;
                          line-height: 30px;
                          border-bottom: 1px solid #c5c5c5;
                        "
                        v-if="item.secondList && item.secondList.length"
                      >
                        二级菜单
                      </h5>
                      <div
                        v-if="item.secondList && item.secondList.length"
                        style="border-bottom: 1px solid #c5c5c5"
                      >
                        <draggable
                          v-bind="draggableOptionsE"
                          v-model="item.secondList"
                          @change="changeE"
                          @start="startE"
                          @end="
                            (event) => {
                              endE(index, event);
                            }
                          "
                          :move="moveE"
                          style="width: 100%; overflow: auto"
                        >
                          <div
                            v-for="(sitem, sindex) in item.secondList"
                            :key="sindex"
                            class="firstItem"
                            @click="clickSecondItem(index, sitem, sindex)"
                            :style="{
                              background:
                                sindex == item.choiceSecondIndex
                                  ? '#dcddde'
                                  : '',
                            }"
                          >
                            <div
                              style="
                                width: 20px;
                                text-align: center;
                                margin-right: 10px;
                              "
                              class="dragSecondItem"
                            >
                              <Icon
                                type="md-menu"
                                style="font-size: 14px; margin-top: -2px"
                              />
                            </div>
                            <h5>{{ sitem.name }}</h5>
                            <div class="firstItemRight">
                              <div></div>
                              <div>
                                <div
                                  style="width: 100%; height: 100%"
                                  @click.stop="delSecondItem(index, sindex)"
                                >
                                  <Icon type="ios-trash" size="17" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </draggable>
                      </div>
                      <div
                        style="
                          height: 100%;
                          display: flex;
                          flex-direction: column;
                        "
                      >
                        <h5
                          style="
                            text-align: center;
                            height: 30px;
                            line-height: 30px;
                            border-bottom: 1px solid #c5c5c5;
                          "
                        >
                          菜单队列
                        </h5>
                        <div style="height: 100%">
                          <ul
                            style="
                              padding: 10px 10px 0px;
                              height: 100%;
                              overflow: auto;
                            "
                          >
                            <li
                              v-for="(mitem, mindex) in item.menuQueue"
                              class="menuQueue"
                              :key="mindex"
                            >
                              <h5
                                style="
                                  width: 40%;
                                  overflow: hidden;
                                  white-space: nowrap;
                                  text-overflow: ellipsis;
                                  line-height: 24px;
                                "
                              >
                                {{ mitem.ad_name }}
                              </h5>
                              <div>
                                <Button
                                  style="margin-right: 10px"
                                  size="small"
                                  type="info"
                                  @click="openEditMenu('update', mitem, mindex)"
                                  >编辑</Button
                                >
                                <Poptip
                                  confirm
                                  title="确定替换当前菜单?"
                                  @on-ok="replaceMenu(index, mindex)"
                                >
                                  <Button
                                    style
                                    size="small"
                                    type="warning"
                                    :disabled="
                                      item.choiceFirstIndex == -1 &&
                                      item.choiceSecondIndex == -1
                                    "
                                    >替换</Button
                                  >
                                </Poptip>
                              </div>
                            </li>
                            <li
                              class="menuQueue menuQueueHover"
                              @click="openEditMenu('add')"
                            >
                              <Icon type="md-add-circle" size="20" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="width: 40%">
                <div style="height: 100%">
                  <div class="itemHeader">
                    <h4>{{ item.formTitle ? item.formTitle : "编辑" }}</h4>
                    <Button
                      type="primary"
                      size="small"
                      @click.stop="saveMenu(index)"
                      :disabled="!item.sms_menus"
                      >保存</Button
                    >
                  </div>
                  <div
                    style="
                      height: calc(100% - 40px);
                      padding: 20px 40px 10px 10px;
                    "
                    v-if="item.sms_menus"
                  >
                    <Form
                      :ref="'form' + index"
                      :model="item.sms_menus"
                      :rules="addRuleValidate"
                      :label-width="110"
                    >
                      <FormItem label="菜单名称:" prop="name">
                        <Input
                          v-model="item.sms_menus.name"
                          placeholder="请填写菜单名称"
                          :maxlength="10"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem label="前置图标:" prop="menuLogo.logo_front">
                        <Input
                          v-model="item.sms_menus.menuLogo.logo_front"
                          placeholder="菜单前置图标"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem label="后置图标:" prop="menuLogo.logo_back">
                        <Input
                          v-model="item.sms_menus.menuLogo.logo_back"
                          placeholder="菜单后置图标"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="角标:"
                        style="font-weight: bold"
                      ></FormItem>
                      <FormItem label="角标类型:" prop="striking.type">
                        <RadioGroup v-model="item.sms_menus.striking.type">
                          <Radio label="0">无</Radio>
                          <Radio label="1">小红点</Radio>
                          <Radio label="2">斜标</Radio>
                          <Radio label="3">横标</Radio>
                        </RadioGroup>
                      </FormItem>
                      <FormItem
                        label="角标图示:"
                        prop="striking.icon"
                        key="striking.icon"
                        v-if="
                          item.sms_menus.striking.type == 1 ||
                          item.sms_menus.striking.type == 2 ||
                          item.sms_menus.striking.type == 3
                        "
                      >
                        <Input
                          v-model="item.sms_menus.striking.icon"
                          placeholder="请填写角标图示"
                          clearable
                        ></Input>
                      </FormItem>

                      <FormItem label="类型:" prop="type">
                        <RadioGroup v-model="item.sms_menus.type">
                          <Radio label="url">url</Radio>
                          <Radio label="app">app</Radio>
                          <Radio label="phone">phone</Radio>
                          <Radio
                            label="fastapp"
                            v-if="partnerId == 5 || partnerId == 9"
                            >fastapp</Radio
                          >
                          <Radio label="menu" v-if="item.clickFirst"
                            >menu</Radio
                          >
                          <Radio label="sms">sms</Radio>
                        </RadioGroup>
                      </FormItem>
                      <FormItem
                        label="商业化菜单:"
                        prop="isCommercial"
                        v-if="item.sms_menus.type != 'menu'"
                      >
                        <RadioGroup v-model="item.sms_menus.isCommercial">
                          <Radio label="0">非商业化菜单</Radio>
                          <Radio label="1">商业化菜单</Radio>
                        </RadioGroup>
                      </FormItem>
                      <FormItem
                        label="选择广告:"
                        v-if="item.sms_menus.type == 'url'"
                      >
                        <Button
                          type="primary"
                          size="small"
                          @click="openChoiceAdModal(index)"
                          >选择广告</Button
                        >
                      </FormItem>
                      <FormItem
                        label="选择快应用:"
                        v-if="item.sms_menus.type == 'fastapp'"
                      >
                        <Button
                          type="primary"
                          size="small"
                          @click="openChoiceAdModalfastApp(index)"
                          >选择快应用</Button
                        >
                      </FormItem>
                      <FormItem
                        label="链接:"
                        prop="data"
                        v-if="item.sms_menus.type == 'url'"
                        key="dataurl"
                      >
                        <Input
                          v-model="item.sms_menus.data"
                          placeholder="'请填写链接'"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="电话号码:"
                        prop="data"
                        v-if="item.sms_menus.type == 'phone'"
                        key="dataphone"
                      >
                        <Input
                          v-model="item.sms_menus.data"
                          placeholder="请填写电话号码"
                          :maxlength="15"
                          clearable
                          @on-keyup="
                            item.sms_menus.data = item.sms_menus.data.replace(
                              /[^\d\-]/g,
                              ''
                            )
                          "
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="菜单基础数据:"
                        prop="data"
                        v-if="item.sms_menus.type == 'sms'"
                        key="datasms"
                      >
                        <Input
                          v-model="item.sms_menus.data"
                          placeholder="请填写菜单基础数据"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="打开方式:"
                        prop="browser_type"
                        v-if="item.sms_menus.type == 'url'"
                        key="browser_type"
                      >
                        <RadioGroup v-model="item.sms_menus.browser_type">
                          <Radio label="1">小窗预览</Radio>
                          <Radio label="2">全屏</Radio>
                          <Radio label="3">浏览器</Radio>
                        </RadioGroup>
                      </FormItem>
                      <FormItem
                        label="应用名称:"
                        prop="extendData.appName"
                        v-if="item.sms_menus.type == 'app'"
                        key="appName"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.appName"
                          placeholder="请填写应用名称"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        :label="
                          item.sms_menus.type == 'app' ? '包名:' : '快应用包名:'
                        "
                        prop="extendData.packageName"
                        v-if="
                          item.sms_menus.type == 'app' ||
                          item.sms_menus.type == 'fastapp'
                        "
                        key="packageName"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.packageName"
                          placeholder="请填写包名"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        :label="
                          item.sms_menus.type == 'app'
                            ? '直达链接:'
                            : '快应用链接:'
                        "
                        prop="extendData.deeplink"
                        v-if="
                          item.sms_menus.type == 'app' ||
                          item.sms_menus.type == 'fastapp'
                        "
                        key="deepLink"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.deeplink"
                          clearable
                          :placeholder="
                            item.sms_menus.type == 'app'
                              ? '请填写页面直达'
                              : '请填写快应用链接'
                          "
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="快应用最低版本:"
                        prop="extendData.fastAppVer"
                        v-if="item.sms_menus.type == 'fastapp'"
                        key="fastAppVer"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.fastAppVer"
                          placeholder="请填写快应用最低版本"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="备用链接:"
                        prop="extendData.html_link"
                        v-if="item.sms_menus.type == 'app'"
                        key="html_link"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.html_link"
                          placeholder="请填写备用链接"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="已安装菜单名称:"
                        prop="extendData.installName"
                        v-if="
                          item.sms_menus.type == 'app' &&
                          (partnerId == 5 || partnerId == 9)
                        "
                        :maxlength="10"
                        key="installName"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.installName"
                          placeholder="请填写已安装菜单名称"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="未安装菜单名称:"
                        prop="extendData.uninstallName"
                        :maxlength="10"
                        v-if="
                          item.sms_menus.type == 'app' &&
                          (partnerId == 5 || partnerId == 9)
                        "
                        key="uninstallName"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.uninstallName"
                          placeholder="请填写未安装菜单名称:"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="备用链接:"
                        prop="extendData.htmlLink"
                        v-if="item.sms_menus.type == 'fastapp'"
                        key="htmlLink"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.htmlLink"
                          placeholder="请填写备用链接"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="监控链接显示:"
                        prop="extendData.monitorLinkShow"
                        v-if="
                          (item.sms_menus.type == 'app' ||
                            item.sms_menus.type == 'url') &&
                          (partnerId == 5 || partnerId == 9)
                        "
                        key="monitorLinkShow"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.monitorLinkShow"
                          placeholder="请填写监控链接显示"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="监控链接点击:"
                        prop="extendData.monitorLinkClick"
                        v-if="
                          (item.sms_menus.type == 'app' ||
                            item.sms_menus.type == 'url') &&
                          (partnerId == 5 || partnerId == 9)
                        "
                        key="monitorLinkClick"
                      >
                        <Input
                          v-model="item.sms_menus.extendData.monitorLinkClick"
                          placeholder="请填写监控链接点击"
                          clearable
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="菜单类型:"
                        prop="extendData.menuAdType"
                        key="menuAdType"
                        v-if="
                          item.sms_menus.type != 'menu' &&
                          (partnerId == 5 || partnerId == 9)
                        "
                      >
                        <RadioGroup
                          v-model="item.sms_menus.extendData.menuAdType"
                        >
                          <Radio :label="0">非商业化菜单</Radio>
                          <Radio :label="1">CPD菜单</Radio>
                          <Radio :label="2">vivo品牌广告菜单</Radio>
                          <Radio :label="3">vivo其他广告菜单</Radio>
                          <Radio :label="4">泰迪CPC广告菜单</Radio>
                          <Radio :label="5">泰迪其他广告菜单</Radio>
                          <Radio :label="6">vivo内部导流菜单</Radio>
                        </RadioGroup>
                      </FormItem>
                      <FormItem
                        label="DP:"
                        prop="extendData.installStatus"
                        v-if="
                          item.sms_menus.type == 'app' &&
                          (partnerId == 5 || partnerId == 9)
                        "
                        key="installStatus"
                      >
                        <RadioGroup
                          v-model="item.sms_menus.extendData.installStatus"
                        >
                          <!-- <Radio label="0">已安装</Radio> -->
                          <Radio label="0">未安装</Radio>
                          <Radio label="1">未安装(空菜单)</Radio>
                        </RadioGroup>
                        <Button
                          @click="cancelDP(index)"
                          v-if="item.sms_menus.extendData.installStatus"
                          style="margin-left: 10px"
                          size="small"
                          >取消DP</Button
                        >
                      </FormItem>
                      <div v-if="item.sms_menus.extendData.installStatus == '0'">
                        <Divider>备用菜单</Divider>
                        <FormItem label="菜单名称:" prop="backupMenu.name">
                          <Input
                            v-model="item.sms_menus.backupMenu.name"
                            placeholder="请填写菜单名称"
                            :maxlength="10"
                            clearable
                          ></Input>
                        </FormItem>
                        <FormItem label="类型:" prop="backupMenu.type">
                          <RadioGroup v-model="item.sms_menus.backupMenu.type">
                            <Radio label="url">url</Radio>
                            <Radio label="phone">phone</Radio>
                          </RadioGroup>
                        </FormItem>
                        <FormItem
                          label="商业化菜单:"
                          prop="backupMenu.isCommercial"
                          v-if="item.sms_menus.backupMenu.type != 'menu'"
                        >
                          <RadioGroup v-model="item.sms_menus.backupMenu.isCommercial">
                            <Radio label="0">非商业化菜单</Radio>
                            <Radio label="1">商业化菜单</Radio>
                          </RadioGroup>
                        </FormItem>
                        
                        <FormItem
                          label="链接:"
                          prop="backupMenu.data"
                          v-if="item.sms_menus.backupMenu.type == 'url'"
                          key="dataurl"
                        >
                          <Input
                            v-model="item.sms_menus.backupMenu.data"
                            placeholder="'请填写链接'"
                            clearable
                          ></Input>
                        </FormItem>
                        <FormItem
                          label="电话号码:"
                          prop="backupMenu.data"
                          v-if="item.sms_menus.backupMenu.type == 'phone'"
                          key="dataphone"
                        >
                          <Input
                            v-model="item.sms_menus.backupMenu.data"
                            placeholder="请填写电话号码"
                            :maxlength="15"
                            clearable
                            @on-keyup="
                              item.sms_menus.backupMenu.data = item.sms_menus.backupMenu.data.replace(
                                /[^\d\-]/g,
                                ''
                              )
                            "
                          ></Input>
                        </FormItem>
                       
                        <FormItem
                          label="打开方式:"
                          prop="backupMenu.browser_type"
                          v-if="item.sms_menus.backupMenu.type == 'url'"
                          key="browser_type"
                        >
                          <RadioGroup v-model="item.sms_menus.backupMenu.browser_type">
                            <Radio label="1">小窗预览</Radio>
                            <Radio label="2">全屏</Radio>
                            <Radio label="3">浏览器</Radio>
                          </RadioGroup>
                        </FormItem>
                        <FormItem
                          label="菜单类型:"
                          prop="backupMenu.extendData.menuAdType"
                          key="menuAdType"
                          v-if="
                            item.sms_menus.backupMenu.type != 'menu' &&
                            (partnerId == 5 || partnerId == 9)
                          "
                        >
                          <RadioGroup
                            v-model="item.sms_menus.backupMenu.extendData.menuAdType"
                          >
                            <Radio :label="0">非商业化菜单</Radio>
                            <Radio :label="1">CPD菜单</Radio>
                            <Radio :label="2">vivo品牌广告菜单</Radio>
                            <Radio :label="3">vivo其他广告菜单</Radio>
                            <Radio :label="4">泰迪CPC广告菜单</Radio>
                            <Radio :label="5">泰迪其他广告菜单</Radio>
                            <Radio :label="6">vivo内部导流菜单</Radio>
                          </RadioGroup>
                        </FormItem>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <div
              style="
                border-top: 1px solid #ccc;
                overflow: hidden;
                padding: 10px 20px;
              "
            >
              <Poptip
                confirm
                title="确定删除该菜单吗?"
                @on-ok="delMenu(index)"
                style="float: right"
              >
                <Button type="error">删除当前</Button>
              </Poptip>
              <!-- <Button type="primary" style="margin-right:20px;float:right;">保存当前</Button> -->
            </div>
          </li>
        </draggable>
      </div>
    </div>
    <div style="display: flex; justify-content: center; padding-bottom: 40px">
      <Button
        type="primary"
        style="margin-right: 30px"
        v-if="
          responseData.customStatus != 1 &&
          showAccess('菜单管理_编辑短信菜单_保存')
        "
        @click="endSave('save')"
        >保存</Button
      >
      <Button
        type="primary"
        style="margin-right: 30px"
        v-if="
          list.length &&
          responseData.customStatus == 1 &&
          showAccess('菜单管理_编辑短信菜单_保存')
        "
        @click="endSave('save')"
        >保存</Button
      >
      <Tooltip content="请点击保存并上线,将会清空线上菜单" placement="top">
        <Button
          disabled
          v-if="
            list.length == 0 &&
            responseData.customStatus == 1 &&
            showAccess('菜单管理_编辑短信菜单_保存')
          "
          style="margin-right: 30px"
          >保存</Button
        >
      </Tooltip>
      <Button
        type="primary"
        style="margin-right: 30px"
        @click="endSave('saveline')"
        v-if="
          showAccess('菜单管理_编辑短信菜单_保存并上线') &&
          !responseData.blackShopFlag
        "
        >保存并上线</Button
      >
      <Button @click="cancelBtn">取消</Button>
    </div>
    <Modal
      title="选择广告"
      v-model="choiceAdModal"
      :mask-closable="false"
      width="80"
      :styles="{ top: '20px' }"
    >
      <div class="choiceAdModal">
        <div class="searchInfo">
          <div>
            <h5>客户名称:</h5>
            <Input
              v-model="choiceAdInfo.customName"
              placeholder="客户名称"
              clearable
              @on-enter="searchAd(true)"
              style="width: 150px"
            />
          </div>
          <div>
            <h5>计划名称:</h5>
            <Input
              v-model="choiceAdInfo.planName"
              placeholder="计划名称"
              clearable
              @on-enter="searchAd(true)"
              style="width: 150px"
            />
          </div>
          <div>
            <h5>广告名称:</h5>
            <Input
              v-model="choiceAdInfo.adName"
              placeholder="广告名称"
              clearable
              @on-enter="searchAd(true)"
              style="width: 150px"
            />
          </div>
          <div>
            <h5>厂商:</h5>
            <Select
              v-model="partnerId"
              style="width: 150px"
              placeholder="请选择"
              disabled
            >
              <Option
                v-for="item in vendorOptions"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <!-- <div>
            <h5>广告渠道:</h5>
            <Select
              v-model="choiceAdInfo.adPositionType"
              style="width:150px"
              @on-change="searchAd(true)"
            >
              <Option :value="1">菜单</Option>
              <Option :value="2">下一步</Option>
              <Option :value="3">中间页</Option>
            </Select>
          </div>-->
          <div>
            <Button @click="searchAd(true)" style type="primary">查询</Button>
          </div>
        </div>
        <div>
          <Table
            border
            :columns="choiceAdColumn"
            :data="choiceAdData"
            align="center"
            :loading="choiceAdLoading"
          >
            <template slot-scope="{ row }" slot="adShortUrl">
              <div style>
                <p
                  v-for="(item, index) in adShortUrlFormat(row.adShortUrl)"
                  :key="index"
                  style="margin: 5px 0"
                >
                  {{ item }}
                </p>
              </div>
            </template>
            <template slot-scope="{ row }" slot="operation">
              <div style>
                <Button
                  :key="sindex"
                  v-for="(sitem, sindex) in adShortUrlFormat(row.adShortUrl)"
                  type="primary"
                  size="small"
                  @click="choiceAdSubmit(row, sindex)"
                  style="margin: 5px 0"
                  >选择短链{{
                    adShortUrlFormat(row.adShortUrl).length > 1
                      ? sindex + 1
                      : ""
                  }}</Button
                >
              </div>
            </template>
          </Table>
          <div style="overflow: hidden">
            <Page
              :total="page.totalCount"
              :current="page.pageIndex"
              @on-change="pageChange"
              :page-size="page.pageSize"
              @on-page-size-change="pageSizeChange"
              show-sizer
              show-total
              show-elevator
              style="margin-top: 10px; float: right"
            ></Page>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="choiceAdModal = false" style>取消</Button>
      </div>
    </Modal>
    <Modal
      title="选择快应用"
      v-model="choicefastAppModal"
      :mask-closable="false"
      width="1200"
    >
      <div class="choiceAdModal">
        <div class="searchInfo">
          <div>
            <h5 style="text-align: right">快应用:</h5>
            <Input
              v-model="choicefastAppInfo.fastApp"
              placeholder="快应用"
              @on-enter="searchfastApp(true)"
              style="width: 150px"
              clearable
            />
          </div>
          <div>
            <Button @click="searchfastApp(true)" style type="primary"
              >查询</Button
            >
          </div>
        </div>
        <div>
          <Table
            border
            :columns="choicefastAppColumn"
            :data="fastAppData"
            align="center"
            :loading="choicefastAppLoading"
          >
            <template slot-scope="{ row }" slot="operation">
              <div style="display: flex; justify-content: center">
                <Button
                  type="primary"
                  size="small"
                  @click="choicefastAppSubmit(row)"
                  >选择快应用</Button
                >
              </div>
            </template>
          </Table>
          <div style="overflow: hidden">
            <Page
              :total="pagefastApp.totalCount"
              :current="pagefastApp.pageIndex"
              @on-change="pageChangefastApp"
              :page-size="pagefastApp.pageSize"
              @on-page-size-change="pageSizeChangefastApp"
              show-sizer
              show-total
              show-elevator
              style="margin-top: 10px; float: right"
            ></Page>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="choicefastAppModal = false" style>取消</Button>
      </div>
    </Modal>
    <menuQueueCom
      :editModal="editModal"
      :editModalInfo="editModalInfo"
      :editModalType="editModalType"
      @closeEditMenu="closeEditMenu"
      :partner_id="responseData.partnerId"
      :merchant_name="responseData.shopName"
      @updateMenuQueue="updateMenuQueue"
    ></menuQueueCom>
    <Modal
      title="复制菜单规则"
      v-model="copyMenuModal"
      :mask-closable="false"
      width="1400"
      :styles="{ top: '40px' }"
    >
      <div class="choiceAdModal">
        <Form
          :model="copyMenuForm"
          :label-width="80"
          :inline="true"
          style="margin-top: 20px"
        >
          <FormItem label="商户名称:">
            <Input
              v-model="copyMenuForm.shopName"
              placeholder="商户名称"
              @on-enter="copyMenuSearchData(true)"
              clearable
            />
          </FormItem>
          <FormItem label="菜单名称:">
            <Input
              v-model="copyMenuForm.menuName"
              placeholder="菜单名称"
              @on-enter="copyMenuSearchData(true)"
              clearable
            />
          </FormItem>
          <Button
            type="primary"
            style="margin-left: 50px"
            @click="copyMenuSearchData(true)"
            >查询</Button
          >
        </Form>
        <div>
          <Table
            border
            :columns="copyMenuColumn"
            :data="copyMenuData"
            align="center"
            :loading="copyMenuLoading"
          >
            <template slot-scope="{ row, index }" slot="checkbox">
              <Checkbox
                v-model="row._checked"
                @on-change="(flag) => checkboxChange(flag, index)"
                :disabled="row._disabled"
              ></Checkbox>
            </template>
            <template slot-scope="{ row }" slot="data">
              <div>
                {{
                  row.type == "url" || row.type == "sms" || row.type == "phone"
                    ? row.data
                    : row.type == "app" || row.type == "fastapp"
                    ? row.extendData.packageName
                    : ""
                }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="isCommercial">
              <div>
                {{ row.isCommercial == 1 ? "商业化菜单" : "非商业菜单" }}
              </div>
            </template>
          </Table>
          <div style="overflow: hidden">
            <Page
              :total="copyMenuPage.totalCount"
              :current="copyMenuPage.pageIndex"
              @on-change="pageChangeCopyMenu"
              :page-size="copyMenuPage.pageSize"
              @on-page-size-change="pageSizeChangeCopyMenu"
              show-sizer
              show-total
              show-elevator
              style="margin-top: 10px; float: right"
            ></Page>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="copyMenuModal = false">取消</Button>
        <Button @click="copyMenuSubmit" style="margin-left: 20px" type="primary"
          >确定</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import draggable from "vuedraggable";
import hasShowAccess from "@/libs/hasShowAccess.js";

import {
  limitOptions,
  defaultForm,
  choiceAdColumn,
  choicefastAppColumn,
  copyMenuColumn,
} from "./config";
import menuQueueCom from "../components/menuQueue";
export default {
  name: "menuEditNoCatch",
  components: { draggable, menuQueueCom },
  data() {
    const validateMenuName = (rule, value, callback) => {
      if (!value || value.trim() == "") {
        callback(new Error("菜单名称不能为空"));
      } else {
        callback();
      }
    };
    const validateRcmd = (rule, value, callback) => {
      if (value) {
        let json;
        try {
          json = JSON.parse(value);
        } catch (err) {
          json = value;
        }
        if (Object.prototype.toString.call(json) === "[object Array]") {
          callback();
        } else {
          callback(new Error("推荐配置格式错误"));
        }
      } else {
        callback();
      }
    };
    return {
      pagefastApp: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10,
      },
      headers: {
        "X-Client-Token": getToken(),
        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": "",
      },
      uploadLogoData: {
        partnerId: null,
        shopId: null,
      },
      vendorOptions: [
        { value: "5", label: "VIVO" },
        { value: "1", label: "OPPO" },
        { value: "2", label: "金立" },
        { value: "3", label: "乐视" },
        { value: "4", label: "ZUK" },
        { value: "9", label: "NEX3" },
        { value: "6", label: "一加" },
      ],
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10,
      },
      editModal: false,
      editModalInfo: {},
      shopId: "",
      partnerId: "",
      editModalType: "add",
      defaultList: [
        // {
        //   name:'2222',
        //   url:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2174909441,2495215020&fm=26&gp=0.jpg'
        // }
      ],
      visible: false,
      uploadList: [],
      responseData: {},
      list: [
       ],
      resMenuQueue: [],
      limitOptions: limitOptions,
      rcmdRuleValidate: {
        rcmd: [
          {
            required: true,
            validator: validateRcmd,
            trigger: "blur",
          },
        ],
      },
      addRuleValidate: {
        "extendData.appName": [
          {
            required: true,
            message: "应用名称为必填项",
            trigger: "blur",
          },
        ],
        "striking.icon": [
          {
            required: true,
            message: "角标图示为必填项",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            // message: "菜单名称为必填项",
            validator: validateMenuName,
            trigger: "blur",
          },
        ],
         'backupMenu.name': [
          {
            required: true,
            // message: "菜单名称为必填项",
            validator: validateMenuName,
            trigger: "blur",
          },
        ],
        "extendData.packageName": [
          {
            required: true,
            message: "包名为必填项",
            trigger: "blur",
          },
        ],
        "extendData.menuAdType": [
          {
            required: true,
            message: "请选择菜单类型",
            trigger: "change",
            type: "number",
          },
        ],
         "backupMenu.extendData.menuAdType": [
          {
            required: true,
            message: "请选择菜单类型",
            trigger: "change",
            type: "number",
          },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        'backupMenu.type': [{ required: true, message: "请选择类型", trigger: "change" }],
        data: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "blur",
          },
        ],
        'backupMenu.data': [
          {
            required: true,
            message: "该项不能为空",
            trigger: "blur",
          },
        ],
        'browser_type': [
          {
            required: true,
            message: "请选择浏览器打开方式",
            trigger: "change",
          },
        ],
        'backupMenu.browser_type': [
          {
            required: true,
            message: "请选择浏览器打开方式",
            trigger: "change",
          },
        ],
        isCommercial: [
          { required: true, message: "请选择是否商业化", trigger: "change" },
        ],
        'backupMenu.isCommercial': [
          { required: true, message: "请选择是否商业化", trigger: "change" },
        ],
      },
      choiceAdModal: false,
      choicefastAppModal: false,
      choiceAdLoading: false,
      choicefastAppLoading: false,
      choiceAdData: [],
      choicefastAppData: [],
      choicefastAppIndex: -1,
      choiceAdColumn: choiceAdColumn,
      choicefastAppColumn: choicefastAppColumn,
      choiceAdInfo: {
        customName: "",
        planName: "",
        adName: "",
        adPositionType: 1,
      },
      choicefastAppInfo: { fastApp: "" },
      menuObject: {},
      oldLogo: "",
      newLogo: "",
      copyMenuModal: false,
      copyMenuPage: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
      },
      copyMenuLoading: false,
      copyMenuData: [],
      copyMenuColumn,
      copyMenuForm: {
        shopName: "",
        menuName: "",
      },
      copyMenuLength: 0,
      copyMenuIndex: 0,
      rcmdMenu: {},
    };
  },
  computed: {
    rcmdMenuFormat() {
      return (rcmd) => {
        if (this.rcmdMenu) {
          rcmd.forEach((item, index) => {
            Object.entries(this.rcmdMenu).forEach((fitem) => {
              if (fitem[0] == item.options.group) {
                item.rcmdMenu = fitem[1];
              }
            });
          });
          return rcmd;
        } else {
          return [];
        }
      };
    },
    showAccess() {
      return (el) => {
        return hasShowAccess(el);
      };
    },
    adShortUrlFormat() {
      return (urlList) => {
        if (urlList) {
          return urlList.split(";");
        } else {
          return [];
        }
      };
    },
    draggableOptions() {
      return {
        group: "list",
        animation: 150,
        ghostClass: "sortable-ghost",
        chosenClass: "chosenClass",
        scroll: true,
        scrollSensitivity: 200,
        dragClass: "dragClass",
        handle: ".itemHeader",
      };
    },
    draggableOptionsS() {
      return {
        group: "listFistItem",
        animation: 150,
        ghostClass: "sortable-ghost",
        chosenClass: "chosenClass",
        scroll: true,
        scrollSensitivity: 200,
        dragClass: "dragClass",
        handle: ".dragFirstItem",
      };
    },

    draggableOptionsE() {
      return {
        group: "listSecondItem",
        animation: 150,
        ghostClass: "sortable-ghost",
        chosenClass: "chosenClass",
        scroll: true,
        scrollSensitivity: 200,
        dragClass: "dragClass",
        handle: ".dragSecondItem",
      };
    },
    fastAppData() {
      return this.choicefastAppData.slice(
        (this.pagefastApp.pageIndex - 1) * this.pagefastApp.pageSize,
        this.pagefastApp.pageIndex * this.pagefastApp.pageSize
      );
    },
    isCommercialNu() {
      let count = 0;
      this.list.forEach((item) => {
        if (!item.rules) {
          item.oldMenu.sms_menus.forEach((simte) => {
            if (simte.type != "menu") {
              if (simte.isCommercial == 1) {
                count++;
              }
            } else {
              if (simte.submenu && simte.submenu.length) {
                simte.submenu.forEach((mitem) => {
                  if (mitem.isCommercial == 1) {
                    count++;
                  }
                });
              }
            }
          });
        }
      });
      return count;
    },
  },
  methods: {
    setRcmdMenuShow(index, findex, show) {
      this.$set(this.list[index].rcmdInit[findex], "show", !show);
    },
    cancelDP(index) {
      this.list[index].sms_menus.extendData.installStatus = "";
    },
    copyMenuSearchData(flag) {
      this.copyMenuLoading = true;
      if (flag) {
        this.copyMenuPage.pageIndex = 1;
      }
      let postData = {
        page: this.copyMenuPage.pageIndex,
        pageSize: this.copyMenuPage.pageSize,
        partnerId: this.partnerId,
        shopName: this.copyMenuForm.shopName,
        name: this.copyMenuForm.menuName,
      };
      axios
        .request({
          url: "/ad/customizedshops/searchSmsMenuForCopy",
          method: "post",
          data: postData,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.copyMenuData = res.data.data.rows;
            this.copyMenuPage.totalCount = res.data.data.total;
            this.copyMenuData.forEach((item) => {
              if (item.type == "menu") {
                item.data = "";
              }
              if (!isNaN(item.name)) {
                item.name = item.name.toString();
              }
              if (item.type == "sms") {
                if (typeof item.data == "object") {
                  item.data = JSON.stringify(item.data);
                }
              }
              if (
                (item.isCommercial === 0 || item.isCommercial) &&
                typeof item.isCommercial == "number"
              ) {
                item.isCommercial = item.isCommercial.toString();
              } else if (!item.isCommercial && item.isCommercial !== "0") {
                item.isCommercial = "0";
              }
              if (
                (item.browser_type === 0 || item.browser_type) &&
                typeof item.browser_type == "number"
              ) {
                item.browser_type = item.browser_type.toString();
              }
              if (!item.hasOwnProperty("menuLogo")) {
                item.menuLogo = {};
              }
              if (!item.hasOwnProperty("extendData")) {
                item.extendData = {};
              } else {
            item.extendData.hasOwnProperty("menuAdType") &&
              (item.extendData.menuAdType = Number(item.extendData.menuAdType));
          }
               if(item.backup && item.backup.length && item.extendData.installStatus == '0'){
            item.backupMenu = item.backup[0]
          }else if((!item.backup || !item.backup.length) && item.extendData.installStatus == '0'){
            item.extendData.installStatus = '1'
          }
           if (!item.hasOwnProperty("backupMenu") || item.extendData.installStatus != '0' || !item.backup || !item.backup.length) {
            item.backupMenu = {name:'',type:'url',isCommercial:'0',data:'',browser_type:'1',extendData:{menuAdType:0}}
          }else{
            if (!item.backupMenu.hasOwnProperty("extendData")) {
            item.backupMenu.extendData = {menuAdType:0};
          } else {
            item.backupMenu.extendData.hasOwnProperty("menuAdType") &&
              (item.backupMenu.extendData.menuAdType = Number(item.backupMenu.extendData.menuAdType));
          }
          }
              if (!item.hasOwnProperty("striking")) {
                item.striking = { type: "0" };
              }
              if (item.submenu && item.submenu.length) {
                item.submenu.forEach((sitem) => {
                  if (!isNaN(sitem.name)) {
                    sitem.name = sitem.name.toString();
                  }
                  if (sitem.type == "sms") {
                    if (typeof sitem.data == "object") {
                      sitem.data = JSON.stringify(sitem.data);
                    }
                  }
                  if (
                    (sitem.isCommercial === 0 || sitem.isCommercial) &&
                    typeof sitem.isCommercial == "number"
                  ) {
                    sitem.isCommercial = sitem.isCommercial.toString();
                  }
                  if (
                    (sitem.browser_type === 0 || sitem.browser_type) &&
                    typeof sitem.browser_type == "number"
                  ) {
                    sitem.browser_type = sitem.browser_type.toString();
                  }
                  if (!sitem.hasOwnProperty("menuLogo")) {
                    sitem.menuLogo = {};
                  }
                  if (!sitem.hasOwnProperty("extendData")) {
                    sitem.extendData = {};
                  }else {
                sitem.extendData.hasOwnProperty("menuAdType") &&
                  (sitem.extendData.menuAdType = Number(
                    sitem.extendData.menuAdType
                  ));
              }
               if(sitem.backup && sitem.backup.length && sitem.extendData.installStatus == '0'){
            sitem.backupMenu = sitem.backup[0]
          }else if((!sitem.backup || !sitem.backup.length) && sitem.extendData.installStatus == '0'){
            sitem.extendData.installStatus = '1'
          }
               if (!sitem.hasOwnProperty("backupMenu") || sitem.extendData.installStatus != '0' || !sitem.backup || !sitem.backup.length) {
            sitem.backupMenu = {name:'',type:'url',isCommercial:'0',data:'',browser_type:'1',extendData:{menuAdType:0}}
          }else{
            if (!sitem.backupMenu.hasOwnProperty("extendData")) {
            sitem.backupMenu.extendData = {menuAdType:0};
          } else {
            sitem.backupMenu.extendData.hasOwnProperty("menuAdType") &&
              (sitem.backupMenu.extendData.menuAdType = Number(sitem.backupMenu.extendData.menuAdType));
          }
          }
                  if (!sitem.hasOwnProperty("striking")) {
                    sitem.striking = { type: "0" };
                  }
                });
              }
              item._checked = false;
              item._disabled = false;
            });
          } else {
            this.$Message.error(res.data.msg);
          }
          this.copyMenuLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.copyMenuLoading = false;
          this.$Message.error("网络错误" + err);
        });
    },
    copyMenuSubmit() {
      // console.log(this.copyMenuIndex,this.list[this.copyMenuIndex].oldMenu.sms_menus)
      // return
      let copyMenu = this.copyMenuData.filter((item) => {
        return item._checked;
      });
      copyMenu.forEach((item) => {
        delete item["shopName"];
        this.list[this.copyMenuIndex].oldMenu.sms_menus.push(item);
      });
      this.copyMenuModal = false;
    },
    checkboxChange(flag, index) {
      this.copyMenuData[index]._checked = flag;
      let choiceLength = this.copyMenuData.filter((item) => {
        return item._checked;
      }).length;
      let copyMenuData = JSON.parse(JSON.stringify(this.copyMenuData));
      if (choiceLength + this.copyMenuLength == 3) {
        copyMenuData.forEach((item) => {
          if (!item._checked) {
            item._disabled = true;
          }
        });
      } else {
        copyMenuData.forEach((item) => {
          item._disabled = false;
        });
      }
      this.copyMenuData = JSON.parse(JSON.stringify(copyMenuData));
    },
    copyMenu(index, length) {
      this.copyMenuIndex = index;
      this.copyMenuLength = length;
      this.copyMenuModal = true;
      this.copyMenuSearchData(true);
    },
    pageChangeCopyMenu(page) {
      this.copyMenuPage.pageIndex = page;
      this.copyMenuSearchData();
    },
    pageSizeChangeCopyMenu(size) {
      this.copyMenuPage.pageSize = size;
      this.copyMenuSearchData();
    },
    pageSizeChangefastApp(size) {
      this.pagefastApp.pageSize = size;
      //this.searchfastApp();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchAd();
    },
    pageChange(index) {
      this.page.pageIndex = index;
      this.searchAd();
    },
    pageChangefastApp(index) {
      this.pagefastApp.pageIndex = index;
      //this.searchfastApp();
    },
    searchfastApp(flag) {
      this.choicefastAppLoading = true;
      if (flag) {
        this.pagefastApp.pageIndex = 1;
      }
      let postData = {
        name: this.choicefastAppInfo.fastApp.trim(),
      };
      axios
        .request({
          url: "/ad/management/ads/findVivoFastApp",
          method: "post",
          data: postData,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.choicefastAppData = res.data.data;
            this.pagefastApp.totalCount = this.choicefastAppData.length;
            this.choicefastAppLoading = false;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.choicefastAppLoading = false;
        })
        .catch((err) => {
          this.$Message.error("网络错误");
          this.choicefastAppLoading = false;
        });
    },
    searchAd(flag) {
      this.choiceAdLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      let postData = {
        adName: this.choiceAdInfo.adName.trim(),
        customerName: this.choiceAdInfo.customName.trim(),
        planName: this.choiceAdInfo.planName.trim(),
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        adPositionType: this.choiceAdInfo.adPositionType,
        partnerId: this.partnerId,
        // oppoApprovalStatus:1
      };
      axios
        .request({
          url: "/ad/management/ads/findAdsPreparePassed",
          method: "post",
          data: postData,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.choiceAdData = res.data.data.data;
            this.page.totalCount = res.data.data.total;
            this.choiceAdLoading = false;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.choiceAdLoading = false;
        })
        .catch((err) => {
          this.$Message.error("网络错误");
          this.choiceAdLoading = false;
        });
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.code == 0) {
        file.url = res.data;
        file.name = res.data;
        this.responseData.logoCustomed = true;
        if (this.$refs.upload.fileList.length == 2) {
          this.$refs.upload.fileList.splice(0, 1);
        }
        this.$nextTick(() => {
          this.uploadList = this.$refs.upload.fileList;
        });
      } else {
        this.uploadList.pop();
        this.$Message.error(res.msg);
      }
    },
    cancelCustom() {
      axios
        .request({
          url: "/ad/customizedshops/cancelCustomLogo",
          method: "post",
          data: {
            partnerId: this.partnerId,
            shopId: this.shopId,
          },
        })
        .then((res) => {
          if (res.data.code == 0) {
            let logoList = [];
            if (res.data.data) {
              logoList = [
                {
                  url: res.data.data,
                  name: res.data.data,
                },
              ];
            }
            setTimeout(() => {
              this.defaultList = logoList;
              this.$nextTick(() => {
                this.uploadList = this.$refs.upload.fileList;
                this.responseData.logoCustomed = false;
              });
            }, 300);
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$Message.error("网络错误");
        });
    },
    handleUploadError(error, file, fileList) {
      this.$Notice.error({
        title: "上传失败",
        desc: "网络错误",
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传失败",
        desc: "图片格式只支持jpg|jpeg|png|gif",
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "logo大小超出限制",
        desc: "logo大小不能超过2M",
      });
    },
    change: function (evt) {},
    start: function (evt) {},
    end: function (evt) {
      evt.item; //可以知道拖动的本身
      evt.to; // 可以知道拖动的目标列表
      evt.from; // 可以知道之前的列表
      evt.oldIndex; // 可以知道拖动前的位置
      evt.newIndex; // 可以知道拖动后的位置
    },
    move: function (evt, originalEvent) {},
    changeS: function (evt) {},
    startS: function (evt) {},
    changeE: function (evt) {},
    startE: function (evt) {},
    endS: function (index, evt) {
      this.list[index].choiceFirstIndex = evt.newIndex;
      let fitem = this.list[index].oldMenu.sms_menus[
        this.list[index].choiceFirstIndex
      ];
      this.clickFirstItem(index, fitem, evt.newIndex);
    },
    moveS: function (evt, originalEvent) {},
    moveE: function (evt, originalEvent) {},
    endE: function (index, evt) {
      this.list[index].oldMenu.sms_menus[
        this.list[index].choiceFirstIndex
      ].submenu = this.list[index].secondList;
      let sitem = this.list[index].oldMenu.sms_menus[
        this.list[index].choiceFirstIndex
      ].submenu[evt.newIndex];
      this.clickSecondItem(index, sitem, evt.newIndex);
    },
    selectLimitConditions(val, index) {
      if (val) {
        this.list[index].rules += val;
        this.$nextTick(() => {
          this.list[index].ruleSelect = "";
        });
      }
    },
    clickFirstItem(index, fitem, findex) {
      this.$set(this.list[index], "choiceFirstIndex", findex);
      this.$set(this.list[index], "choiceSecondIndex", -1);
      let menu = JSON.parse(JSON.stringify(fitem));
      this.$set(this.list[index], "sms_menus", menu);
      this.$set(this.list[index], "formTitle", fitem.name);
      this.$set(this.list[index], "clickFirst", true);
      this.list[index].saveType = "saveFirst";
      if (fitem.type == "menu" && fitem.submenu && fitem.submenu.length) {
        this.$set(this.list[index], "secondList", fitem.submenu);
      } else {
        this.$set(this.list[index], "secondList", []);
      }
      this.getMenuQueue(index, findex);
    },
    clickSecondItem(index, sitem, sindex) {
      this.$set(this.list[index], "choiceSecondIndex", sindex);
      let menu = JSON.parse(JSON.stringify(sitem));
      this.list[index].saveType = "saveSecond";
      this.$set(this.list[index], "clickFirst", false);
      this.$set(this.list[index], "sms_menus", menu);
      this.$set(this.list[index], "formTitle", sitem.name);
    },
    delFirstItem(index, findex) {
      this.list[index].oldMenu.sms_menus.splice(findex, 1);
      if (findex == this.list[index].choiceFirstIndex) {
        this.list[index].sms_menus = null;
        this.$set(this.list[index], "choiceFirstIndex", -1);
        this.$set(this.list[index], "formTitle", "编辑");
        this.$set(this.list[index], "secondList", []);
      }
    },
    delSecondItem(index, sindex) {
      let findex = this.list[index].choiceFirstIndex;
      this.list[index].oldMenu.sms_menus[findex].submenu.splice(sindex, 1);
      if (sindex == this.list[index].choiceSecondIndex) {
        this.list[index].sms_menus = null;
        this.$set(this.list[index], "choiceSecondIndex", -1);
        this.$set(this.list[index], "formTitle", "编辑");
      }
    },
    addFirstItem(index, type) {
      this.$set(this.list[index], "formTitle", "增加一级菜单");
      this.$set(this.list[index], "choiceFirstIndex", -1);
      this.list[index].saveType = type;
      this.$set(
        this.list[index],
        "sms_menus",
        JSON.parse(JSON.stringify(defaultForm))
      );
    },
    addSecondItem(index, findex) {
      this.$set(this.list[index], "formTitle", "增加二级菜单");
      this.$set(this.list[index], "choiceFirstIndex", findex);
      this.$set(this.list[index], "choiceSecondIndex", -1);
      this.list[index].saveType = "addSecond";
      this.$set(
        this.list[index],
        "sms_menus",
        JSON.parse(JSON.stringify(defaultForm))
      );
      this.$set(this.list[index], "clickFirst", false);
    },
    saveMenu(index) {
      let ref = "form" + index;
      this.$refs[ref][0].validate((valid) => {
        if (this.list[index].sms_menus.type == "url") {
          let url = this.list[index].sms_menus.data;
          let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
          if (url && !reg.test(url)) {
            this.$Message.error("url格式不正确");
            return;
          }
        } else if (this.list[index].sms_menus.type == "phone") {
          if (
            this.list[index].sms_menus.data &&
            this.list[index].sms_menus.data.length > 15
          ) {
            this.$Message.error("请输入正确号码,电话号码长度不能大于15位");
            return;
          }
          // if (!/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(this.list[index].sms_menus.data)) {
          //   this.$Message.error("phone格式不正确");
          //   return;
          // }
        }
        if (valid) {
          let menu = JSON.parse(JSON.stringify(this.list[index].sms_menus));
          let smsMenusLength = this.list[index].oldMenu.sms_menus.length;
          for (let a = 0; a < smsMenusLength; a++) {
            if (
              (menu.type == "url" &&
                this.list[index].oldMenu.sms_menus[a].type == "url") ||
              (menu.type == "phone" &&
                this.list[index].oldMenu.sms_menus[a].type == "phone") ||
              (menu.type == "sms" &&
                this.list[index].oldMenu.sms_menus[a].type == "sms")
            ) {
              if (
                menu.data == this.list[index].oldMenu.sms_menus[a].data &&
                (a != this.list[index].choiceFirstIndex ||
                  this.list[index].choiceFirstIndex < 0)
              ) {
                this.$Message.error(
                  "菜单" +
                    (a + 1) +
                    "存在相同" +
                    (menu.type == "url"
                      ? "链接!"
                      : menu.type == "phone"
                      ? "电话号码!"
                      : "菜单基础数据!")
                );
                return;
              }
            }
            if (
              (menu.type == "app" &&
                this.list[index].oldMenu.sms_menus[a].type == "app") ||
              (menu.type == "fastapp" &&
                this.list[index].oldMenu.sms_menus[a].type == "fastapp")
            ) {
              if (
                menu.extendData.packageName ==
                  this.list[index].oldMenu.sms_menus[a].extendData
                    .packageName &&
                menu.extendData.deeplink ==
                  this.list[index].oldMenu.sms_menus[a].extendData.deeplink &&
                (a != this.list[index].choiceFirstIndex ||
                  this.list[index].choiceFirstIndex < 0)
              ) {
                this.$Message.error("菜单" + (a + 1) + "存在相同包名和链接!");
                return;
              }
            }
            if (this.list[index].oldMenu.sms_menus[a].type == "menu") {
              if (this.list[index].oldMenu.sms_menus[a].submenu) {
                let submenuLength = this.list[index].oldMenu.sms_menus[a]
                  .submenu.length;
                for (let b = 0; b < submenuLength; b++) {
                  if (
                    (menu.type == "url" &&
                      this.list[index].oldMenu.sms_menus[a].submenu[b].type ==
                        "url") ||
                    (menu.type == "phone" &&
                      this.list[index].oldMenu.sms_menus[a].submenu[b].type ==
                        "phone") ||
                    (menu.type == "sms" &&
                      this.list[index].oldMenu.sms_menus[a].submenu[b].type ==
                        "sms")
                  ) {
                    if (
                      menu.data ==
                        this.list[index].oldMenu.sms_menus[a].submenu[b].data &&
                      ((b != this.list[index].choiceSecondIndex &&
                        a == this.list[index].choiceFirstIndex) ||
                        a != this.list[index].choiceFirstIndex)
                    ) {
                      this.$Message.error(
                        "一级菜单菜单" +
                          (a + 1) +
                          " " +
                          "二级菜单" +
                          (b + 1) +
                          " " +
                          "存在相同" +
                          (menu.type == "url"
                            ? "链接!"
                            : menu.type == "phone"
                            ? "电话号码!"
                            : "菜单基础数据!")
                      );
                      return;
                    }
                  }
                  if (
                    (menu.type == "app" &&
                      this.list[index].oldMenu.sms_menus[a].submenu[b].type ==
                        "app") ||
                    (menu.type == "fastapp" &&
                      this.list[index].oldMenu.sms_menus[a].submenu[b].type ==
                        "fastapp")
                  ) {
                    if (
                      menu.extendData.packageName ==
                        this.list[index].oldMenu.sms_menus[a].submenu[b]
                          .extendData.packageName &&
                      menu.extendData.deeplink ==
                        this.list[index].oldMenu.sms_menus[a].submenu[b]
                          .extendData.deeplink &&
                      ((b != this.list[index].choiceSecondIndex &&
                        a == this.list[index].choiceFirstIndex) ||
                        a != this.list[index].choiceFirstIndex)
                    ) {
                      this.$Message.error(
                        "菜单" +
                          (a + 1) +
                          "二级菜单" +
                          (b + 1) +
                          "存在相同包名和链接!"
                      );
                      return;
                    }
                  }
                }
              }
            }
          }
          if (menu.type == "url") {
            menu.extendData.appName = "";
            menu.extendData.packageName = "";
            menu.extendData.deeplink = "";
            menu.extendData.html_link = "";
            menu.extendData.htmlLink = "";
            menu.extendData.fastAppVer = "";
            menu.extendData.installName = "";
            menu.extendData.uninstallName = "";
            delete menu["submenu"];
          } else if (menu.type == "phone") {
            let menuAdType = menu.extendData.menuAdType;
            menu.extendData = {
              menuAdType,
            };
            delete menu["submenu"];
          } else if (menu.type == "sms") {
            let menuAdType = menu.extendData.menuAdType;
            menu.extendData = {
              menuAdType,
            };
            delete menu["submenu"];
            try {
              let data = JSON.parse(menu.data);
              if (Object.prototype.toString.call(data) !== "[object Object]") {
                this.$Message.error("菜单基础数据填写错误!");
                return;
              }
            } catch {
              this.$Message.error("菜单基础数据填写错误!");
              return;
            }
          } else if (menu.type == "app") {
            delete menu["submenu"];
            menu.data = "";
            menu.extendData.fastAppVer = "";
            menu.extendData.htmlLink = "";
          } else if (menu.type == "fastapp") {
            delete menu["submenu"];
            menu.data = "";
            menu.extendData.html_link = "";
            menu.extendData.monitorLinkShow = "";
            menu.extendData.monitorLinkClick = "";
            menu.extendData.installStatus = "";
            menu.extendData.appName = "";
            menu.extendData.installName = "";
            menu.extendData.uninstallName = "";
          } else if (menu.type == "menu") {
            menu.extendData = {};
            if (!menu.submenu) {
              menu.submenu = [];
            }
            menu.data = "";
          }
          if (this.list[index].saveType == "addFirst") {
            let slength = this.list[index].oldMenu.sms_menus.length;
            for (let i = 0; i < slength; i++) {
              if (this.list[index].oldMenu.sms_menus[i].name == menu.name) {
                this.$Message.error("不可存在相同的菜单名称");
                return;
              }
            }
            this.list[index].oldMenu.sms_menus.push(menu);
            let fitem = this.list[index].oldMenu.sms_menus[
              this.list[index].oldMenu.sms_menus.length - 1
            ];
            let findex = this.list[index].oldMenu.sms_menus.length - 1;
            this.clickFirstItem(index, fitem, findex);
            this.$Message.success("添加成功");
          } else if (this.list[index].saveType == "saveFirst") {
            let slength = this.list[index].oldMenu.sms_menus.length;
            for (let i = 0; i < slength; i++) {
              if (
                this.list[index].choiceFirstIndex != i &&
                this.list[index].oldMenu.sms_menus[i].name == menu.name
              ) {
                this.$Message.error("不可存在相同的菜单名称");
                return;
              }
            }
            this.$set(
              this.list[index].oldMenu.sms_menus,
              this.list[index].choiceFirstIndex,
              menu
            );
            this.clickFirstItem(
              index,
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ],
              this.list[index].choiceFirstIndex
            );
            this.$Message.success("保存成功");
          } else if (this.list[index].saveType == "saveSecond") {
            let slength = this.list[index].oldMenu.sms_menus[
              this.list[index].choiceFirstIndex
            ].submenu.length;
            for (let i = 0; i < slength; i++) {
              if (
                this.list[index].choiceSecondIndex != i &&
                this.list[index].oldMenu.sms_menus[
                  this.list[index].choiceFirstIndex
                ].submenu[i].name == menu.name
              ) {
                this.$Message.error("不可存在相同的菜单名称");
                return;
              }
            }
            this.$set(
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu,
              this.list[index].choiceSecondIndex,
              JSON.parse(JSON.stringify(menu))
            );
            this.$Message.success("保存成功");
          } else if (this.list[index].saveType == "addSecond") {
            if (
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu &&
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu.length
            ) {
              let slength = this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu.length;
              for (let i = 0; i < slength; i++) {
                if (
                  this.list[index].oldMenu.sms_menus[
                    this.list[index].choiceFirstIndex
                  ].submenu[i].name == menu.name
                ) {
                  this.$Message.error("不可存在相同的菜单名称");
                  return;
                }
              }
            }
            if (
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu &&
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu.length
            ) {
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu.push(menu);
            } else {
              this.$set(
                this.list[index].oldMenu.sms_menus[
                  this.list[index].choiceFirstIndex
                ],
                "submenu",
                []
              );
              this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu.push(menu);
            }
            let fitem = this.list[index].oldMenu.sms_menus[
              this.list[index].choiceFirstIndex
            ];
            let findex = this.list[index].choiceFirstIndex;
            this.clickFirstItem(index, fitem, findex);
            this.$nextTick(() => {
              let sitem = this.list[index].oldMenu.sms_menus[
                this.list[index].choiceFirstIndex
              ].submenu[
                this.list[index].oldMenu.sms_menus[
                  this.list[index].choiceFirstIndex
                ].submenu.length - 1
              ];
              let sindex =
                this.list[index].oldMenu.sms_menus[
                  this.list[index].choiceFirstIndex
                ].submenu.length - 1;
              this.clickSecondItem(index, sitem, sindex);
              this.$Message.success("添加成功");
            });
          }
        } else {
          this.$Message.error("参数缺失");
        }
      });
    },
    defaultClickFirstOne() {
      if (this.list.length) {
        this.list.forEach((item, index) => {
          if (
            item.oldMenu &&
            item.oldMenu.sms_menus &&
            item.oldMenu.sms_menus.length
          ) {
            this.clickFirstItem(index, item.oldMenu.sms_menus[0], 0);
          }
        });
      }
    },
    openChoiceAdModal(index) {
      this.choiceAdModal = true;
      this.choiceAdIndex = index;
      this.searchAd(true);
    },
    openChoiceAdModalfastApp(index) {
      this.choicefastAppModal = true;
      this.choicefastAppIndex = index;
      this.searchfastApp(true);
    },
    choiceAdSubmit(row, index) {
      this.choiceAdModal = false;
      let url = row.adShortUrl.split(";")[index];
      this.list[this.choiceAdIndex].sms_menus.data = url;
    },
    choicefastAppSubmit(row) {
      this.choicefastAppModal = false;
      this.list[this.choicefastAppIndex].sms_menus.extendData.deeplink =
        row.deeplink;
      this.list[this.choicefastAppIndex].sms_menus.extendData.fastAppVer =
        row.fastAppVer;
      this.list[this.choicefastAppIndex].sms_menus.extendData.packageName =
        row.packageName;
    },
    handleAdd() {
      let item = {
        rules: "",
        ruleSelect: "",
        formTitle: "编辑",
        sms_menus: null,
        clickFirst: true,
        oldMenu: {
          sms_menus: [],
        },
        choiceFirstIndex: -1,
        choiceSecondIndex: -1,
        rcmd: "",
        rcmdInit: [],
      };
      // item.rulesBlurFlag = this.list.some(litem => {
      //   return litem.rules == "";
      // });
      this.list.push(item);
      this.$nextTick(() => {
        this.$refs.shopCustomEdit.scrollTop = this.$refs.shopCustomEdit.scrollHeight;
      });
    },
    delMenu(index) {
      this.list.splice(index, 1);
    },
    openEditMenu(type, mitem, mindex) {
      this.editModal = true;
      if (type == "update") {
        this.editModalInfo = mitem;
        this.editModalType = "update";
      } else {
        this.editModalType = "add";
        this.editModalInfo = {};
      }
    },
    closeEditMenu() {
      this.editModal = false;
    },
    endSave(type) {
      let endList = JSON.parse(JSON.stringify(this.list));
      let count = 0;
      endList.forEach((item) => {
        if (!item.rules) {
          count++;
        }
      });
      if (count > 1) {
        this.$Message.error("仅有一个菜单规则可为空");
        return;
      }
      var totalLimit = 0;
      var hasHashRule = false;
      var hasNormalRule = false;
      for (let i = 0; i < endList.length; i++) {
        if (endList[i].rules != "") {
        }
        if (
          endList[i].rules.indexOf("$H") != -1 &&
          endList[i].rules.indexOf("$HF") == -1
        ) {
          //开始转化过程
          if (
            endList[i].rules.indexOf("&&") != -1 ||
            endList[i].rules.indexOf("||") != -1
          ) {
            this.$Message.error("设备百分比条件暂不支持多条件公式!");
            return;
          } else if (endList[i].rules.indexOf("==") == -1) {
            this.$Message.error("设备百分比条件仅支持等值公式!");
            return;
          } else {
            var limit = endList[i].rules.replace(/^[^\d]*(\d+)[^\d]*$/, "$1");
            if (parseInt(limit) == 0) {
              this.$Message.error("设备百分比不能为0!");
              return;
            } else if (parseInt(limit) > 100) {
              this.$Message.error("设备百分比不能大于100!");
              return;
            }
            var preTag = "$H>=" + totalLimit;
            totalLimit += parseInt(limit);
            var postTag = "$H<" + totalLimit;
            endList[i].rules = preTag + "&&" + postTag;
          }
        }
        if (totalLimit > 100) {
          this.$Message.error("设备百分比条件总和错误：" + totalLimit + "%");
          return;
        }
        let firstNameArr = [];
        for (let j = 0; j < endList[i].oldMenu.sms_menus.length; j++) {
          if (
            endList[i].oldMenu.sms_menus[j].type == "menu" &&
            (!endList[i].oldMenu.sms_menus[j].submenu ||
              !endList[i].oldMenu.sms_menus[j].submenu.length)
          ) {
            this.$Message.error(
              "规则" + (i + 1) + "一级菜单" + (j + 1) + "未配置二级菜单"
            );
            return;
          }
          if (firstNameArr.includes(endList[i].oldMenu.sms_menus[j].name)) {
            this.$Message.error("规则" + (i + 1) + "存在相同的一级菜单名称");
            return;
          } else {
            firstNameArr.push(endList[i].oldMenu.sms_menus[j].name);
          }
          if (
            endList[i].oldMenu.sms_menus[j].type == "sms" &&
            Object.prototype.toString.call(
              endList[i].oldMenu.sms_menus[j].data
            ) !== "[object Object]"
          ) {
            try {
              endList[i].oldMenu.sms_menus[j].data = JSON.parse(
                endList[i].oldMenu.sms_menus[j].data
              );
            } catch {
              this.$Message.error(
                "规则" +
                  (i + 1) +
                  " " +
                  "一级菜单" +
                  (j + 1) +
                  " " +
                  "sms类型菜单基础数据填写错误"
              );
              return;
            }
          }
          if (endList[i].oldMenu.sms_menus[j].type == "menu") {
            let secondNameArr = [];
            if (
              endList[i].oldMenu.sms_menus[j].submenu &&
              endList[i].oldMenu.sms_menus[j].submenu.length
            ) {
              for (
                let a = 0;
                a < endList[i].oldMenu.sms_menus[j].submenu.length;
                a++
              ) {
                if (
                  secondNameArr.includes(
                    endList[i].oldMenu.sms_menus[j].submenu[a].name
                  )
                ) {
                  this.$Message.error(
                    "规则" + (i + 1) + "存在相同的二级菜单名称"
                  );
                  return;
                } else {
                  secondNameArr.push(
                    endList[i].oldMenu.sms_menus[j].submenu[a].name
                  );
                }
                if (
                  endList[i].oldMenu.sms_menus[j].submenu[a].type == "sms" &&
                  Object.prototype.toString.call(
                    endList[i].oldMenu.sms_menus[j].submenu[a].data
                  ) !== "[object Object]"
                ) {
                  try {
                    endList[i].oldMenu.sms_menus[j].submenu[
                      a
                    ].data = JSON.parse(
                      endList[i].oldMenu.sms_menus[j].submenu[a].data
                    );
                  } catch {
                    this.$Message.error(
                      "规则" +
                        (i + 1) +
                        " " +
                        "一级菜单" +
                        (j + 1) +
                        " " +
                        "二级菜单" +
                        (a + 1) +
                        " " +
                        "sms类型菜单基础数据填写错误"
                    );
                    return;
                  }
                }
              }
            }
          }
        }
      }
      let menuRules = [];
      endList.forEach((item) => {
        menuRules.push(item.rules);
        item.oldMenu.sms_menus.forEach((sitem, sindex) => {
          sitem.index = sindex + 1;
          if (sitem.extendData instanceof Array) {
            sitem.extendData = {};
          }
           if(sitem.extendData.installStatus == '' || sitem.extendData.installStatus == '1'){
            sitem.backup = []
            if(sitem.extendData.installStatus =='1'){
              sitem.extendData.installStatus = '0'
            }else if(sitem.extendData.installStatus == ''){
              delete sitem.extendData['installStatus']
            }
          }else if( sitem.extendData.installStatus == '0'){
            sitem.backup = []
            sitem.backup[0]  = JSON.parse(JSON.stringify(sitem.backupMenu));
            // sitem.backup[0].index = sindex+1;
          }
          delete sitem['backupMenu']
          if (sitem.submenu && sitem.submenu.length) {
            sitem.submenu.forEach((fitem, findex) => {
              fitem.index = findex + 1;
              if (fitem.extendData instanceof Array) {
                fitem.extendData = {};
              }
              if(fitem.extendData.installStatus == '' || fitem.extendData.installStatus == '1'){
            fitem.backup = []
            if(fitem.extendData.installStatus =='1'){
              fitem.extendData.installStatus = '0'
            }else if(fitem.extendData.installStatus == ''){
              delete fitem.extendData['installStatus']
            }
          }else if( fitem.extendData.installStatus == '0'){
            fitem.backup = []
            fitem.backup[0]  = JSON.parse(JSON.stringify(fitem.backupMenu));
            // fitem.backup[0].index = findex+1;
          }
          delete fitem['backupMenu']
            });
          }
        });
      });
      let menuRulesSet = [...new Set(menuRules)];
      if (menuRules.length != menuRulesSet.length) {
        this.$Message.error("不可有相同规则的菜单");
        return;
      }
      let menus = {};
      let rcmd = {};
      let rcmdFlag = false;
      endList.forEach((item, index) => {
        menus[item.rules] = item.oldMenu.sms_menus;
        this.$refs["rcmd" + index][0].validate((valid) => {
          if (valid) {
            rcmdFlag = true;
          } else {
            this.$Message.error(
              "规则" + (index + 1) + "推荐配置错误,请正确填写"
            );
            rcmdFlag = false;
          }
        });
        rcmd[item.rules] = item.rcmd ? JSON.parse(item.rcmd) : [];
      });
      if (!rcmdFlag) {
        return;
      }
      let menusStr = JSON.stringify(menus);
      let rcmdStr = JSON.stringify(rcmd);
      let url =
        type == "save"
          ? "/ad/customizedshops/save"
          : "/ad/customizedshops/saveonline";
      let postData = {
        shopId: this.shopId,
        partnerId: this.partnerId,
        // menus: menusStr === '{}' ? '' : menusStr
        menus: menusStr,
        rcmd: rcmdStr,
      };
      axios
        .request({
          url,
          method: "post",
          data: postData,
        })
        .then((res) => {
          if (res.data.code == 0) {
            type == "save"
              ? this.$Message.success("保存成功")
              : this.$Message.success("保存并上线成功");
            this.cancelBtn();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$Message.error("网络错误");
        });
    },
    replaceMenu(index, mindex) {
      let fromMenu = this.list[index].menuQueue[mindex].sms_menu;
      let choiceFirstIndex = this.list[index].choiceFirstIndex;
      let choiceSecondIndex = this.list[index].choiceSecondIndex;
      if (choiceSecondIndex > -1) {
        Object.assign(
          this.list[index].oldMenu.sms_menus[choiceFirstIndex].submenu[
            choiceSecondIndex
          ],
          fromMenu
        );
        let sitem = this.list[index].oldMenu.sms_menus[choiceFirstIndex]
          .submenu[choiceSecondIndex];
        this.clickSecondItem(index, sitem, choiceSecondIndex);
      } else if (choiceSecondIndex == -1 && choiceFirstIndex > -1) {
        Object.assign(
          this.list[index].oldMenu.sms_menus[choiceFirstIndex],
          fromMenu
        );
        this.list[index].oldMenu.sms_menus[choiceFirstIndex].submenu = [];
        let fitem = this.list[index].oldMenu.sms_menus[choiceFirstIndex];
        this.clickFirstItem(index, fitem, choiceFirstIndex);
      }
    },
    getMenuList() {
      axios
        .request({
          url: "/ad/shops/detail",
          method: "post",
          data: {
            partnerId: this.partnerId,
            shopId: this.shopId,
          },
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.responseData = res.data.data;
            this.rcmdMenu = this.responseData.rcmdMenu
              ? this.responseData.rcmdMenu
              : {};
            this.menuObject = this.responseData.smsMenus
              ? JSON.parse(this.responseData.smsMenus)
              : {};
            let logoList = [];
            if (res.data.data.logo) {
              logoList = [
                {
                  name: res.data.data.logo,
                  url: res.data.data.logo,
                },
              ];
            } else {
              logoList = [];
            }
            setTimeout(() => {
              this.defaultList = logoList;
              this.$nextTick(() => {
                this.uploadList = this.$refs.upload.fileList;
              });
            }, 300);
            this.menuListFormat();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$Message.error("网络错误" + err);
        });
    },
    menuListFormat() {
      let list = [];
      // console.log(JSON.parse(this.responseData.rcmd));
      for (let key in this.menuObject) {
        let k = "";
        try {
          if (key.indexOf("$H") != -1 && key.indexOf("$HF") == -1) {
            var data = key.trim().split("&&");
            var min = parseInt(data[0].replace(/^[^\d]*(\d+)[^\d]*$/, "$1"));
            var max = parseInt(data[1].replace(/^[^\d]*(\d+)[^\d]*$/, "$1"));
            k = "$H==" + (max - min);
          } else {
            k = key.trim();
          }
        } catch {
          k = key.trim();
        }
        var regIM = new RegExp(/\$IMEIFID\(\)/, "g");
        k = k.replace(regIM, "$IMEIFID");
        var regM = new RegExp(/\$M\(\)/, "g");
        k = k.replace(regM, "$M");
        var regCI = new RegExp(/\$CITY\(\)/, "g");
        k = k.replace(regCI, "$CITY");
        var regPRO = new RegExp(/\$PROVINCE\(\)/, "g");
        k = k.replace(regPRO, "$PROVINCE");
        var reg = new RegExp(/\$V\(\)/, "g");
        k = k.replace(reg, "$V");
        var regSDK = new RegExp(/\$SDK\(\)/, "g");
        k = k.replace(regSDK, "$SDK");
        var regH = new RegExp(/\$H\(\)/, "g");
        k = k.replace(regH, "$H");
        var regHF = new RegExp(/\$HF\(\)/, "g");
        k = k.replace(regHF, "$HF");
        let obj = {
          rules: k,
          ruleSelect: "",
          formTitle: "编辑",
          sms_menus: null,
          clickFirst: true,
          oldMenu: {},
          menuQueue: [],
        };
        try {
          obj.rcmd =
            JSON.stringify(JSON.parse(this.responseData.rcmd)[key]) === "[]"
              ? ""
              : JSON.stringify(JSON.parse(this.responseData.rcmd)[key]);
        } catch (err) {
          console.log(err);
          obj.rcmd = this.responseData.rcmd[key]
            ? this.responseData.rcmd[key]
            : "";
        }
        try {
          obj.rcmdInit = JSON.parse(obj.rcmd);
          obj.rcmdInit.forEach((item) => {
            item.show = false;
          });
        } catch {
          obj.rcmdInit = [];
        }
        this.menuObject[key].forEach((item) => {
          if (item.type == "menu") {
            item.data = "";
          }
          if (!isNaN(item.name)) {
            item.name = item.name.toString();
          }
          if (item.type == "sms") {
            if (typeof item.data == "object") {
              item.data = JSON.stringify(item.data);
            }
          }
          if (
            (item.isCommercial === 0 || item.isCommercial) &&
            typeof item.isCommercial == "number"
          ) {
            item.isCommercial = item.isCommercial.toString();
          } else if (!item.isCommercial && item.isCommercial !== "0") {
            item.isCommercial = "0";
          }
          if (
            (item.browser_type === 0 || item.browser_type) &&
            typeof item.browser_type == "number"
          ) {
            item.browser_type = item.browser_type.toString();
          }
          if (!item.hasOwnProperty("menuLogo")) {
            item.menuLogo = {};
          }
        
          if (!item.hasOwnProperty("extendData")) {
            item.extendData = {};
          } else {
            item.extendData.hasOwnProperty("menuAdType") &&
              (item.extendData.menuAdType = Number(item.extendData.menuAdType));
          }
            if(item.backup && item.backup.length && item.extendData.installStatus == '0'){
            item.backupMenu = item.backup[0]
          }else if((!item.backup || !item.backup.length) && item.extendData.installStatus == '0'){
            item.extendData.installStatus = '1'
          }
           if (!item.hasOwnProperty("backupMenu") || item.extendData.installStatus != '0' || !item.backup || !item.backup.length) {
            item.backupMenu = {name:'',type:'url',isCommercial:'0',data:'',browser_type:'1',extendData:{menuAdType:0}}
          }else{
            if (!item.backupMenu.hasOwnProperty("extendData")) {
            item.backupMenu.extendData = {menuAdType:0};
          } else {
            item.backupMenu.extendData.hasOwnProperty("menuAdType") &&
              (item.backupMenu.extendData.menuAdType = Number(item.backupMenu.extendData.menuAdType));
          }
          }
          if (!item.hasOwnProperty("striking")) {
            item.striking = { type: "0" };
          }
          if (item.submenu && item.submenu.length) {
            item.submenu.forEach((sitem) => {
              if (!isNaN(sitem.name)) {
                sitem.name = sitem.name.toString();
              }
              if (sitem.type == "sms") {
                if (typeof sitem.data == "object") {
                  sitem.data = JSON.stringify(sitem.data);
                }
              }
              if (
                (sitem.isCommercial === 0 || sitem.isCommercial) &&
                typeof sitem.isCommercial == "number"
              ) {
                sitem.isCommercial = sitem.isCommercial.toString();
              }
              if (
                (sitem.browser_type === 0 || sitem.browser_type) &&
                typeof sitem.browser_type == "number"
              ) {
                sitem.browser_type = sitem.browser_type.toString();
              }
              if (!sitem.hasOwnProperty("menuLogo")) {
                sitem.menuLogo = {};
              }
             
              if (!sitem.hasOwnProperty("extendData")) {
                sitem.extendData = {};
              } else {
                sitem.extendData.hasOwnProperty("menuAdType") &&
                  (sitem.extendData.menuAdType = Number(
                    sitem.extendData.menuAdType
                  ));
              }
               if(sitem.backup && sitem.backup.length && sitem.extendData.installStatus == '0'){
            sitem.backupMenu = sitem.backup[0]
          }else if((!sitem.backup || !sitem.backup.length) && sitem.extendData.installStatus == '0'){
            sitem.extendData.installStatus = '1'
          }
               if (!sitem.hasOwnProperty("backupMenu") || sitem.extendData.installStatus != '0' || !sitem.backup || !sitem.backup.length) {
            sitem.backupMenu = {name:'',type:'url',isCommercial:'0',data:'',browser_type:'1',extendData:{menuAdType:0}}
          }else{
            if (!sitem.backupMenu.hasOwnProperty("extendData")) {
            sitem.backupMenu.extendData = {menuAdType:0};
          } else {
            sitem.backupMenu.extendData.hasOwnProperty("menuAdType") &&
              (sitem.backupMenu.extendData.menuAdType = Number(sitem.backupMenu.extendData.menuAdType));
          }
          }
              if (!sitem.hasOwnProperty("striking")) {
                sitem.striking = { type: "0" };
              }
            });
          }
        });
        obj.oldMenu.sms_menus = this.menuObject[key];
        list.push(obj);
      }
      this.list = JSON.parse(JSON.stringify(list));
      this.defaultClickFirstOne();
    },
    getMenuQueue(index, findex) {
      this.$set(this.list[index], "menuQueue", []);
      let postData = {
        partnerId: this.responseData.partnerId,
        shopId: this.responseData.shopId,
        shopName: this.responseData.shopName,
        ruleInfo: this.list[index].rules,
        menuIndex: findex + 1,
      };
      axios
        .request({
          url: "/ad/customizedshops/queued/menus",
          method: "post",
          data: postData,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.list[index].menuQueue = res.data.data;
            this.list[index].menuQueue.forEach((item) => {
              if (!item.sms_menu.hasOwnProperty("extendData")) {
                item.sms_menu.extendData = {};
              }
            });
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$Message.error("网络错误");
        });
    },
    cancelBtn() {
      this.partnerId = "";
      this.shopId = "";
      this.$router.push({ path: "/customManagement/shopCustom" });
    },
    updateMenuQueue() {
      this.list.forEach((item, index) => {
        if (this.list[index].choiceFirstIndex > -1) {
          this.getMenuQueue(index, this.list[index].choiceFirstIndex);
        }
      });
    },
  },
  created() {
    if (!this.$route.query.shopId) {
      this.$router.push({ path: "/customManagement/shopCustom" });
    } else {
      this.shopId = this.$route.query.shopId;
      this.partnerId = this.$route.query.partnerId + "";
    }
  },
  mounted() {},
  activated() {
    if (!this.$route.query.shopId) {
      this.$router.push({ path: "/customManagement/shopCustom" });
    } else {
      if (
        this.shopId == this.$route.query.shopId &&
        this.partnerId == this.$route.query.partnerId
      ) {
        this.getMenuList();
      } else if (
        this.shopId == this.$route.query.shopId &&
        this.partnerId != this.$route.query.partnerId
      ) {
        //this.shopId = this.$route.query.shopId;
        this.partnerId = this.$route.query.partnerId + "";
        this.getMenuList();
      } else {
        this.shopId = this.$route.query.shopId;
        this.partnerId = this.$route.query.partnerId + "";
      }
    }
  },
  watch: {
    shopId(newVal, oldVal) {
      if (newVal != oldVal && newVal) {
        this.uploadLogoData.shopId = newVal;
        this.getMenuList();
      }
    },
    partnerId(newVal, oldVal) {
      this.uploadLogoData.partnerId = newVal;
    },
  },
};
</script>

<style lang="less">
.shopCustomEdit .ivu-form-item {
  margin-bottom: 16px;
}
.shopCustomEdit .ivu-form-item-error-tip {
  padding-top: 3px;
}
.shopCustomEdit {
  width: 100%;
  height: 100%;
  // overflow: auto;
  ul,
  li {
    list-style: none;
  }
  .demo-upload-list {
    display: inline-block;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }
  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }
  .demo-upload-list-cover i {
    color: #fff;
    font-size: 26px;
    cursor: pointer;
    margin: calc(50% - 15px) auto;
  }
  .itemHeader {
    background: #f2f3f5;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    cursor: move;
    h4 {
      font-size: 14px;
    }
  }
  .firstItem {
    height: 40px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    h5 {
      width: 40%;
      overflow: hidden;
      text-overflow: ellipsis; //文本溢出显示省略号
      white-space: nowrap;
    }
    .dragFirstItem,
    .dragSecondItem {
      cursor: move;
    }
  }
  .firstItem:hover {
    background: #f2f3f5;
    cursor: pointer;
    color: #2167fa;
  }
  .firstItemRight {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    > div {
      width: 24px;
      display: flex;
      justify-content: center;
      text-align: center;
    }
    > div:nth-of-type(1) {
      margin-right: 20px;
    }
  }
  .menuQueue {
    background: #f0f1f3;
    padding: 5px 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
  .menuQueueHover {
    display: flex;
    justify-content: center;
  }
  .menuQueueHover:hover {
    cursor: pointer;
    background: #d7d8d9;
  }
}
.dragLi {
  margin-bottom: 20px;
  border: #cccccc 1px solid;
  border-radius: 5px;
  background: #fff;
}
.chosenClass {
  border: 2px dashed #ccc;
}
.dragClass {
  border: 2px dashed #000;
}
.choiceAdModal {
  .searchInfo {
    display: flex;
    margin-bottom: 20px;
    > div {
      display: flex;
      margin-right: 20px;
      h5 {
        width: 60px;
        line-height: 32px;
        margin-right: 10px;
      }
    }
  }
}
</style>
