// pages/user/user.js   
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  outLogin:function(){
    wx.removeStorageSync('userList');
    wx.navigateTo(
      {
        url:'../login/login'
      }
    )
  },
  login: function (e) {  
    if (app.globalData.userInfo==null){ 
      console.log("进入");
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync("userInfo", e.detail.userInfo); 
    }
    wx.navigateTo(
      {
        url: '../login/login'
      }
    )
  },
  onLoad: function (options) {
    if (app.globalData.userInfo == null) {
      console.log("进入");
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync("userInfo", e.detail.userInfo);
    }
    var userInfo=wx.getStorageSync('userInfo')
    this.setData({ 
      avatarUrl: userInfo.avatarUrl
    })
    console.log(wx.getStorageSync('userList')); 
    if( wx.getStorageSync('userList')) {
      var userList = wx.getStorageSync('userList');
      this.setData({
        userName: userList.name,
        userType: userList.userType
      }) 
    } else {
      this.setData({
        userName: '',
        userType: ''
      })
    }
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
    var userInfo = wx.getStorageSync('userInfo')
    if (app.globalData.userInfo==null){ 
      console.log("进入");
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync("userInfo", e.detail.userInfo);
    }
    this.setData({
      avatarUrl: userInfo.avatarUrl
    })
    if (wx.getStorageSync('userList')) {
      var userList = wx.getStorageSync('userList');
      this.setData({
        userName: userList.name,
        userType: userList.userType
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