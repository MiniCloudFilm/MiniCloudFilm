// pages/videoMag/videoMag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["已上架", "未上架", "已下架", "未审核", "未通过"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    videoList: [ 
    ],
    page: 1,
    load: true,
    token: wx.getStorageSync("token")
  },
  //nav切换
  tabClick: function (e) {
    this.setData({
      videoList:[]
    })
    console.log(e.currentTarget.dataset.index);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.getData(e.currentTarget.dataset.index);
    // console.log(this.data.videoList)
  },
  //打开选择操作
  open: function (e) {
    // console.log(e.currentTarget.dataset);
    let data = e.currentTarget.dataset;
    if (e.currentTarget.dataset.status=="0"){
      wx.showActionSheet({
        itemList: ['视频下架'],
        itemColor: '#1c7eff',
        success: res => {
          console.log(res);
          if (!res.cancel) {
            console.log(res.tapIndex)
            this.upVideo(data, -1);
            this.setData({
              videoList: []
            })
            this.getData('0', 1)
          }
        }
      });
    } else if (e.currentTarget.dataset.status == "1"){
      wx.showActionSheet({
        itemList: ['视频上架', '删除'],
        itemColor: '#1c7eff',
        success: res => {
          console.log(res);
          if (!res.cancel) {
            console.log(res.tapIndex)
            if (res.tapIndex == 0) {
              this.upVideo(data, 1);
              this.setData({
                videoList: []
              })
              this.getData('1', 1)
            } else if (res.tapIndex == 1) {
              this.deleteVideo(data);
              this.setData({
                videoList:[]
              })
              this.getData('1', 1)
            }
          }
        }
      });
    } else if (e.currentTarget.dataset.status == "2") {
      wx.showActionSheet({
        itemList: ['视频上架', '删除'],
        itemColor: '#1c7eff',
        success: res => {
          console.log(res);
          if (!res.cancel) {
            console.log(res.tapIndex)
            if (res.tapIndex == 0) {
              this.upVideo(data);
            } else if (res.tapIndex == 1) {
              this.deleteVideo(data);
            }
          }
        }
      });
    } 
    else if (e.currentTarget.dataset.status == "3") {
      wx.showActionSheet({
        itemList: ['删除','修改'],
        itemColor: '#1c7eff',
        success: res => {
          console.log(res);
          if (!res.cancel) {
            console.log(res.tapIndex)
            if (res.tapIndex == 0) {
              this.upVideo(data);
            } else if (res.tapIndex == 1) {
              this.deleteVideo(data);
            }
          }
        }
      });
    } else if (e.currentTarget.dataset.status == "4") {
      wx.showActionSheet({
        itemList: ['删除', '修改'],
        itemColor: '#1c7eff',
        success: res => {
          console.log(res);
          if (!res.cancel) {
            console.log(res.tapIndex)
            if (res.tapIndex == 0) {
              this.upVideo(data);
            } else if (res.tapIndex == 1) {
              this.deleteVideo(data);
            }
          }
        }
      });
    } 
    // url = "../upload/upload?url={{item.videoUrl}}&title={{item.videoTitle}}&charge={{item.videoCharge}}&id={{item.id}}"
  },
  //视频上架
  upVideo: function (data,type) {
    wx.request({
      url: `http://192.168.131.63:8080/doctor/api/v1/upVideo`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        'videoId': data.id, 
        "token": this.data.token,
        'type':type
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        //do something
        if (res.data.code == "200") {
          // wx.redirectTo({
          //   url: '../videoMag/videoMag',
          // })
        }
      }
    })
  },
  //视频删除
  deleteVideo: function (data) {
    wx.request({
      url: `http://192.168.131.63:8080/doctor/api/v1/deleteVideo`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        'videoId ': data.id,
        "token": this.data.token
      },
      success: function (res) {
        console.log(res);
        //do something
        if (res.data.code == "200") { 
          // wx.redirectTo({
          //   url: '../videoMag/videoMag',
          // })
        }
      }
    })
  },
  //视频修改
  updateVideo: function (data) { },
  //获取视频
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
  getData: function (status, pg) {
    wx.showNavigationBarLoading();
    let user = wx.getStorageSync('userList')
    pg = pg ? pg : 0;
    let that = this;
    var apiUrl = `http://192.168.131.63:8080/doctor/api/v1/myUploadVideo`;
    wx.request({
      url: apiUrl,
      data: {
        "userId": user.userId,
        "page": pg,
        "status": status,
        "token": this.data.token

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data.datas)
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
    this.getData( 0, 1);
    wx.getSystemInfo({
      success: res => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length) / 2 - 20,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
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