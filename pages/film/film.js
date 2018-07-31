var app = getApp();
Page({
  data: {
    tabs: ["免费视频", "收费视频", "我的记录"],
    videoList: [],
    activeIndex: 0,
    check: 0,
    isFree: true,
    isPay: true, 
    isBuy: false,
    hidden:false,
    url: app.globalData.api.url,
    free: app.globalData.api.film.getFreeVideo,
    charge: app.globalData.api.film.getChargeVideo, 
  },
  tabClick: function (e) {
    wx.showLoading({
      title: '加载中..',
    })
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      check: e.currentTarget.dataset.index,
      videoList:[],
      page: 1,
      isHideLoadMore: true,
      isLoad: true,
      isEnd: true
    });
    // console.log(this.data.check);
    if (e.currentTarget.dataset.index == '0') {
      this.getVideo(this.data.free);
    } else if (e.currentTarget.dataset.index == '1') {
      this.getVideo(this.data.charge);
    } else if (e.currentTarget.dataset.index == '2') {
      this.getQueryVideoLog();
    }
  },
  videoType: function (e) {
    let dataList = e.currentTarget.dataset;
    if (e.currentTarget.dataset.isCharge == "Y") {
      this.checkIsBuy(dataList, this.data.user.userId);
    } else {
      this.getSaveVideoLog(dataList);
    }
  },
  //获取视频
  getVideo:function(api){ 
    wx.request({
      // url: app.globalData.api.film.getChargeVideo,
      url: api,
      data: {
        "userId":this.data.user.userId,
        "page": this.data.page,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          let tmpArr;
          if (this.data.page > 1) {
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
            if (this.data.page > 1) {
              this.setData({
                isEnd: false,
                isHideLoadMore: true
              })
            }
          } else {
            if (res.data.data.datas.length < 15) {
              this.setData({
                isLoad: false,
                isHideLoadMore: true
              })
              if (this.data.page > 1) {
                this.setData({
                  isEnd: false
                })
              }
            } else {
              this.setData({
                isLoad: true,
                isHideLoadMore: true,
                page: ++this.data.page
              })
            }
          } 
        }
        console.log(this.data.videoList);
        wx.hideLoading()
      },
      fail:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }, 
  //获取观看记录
  getQueryVideoLog: function() { 
    wx.request({ 
      url: app.globalData.api.film.getQueryVideoLog, 
      data: {
        "userId": this.data.user.userId,
        "page": this.data.page,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          let tmpArr;
          if (this.data.page > 1) {
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
            if (this.data.page > 1) {
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
              if (this.data.page > 1) {
                this.setData({
                  isEnd: false
                })
              }
            } else {
              this.setData({
                isLoad: true,
                isHideLoadMore: true,
                page: ++this.data.page
              })
            }
          }
        }
        console.log(this.data.videoList);
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
  //观看记录保存
  getSaveVideoLog: function(data) { 
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
            this.getVideo(this.data.free);
          } else if (this.data.check  == '1') {
            this.getVideo(this.data.charge);
          } else if (this.data.check  == '2') {
            this.getQueryVideoLog();
          }
          console.log(data);
          if (data.isBuy || data.isCharge=='N') {
            let arr = data.videoUrl.split('?');
            wx.navigateTo({
              url: `../video/video?title=${data.title}&frontUrl=${arr[0]}&${arr[1]}`,
            }) 
          } 
        }
      }
    })
  },
  //判断是否购买
  checkIsBuy: function(data, userId) {
    console.log(data);
    wx.request({ 
      url: app.globalData.api.film.checkIsBuy, 
      data: {
        "videoId": data.videoId,
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
            wx.showModal({
              title: '提示',
              content: `是否购买《${data.title}》?`,
              success: res=> {
                if (res.confirm) { 
                  this.getSaveVideoLog(data);
                  wx.navigateTo({
                    url: `../confirmPay/confirmPay?videoId=${data.videoId}&charge=${data.charge}&title=${data.title}&upId=${data.userId}&type=2`
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
      token: app.globalData.token,
      user: app.globalData.userList,
      isHideLoadMore: true,
      isLoad: true,
      isEnd: true,
      page: 1,
    })
    app.checkLoginInfo(app.getCurrentUrl());  
    this.getVideo(this.data.free);  
  },
   //监听页面滚动
  onPageScroll: function (e) { 
    if (e.scrollTop > 10) {
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
    this.setData({
      page: 1,
      isEnd: true,
      isLoad: true
    })
    setTimeout(() => {
      if (this.data.check == '0') {
        this.getVideo(this.data.free)
      } else if (this.data.check == '1') {
        this.getVideo(this.data.charge)
      } else if (this.data.check == '2') {
        this.getQueryVideoLog();
      } 
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
      if (this.data.check=='0'){
        this.getVideo(this.data.free)
      } else if (this.data.check == '1') {
          this.getVideo(this.data.charge)
      } else if (this.data.check == '2') {
        this.getQueryVideoLog();
      } 
    } else {
      this.setData({
        isEnd: false
      })
    }
  },

});