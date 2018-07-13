// pages/myVideo/myVideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    videoList: [ 
    ],
    page: 1,
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(0);
  },
  //获取视频
  getData: function (pg) {
    wx.showNavigationBarLoading();
    let user = wx.getStorageSync('userList')
    let token = wx.getStorageSync('token')
    pg = pg ? pg : 0;
    let that = this;
    var apiUrl = `http://192.168.131.63:8080/doctor/api/v1/myVideoDoctor?userId=${user.userId}&page=${pg}&token=${token}`;
    wx.request({
      url: apiUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        var tmpArr = that.data.videoList;
        // 这一步实现了上拉加载更多
        if (res.data.data.datas.length < 15) {
          that.data.load = false;
        }
        tmpArr.push.apply(tmpArr, res.data.data.datas);
        that.setData({
          videoList: that.data.videoList
        })
        that.data.page++;
        wx.hideNavigationBarLoading();
      }
    })
  },
  //观看记录保存
  getSaveVideoLog: function (data) {
    this.setData({
      user:wx.getStorageSync("userList")
    })
    wx.request({
      url: 'http://192.168.131.63:8080/common/api/v1/saveVideoLog',
      data: {
        "videoId": data.id,
        "videoViewer": this.data.user.userId,
        "token": this.data.token
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          // console.log(data);
          let arr = data.videoUrl.split('?');
          wx.navigateTo({
            url: `../video/video?title=${data.title}&videoId=${data.id}&frontUrl=${arr[0]}&${arr[1]}`,
          })
        }
      }
    })
  },
  //视频观看
  videoType: function (e) {
    let dataList = e.currentTarget.dataset; 
      this.getSaveVideoLog(dataList); 
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