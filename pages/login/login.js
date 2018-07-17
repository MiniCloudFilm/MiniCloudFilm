// pages/login/login.js
let app = getApp();
var util = require('../../utils/util.js')
Page({ 
  /**
   * 页面的初始数据
   */
  data: {
    currentTab:1, 
    userPwd: "",
    turn:true
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
    // console.log(e);
    // console.log((e.detail.value.userName)); 
    if (e.detail.value.userName.length == 0) {
      wx.setTopBarText({
        text: '请输入手机号!'
      })
      return false;
    };
    if (e.detail.value.password.length == 0) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1500
      })
      return false;
    };
    // lanjq
    wx.showLoading({
      title: '登录中...',
    })
    wx.login({
      success: res => {
        var code = res.code
        // console.log(code);  
        // 发送 res.code 到后台换取 openId, sessionKey, unionId  
        // wx.request({
        //   url: `https://api.weixin.qq.com/sns/jscode2session`,
        //   data: {
        //     appid: 'wxa4cd3f1e2af9b0dd',
        //     //小程序的 app secret
        //     secret: '258161f4a510c793ebd0356962bb177b',
        //     grant_type: 'authorization_code',
        //     js_code: res.code
        //   },
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (resO) {
        //     openid = resO.data.openid //返回openid  
        //     that.globalData.openid = resO.data.openid ; 
        //     console.log(openid);
        //   }
        // })
      }
    })
    //登录
    wx.request({
      url:app.globalData.api.login.login, 
      data: {
        'userName': e.detail.value.userName,
        'password': e.detail.value.password,
        'userType': this.data.currentTab
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          wx.setStorageSync('userList', res.data.data.user);
          wx.setStorageSync('token', res.data.data.token);
          // console.log(wx.getStorageSync('userList'))
          // console.log(app.globalData.token );
          app.globalData.userList = wx.getStorageSync('userList');
          app.globalData.token = wx.getStorageSync('token');
          // console.log(app.globalData.token);
          wx.switchTab({
            url: `../user/user`
          });
         }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail:function(){
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          icon: 'none',
          duration: 1500
        })
      }
    })
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
    // console.log(util);
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