const app = getApp()

Page({
  data: {
    src: '',
    info: '',
    play: false,
    isAgree: true,
    showTopTips: false,
    url: '',
    title: '',
    charge: '',
    id: ''
    
  },
  chooseVideo() {
    let that=this;
    this.setData({
      info: ''
    })
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success: (res) => {
        console.log(res);
        this.setData({
          src: res.tempFilePath,
          info: this.format(res)
        })
       
      },
      fail: (res) => {
        this.setData({
          info: this.format(res)
        })
      }
    })
  },
  format(obj) {
    return '{\n' +
      Object.keys(obj).map(function (key) { return '  ' + key + ': ' + obj[key] + ',' }).join('\n') + '\n' +
      '}'
  }, 
  
  subVideo: function () {
    var that = this;
    wx.uploadFile({
      url: `http://192.168.131.63:8080/doctor/api/v1/uploadVideo`,
      filePath: that.data.src,
      name: 'file',
      formData: {
        'userId': "123456",
        "videoTitle": that.data.title,
        "videoCharge": that.data.charge,
        "token": ""
      },
      success: function (res) {
        console.log(res); 
        //do something
        wx.redirectTo({
          url: '../videoMag/videoMag',
        })
      }
    })
    
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  onLoad: function (options) {
    console.log(options);  
    if (options.length!==undefined) {
      this.setData({
        url: options.url,
        title: options.title,
        charge: options.charge,
        id: options.id,
        src: options.url
      }) 
    }
  },
})
