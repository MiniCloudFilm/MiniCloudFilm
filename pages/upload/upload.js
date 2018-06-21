const app = getApp()

Page({
  data: {
    src: '',
    info: '',
    play: false, 
    isAgree: false,
        showTopTips: false,
  },
  chooseVideo() {
    this.setData({
      info: ''
    })
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success: (res) => {
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
  }, showTopTips: function () {
    wx.redirectTo({
      url: '../videoMag/videoMag',
    })
    var that = this;
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
  }
})
