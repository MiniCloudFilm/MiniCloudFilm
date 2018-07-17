// pages/chRepCon/chRepCon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  turn: function(e) {
    if (this.data.doctorMes.order == 'before') {
      wx.navigateTo({
        url: `../expertList/expert?reportId=${e.currentTarget.dataset.reportid}`
      })
    } else {
      wx.navigateTo({
        url: `../confirmPay/confirmPay?price=${this.data.doctorMes.price }&doctorName=${this.data.doctorMes.doctorName}&belong=${this.data.doctorMes.belong}&doctorId=${this.data.doctorMes.doctorId }&reportId=${e.currentTarget.dataset.reportid}&type=1`
      })
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading('加载中..')
    if (options.order == 'before') {
      this.setData({
        doctorMes: options
      })
    } else {
      this.setData({
        doctorMes: options
      })
      // console.log(this.data.doctorMes);
    }
    if (app.globalData.userList) {
      wx.request({
        url: app.globalData.api.chRepCon.getReportList,
        data: {
          'token': app.globalData.token,
          'name': app.globalData.userList.name
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          // console.log(res);
          if (res.data.code == '200') {
            this.setData({
              reportList: res.data.data
            })
            wx.hideLoading()
            // console.log(res.data)
          }
        },
        fail: res => {
          wx.hideLoading()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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