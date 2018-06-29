// pages/chRepCon/chRepCon.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportList: [],
    doctorMes: {}
  },
  turn: function () {
    if (this.data.doctorMes.order=='before'){
      wx.navigateTo({
        url: `../expertList/expert`
      })
    }else{
      wx.navigateTo({
        url: `../confirmPay/confirmPay?price=${this.data.doctorMes.price}&doctorName=${this.data.doctorMes.doctorName}&belong=${this.data.doctorMes.belong}&type=1`
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    let that=this;
    console.log(options.order);
    if (options.order == 'before') {
      this.setData({
        doctorMes: options
      })
    } else {
      this.setData({
        doctorMes: options
      })
      console.log(this.data.doctorMes);
    }
    if (app.globalData.userList){
      wx.request({
        url: 'http://192.168.131.227:8080/api/v1/report/findReportList', //仅为示例，并非真实的接口地址
        data: {
          'token': app.globalData.token,
          'name': app.globalData.userList.name
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.code == '200') {
            that.setData({
              reportList: res.data.data
            })
            console.log(res.data)
          }
        }
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