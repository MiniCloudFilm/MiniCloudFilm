// pages/confirmPay/confirmPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
     checked:'true',
     allow:true
  }, 
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  }, 
  radioAllow:function(e){ 
    this.data.allow=!this.data.allow;
  },
  openConfirm: function () {
    wx.showModal({
      title: '支付完成',
      content: '解读咨询已发起,请等待医生接受。',
      confirmText: "回主页", 
      confirmColor:"#1c7eff",
      cancelText: "咨询列表",
      cancelColor:"#616569",
      success: function (res) { 
        if (res.confirm) {
          wx.reLaunch({
            url: '../index/index'
          })
        } else {
          wx.reLaunch({
            url: '../counList/counList'
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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