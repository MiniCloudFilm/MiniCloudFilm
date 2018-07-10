// pages/expertList/expert.js

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItem: '全部',
    hospital: [],
    departmentIndex: [0, 0],
    depart: [[], []],
    index: 0, 
  },
  //获取地市
  getArea: function () {
    wx.request({
      url: 'http://192.168.131.63:8080/api/v1/dict/getArea',
      data: {
        'token': '',
        'parentId': areaId,
        'deptId': level
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res.data.data)
        if (res.data.code == "200") {
          this.setData({
            expertList: res.data.data
          })
        }
      }
    })
  },
  //选择区域
  bindRegionChange: function (e) {
    let that = this;
    this.setData({
      region: e.detail.value
    })
    console.log(e.detail.value);
    // this.getHospital();
  },
  //获取科室
  getDepartment: function () {
    let that = this;
    let apiUrl = `http://192.168.131.63:8080/api/v1/dict/getDept`;
    wx.request({
      url: apiUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          that.setData({
            departList: res.data.data
          })
          let depart = [[], []]
          for (let i = 0; i < res.data.data.length; i++) {
            depart[0].push(res.data.data[i])
          }
          depart[1] = res.data.data[0].children;
          console.log(depart);
          that.setData({
            department: depart
          })
        }
      }
    })
  },
  //获取列
  bindMultiPickerColumnChange: function (e) {
    // console.log(e.detail.column, e.detail.value);
    var data = {
      department: this.data.department,
      departmentIndex: this.data.departmentIndex
    };
    data.departmentIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      for (let i = 0; i < this.data.departList.length; i++) {
        if (e.detail.value == i) {
          let list = this.data.department;
          list[1] = this.data.departList[i].children;
          this.setData({
            department: list
          })
          // console.log(this.data.department);
          // console.log(this.data.department[1]);
          // console.log(this.data.departList[i]);
          // console.log(this.data.departList[i].children);
          // console.log(this.data.department);
        }
      }
    }

  },
  //获取专家列表
  getExpert: function (areaId, deptId) {
    wx.request({
      url: 'http://192.168.131.63:8080/doctor/api/v1/findDoctorList',
      data: {
        'token': '',
        'areaId': areaId,
        'deptId': deptId
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res.data.data)
        if (res.data.code == "200") {
          this.setData({
            expertList: res.data.data
          })
        }
      }
    })
  },
  bindDepartmentChange: function (e) {
    console.log(e);
    let index = e.detail.value;
    let parent = index[0];
    let value = index[1];
    let list = this.data.departList;
    for (let i = 0; i < list.length; i++) {
      if (parent == i) {
        if (value == 0) {
          this.setData({
            deptId: list[i].deptId
          })
          this.getExpert(440000, this.data.deptId)
          // console.log(list[i]);
          // console.log(list[i].deptId); 
        } else {
          // console.log(list[i].children[value])
          // console.log(list[i].children[value].deptId);
          this.setData({
            deptId: list[i].children[value].deptId
          })
          this.getExpert(440000, this.data.deptId)
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDepartment();
    this.getExpert(440000, 'all');
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'NOYBZ-WXICJ-XMGFO-FF2UV-ULBW7-UEBFX'//此处使用你自己申请的key  
    });
    this.setData({
      dialogId: options.dialogId,
      reportId: options.reportId
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (resA) {
            that.setData({
              region: [resA.result.address_component.province, resA.result.address_component.city, resA.result.address_component.district]
            })
            // that.getHospital();
            // console.log(resA);
          },
          fail: function (resA) {
            console.log(resA);
          },
          complete: function (resA) {
            // console.log(resA);
          }
        });
      }
    })
  },
  chooseAssist: function () {//确认选择医生
    if (this.data.assisterId == wx.getStorageSync('userList').userId){
      wx.showToast({
        title: '协助专家不能为自己，请重选',
        icon: 'none',
        image: '',
        duration: 1500
      });
    } else if (this.data.assisterId == undefined) {
      wx.showToast({
        title: '请选择要协助的医生',
        icon: 'none',
        image: '',
        duration: 1500
      });
    }else{
      wx.request({
        url: 'http://192.168.131.212:8080/dialogUser/api/v1/add',
        data: {
          'token': wx.getStorageSync('token'),
          'userId': this.data.assisterId,
          "dialogId": this.data.dialogId,
          "userType":3
        },
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          console.log("成功?")
          console.log(res);
          // wx.redirectTo({
          //   url: `../ConInterface/ConInterface?reportId=${this.data.reportId}&dialogId=${this.data.dialogId}`,
          // });
          wx.navigateBack({
            delta:1
          })
        }
      })
      
    }
  },
  radioChange: function (e) {
    this.setData({
      assisterId: e.detail.value
    });
  }


})