// pages/chRepCon/chRepCon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportList: [ 
    ],
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