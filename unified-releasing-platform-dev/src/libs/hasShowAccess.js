import store from "@/store"
let btnAccess = store.state.app.btnAccess
export default (el) => {
    return btnAccess.includes(el)
  }