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

    this.reset(); // 重置数据
    // tab切换
    if (index == 0) {
      this.getCounList(1);
    } else if (index == 1) {
      this.receiveAssist(1);
    } else {
      this.pendingAction(1);
    }
  },
  // 确认接收会诊
  confirmAccept: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定接受此会诊？',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          this.accept(e);
        }
      }
    })
  },

  // 确认拒绝会诊
  confirmrefuse: function(e) {
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定拒绝此会诊？',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          this.refund(e);
        }
      }
    })
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
        if (res.data.data == 'SUCCESS') {
          wx.showToast({
            title: '拒绝成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              this.refuse(e.currentTarget.dataset.consult);
            }
          })
        } else {
          app.globalData.util.showFail("拒收失败");
        }
      }
    })
  },
  //接受
  accept: function(e) {
    // console.log(e.currentTarget.dataset.consult);
    let url = app.globalData.api.counList.accept;
    let params = {
      'consultId': e.currentTarget.dataset.consult
    };
    app.globalData.util.request(url, params, false, "get", "json", (res) => {
      let dialoger = e.currentTarget.dataset.dialoger;
      let dialogId = e.currentTarget.dataset.dialogId;
      let reportId = e.currentTarget.dataset.reportId;
      let consultId = e.currentTarget.dataset.consult;
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${dialogId}&reportId=${reportId}&dialoger=${dialoger}&ifNeedAssist=true&consultId=${consultId}&fromWhere=noRecord&endbutton=true`
      })
    });

    // wx.request({
    //   url: app.globalData.api.counList.accept,
    //   data: {
    //     'consultId': e.currentTarget.dataset.consult,
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: res => {
    //     // console.log(res);
    //     if (res.data.code == '200') {
    //       let dialoger = e.currentTarget.dataset.dialoger;
    //       let dialogId = e.currentTarget.dataset.dialogId;
    //       let reportId = e.currentTarget.dataset.reportId;
    //       let consultId = e.currentTarget.dataset.consult;
    //       wx.navigateTo({
    //         url: `../ConInterface/ConInterface?dialogId=${dialogId}&reportId=${reportId}&dialoger=${dialoger}&ifNeedAssist=true&consultId=${consultId}&fromWhere=noRecord&endbutton=true`
    //       })
    //     }
    //   }
    // })
  },
  //拒绝
  refuse: function(consult) {
    let url = app.globalData.api.counList.refuse;
    let params = {
      'consultId': consult
    };
    app.globalData.util.request(url, params, false, "get", "json", (res) => {
      this.pendingAction(1);
    });


    // wx.request({
    //   url: app.globalData.api.counList.refuse,
    //   data: {
    //     'consultId': consult,
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: res => {
    //     // console.log(res);
    //     if (res.data.code == "200") {
    //       this.pendingAction(1);
    //     }
    //   }
    // })
  },
  //获取咨询列表---患者端
  getCounListOfPatient: function(page) {
    let url = app.globalData.api.counList.getCounListOfPatient;
    let params = {
      "token": app.globalData.token,
      "page": page,
      "pageSize": this.data.pageSize
    };
    app.globalData.util.request(url, params, true, "get", "json", (res) => {
      let mesArr;
      if (page > 1) {
        mesArr = this.data.counList;
      } else {
        mesArr = [];
      };
      mesArr.push.apply(mesArr, res.data.datas); //合并数组
      this.setData({
        counList: mesArr
      });
      // 判断是否换页
      if (res.data.datas.length == 0) {
        this.setData({
          ifHasData: false,
          showNoData: true
        })
        if (page > 1) {
          this.setData({
            nodataIsHidden: false,
            loadingIsHidden: true
          })
        }
      } else {
        if (res.data.datas.length < this.data.pageSize) {
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
    });


    // wx.request({
    //   url: app.globalData.api.counList.getCounListOfPatient,
    //   data: {
    //     "token": app.globalData.token,
    //     "page": page,
    //     "pageSize": this.data.pageSize
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: res => {
    //     if (res.data.code == '200') {
    //       let mesArr;
    //       if (page > 1) {
    //         mesArr = this.data.counList;
    //       } else {
    //         mesArr = [];
    //       };
    //       mesArr.push.apply(mesArr, res.data.data.datas); //合并数组
    //       this.setData({
    //         counList: mesArr
    //       });
    //       // 判断是否换页
    //       if (res.data.data.datas.length == 0) {
    //         this.setData({
    //           ifHasData: false,
    //           showNoData: true
    //         })
    //         if (page > 1) {
    //           this.setData({
    //             nodataIsHidden: false,
    //             loadingIsHidden: true
    //           })
    //         }
    //       } else {
    //         if (res.data.data.datas.length < this.data.pageSize) {
    //           this.setData({
    //             ifHasData: false
    //           })
    //           if (page > 1) {
    //             this.setData({
    //               nodataIsHidden: false,
    //               loadingIsHidden: true
    //             })
    //           }
    //         } else {
    //           this.setData({
    //             loadingIsHidden: true,
    //             page: ++page
    //           })
    //         }
    //       };
    //       wx.hideLoading();
    //     } else {
    //       app.globalData.util.showFail("查询列表失败");
    //     }
    //   },
    //   fail: res => {
    //     wx.hideLoading();
    //     app.globalData.util.showFail("服务连接失败")
    //   }
    // })
  },
  //获取咨询列表---医生端
  getCounList: function(page) {
    let url = app.globalData.api.counList.getCounList;
    let params = {
      "token": app.globalData.token,
      "page": page,
      "pageSize": this.data.pageSize
    };
    app.globalData.util.request(url, params, true, "get", "json", (res) => {
      let mesArr;
      if (page > 1) {
        mesArr = this.data.counList;
      } else {
        mesArr = [];
      };
      mesArr.push.apply(mesArr, res.data.datas); //合并数组
      this.setData({
        counList: mesArr
      });
      // 判断是否换页
      if (res.data.datas.length == 0) {
        this.setData({
          showNoData: true,
          ifHasData: false
        })
        if (page > 1) {
          this.setData({
            nodataIsHidden: false,
            loadingIsHidden: true
          })
        }
      } else {
        if (res.data.datas.length < this.data.pageSize) {
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
    });
    
    // wx.request({
    //   url: app.globalData.api.counList.getCounList,
    //   data: {
    //     "token": app.globalData.token,
    //     "page": page,
    //     "pageSize": this.data.pageSize

    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: res => {
    //     wx.hideLoading()
    //     if (res.data.code == "200") {
    //       let mesArr;
    //       if (page > 1) {
    //         mesArr = this.data.counList;
    //       } else {
    //         mesArr = [];
    //       };
    //       mesArr.push.apply(mesArr, res.data.data.datas); //合并数组
    //       this.setData({
    //         counList: mesArr
    //       });
    //       // 判断是否换页
    //       if (res.data.data.datas.length == 0) {
    //         this.setData({
    //           showNoData: true,
    //           ifHasData: false
    //         })
    //         if (page > 1) {
    //           this.setData({
    //             nodataIsHidden: false,
    //             loadingIsHidden: true
    //           })
    //         }
    //       } else {
    //         if (res.data.data.datas.length < this.data.pageSize) {
    //           this.setData({
    //             ifHasData: false
    //           })

    //           if (page > 1) {
    //             this.setData({
    //               nodataIsHidden: false,
    //               loadingIsHidden: true
    //             })
    //           }
    //         } else {
    //           this.setData({
    //             loadingIsHidden: true,
    //             page: ++page
    //           })
    //         }
    //       };
    //     } else {
    //       app.globalData.util.showFail("查询列表失败");
    //     }
    //   },
    //   fail: res => {
    //     wx.hideLoading();
    //     app.globalData.util.showFail("服务连接失败")
    //   }
    // })
  },
  receiveAssist: function(page) { //我接收的协助

    let url = app.globalData.api.counList.receiveAssist;
    let params = {
      "token": app.globalData.token,
      "page": page,
      "pageSize": this.data.pageSize
    };
    app.globalData.util.request(url, params, true, "get", "json", (res) => {
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
      if (res.data.datas.length == 0) {
        this.setData({
          showNoData: true,
          ifHasData: false
        })
        if (page > 1) {
          this.setData({
            nodataIsHidden: false,
            loadingIsHidden: true
          })
        }
      } else {
        if (res.data.datas.length < this.data.pageSize) {
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
    });


    // wx.request({
    //   url: app.globalData.api.counList.receiveAssist,
    //   data: {
    //     "token": app.globalData.token,
    //     "page": page,
    //     "pageSize": this.data.pageSize
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: res => {
    //     wx.hideLoading();
    //     if (res.data.code == "200") {
    //       let mesArr;
    //       if (page > 1) {
    //         mesArr = this.data.receiveAssistList;
    //       } else {
    //         mesArr = [];
    //       };
    //       mesArr.push.apply(mesArr, res.data.data.datas); //合并数组
    //       this.setData({
    //         receiveAssistList: mesArr
    //       });
    //       // 判断是否换页
    //       if (res.data.data.datas.length == 0) {
    //         this.setData({
    //           showNoData: true,
    //           ifHasData: false
    //         })
    //         if (page > 1) {
    //           this.setData({
    //             nodataIsHidden: false,
    //             loadingIsHidden: true
    //           })
    //         }
    //       } else {
    //         if (res.data.data.datas.length < this.data.pageSize) {
    //           this.setData({
    //             ifHasData: false
    //           })

    //           if (page > 1) {
    //             this.setData({
    //               nodataIsHidden: false,
    //               loadingIsHidden: true
    //             })
    //           }
    //         } else {
    //           this.setData({
    //             loadingIsHidden: true,
    //             page: ++page
    //           })
    //         }
    //       };
    //     } else {
    //       app.globalData.util.showFail("查询列表失败");
    //     }
    //   },
    //   fail: res => {
    //     wx.hideLoading();
    //     app.globalData.util.showFail("服务连接失败")
    //   }
    // })
  },
  pendingAction: function(page) { //待处理
    let url = app.globalData.api.counList.pendingAction;
    let params = {
      "token": app.globalData.token,
      "page": page,
      "pageSize": this.data.pageSize
    };
    app.globalData.util.request(url, params, true, "get", "json", (res) => {
      let mesArr;
      if (page > 1) {
        mesArr = this.data.pendingActionList;
      } else {
        mesArr = [];
      };
      mesArr.push.apply(mesArr, res.data.data); //合并数组
      this.setData({
        totalPending: res.data.pageCount,
        pendingActionList: mesArr
      });
      // 判断是否换页
      if (res.data.data.length == 0) {
        this.setData({
          showNoData: true,
          ifHasData: false
        })
        if (page > 1) {
          this.setData({
            nodataIsHidden: false,
            loadingIsHidden: true
          })
        }
      } else {
        if (res.data.data.length < this.data.pageSize) {
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
    });


    // wx.request({
    //   url: app.globalData.api.counList.pendingAction,
    //   data: {
    //     "token": app.globalData.token,
    //     "page": page,
    //     "pageSize": this.data.pageSize
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: res => {
    //     wx.hideLoading();
    //     if (res.data.code == "200") {
    //       let mesArr;
    //       if (page > 1) {
    //         mesArr = this.data.pendingActionList;
    //       } else {
    //         mesArr = [];
    //       };
    //       mesArr.push.apply(mesArr, res.data.data.data); //合并数组
    //       this.setData({
    //         totalPending: res.data.data.pageCount,
    //         pendingActionList: mesArr
    //       });
    //       // 判断是否换页
    //       if (res.data.data.data.length == 0) {
    //         this.setData({
    //           showNoData: true,
    //           ifHasData: false
    //         })
    //         if (page > 1) {
    //           this.setData({
    //             nodataIsHidden: false,
    //             loadingIsHidden: true
    //           })
    //         }
    //       } else {
    //         if (res.data.data.data.length < this.data.pageSize) {
    //           this.setData({
    //             ifHasData: false
    //           })
    //           if (page > 1) {
    //             this.setData({
    //               nodataIsHidden: false,
    //               loadingIsHidden: true
    //             })
    //           }
    //         } else {
    //           this.setData({
    //             loadingIsHidden: true,
    //             page: ++page
    //           })
    //         }
    //       };
    //     } else {
    //       app.globalData.util.showFail("查询列表失败");
    //     }
    //   },
    //   fail: res => {
    //     wx.hideLoading();
    //     app.globalData.util.showFail("服务连接失败")
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  trunConInterface: function(e) {
    if (e.currentTarget.dataset.status == "0") { // 患者端待接收
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifNeedAssist=false&consultId=${e.currentTarget.dataset.consultid}&fromWhere=waiting&endbutton=false&firstEnter=true`,
      })
    } else if (e.currentTarget.dataset.status == "1") {//咨询中
      var limitsOfEnd = e.currentTarget.dataset.endbutton ? 'false' : 'true'
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifNeedAssist=${e.currentTarget.dataset.assisterid ? false : true}&consultId=${e.currentTarget.dataset.consultid}&fromWhere=noRecord&endbutton=${limitsOfEnd}`,
      })
    } else if (e.currentTarget.dataset.status == "2") {//已结束
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifNeedAssist=false&consultId=&fromWhere=record&endbutton=false`,
      })
    } else if (e.currentTarget.dataset.status == "3") {//患者端已拒绝
      app.globalData.util.showWarning("咨询已被拒绝")
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中...',
    });
    this.reset(); // 重置数据
    //登录校验
    app.checkLoginInfo(app.getCurrentUrl());
    let user = app.globalData.userList;
    console.log(user);
    if (user) {
      this.setData({
        userType: user.userType,
        showNoData: false,
        counList: [],
        receiveAssistList: [],
        pendingActionList: []
      });
    } else {
      this.setData({
        userType: null
      });
    };
    console.log(this.data.ifHasData)
    if (this.data.userType == 1) {
      this.getCounListOfPatient(1);
      return false;
    } else if (this.data.userType == 2) {
      if (this.data.activeIndex == 0) {
        this.getCounList(1);
        this.pendingAction(1);
      } else if (this.data.activeIndex == 1) {
        this.receiveAssist(1);
      } else {
        this.pendingAction(1);
      }
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
    this.reset(); // 重置数据
    if (this.data.userType == 1) {
      this.getCounListOfPatient(1);
    } else{
      if (this.data.activeIndex == 0) {
        this.getCounList(1);
      } else if (this.data.activeIndex == 1) {
        this.receiveAssist(1);
      } else {
        this.pendingAction(1);
      } 
    } 
    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh(); //停止下拉刷新   
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
      ifHasData: true,
      showNoData: false
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})