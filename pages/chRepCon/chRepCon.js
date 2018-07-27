// pages/chRepCon/chRepCon.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: { 
  },
  turn: function (e) {
    if (this.data.doctorMes.order == 'before') {
      console.log(e.currentTarget.dataset.doctoruserid)
      wx.navigateTo({
        url: `../expertList/expert?reportId=${e.currentTarget.dataset.reportid}&doctoruserid=${e.currentTarget.dataset.doctoruserid}`
      })
    } else {
      console.log(e.currentTarget.dataset.doctoruserid)
      console.log(this.data.doctorMes.doctorId)
      console.log(e.currentTarget.dataset.doctoruserid.indexOf(this.data.doctorMes.doctorId))
      if (e.currentTarget.dataset.doctoruserid.indexOf(this.data.doctorMes.doctorId)!=-1){
        wx.showModal({
          title: '温馨提示',
          content: '该检查报告正在和此医生咨询中，请勿重复选择',
          showCancel: false,
          success: function (res) {}
        });
        return false;
      }
      wx.navigateTo({
        url: `../confirmPay/confirmPay?price=${this.data.doctorMes.price}&doctorName=${this.data.doctorMes.doctorName}&belong=${this.data.doctorMes.belong}&doctorId=${this.data.doctorMes.doctorId}&reportId=${e.currentTarget.dataset.reportid }&type=1` 
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.showLoading({
      title: '报告加载中..',
    });
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
    app.checkLoginInfo(app.getCurrentUrl()); 
    if (app.globalData.userList) {
      this.getReportList(1)
    }
  },
  getReportList:function(page){
    wx.request({
      url: app.globalData.api.chRepCon.getReportList,
      data: {
        'token': app.globalData.token,
        'name': app.globalData.userList.name,
        'pageSize': 8,
        'page': page
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.code == '200') {
          this.setData({
            reportList: res.data.data.datas
          })
          wx.hideLoading()
          // console.log(res.data)
        }
      },
      fail: res => {
        wx.hideLoading()
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