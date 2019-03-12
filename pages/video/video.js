// pages/video/video.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.api.url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    if (options.src == "535") {
      this.setData({
        src: "https://film.lanwon.com:8445/video/readOnline?videoId=e12a496a0a4b49d28eda15c4a935f469"
      })
    } else if (options.src == "342") {
      this.setData({
        src: "https://film.lanwon.com:8445/video/readOnline?videoId=3d2037f6c46c4b7a9e04150e3ba1f048"
      })
    }
    else {
      wx.setNavigationBarTitle({
        title: options.title
      })
      this.setData({
        videoList: options
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(this.data.videoList.videoId);
    // this.videoContext = wx.createVideoContext(this.data.videoList.videoId);
    // this.videoContext.requestFullScreen();
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