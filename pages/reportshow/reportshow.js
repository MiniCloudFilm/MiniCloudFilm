// pages/reportshow/reportshow.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    noDataImg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  imgYu: function(event) {
    console.log(event); 
    var imgList = []; //获取data-list
    imgList[0] = event.currentTarget.dataset.src;
    //图片预览
    wx.previewImage({ 
      // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }, 
  onLoad: function (options) {
    console.log(getCurrentPages()); 
    this.setData({
      reportUrl: app.globalData.api.filmshow.reportUrl + options.studyUid
    });
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