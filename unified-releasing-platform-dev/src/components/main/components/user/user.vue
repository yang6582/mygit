<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount"> -->
      <Avatar :src="userAvator" />
      <span style="font-size:14px;padding:0 5px;">{{username}}</span>
      <!-- </Badge> -->
      <Icon :size="18" type="md-arrow-dropdown" style="margin-top:-5px;"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>-->
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
import axios from "@/libs/api.request";
export default {
  name: "User",
  props: {
    userAvator: {
      type: String,
      default: ""
    }
    // messageUnreadCount: {
    //   type: Number,
    //   default: 0
    // }
  },
  data() {
    return {
      username: localStorage.userName
    };
  },
  mounted() {
    //this.username = this.$store.state.user.userName;
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      axios
        .request({
          url: "/logout",
          method: "get"
        })
        .then(res => {
            this.$router.push('/home')
            location.href = res.data.data;
        });
      // this.handleLogOut().then(() => {
      //   this.$router.push({
      //     name: 'login'
      //   })
      // })
    },
    // message () {
    //   this.$router.push({
    //     name: 'message_page'
    //   })
    // },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        // case 'message': this.message()
        //   break
      }
    }
  }
};
</script>
