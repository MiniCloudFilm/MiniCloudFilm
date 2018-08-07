// pages/videoMag/videoMag.js
let app = getApp();
let util = app.globalData.util;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["已上架", "审核中", "未上架", "未通过"],
    activeIndex: 0,
    url: app.globalData.api.url
  },
  //nav切换
  tabClick: function(e) {
    wx.showLoading({
      title: '加载中..',
    })
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      page: 1,
      videoList: [],
      isHideLoadMore: true,
      isEnd: true,
      showNoData: false
    });
    if (e.currentTarget.dataset.index == 0) {
      this.setData({
        activeIndex: e.currentTarget.id,
        status: e.currentTarget.dataset.index,
      })
      this.getData(e.currentTarget.dataset.index, this.data.page);
    } else {
      this.getData(e.currentTarget.dataset.index + 1, this.data.page);
      this.setData({
        activeIndex: parseInt(e.currentTarget.id),
        status: parseInt(e.currentTarget.dataset.index) + 1,
      })
    }
  },
  //打开选择操作
  open: function(e) {
    // console.log(e.currentTarget.dataset);
    let data = e.currentTarget.dataset;
    if (data.status == "0") {
      wx.showActionSheet({
        //已上架
        itemList: ['视频下架'],
        itemColor: '#1c7eff',
        success: res => {
          // console.log(res);
          if (!res.cancel) {
            this.upVideo(data, -1);
            this.setData({
              videoList: []
            })
            this.getData('0', 1)
          }
        }
      });
    } else if (data.status == "1") {
      app.globalData.util.showWarning("视频审核中");
      // wx.showActionSheet({
      //   //未上架
      //   itemList: ['视频上架', '删除'],
      //   itemColor: '#1c7eff',
      //   success: res => {
      //     // console.log(res);
      //     if (!res.cancel) {
      //       if (res.tapIndex == 0) {
      //         this.upVideo(data, 1);
      //         this.setData({
      //           videoList: []
      //         })
      //         this.getData('1', 1)
      //       } else if (res.tapIndex == 1) {
      //         this.deleteVideo(data);
      //         this.setData({
      //           videoList: []
      //         })
      //         this.getData('1', 1)
      //       }
      //     }
      //   }
      // });
    }
    //  else if (data.status == "2") {
    //   wx.showActionSheet({
    //     //已下架
    //     itemList: ['视频上架', '删除'],
    //     itemColor: '#1c7eff',
    //     success: res => {
    //       // console.log(res);
    //       if (!res.cancel) {
    //         if (res.tapIndex == 0) {
    //           this.upVideo(data);
    //         } else if (res.tapIndex == 1) {
    //           this.deleteVideo(data);
    //         }
    //       }
    //     }
    //   });
    // } 
    else if (data.status == "3") {
      let item = ['上架']
      console.log(this.data.videoList[0].delFlag);
      if (this.data.videoList[0].delFlag=='1'){
        item = ['删除'];
      }
      //未审核
      wx.showActionSheet({
        itemList: item,
        itemColor: '#1c7eff',
        success: res => {
          console.log(res);
          if (!res.cancel) {
            // this.deleteVideo(data);
            if (item[0] == '上架') {
              this.upVideo(data, 1); 
            }else{ 
              this.deleteVideo(data);
            }
          }
        }
      });
    } else if (data.status == "4") {
      wx.showActionSheet({
        itemList: ['删除'],
        itemColor: '#1c7eff',
        success: res => {
          // console.log(res);
          //未通过
          if (!res.cancel) {
            this.deleteVideo(data);
          }
        }
      });
    }
    // url = "../upload/upload?url={{item.videoUrl}}&title={{item.videoTitle}}&charge={{item.videoCharge}}&id={{item.id}}"
  },
  //视频上架
  upVideo: function(data, type) {
    // console.log(data);
    this.setData({
      videoList: []
    })
    wx.request({
      url: app.globalData.api.videoMag.upVideo,
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        'videoId': data.videoId,
        "token": this.data.token,
        'type': type
      },
      method: 'GET',
      success: res => {
        // console.log(res);
        //do something
        if (res.data.code == "200") {
          this.getData(data.status, 1)
        }
      }
    })
  },
  //视频删除
  deleteVideo: function(data) {
    this.setData({
      videoList: []
    })
    wx.request({
      url: app.globalData.api.videoMag.deleteVideo,
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        'videoId': data.videoId,
        "token": this.data.token
      },
      method: 'GET',
      success: res => {
        // console.log(res);
        if (res.data.code == "200") {
          wx.showToast({
            title: `视频删除成功！`,
            icon: 'success',
            duration: 2000,
            success: resA => {
              this.getData(data.status, 1)
            }
          })
        }
      }
    })
  },
  //视频修改
  updateVideo: function(data) {},
  //视频
  getData: function(status, page) {
    let user = app.globalData.userList;
    wx.request({
      url: app.globalData.api.videoMag.myUploadVideo,
      data: {
        "userId": user.userId,
        "page": page,
        "status": status,
        "token": this.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res)
        if (res.data.code == "200") {
          this.setData({
            videoList: app.globalData.pageLoad.check(this.data.videoList, res.data.data.datas, 15, this)
          })
        }
        wx.hideNavigationBarLoading();
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading();
        app.globalData.util.showFail("服务连接失败");
      }
    })
  },
  //视频观看
  videoType: function(e) {
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
      let data = e.currentTarget.dataset;
      let arr = data.videoUrl.split('?');
      wx.navigateTo({
        url: `../video/video?title=${data.title}&videoId=${data.id}&frontUrl=${arr[0]}&${arr[1]}`
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中..',
    })
    this.setData({
      token: app.globalData.token,
      isHideLoadMore: true,
      page: 1,
      isEnd: true,
    })
    this.getData(0, this.data.page);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  //监听页面滚动
  onPageScroll: function(e) {
    console.log(e);
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
  onPullDownRefresh: function() {

    app.globalData.pageLoad.pullDownRefresh(this, this.getData, [this.data.status, 1]);
    // wx.showNavigationBarLoading() //在标题栏中显示加载  
    // setTimeout(() => {
    //   this.getData(this.data.status, 1)
    //   this.setData({
    //     page: 1,
    //     isEnd: true,
    //     isLoad: true
    //   })
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新 
    // }, 1500);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    app.globalData.pageLoad.reachBottom(this, this.getData, [this.data.status, this.data.page]);
    // if (this.data.isLoad) {
    //   this.setData({
    //     isHideLoadMore: false
    //   })
    //   setTimeout(() => {
    //     this.getData(this.data.status, this.data.page);
    //   }, 1500)
    // } else {
    //   this.setData({
    //     isEnd: false
    //   })
    // } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})