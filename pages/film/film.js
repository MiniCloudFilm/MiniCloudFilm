var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["免费视频", "收费视频", "我的记录"],
    videoList:[
      { "imgSrc": "/image/timg1.jpg", "title":"华中科技大学  张三丰教授  医学影像学ct教学视频","isFree":true,"isPay":true,"price":0},
      { "imgSrc": "/image/timg1.jpg", "title": "华中科技大学  张三丰教授  医学影像学ct教学视频", "isFree": false, "isPay": false, "price": 5.88} 
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    isFree:true,
    isPay:true
  },
  //查看收费视频
  getChargeVideo:function(){
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
        }
      }
    })
  },
  //查看免费视频
  getFreeVideo:function(){
    wx.request({
      url: 'http://192.168.131.63:8080/common/api/v1/freeVideo', 
      data:{
        "page":1,
        "token":this.data.token
      }, 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") { 
        }
      }
    })
  },
  //获取观看记录
  getQueryVideoLog:function(){
    wx.request({
      url: 'http://192.168.131.63:8080/common/api/v1/queryVideoLog',
      data: {
        "userId":this.data.user.userId,
        "page": 1,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
        }
      }
    })
  },
  //观看记录保存
  getSaveVideoLog:function(){
    wx.request({
      url: 'http://192.168.131.63:8080/common/api/v1/saveVideoLog',
      data: {
        "videoId": "9d15c1c0e4ae4c31b8a148de1423b210",
        "videoViewer": this.data.user.userId,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
        }
      }
    })
  },
  onLoad: function () {
    this.setData({
      token:wx.getStorageSync('token'),
      user:wx.getStorageSync('userList')
    })
    this.getFreeVideo();
    this.getChargeVideo();
    this.getQueryVideoLog();
    this.getSaveVideoLog();
    var that = this;
    wx.getSystemInfo({
      success: function (res) { 
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length) / 2-20,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        }); 
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }, 
  videoType:function(e){ 
    console.log(e.currentTarget);
    console.log(e.currentTarget.id);
    if (e.currentTarget.id=="true"){ 
      wx.navigateTo({
        url: '../video/video'
      })
    } else{
      wx.navigateTo({
        url: `../confirmPay/confirmPay?title=${e.currentTarget.dataset.title}&price=${e.currentTarget.dataset.price}&type=2`
      })
    }
  }
});