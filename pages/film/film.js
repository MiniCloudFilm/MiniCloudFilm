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
  onLoad: function () {
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
        url: `../confirmPay/confirmPay?title=${e.currentTarget.dataset.title}&price=${e.currentTarget.dataset.price}&type=0`
      })
    }
  }
});