var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
  data: {
    tabs: ["免费视频", "收费视频", "我的记录"],
    videoList: [],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    check: 0,
    isFree: true,
    isPay: true,
    user: wx.getStorageSync('userList'),
    isBuy: false,
    hidden:false,
    url: app.globalData.api.film.image
  },
  //查看收费视频
  getChargeVideo: function() {
    this.data.videoList = [];
    wx.request({ 
      url: app.globalData.api.film.getChargeVideo, 
      data: {
        "page": 1,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            videoList: res.data.data.datas
          })
        }
      }
    })
  },
  //查看免费视频
  getFreeVideo: function() {
    this.data.videoList = [];
    wx.request({ 
      url: app.globalData.api.film.getFreeVideo, 
      data: {
        "page": 1,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            videoList: res.data.data.datas
          }) 
        }
      }
    })
  },
  //获取观看记录
  getQueryVideoLog: function() {
    this.data.videoList = [];
    wx.request({ 
      url: app.globalData.api.film.getQueryVideoLog, 
      data: {
        "userId": this.data.user.userId,
        "page": 1,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            videoList: res.data.data.datas
          })
        }
      }
    })
  },
  //观看记录保存
  getSaveVideoLog: function(data) {
    wx.request({ 
      url: app.globalData.api.film.getSaveVideoLog, 
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
  //判断是否购买
  checkIsBuy: function(data, userId) {
    wx.request({ 
      url: app.globalData.api.film.checkIsBuy, 
      data: {
        "videoId": data.id,
        "userId": userId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            isBuy: res.data.data
          })
          if (!this.data.isBuy) { 
            wx.showModal({
              title: '提示',
              content: `确定购买${data.title}，该视频！`,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: `../confirmPay/confirmPay?videoId=${data.id}&charge=${data.charge}&title=${data.title}&upId=${data.userId}&type=2`
                  })
                } else if (res.cancel) {
                  // console.log('用户点击取消')
                }
              }
            })
           
          }else{ 
            this.getSaveVideoLog(data);
          }
        }
      }
    })
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中..',
    })
    this.setData({
      token: wx.getStorageSync('token'),
      user: wx.getStorageSync('userList')
    })
    this.getFreeVideo(); 
    wx.getSystemInfo({
      success: res=> {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length) / 2 - 20,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
    wx.hideLoading()
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      check: e.currentTarget.dataset.index
    });
    // console.log(this.data.check);
    if (e.currentTarget.dataset.index == '0') {
      this.getFreeVideo();
    } else if (e.currentTarget.dataset.index == '1') {
      this.getChargeVideo();
    } else if (e.currentTarget.dataset.index == '2') {
      this.getQueryVideoLog();
    }
  },
  videoType: function(e) { 
    let dataList = e.currentTarget.dataset; 
    if (e.currentTarget.dataset.isCharge == "Y") {
      this.checkIsBuy(dataList, this.data.user.userId); 
    } else {
      this.getSaveVideoLog(dataList);
    }
  }
});