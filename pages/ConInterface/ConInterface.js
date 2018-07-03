var util = require("../../utils/util.js");
var app = getApp();
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'ws://192.168.131.212:8080/openSocket/164';
var upload_url = '请填写您的图片上传接口地址'
Page({
  data: {
    user_input_text: '',//用户输入文字
    inputValue: '',
    returnValue: '',
    addImg: false,
    time:'',
    //格式示例数据，可为空
    allContentList: [{
      "time": "2018-6-7 8:30",
      "content": "cdp生命生命周期函数--监听页面加载生命周期函数--监听页面加载",
      "is_img": false,
      "head_owner": "/image/icon-me1.png",
      "is_my": true,
      "theOtherId":"169"
    },
      {
        "time": "2018-6-7 8:30",
        "content": "cdp生命生命周期函数--监听页面加载生命周期函数--监听页面加载",
        "is_img": false,
        "head_owner": "/image/icon-me1.png",
        "is_you": true,
        "theOtherId": "164"
      }],
    num: 0,
    scrollTop:0
  },
  // 页面加载
  onLoad: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    this.bottom();
  },
  // onShow: function (e) {
  //   if (!socketOpen) {
  //     this.webSocket()
  //   }
  // },
  // 页面加载完成
  onShow: function () {
    var that = this;
    if (!socketOpen) {
      this.webSocket()
    }
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      this.webSocket()
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log(onMessage)
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var onMessage_data = JSON.parse(onMessage.data);
      console.log(onMessage_data)
      // if (onMessage_data.cmd == 1) {
      //   console.log(text, text instanceof Array)
      //   // 是否为数组
      //   if (text instanceof Array) {
      //     for (var i = 0; i < text.length; i++) {
      //       text[i]
      //     }
      //   } else {

      //   }
      that.data.allContentList.push(onMessage_data);
        that.setData({
          allContentList: that.data.allContentList
        })
        that.bottom()
      // }
    })
  },
  webSocket: function () {
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
  },

  // 提交文字
  submitTo: function (e) {
    let that = this;
    console.log(socketOpen)
    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      var data = {
        is_my: true,
        content: this.data.inputValue,
        time: util.formatTime(new Date()),
        theOtherId:'169',
        myId:'164'      
      };
      this.data.allContentList.push(data);
      sendSocketMessage(data);
      this.setData({
        allContentList: this.data.allContentList,
        inputValue: ''
      })
      console.log(that.data.allContentList)
      that.bottom()
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onHide: function () {
    SocketTask.close(function (close) {
      console.log('关闭 WebSocket 连接。', close)
    })
  },
  upimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function (res) {
        that.setData({
          img: res.tempFilePaths
        })
        wx.uploadFile({
          url: upload_url,
          filePath: res.tempFilePaths,
          name: 'img',
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '图片发送成功！',
              duration: 3000
            });
          }
        })
        that.data.allContentList.push({ is_my: { img: res.tempFilePaths } });
        that.setData({
          allContentList: that.data.allContentList,
        })
        that.bottom();
      }
    })
  },
  addImg: function () {
    this.setData({
      addImg: !this.data.addImg
    })

  },
  // 获取hei的id节点然后屏幕焦点调转到这个节点  
  bottom: function () {
    var that = this;
    this.setData({
      scrollTop: 1000000
    })
  },
})

//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  var that = this;
  console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function (res) {
    console.log('已发送', res)
  })
}