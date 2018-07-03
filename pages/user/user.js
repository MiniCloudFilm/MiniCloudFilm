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
  onLoad: function (options) {
    var s = app.globalData.userList
    console.log(s);
    if( wx.getStorageSync('userList')) {
      var userList = wx.getStorageSync('userList');
      this.setData({
        userName: userList.name
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
    console.log(app.globalData.userList);
    if (app.globalData.userList) {
      var userList = app.globalData.userList;
      this.setData({
        userName: userList.name
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