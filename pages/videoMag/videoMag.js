// pages/videoMag/videoMag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [
      // { "imgSrc": "/image/timg1.jpg", "title": "华中科技大学  张三丰教授  医学影像学ct教学视频", "isFree": true, "isPay": true, "price": 0 },
      // { "imgSrc": "/image/timg1.jpg", "title": "华中科技大学  张三丰教授  医学影像学ct教学视频", "isFree": false, "isPay": false, "price": 5.88 }
    ],
    page: 1,
    load: true
  },
  getVideo: function () {
    let user = wx.getStorageSync("userList");
    let token = wx.getStorageSync("token")
    var that = this;
    wx.request({
      url: `http://192.168.131.63:8080/doctor/api/v1/upVideo`,  
      header: {
        'content-type': 'application/json' // 默认值
      }, 
      Data: {
        'userId': user.userId,
        "videoTitle": e.detail.value.title,
        "videoCharge": e.detail.value.charge,
        "token": token
      },
      success: function (res) {
        console.log(res);
        //do something
        if (res.data.code == "200") {
          wx.redirectTo({
            url: '../videoMag/videoMag',
          })
        }
      }
    })
    },
    //视频
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
        console.log(res.data)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.getData();
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
    var that = this;
    // 显示加载图标  
    if (that.data.load) {
      wx.showLoading({
        title: '玩命加载中',
      })
      that.getData(that.data.page);
      // 隐藏加载框  
      wx.hideLoading();
    } 

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})