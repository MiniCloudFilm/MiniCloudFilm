// pages/myAccount/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:0
    },
  // 提现
  pickupCash: function () {
    wx.navigateTo({
      url: '../pickupCach/pickupCach'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user=wx.getStorageSync('userList')
    let token = wx.getStorageSync('token')
    console.log(user);
    console.log(token);
    wx.request({
      url: 'http://192.168.131.63:8080/doctor/api/v1/myBalance', //仅为示例，并非真实的接口地址
      data: {
        'userId': user.userId,
        'token': token, 
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res=> {
        console.log(res.data)
        this.setData({
          balance: res.data.data
        })
      }
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