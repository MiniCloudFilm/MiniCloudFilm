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
  getQueryVideoLog: function () {
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
  getSaveVideoLog: function (data) {
    console.log(data);
    wx.request({
      url: app.globalData.api.film.getSaveVideoLog,
      data: {
        "videoId": data.videoId,
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
          if (this.data.check == '0') {
            this.getData(1);
          } else if (this.data.check == '1') {
            this.getQueryVideoLog();
          }  
          console.log(data);
          let arr = data.videoUrl.split('?');
          wx.navigateTo({
            url: `../video/video?title=${data.title}&frontUrl=${arr[0]}&${arr[1]}`,
          })
        }
      }
    })
  }, 
  onLoad: function () {
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
      isLoad: true,
      isEnd: true
    }) 
    this.getData(1)
    wx.hideLoading()
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      check: e.currentTarget.dataset.index
    });
    // console.log(this.data.check);
    if (e.currentTarget.dataset.index == '0') {
      this.getData(1);
    } else if (e.currentTarget.dataset.index == '1') {
      this.getQueryVideoLog();
    } 
  },
  videoType: function (e) {
    let dataList = e.currentTarget.dataset; 
    this.getSaveVideoLog(dataList); 
  },
  //获取视频
  getData: function (page) {
    let user = app.globalData.userList;
    wx.request({
      url: app.globalData.api.userFilm.queryVideoList,
      data: { 
        "page": page,  
        'userType':user.userType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res)
        let tmpArr;
        if (page > 1) {
          tmpArr = this.data.videoList;
        } else {
          tmpArr = [];
          this.setData({
            isEnd: true
          })
        }
        // 这一步实现了上拉加载更多
        tmpArr.push.apply(tmpArr, res.data.data.datas);
        this.setData({
          videoList: tmpArr
        })
        if (res.data.data.datas.length == 0) {
          this.setData({
            isLoad: false,
          })
          if (page > 1) {
            this.setData({
              isEnd: true
            })
          }
        } else {
          if (res.data.data.datas.length < 15) {
            this.setData({
              isLoad: false,
              isHideLoadMore: true
            })
            if (page > 1) {
              this.setData({
                isEnd: false
              })
            }
          } else {
            this.setData({
              isLoad: true,
              isHideLoadMore: true,
              page: ++page
            })
          }
        }
        wx.hideNavigationBarLoading(); 
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //监听页面滚动
  onPageScroll: function (e) {
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
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载  
    setTimeout(() => {
      this.getData(this.data.status, 1)
      this.setData({
        page: 1,
        isEnd: true,
        isLoad: true
      })
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新 
    }, 1500);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 显示加载图标   
    if (this.data.isLoad) {
      this.setData({
        isHideLoadMore: false
      })
      setTimeout(() => {
        this.getData(this.data.status, this.data.page);
      }, 1500)
    } else {
      this.setData({
        isEnd: false
      })
    }

  },
});