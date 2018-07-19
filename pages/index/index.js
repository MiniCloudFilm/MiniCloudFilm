//index.js
//获取应用实例
const app = getApp(); 
Page({
  data: { 
    bannerList:[
      "../../image/timg.jpg",
      "../../image/timg1.jpg",
      "../../image/timg2.jpg",
      "../../image/timg3.jpg",
    ] 
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
  },
  onShow:function(){  
  }, 
  // 专家咨询
  turnToExpert: function (e) { 
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
  turnToChRepCon: function (e) {
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
  turnToVideo: function (e) {
    // console.log(app.globalData.userList)
    let formId = e.detail.formId;
    wx.navigateTo({
      url: "../film/film"
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
  saveFormId: function (formId){
    wx.request({//通过网络请求发送openId和formIds到服务器
      url: app.globalData.api.index.postFormId,
      method: 'post',
      data: {
        "userId": app.globalData.userList.userId,
        "openId": app.globalData.userList.userOpenId,
        "formId": formId
      },
      success: function (res) {
        // console.log(res)
      }
    });
  }


})
