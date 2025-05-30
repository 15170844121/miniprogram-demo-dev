import CustomPage from '../../../base/CustomPage'

CustomPage({
  openSuccess() {
    wx.navigateTo({
      url: 'msg_success'
    })
  },
  openText() {
    wx.navigateTo({
      url: 'msg_text'
    })
  },
  openTextPrimary() {
    wx.navigateTo({
      url: 'msg_text_primary'
    })
  },
  openFail() {
    wx.navigateTo({
      url: 'msg_fail'
    })
  }
})
