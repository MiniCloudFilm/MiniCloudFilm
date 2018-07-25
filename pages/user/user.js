// pages/user/user.js   
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    url: app.globalData.api.expertList.image
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  outLogin: function() {
    wx.request({
      // url: app.globalData.api.login.login,
      url:'http://192.168.131.102:8080/api/v1/user/exit',
      data: {
        'token': app.globalData.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
        if(res.data.code=="200"){ 
          wx.removeStorageSync('userList');
          app.globalData.userList = null;
          wx.navigateTo({
            url: '../login/login?backUrl=../user/user'
          })
        }
      },
      fail:()=>{
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //获取头像
  getUserInfo: function(e) { 
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl
    }) 
  },
  login: function(e) {
    wx.navigateTo({
      url: '../login/login?backUrl=../user/user'
    })
  },
  onLoad: function(options) {  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkLoginInfo(app.getCurrentUrl());
    if (app.globalData.userInfo) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
    // console.log(wx.getStorageSync('userList')); 
    if (app.globalData.userList) {
      this.setData({
        userName: app.globalData.userList.name,
        userType: app.globalData.userList.userType,
        doctorStatus: app.globalData.userList.doctorStatus,
        doctorAva: this.data.url + app.globalData.userList.doctorId
      })
    } else {
      this.setData({
        userName: '',
        userType: ''
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})