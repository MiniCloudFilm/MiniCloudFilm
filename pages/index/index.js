//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerList: [],
    url: app.globalData.api.index.showImage, 
    page: 1,
    nodataIsHidden: true,
    loadingIsHidden: true,

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };

    this.getMessage(2, 1);
    this.getMessage(1, 1);
  },
  onShow: function() {
    let user = app.globalData.userList;
    if (user) {
      this.setData({
        userType: user.userType
      })
    } else {
      this.setData({
        userType: ''
      })
    }
    // console.log(this.data.userType);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 专家咨询
  turnToExpert: function(e) {
    "../chRepCon/chRepCon?order=before"
    // console.log(app.globalData.userList)
    let formId = e.detail.formId;
    wx.navigateTo({
      url: '../expertList/expert?order=before'
    });
    if (formId && formId != 'the formId is a mock one') {
      this.saveFormId(formId);
    };
  },
  // 报告解读
  turnToChRepCon: function(e) {
    // console.log(app.globalData.userList)
    let formId = e.detail.formId;
    wx.navigateTo({
      url: "../chRepCon/chRepCon?order=before"
    });
    if (formId && formId != 'the formId is a mock one') {
      this.saveFormId(formId);
    };
  },
  // 医学视频
  turnToVideo: function(e) {
    // console.log(app.globalData.userList)
    let formId = e.detail.formId;
    wx.navigateTo({
      url: "../film/film"
    });
    if (formId && formId != 'the formId is a mock one') {
      this.saveFormId(formId);
    };
  },
  //生活小常识
  turnUserVideo:function(e){
    let formId = e.detail.formId;
    wx.navigateTo({
      url: "../userFilm/userFilm"
    });
    if (formId && formId != 'the formId is a mock one') {
      this.saveFormId(formId);
    };
  },
  // 会诊记录
  turnToConAssistance: function(e) {
    // console.log(app.globalData.userList)
    let formId = e.detail.formId;
    wx.navigateTo({
      url: "../conAssistance/conAssistance"
    });
    if (formId && formId != 'the formId is a mock one') {
      this.saveFormId(formId);
    };
  },
  // 会诊记录
  developing: function(e) {
    // console.log(app.globalData.userList)
    let formId = e.detail.formId;
    if (formId && formId != 'the formId is a mock one') {
      this.saveFormId(formId);
    };
  },
  saveFormId: function(formId) {
    if (formId && formId != 'the formId is a mock one') {
      wx.request({ //通过网络请求发送openId和formIds到服务器
        url: app.globalData.api.index.postFormId,
        method: 'post',
        data: {
          "userId": app.globalData.userList.userId,
          "openId": app.globalData.userList.userOpenId,
          "formId": formId
        },
        success: function(res) {
          // console.log(res)
        }
      });
    } else {
      // return false;
      console.log("电脑端")
    }

  },
  // 获取资讯列表
  getMessage: function(type, page) {
    wx.request({
      url: app.globalData.api.index.getMessage,
      method: 'post',
      data: {
        "pageNum": page,
        "rowsCount": 6,
        "type": type
      },
      success: res => {
        if (res.data.code == "200") {
          if (type == 1) {
            // 轮播图
            var bannerList = [];
            res.data.data.data.forEach(val => {
              bannerList.push(this.data.url + val.id);
            });
            this.setData({
              bannerList: bannerList
            })
          } else if (type == 2) {
            //咨询列表
            let mesArr;
            if (page > 1) {
              mesArr = this.data.messageList;
            } else {
              mesArr = [];
            };
            mesArr.push.apply(mesArr, res.data.data.data); //合并数组
            this.setData({
              messageList: mesArr
            });
            // 判断是否换页
            if (res.data.data.data.length == 0) {
              this.setData({
                loadingIsHidden: true,
                ifHasData: false
              })
            } else {
              if (res.data.data.data.length < 6) {
                this.setData({
                  nodataIsHidden: false,
                  loadingIsHidden: true,
                  ifHasData: false
                })
              } else {
                this.setData({
                  ifHasData: true,
                  loadingIsHidden: true,
                  page: ++page
                })
              }
            };
            // console.log(this.data.page)
          }
        }
      }
    });
  },
  // 获取信息详情页面
  getMessageDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../newsDetail/newsDetail?id=${id}`
    });
    app.saveFormId();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载  
      this.getMessage(2, 1);
      this.getMessage(1, 1);
      this.setData({
        page: 1,
        loadingIsHidden: true,
        nodataIsHidden: true
    })
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新 
    }, 1000);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 显示加载图标 
    if (this.data.ifHasData) {
      this.setData({
        loadingIsHidden: false
      })

      this.getMessage(2, this.data.page);

    }
  },


})