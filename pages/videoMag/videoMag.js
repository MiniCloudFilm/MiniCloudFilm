// pages/videoMag/videoMag.js
let app = getApp();
let util = app.globalData.util;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["已上架", "未上架", "已下架", "未审核", "未通过"],
    activeIndex: 0,  
    videoList: [],
    page: 1,
    load: true,
    token: wx.getStorageSync("token"),
    url: app.globalData.api.url
  },
  //nav切换
  tabClick: function(e) { 
    // console.log(this.data.videoList);
    // console.log(e.currentTarget);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.getData(e.currentTarget.dataset.index);
    // console.log(this.data.videoList)
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
            // console.log(res.tapIndex)
            this.upVideo(data, -1);
            this.setData({
              videoList: []
            })
            this.getData('0', 1)
          }
        }
      });
    } else if (data.status == "1") {
      wx.showActionSheet({
        //未上架
        itemList: ['视频上架', '删除'],
        itemColor: '#1c7eff',
        success: res => {
          // console.log(res);
          if (!res.cancel) {
            // console.log(res.tapIndex)
            if (res.tapIndex == 0) {
              this.upVideo(data, 1);
              this.setData({
                videoList: []
              })
              this.getData('1', 1)
            } else if (res.tapIndex == 1) {
              this.deleteVideo(data);
              this.setData({
                videoList: []
              })
              this.getData('1', 1)
            }
          }
        }
      });
    } else if (data.status == "2") {
      wx.showActionSheet({
        //已下架
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
    } else if (data.status == "3") {
      //未审核
      wx.showActionSheet({
        itemList: ['删除'],
        itemColor: '#1c7eff',
        success: res => {
          console.log(res);
          if (!res.cancel) {
            this.deleteVideo(data);
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
    console.log(data);
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
        console.log(res);
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
        console.log(res);
        if (res.data.code == "200") {
          wx.showToast({
            title: `${data.title}视频删除成功！`,
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
  getData: function(status, pg) {
    // wx.showNavigationBarLoading();
    // wx.showLoading({ 
    //   title: '视频列表加载中。。。'
    // })
    let user = wx.getStorageSync('userList')
    pg = pg ? pg : 0;
    wx.request({
      url: app.globalData.api.videoMag.myUploadVideo,
      data: {
        "userId": user.userId,
        "page": pg,
        "status": status,
        "token": this.data.token

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res)
        let tmpArr;
        if(pg>1){  
          tmpArr=this.data.videoList;
        }else{
          tmpArr=[];
        }
        // 这一步实现了上拉加载更多
        if (res.data.data.datas.length < 15) {
          this.data.load = false;
        }
        tmpArr.push.apply(tmpArr, res.data.data.datas);
        this.setData({
          videoList: tmpArr
        })
        // console.log(this.data.videoList);
        this.data.page++;
        wx.hideNavigationBarLoading();
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        util.showToast('服务器连接失败！')
      }
    })
  }, 
  //视频观看
  videoType:function(e){   
    let data = e.currentTarget.dataset; 
    let arr = data.videoUrl.split('?'); 
    // console.log(data);
    // console.log(arr);
    wx.navigateTo({
      url: `../video/video?title=${data.title}&videoId=${data.id}&frontUrl=${arr[0]}&${arr[1]}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中..',
    })
    this.getData(0, 1);
    // wx.getSystemInfo({
    //   success: res => {
    //     this.setData({
    //       sliderLeft: (res.windowWidth / this.data.tabs.length) / 2 - 20,
    //       sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
    //     });
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 显示加载图标  
    if (this.data.load) {
      wx.showLoading({
        title: '玩命加载中',
      })
      this.getData(this.data.page);
      // 隐藏加载框  
      wx.hideLoading();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})