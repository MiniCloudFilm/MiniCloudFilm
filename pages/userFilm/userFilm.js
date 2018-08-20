var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
  data: {
    tabs: ["最新视频", "我的记录"],
    videoList: [],
    activeIndex: 0,
    check: 0,
    isFree: true,
    isPay: true,
    isBuy: false,
    hidden: false,
    url: app.globalData.api.url
  },
  //获取观看记录
  getQueryVideoLog: function() {
    this.data.videoList = [];
    let url = app.globalData.api.film.getQueryVideoLog;
    let params = {
      "userId": this.data.user.userId,
      "page": 1,
      "token": this.data.token
    }
    app.globalData.util.request(url, params, true, "get", "json", (res) => {
      this.setData({
        videoList: app.globalData.pageLoad.check(this.data.videoList, res.data.datas, 15, this)
      })
    });

    // wx.request({
    //   url: app.globalData.api.film.getQueryVideoLog,
    //   data: {
    //     "userId": this.data.user.userId,
    //     "page": 1,
    //     "token": this.data.token
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: res => {
    //     console.log(res.data)
    //     if (res.data.code == "200") {
    //       this.setData({
    //         videoList: app.globalData.pageLoad.check(this.data.videoList, res.data.data.datas, 15, this)
    //       })
    //     }
    //     console.log(this.data.videoList);
    //     wx.hideLoading()
    //   },
    //   fail: res => {
    //     wx.hideLoading()
    //     app.globalData.util.showFail("服务连接失败");
    //   } 
    // })
  },
  //观看记录保存
  getSaveVideoLog: function(data) {
    let url = app.globalData.api.film.getSaveVideoLog;
    let params = {
      "videoId": data.videoId,
      "videoViewer": this.data.user.userId,
      "token": this.data.token
    }
    app.globalData.util.request(url, params, false, "post", "json", (res) => {
      if (this.data.check == '0') {
        this.getData(1);
      } else if (this.data.check == '1') {
        this.getQueryVideoLog();
      }
      let arr = data.videoUrl.split('?');
      wx.navigateTo({
        url: `../video/video?title=${data.title}&frontUrl=${arr[0]}&${arr[1]}`,
      })
    });


    // wx.request({
    //   url: app.globalData.api.film.getSaveVideoLog,
    //   data: {
    //     "videoId": data.videoId,
    //     "videoViewer": this.data.user.userId,
    //     "token": this.data.token
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: res => {
    //     console.log(res.data)
    //     if (res.data.code == "200") {
    //       if (this.data.check == '0') {
    //         this.getData(1);
    //       } else if (this.data.check == '1') {
    //         this.getQueryVideoLog();
    //       }
    //       console.log(data);
    //       let arr = data.videoUrl.split('?');
    //       wx.navigateTo({
    //         url: `../video/video?title=${data.title}&frontUrl=${arr[0]}&${arr[1]}`,
    //       })
    //     }
    //   }
    // })
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中..',
    })
    app.checkLoginInfo(app.getCurrentUrl());
    this.setData({
      token: app.globalData.token,
      user: app.globalData.userList,
      videoList: [],
      page: 1,
      isHideLoadMore: true,
      isEnd: true
    })
    this.getData(1)
    wx.hideLoading()
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      check: e.currentTarget.dataset.index,
      page: 1,
      isHideLoadMore: true,
      isEnd: true,
      showNoData: false
    });
    // console.log(this.data.check);
    if (e.currentTarget.dataset.index == '0') {
      this.getData(1);
    } else if (e.currentTarget.dataset.index == '1') {
      this.getQueryVideoLog();
    }
  },
  videoType: function(e) {
    console.log(e.currentTarget.dataset.delFlag);
    if (e.currentTarget.dataset.delFlag == "1") {
      wx.showModal({
        title: '提示',
        content: e.currentTarget.dataset.delReason,
        showCancel: false,
        success: res => {
          if (res.confirm) {}
        }
      })
    } else {
      let dataList = e.currentTarget.dataset;
      this.getSaveVideoLog(dataList);
    }
  },
  //获取视频
  getData: function() {
    let user = app.globalData.userList;
    let url = app.globalData.api.userFilm.queryVideoList;
    let params = {
      "page": this.data.page,
      'userType': user.userType
    }
    app.globalData.util.request(url, params, true, "get", "json", (res) => {
      this.setData({
        videoList: app.globalData.pageLoad.check(this.data.videoList, res.data.datas, 15, this)
      })
    });

    // wx.request({
    //   url: app.globalData.api.userFilm.queryVideoList,
    //   data: {
    //     "page": this.data.page,
    //     'userType': user.userType
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: res => {
    //     if (res.data.code == "200") {
    //       this.setData({
    //         videoList: app.globalData.pageLoad.check(this.data.videoList, res.data.data.datas, 15, this)
    //       })
    //     }
    //     console.log(this.data.videoList);
    //     wx.hideLoading()
    //   },
    //   fail: res => {
    //     wx.hideLoading()
    //     app.globalData.util.showFail("服务连接失败");
    //   }
    // })
  },
  //监听页面滚动
  onPageScroll: function(e) {
    console.log(e);
    if (e.scrollTop > 0) {
      this.setData({
        fixed: true
      })
    } else {
      this.setData({
        fixed: false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    app.globalData.pageLoad.pullDownRefresh(this, this.getData);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 显示加载图标   
    app.globalData.pageLoad.reachBottom(this, this.getData);
  },
});