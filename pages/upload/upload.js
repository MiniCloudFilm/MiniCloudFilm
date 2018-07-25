let app = getApp();
let util = app.globalData.util;
Page({
  data: {
    info: '',
    play: false,
    isAgree: false,
    showTopTips: false,
    title: '',
    charge: '',
    id: ''
  },
  chooseVideo() {
    this.setData({
      info: ''
    })
    wx.chooseVideo({
      sourceType: ['album'],
      compressed: false,
      maxDuration: 60,
      success: (res) => {
        console.log(res);
        console.log(res.tempFilePath);
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res.errMsg)
          }
        })
        this.setData({
          src: res.tempFilePath,
          info: this.format(res)
        })
        console.log(this.data.src);
      },
      fail: (res) => {

      }
    })
  },
  format(obj) {
    return '{\n' +
      Object.keys(obj).map(function(key) {
        return '  ' + key + ': ' + obj[key] + ','
      }).join('\n') + '\n' +
      '}'
  },

  subVideo: function(e) {
    let user = wx.getStorageSync("userList");
    let token = wx.getStorageSync("token")
    if (this.data.src) {
      if (e.detail.value.title) {
        if (e.detail.value.charge) {
          if (e.detail.value.isAgree != 0) {
            wx.showLoading({
              title: '视频上传中请稍等！',
            })
            wx.uploadFile({
              url: app.globalData.api.upload.uploadVideo,
              filePath: this.data.src,
              name: 'file',
              formData: {
                'userId': user.userId,
                "videoTitle": e.detail.value.title,
                "videoCharge": e.detail.value.charge == 0 ? '' : e.detail.value.charge,
                "isCharge": e.detail.value.charge != "0" ? 'Y' : 'N',
                "token": token
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function(res) {
                console.log(res);
                let data = JSON.parse(res.data);
                //do something
                if (data.code == "200") {
                  wx.hideLoading()
                  wx.showToast({
                    title: '视频上传成功！',
                    icon: 'success',
                    duration: 2000,
                    success: resA => {
                      wx.redirectTo({
                        url: '../videoMag/videoMag',
                      })
                    }
                  })
                }
              },
              fail: function(res) {
                wx.showToast({
                  title: '视频上传失败！',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            util.showToast('请阅读并同意相关条款！');
          }
        } else {
          util.showToast('请填写视频价格！');
        }
      } else {
        util.showToast('请填写视频标题！');
      }
    } else {
      // app.globalData.util.showModel('失败提示','请选择要上传的视频！');
      util.showToast('请选择要上传的视频！');
    }


    this.setData({
      showTopTips: true
    });
    setTimeout(() => {
      this.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  onLoad: function(options) {
    // console.log(options);
    if (options.length !== undefined) {
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