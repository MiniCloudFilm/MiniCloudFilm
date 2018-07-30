// pages/counList/counList.js
var app = getApp();
let filter = require('../../utils/filter.js')
// filter.identityFilter(
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoctor: true,
    tabs: ["患者咨询", "医生协助", "待处理"],
    activeIndex: 0,
    token: '',
    url: app.globalData.api.expertList.image,
    ifHasData: true, //是否可以下拉刷新
    page: 1,
    nodataIsHidden: true,
    loadingIsHidden: true,
    pageSize: 10
  },
  tabClick: function(e) {
    let index = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: index
    });
    // tab切换
    if (index == 0) {
      this.getCounList(1);
    } else if (index == 1) {
      this.receiveAssist(1);
    } else {
      this.pendingAction(1);
    }
  },
  //退款
  refund: function(e) {
    wx.request({
      url: app.globalData.api.counList.refund,
      data: {
        'orderId': e.currentTarget.dataset.orderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.data == 'SUCCESS') {
          wx.showToast({
            title: '拒绝成功',
            icon: 'none',
            duration: 2000,
            success: () => {
              this.refuse(e.currentTarget.dataset.consult);
            }
          })
        } else {
          wx.showToast({
            title: '拒绝失败，请稍后再试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //接受
  accept: function(e) {
    // console.log(e.currentTarget.dataset.consult);
    wx.request({
      url: app.globalData.api.counList.accept,
      data: {
        'consultId': e.currentTarget.dataset.consult,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res);
        if (res.data.code == '200') {
          let dialoger = e.currentTarget.dataset.dialoger;
          let dialogId = e.currentTarget.dataset.dialogId;
          let reportId = e.currentTarget.dataset.reportId;
          let consultId = e.currentTarget.dataset.consult;
          wx.navigateTo({
            url: `../ConInterface/ConInterface?dialogId=${dialogId}&reportId=${reportId}&dialoger=${dialoger}&ifNeedAssist=true&consultId=${consultId}&fromWhere=noRecord&endbutton=true`
          })
        }
      }
    })
  },
  //拒绝
  refuse: function(consult) {
    wx.request({
      url: app.globalData.api.counList.refuse,
      data: {
        'consultId': consult,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res);
        if (res.data.code == "200") {
          this.pendingAction(1);
        }
      }
    })
  },
  //获取咨询列表---患者端
  getCounListOfPatient: function(page) {
    wx.request({
      url: app.globalData.api.counList.getCounListOfPatient,
      data: {
        "token": app.globalData.token,
        "page": page,
        "pageSize": this.data.pageSize
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        if (res.data.code == '200') {
          let mesArr;
          if (page > 1) {
            mesArr = this.data.counList;
          } else {
            mesArr = [];
          };
          mesArr.push.apply(mesArr, res.data.data.datas); //合并数组
          this.setData({
            counList: mesArr
          });
          // 判断是否换页
          if (res.data.data.datas.length == 0) {
            this.setData({
              loadingIsHidden: true,
              ifHasData: false
            })
          } else {
            if (res.data.data.datas.length < this.data.pageSize) {
              this.setData({
                nodataIsHidden: false,
                loadingIsHidden: true,
                ifHasData: false
              })
            } else {
              this.setData({
                loadingIsHidden: true,
                page: ++page
              })
            }
          };
          wx.hideLoading();
        } else {
          wx.showToast({
            title: '查询列表失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '服务器或网络异常，请稍后再试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //获取咨询列表---医生端
  getCounList: function(page) {
    wx.request({
      url: app.globalData.api.counList.getCounList,
      data: {
        "token": app.globalData.token,
        "page": page,
        "pageSize": this.data.pageSize

      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data)
        wx.hideLoading()
        if (res.data.code == "200") {
          this.setData({
            counList: res.data.data.datas
          });
        } else {
          wx.showToast({
            title: '查询列表失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  receiveAssist: function(page) { //我接收的协助
    wx.request({
      url: app.globalData.api.counList.receiveAssist,
      data: {
        "token": app.globalData.token,
        "page": page,
        "pageSize": this.data.pageSize
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            receiveAssistList: res.data.data.datas
          })
        }
      }
    })
  },
  pendingAction: function(page) { //待处理
    wx.request({
      url: app.globalData.api.counList.pendingAction,
      data: {
        "token": app.globalData.token,
        "page": page,
        "pageSize": this.data.pageSize
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          let mesArr;
          if (page > 1) {
            mesArr = this.data.pendingActionList;
          } else {
            mesArr = [];
          };
          mesArr.push.apply(mesArr, res.data.data.data); //合并数组
          this.setData({
            totalPending: res.data.data.pageCount,
            pendingActionList: mesArr
          });
          // 判断是否换页
          if (res.data.data.data.length == 0) {
            this.setData({
              loadingIsHidden: true,
              ifHasData: false
            })
          } else {
            if (res.data.data.data.length < this.data.pageSize) {
              this.setData({
                nodataIsHidden: false,
                loadingIsHidden: true,
                ifHasData: false
              })
            } else {
              this.setData({
                loadingIsHidden: true,
                page: ++page
              })
            }
          };
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log((this.data.counList && this.data.counList.length == 0));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  trunConInterface: function(e) {
    if (e.currentTarget.dataset.status == "0") {
      wx.showToast({
        title: '请等待专家确认！',
        icon: 'none',
        duration: 2000
      })
    } else if (e.currentTarget.dataset.status == "1") {
      var limitsOfEnd = e.currentTarget.dataset.endbutton ? 'false' : 'true'
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifNeedAssist=${e.currentTarget.dataset.assisterid ? false : true}&consultId=${e.currentTarget.dataset.consultid}&fromWhere=noRecord&endbutton=${limitsOfEnd}`,
      })
    } else if (e.currentTarget.dataset.status == "2") {
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifNeedAssist=false&consultId=&fromWhere=record&endbutton=false`,
      })
    } else if (e.currentTarget.dataset.status == "3") {
      wx.showToast({
        title: '咨询已被拒绝！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中..',
    });
    this.reset();// 重置数据
    //登录校验
    app.checkLoginInfo(app.getCurrentUrl());
    let user = app.globalData.userList;
    console.log(user);
    if (user) {
      this.setData({
        userType: user.userType
      });
    } else {
      this.setData({
        userType: null
      });
    }
    if (this.data.userType == 1) {
      this.getCounListOfPatient(1);
      return false;
    } else if (this.data.userType == 2) {
      this.getCounList(1);
      this.pendingAction(1);
      // this.receiveAssist(1);
    }
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载  
    setTimeout(() => {
      this.reset();// 重置数据
      wx.hideNavigationBarLoading();//完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新 
      if (this.data.userType == 1) {
        this.getCounListOfPatient(1);
        return false;
      } else if (this.data.userType == 2) {
        if (this.data.activeIndex == 0) {
          this.getCounList(1);
        } else if (this.data.activeIndex == 1) {
          this.receiveAssist(1);
        } else {
          this.pendingAction(1);
        }
      }
    }, 1000);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.ifHasData) {
      this.setData({
        // 显示加载图标 
        loadingIsHidden: false
      });
      if (this.data.userType == 1) {
        this.getCounListOfPatient(this.data.page);
        return false;
      } else if (this.data.userType == 2) {
        if (this.data.activeIndex == 0) {
          this.getCounList(this.data.page);
        } else if (this.data.activeIndex == 1) {
          this.receiveAssist(this.data.page);
        } else {
          this.pendingAction(this.data.page);
        }

      }
    }

  },
  // 重置参数
  reset: function() {
    this.setData({
      page: 1,
      loadingIsHidden: true,
      nodataIsHidden: true,
      ifHasData: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})