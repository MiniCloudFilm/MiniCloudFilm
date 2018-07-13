var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

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
    hidden:false
  },
  //查看收费视频
  getChargeVideo: function() {
    this.data.videoList = [];
    wx.request({
      url: 'http://192.168.131.63:8080/common/api/v1/chargeVideo',
      data: {
        "page": 1,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
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
      url: 'http://192.168.131.63:8080/common/api/v1/freeVideo',
      data: {
        "page": 1,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            videoList: res.data.data.datas
          })
          console.log(this.data.videoList);
          console.log(this.data.check);
        }
      }
    })
  },
  //获取观看记录
  getQueryVideoLog: function() {
    this.data.videoList = [];
    wx.request({
      url: 'http://192.168.131.63:8080/common/api/v1/queryVideoLog',
      data: {
        "userId": this.data.user.userId,
        "page": 1,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            videoList: res.data.data.datas
          })
        }
      }
    })
  },
  //观看记录保存
  getSaveVideoLog: function(videoId,data) {
    wx.request({
      url: 'http://192.168.131.63:8080/common/api/v1/saveVideoLog',
      data: {
        "videoId": videoId,
        "videoViewer": this.data.user.userId,
        "token": this.data.token
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      }, 
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") { 
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
      url: 'http://192.168.131.63:8080/video/api/v1/checkIsBuy',
      data: {
        "videoId": data.id,
        "userId": userId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            isBuy: res.data.data
          })
          if (!this.data.isBuy) { 
            wx.navigateTo({
              url: `../confirmPay/confirmPay?videoId=${data.id}&charge=${data.charge}&title=${data.title}&upId=${data.userId}&type=2`
            })
          }else{ 
            this.getSaveVideoLog(data.id);
          }
        }
      }
    })
  },
  onLoad: function() {
    this.setData({
      token: wx.getStorageSync('token'),
      user: wx.getStorageSync('userList')
    })
    this.getFreeVideo();
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length) / 2 - 20,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      check: e.currentTarget.dataset.index
    });
    console.log(this.data.check);
    if (e.currentTarget.dataset.index == '0') {
      this.getFreeVideo();
    } else if (e.currentTarget.dataset.index == '1') {
      this.getChargeVideo();
    } else if (e.currentTarget.dataset.index == '2') {
      this.getQueryVideoLog();
    }
  },
  videoType: function(e) {
    console.log(e.currentTarget);
    let data = e.currentTarget.dataset;
    console.log(data.videoUrl);
    if (e.currentTarget.dataset.isCharge == "Y") {
      this.checkIsBuy(data, this.data.user.userId);
    } else {
      this.getSaveVideoLog(e.currentTarget.dataset.id,data);
    }
    // if (e.currentTarget.dataset.isCharge == "Y") {
    //   wx.navigateTo({
    //     url: `../confirmPay/confirmPay?videoId=${data.id}&charge=${data.charge}&title=${data.title}&upId=${data.userId}&type=2`
    //   })
    // }
  }
});