// pages/counList/counList.js
var sliderWidth = 96;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoctor: true,
    tabs: ["我的会诊", "发起协助", "接收协助"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    isAccept: false,
    ifHasData: true, //是否可以下拉刷新
    page: 1,
    nodataIsHidden: true,
    loadingIsHidden: true,
    pageSize: 15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中..',
    });
    var that = this;
    app.checkLoginInfo(app.getCurrentUrl());
    // console.log(that.data.activeIndex)
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: 0,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.setData({
      token: app.globalData.token
    });
    this.myALLConsult(1);
  },
  tabClick: function(e) {
    let index = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.reset(); // 重置数据
    // tab切换
    if (index == 0) {
      this.myALLConsult(1);
    } else if (index == 1) {
      this.sendAssist(1);
    } else {
      this.receiveAssist(1);
    }
  },
  myALLConsult: function(page) { //所有患者的咨询
    let url = app.globalData.api.conAssistance.myALLConsult;
    let params = {
      'token': this.data.token,
      'page': page,
      'pageSize': this.data.pageSize
    };
    app.globalData.util.request(url, params, true, "get", "json", (res) => {
      let mesArr;
      if (page > 1) {
        mesArr = this.data.myALLConsultList;
      } else {
        mesArr = [];
      };
      mesArr.push.apply(mesArr, res.data.datas); //合并数组
      this.setData({
        myALLConsultList: mesArr
      });
      // 判断是否换页
      this.switchPage(res.data.datas, page)
    });
  },
  sendAssist: function(page) { //我向别人发起协助的会诊

    let url = app.globalData.api.conAssistance.sendAssist;
    let params = {
      'token': this.data.token,
      'page': page,
      'pageSize': this.data.pageSize
    };
    app.globalData.util.request(url, params, false, "get", "json", (res) => {
      let mesArr;
      if (page > 1) {
        mesArr = this.data.sendAssistList;
      } else {
        mesArr = [];
      };
      mesArr.push.apply(mesArr, res.data.datas); //合并数组
      this.setData({
        sendAssistList: mesArr
      });
      // 判断是否换页
      this.switchPage(res.data.datas, page);
    });
  },
  receiveAssist: function(page) { //别人向我发起的协助会诊
    let url = app.globalData.api.conAssistance.receiveAssist;
    let params = {
      'token': this.data.token,
      'page': page,
      'pageSize': this.data.pageSize
    };
    app.globalData.util.request(url, params, false, "get", "json", (res) => {
      let mesArr;
      if (page > 1) {
        mesArr = this.data.receiveAssistList;
      } else {
        mesArr = [];
      };
      mesArr.push.apply(mesArr, res.data.datas); //合并数组
      this.setData({
        receiveAssistList: mesArr
      });
      // 判断是否换页
      this.switchPage(res.data.datas, page);
    });
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
  // 监听页面滚动
  onPageScroll: function(e) {
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
  // 判断是否翻页
  switchPage: function(dataArr, page) {
    if (dataArr.length == 0) {
      this.setData({
        ifHasData: false
      })
      if (page > 1) {
        this.setData({
          nodataIsHidden: false,
          loadingIsHidden: true
        })
      }
    } else {
      if (dataArr.length < this.data.pageSize) {
        this.setData({
          ifHasData: false
        })
        if (page > 1) {
          this.setData({
            nodataIsHidden: false,
            loadingIsHidden: true
          })
        }
      } else {
        this.setData({
          loadingIsHidden: true,
          page: ++page
        })
      }
    };
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.ifHasData) {
      this.setData({
        // 显示加载图标 
        loadingIsHidden: false
      });
      if (this.data.activeIndex == 0) {
        this.myALLConsult(this.data.page);
      } else if (this.data.activeIndex == 1) {
        this.sendAssist(this.data.page);
      } else {
        this.receiveAssist(this.data.page);
      }
    }

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.reset(); // 重置数据
    if (this.data.activeIndex == 0) {
      this.myALLConsult(1);
    } else if (this.data.activeIndex == 1) {
      this.sendAssist(1);
    } else {
      this.receiveAssist(1);
    };

    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh(); //停止下拉刷新 
  },

})