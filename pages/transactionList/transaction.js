// pages/transactionList/transaction.js 
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
  },
  getData: function(page) { 
    wx.showNavigationBarLoading();
    let token = app.globalData.token;
    var doctorUrl = app.globalData.api.transactionList.myPayList;
    var patientUrl = app.globalData.api.transactionList.myPayListOfPatient;
    var url = this.data.userType == 2 ? doctorUrl : patientUrl;
    // console.log(token)  
    wx.request({
      url: url,
      data: {
        'page': page,
        'token': token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data) 
        let tmpArr;
        if (page > 1) {
          tmpArr = this.data.transactionList;
        } else {
          tmpArr = [];
          this.setData({
            isEnd: true

          })
        } 
        // 这一步实现了上拉加载更多
        tmpArr.push.apply(tmpArr, res.data.data.datas);
        this.setData({
          transactionList: tmpArr,
          // isHideLoadMore: false 
        })
        console.log(res.data.data.datas.length);
        if (res.data.data.datas.length==0){
          if(page>1){ 
            this.setData({
              isEnd: true
            }) 
          }
        }else{
          if (res.data.data.datas.length < 15) {
            this.setData({
              isLoad: false,
              isHideLoadMore: true,
            })
            if(page>1){
              this.setData({ 
                isEnd: false
              })
            }
          } else {
            this.setData({
              isHideLoadMore: true,
              page: ++page
            })
          }
        } 
        // console.log(this.data.page);
        wx.hideNavigationBarLoading();
      }
    })
  },
  openDetail: function(e) {
    let orderId = e.currentTarget.dataset.orderId;
    let orderFee = e.currentTarget.dataset.orderFee;
    let orderMobile = e.currentTarget.dataset.orderMobile;
    let orderTime = e.currentTarget.dataset.orderTime;
    let orderType = e.currentTarget.dataset.orderType;
    let userName = e.currentTarget.dataset.userName;
    let orderPayType = e.currentTarget.dataset.orderpaytype;
    let videoTitle = e.currentTarget.dataset.videotitle;
    let doctorName = e.currentTarget.dataset.doctorName;
    wx.navigateTo({
      url: `../payDetail/payDetail?orderId=${orderId}&orderFee=${orderFee}&orderMobile=${orderMobile}&orderTime=${orderTime}&orderType=${orderType}&userName=${userName}&orderPayType=${orderPayType}&videoTitle=${videoTitle}&doctorName=${doctorName}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isHideLoadMore: true,
      page:1,
      isLoad:true,
      isEnd:true,
      myId: app.globalData.userList.userId,
      userType: app.globalData.userList.userType
    });
    this.getData(this.data.page);
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
    wx.showNavigationBarLoading() //在标题栏中显示加载  
    setTimeout(() => {
      this.getData(1);
      this.setData({
        page:1,
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
  onReachBottom: function() {
    // 显示加载图标 
    if (this.data.isLoad) {
        this.setData({
          isHideLoadMore: false
        })
        setTimeout(() => {
          this.getData(this.data.page);
        }, 1500)  
    } else {
      this.setData({
        isEnd:false
      })
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})