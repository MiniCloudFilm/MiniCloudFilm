var app = getApp();
var upload_url = '请填写您的图片上传接口地址';
Page({
  data: {
    SocketTask: '',
    socketOpen: false,
    inputValue: '', //用户输入文字
    returnValue: '',
    addImg: false,
    time: '', //用户发送时间
    myPicture: "/image/icon-me1.png",
    youPicture: "/image/icon-me1.png",
    //格式示例数据，可为空
    allContentList: [],
    num: 0,
    scrollTop: 0
  },
  // 页面加载
  onLoad: function(options) {
    var userList = app.globalData.userList;
    // console.log(options)
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = app.globalData.util.formatTime(new Date());
    if (options.firstEnter) {
      wx: wx.showModal({
        title: '温馨提示',
        content: '医生暂未接收您的会诊，接收之后将会看到您的留言！',
        showCancel: false,
        success: function(res) {}
      })
    }
    this.setData({
      myId: JSON.stringify(userList.userId),
      myName: userList.name,
      myType: userList.userType,
      time: time,
      dialoger: options.dialoger,
      dialogId: options.dialogId,
      reportId: options.reportId,
      ifNeedAssist: options.ifNeedAssist,
      consultId: options.consultId,
      fromWhere: options.fromWhere,
      endbutton: options.endbutton
    });
    this.getReport(options.reportId);
    this.bottom();
  },
  // 根据studyUid获取报告
  getReport: function(reportId) {
    let url = app.globalData.api.ConInterface.getReport;
    let params={
      'token': app.globalData.token,
      'reportId': reportId
    }
    app.globalData.util.request(url, params, false, "get", "json", (res) => {
      this.setData({
        reportDetail: res.data
      })
    });
  },
  // 页面加载完成
  onShow: function() {
    // console.log(getCurrentPages());
    var that = this;
    if (this.data.fromWhere == 'noRecord' || this.data.fromWhere == 'waiting') {
      if (!this.data.socketOpen) {
        this.webSocket()
      };
      this.data.SocketTask.onOpen(res => {
        this.setData({
          socketOpen: true
        })
        // console.log('监听 WebSocket 连接打开事件。', res)
      });
      this.data.SocketTask.onClose(onClose => {
        // console.log('监听 WebSocket 连接关闭事件。', onClose)
        this.setData({
          socketOpen: false
        });
      });
      this.data.SocketTask.onError(onError => {
        // console.log('监听 WebSocket 错误。错误信息', onError)
        this.setData({
          socketOpen: false
        });
      });
      this.data.SocketTask.onMessage(onMessage => {
        // console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
        var onMessage_data = JSON.parse(onMessage.data);
        // for (var i in onMessage_data) {
        //   that.data.allContentList.push(onMessage_data[i]);
        // }
        let dialogArr;
        if (that.data.allContentList) {
          dialogArr = that.data.allContentList;
        } else {
          dialogArr = [];
        };
        dialogArr.push.apply(dialogArr, onMessage_data);
        // console.log(dialogArr)
        that.setData({
          allContentList: dialogArr
        })
        that.bottom();
      });
    } else {
      that.getDialogRecord();
    }

  },
  // 创建Socket
  webSocket: function() {
    this.setData({
      SocketTask: wx.connectSocket({
        url: app.globalData.api.ConInterface.webSocket + this.data.myId + '/' + this.data.dialogId,
        data: 'data',
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function(res) {
          // console.log('WebSocket连接创建', res)
        },
        fail: function(err) {
          app.globalData.util.showFail("服务连接失败")
        },
      })
    })
  },

  // 提交文字
  submitTo: function(e) {
    let formId = e.detail.formId;
    app.saveFormId(formId);
    if (this.data.inputValue.length == 0) {
      app.globalData.util.showWarning("内容不能为空");
      return false;
    }
    if (this.data.socketOpen) {
      // 如果打开了socket就发送数据给服务器
      var data = {
        isMy: true,
        content: this.data.inputValue,
        time: app.globalData.util.formatTime(new Date()),
        myId: this.data.myId,
        name: this.data.myName,
        dialogId: this.data.dialogId
      };
      this.data.allContentList.push(data);
      this.sendSocketMessage(data);
      this.setData({
        allContentList: this.data.allContentList,
        inputValue: ''
      })
      this.bottom();
    };
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //退出页面
  onUnload: function() {
    if (this.data.SocketTask) {
      this.data.SocketTask.close(function(close) {
        // console.log('关闭 WebSocket 连接。', close)
      })
    }
  },
  onHide: function() {
    this.setData({
      allContentList: []
    });
    if (this.data.SocketTask) {
      this.data.SocketTask.close(function(close) {
        // console.log('关闭 WebSocket 连接。', close)
      });
    }
  },
  //结束会话
  endDialog: function() {
    let url = app.globalData.api.ConInterface.endDialog;
    let params = {
      'consultId': this.data.consultId,
      'userType': this.data.myType
    }
    app.globalData.util.request(url, params, false, "get", "json", (res) => {
      app.globalData.util.showSuccess(res.msg,()=>{
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2500)
      })
    });
  },
  // 是否结束
  confirmEndDialog: function() {
    wx: wx.showModal({
      title: '提示',
      content: '结束之后将不能再次进行对话，确认结束此次会诊？',
      cancelText: '取消',
      confirmText: '确认结束',
      success: res => {
        if (res.confirm) {
          this.endDialog();
        }
      }
    });
  },
  upimg: function() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function(res) {
        that.setData({
          img: res.tempFilePaths
        })
        wx.uploadFile({
          url: upload_url,
          filePath: res.tempFilePaths,
          name: 'img',
          success: function(res) {
            app.globalData.util.showSuccess("图片发送成功")
          }
        })
        that.data.allContentList.push({
          is_my: {
            img: res.tempFilePaths
          }
        });
        that.setData({
          allContentList: that.data.allContentList,
        })
        that.bottom();
      }
    })
  },
  addImg: function() {
    this.setData({
      addImg: !this.data.addImg
    })

  },
  // 获取historycon的id节点然后屏幕焦点调转到这个节点
  bottom: function() {
    this.setData({
      scrollTop: 1000000
    })
  },
  //通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
  sendSocketMessage: function(msg) {
    // console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
    this.data.SocketTask.send({
      data: JSON.stringify(msg)
    }, function(res) {
      // console.log('已发送', res)
    })
  },
  // 获取会话记录
  getDialogRecord: function() {
    let url = app.globalData.api.ConInterface.getDialogRecord + this.data.myId + '/' + this.data.dialogId;
    app.globalData.util.request(url, {}, false, "get", "json", (res) => {
      this.setData({
        allContentList: res.data
      });
      this.bottom(); //置底
    });
  }
})