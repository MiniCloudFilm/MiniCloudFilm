// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, 
    userPwd: ""
  },
  //用户手机号
  mobileCheck: function (e) { 
    this.setData({
      userName: e.detail.value
    })   
    wx.setStorageSync('user', e.detail.value)
    console.log(wx.getStorageSync('user'));
  },
  //用户密码
  userPwdInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  navbarTap: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  formSubmit: function (e) {
    console.log((e.detail.value.userName));
    console.log((e.detail.value.userName));
    if (e.detail.value.userName.length == 0) {
      wx.setTopBarText({
        text: '请输入手机号!'
      })
      return false;
    }
    if (e.detail.value.password.length == 0) {
      wx.showToast({
        title: '请输入密码',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    wx.request({
      url: 'http://192.168.131.63:8080/api/v1/user/login', //仅为示例，并非真实的接口地址
      data: {
        'userName': e.detail.value.userName,
        'password': e.detail.value.password,
        'userType': 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == '200') {
          app.globalData.userList = res.data.data.user;
          app.globalData.token = res.data.data.token; 
          wx.setStorageSync('userList', res.data.data.user)
          wx.setStorageSync('token', res.data.data.token)
          wx.switchTab({
            url: `../user/user`
          })
        }
      }
    })
  },
  login: function () {
    // if (this.data.userName.length == 0) {
    //   wx.setTopBarText({
    //     text: '请输入手机号!'
    //   }) 
    //   return false;
    // }
    // if (this.data.userPwd.length == 0) {
    //   wx.showToast({
    //     title: '请输入密码',
    //     icon: 'success',
    //     duration: 1500
    //   })
    //   return false;
    // }
    // wx.request({
    //   url: 'http://192.168.131.227:8080/api/v1/user/login', //仅为示例，并非真实的接口地址
    //   data: {
    //     'userName': this.data.userName,
    //     'password': this.data.userPwd
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     app.globalData.userList = res.data.data.user;
    //     app.globalData.token = res.data.data.token; 
    //     if (res.data.code == '200') {
    //       wx.switchTab({
    //         url: `../user/user`
    //       })
    //     }
    //   }
    // })
  }, 
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  radioAllow: function (e) {
    this.data.allow = !this.data.allow;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName: wx.getStorageSync('user')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})