// pages/login/login.js
let app = getApp(); 
Page({ 
  /**
   * 页面的初始数据
   */
  data: { 
  },
  //用户手机号
  mobileCheck: function (e) { 
    this.setData({
      userName: e.detail.value
    })   
    wx.setStorageSync('user', e.detail.value)
    // console.log(wx.getStorageSync('user'));
  },
  //用户密码
  userPwdInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  //切换用户
  navbarTap: function (e) { 
    // console.log(e.currentTarget.dataset.idx);
    let type = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: type
    })
    wx.setStorageSync('type',type)
  },  
  //登录
  formSubmit: function (e) {
    // console.log(e);
    // console.log((e.detail.value.userName)); 
    if (e.detail.value.userName.length == 0) {
      wx.setTopBarText({
        text: '请输入手机号!'
      })
      return false;
    };
    if (e.detail.value.password.length == 0) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1500
      })
      return false;
    };
    // lanjq
    wx.showLoading({
      title: '登录中...',
    })
    wx.login({ 
      success: resA => {  
        //登录
        wx.request({
          url: app.globalData.api.login.login,
          data: {
            'userName': e.detail.value.userName,
            'password': e.detail.value.password,
            'userType': this.data.currentTab,
            'code':resA.code
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: res => {
            wx.hideLoading();
            if (res.data.code == '200') {
              wx.setStorageSync('userList', res.data.data.user);
              wx.setStorageSync('token', res.data.data.token);
              // console.log(wx.getStorageSync('userList'))
              // console.log(app.globalData.token );
              app.globalData.userList = res.data.data.user;
              app.globalData.token = res.data.data.token;
              // console.log(app.globalData.token);
              if (!this.data.backUrl) {
                wx.switchTab({
                  url: '../user/user',
                })
              } else {
                console.log(this.data.backUrl);
                if (this.data.backUrl == '../user/user' || this.data.backUrl == '../counList/counList') {
                  wx.switchTab({
                    url: this.data.backUrl
                  });
                } else {

                  if (this.data.backUrl == '../expertList/expert' || this.data.backUrl == '../chRepCon/chRepCon') { 
                    wx.redirectTo({
                      url: this.data.backUrl +'?order=before'
                    });
                  } else {
                    wx.redirectTo({
                      url: this.data.backUrl
                    });

                  }
                }
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000
              })
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({
              title: '服务器异常，请稍后再试！',
              icon: 'none',
              duration: 1500
            })
          }
        }) 
        // var code = res.code 
        // console.log(code);  
        // 发送 res.code 到后台换取 openId, sessionKey, unionId   
        // wx.request({
        //   url: `https://api.weixin.qq.com/sns/jscode2session`,
        //   data: {
        //     appid: 'wxa4cd3f1e2af9b0dd',
        //     //小程序的 app secret
        //     secret: '258161f4a510c793ebd0356962bb177b',
        //     grant_type: 'authorization_code',
        //     js_code: res.code
        //   },
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (resO) {
        //     openid = resO.data.openid //返回openid  
        //     that.globalData.openid = resO.data.openid ; 
        //     console.log(openid);
        //   }
        // })
      }
    })
  
  },   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.setData({ 
      backUrl: options.backUrl ? options.backUrl : null
    }) 
    // console.log(getCurrentPages()); 
    // console.log(wx.getStorageSync('type'));
    // console.log(options);  
    // this.setData({
    //   currentTab: wx.getStorageSync('type') ? wx.getStorageSync('type') : 1,
    //   userName: wx.getStorageSync('user'), 
    //   backUrl: options.backUrl ? options.backUrl:null
    // })
    // console.log(this.data.backUrl); 
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
    this.setData({
      currentTab: wx.getStorageSync('type') ? wx.getStorageSync('type') : 1,
      userName: wx.getStorageSync('user')
    })
    console.log(wx.getStorageSync('user'));
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