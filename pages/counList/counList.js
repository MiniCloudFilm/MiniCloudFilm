// pages/counList/counList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoctor: true,
    tabs: ["咨询列表", "待处理"],
    activeIndex: 0
  },
  tabClick: function (e) {
    console.log(e.currentTarget.offsetLeft);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //接受
  accept:function(e){
    console.log(e.currentTarget.dataset.consult);
    wx.request({
      url: 'http://192.168.131.63:8080/consult/api/v1/receive', //仅为示例，并非真实的接口地址
      data: {
        'consultId': e.currentTarget.dataset.consult, 
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res=> {
        console.log(res);
        if (res.data.code == '200') { 
          this.getCounList();
        }
      }
    })
  },
  //拒绝
  refuse:function(e){
    wx.request({
      url: 'http://192.168.131.63:8080/consult/api/v1/refuse', //仅为示例，并非真实的接口地址
      data: {
        'consultId': e.currentTarget.dataset.consult,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res=> {
        console.log(res);
        if (res.data.code == '200') {
          this.getCounList();
        }
      }
    })
  },
  //获取咨询列表
  getCounList:function(){
    let user = wx.getStorageSync("userList")
    let token = wx.getStorageSync("token")
    this.setData({
      userType: user.userType
    })
    console.log(user.userType);
    console.log(user.userId);
    console.log(token);
    wx.request({
      url: 'http://192.168.131.63:8080/dialog/api/v1/dialogList',
      data: {
        'userId': user.userId,
        'userType': user.userType
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            counList: res.data.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let user=wx.getStorageSync("userList")
    // let token = wx.getStorageSync("token")
    // console.log(user.userId);
    // console.log(token);
    // wx.request({
    //   url: 'http://192.168.131.63:8080/dialog/api/v1/dialogList',
    //   data: { 
    //     'userId': user.userId,
    //     'userType': user.userType
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: res => {
    //     console.log(res.data.data)
    //     if (res.data.code == "200") {
    //       this.setData({
    //         expertList: res.data.data
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  trunConInterface:function(e){
    console.log(e);
    console.log(e.currentTarget.dataset.dialogid);
    console.log(e.currentTarget.dataset.reportid);
    if (e.currentTarget.dataset.status == "0") { 
      wx.showToast({
        title: '请等待专家确认！',
        icon: 'none',
        duration: 2000
      })   
    } else if(e.currentTarget.dataset.status == "1"){
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.receiver}&ifAssist=${e.currentTarget.dataset.assister}&consultId=${e.currentTarget.dataset.consultid}`,
      })
    } else if (e.currentTarget.dataset.status == "2"){
      wx.showToast({
        title: '咨询结束！',
        icon: 'none',
        duration: 2000
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
  onShow: function () {
    this.getCounList();
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})