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
    department: [],
    departmentIndex: [0, 0, 0],
    index: 0,
    expertList:[
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 },
      { "deptName": "皮肤性病科", "doctorLevel": "副主任医师", "charge": 1.0, "sex": "未知", "deptId": 6, "hospitalName": "深圳市人民医院", "synopsis": "深圳市人民医院皮肤科专家", "userId": 168, "doctorId": "62a0d40a4a264e9580338f4737ef0361", "hospitalId": "455755442", "hospitalLevel": "三丙", "name": "test1", "startTime": "2018-07-03", "endTime": "2018-07-04", "age": 33 }
    ]
    // doctorList: [
    //   { "doctorImg": "/image/icon-doctor.png", "doctorName": "兰建清", "department": "妇科", "position": "主任医师", "belong": "深圳第一医院", "level": "三甲医院", "skill": "妇科疾病诊断治疗", "price": "8.88" },
    //   { "doctorImg": "/image/icon-doctor.png", "doctorName": "罗腾可", "department": "放射科", "position": "主任医师", "belong": "北京大学深圳医院", "level": "三甲医院", "skill": "超声诊断", "price": "6.88" },
    //   { "doctorImg": "/image/icon-doctor.png", "doctorName": "田程林", "department": "男科", "position": "主任医师", "belong": "深圳第二医院", "level": "三甲医院", "skill": "男性疾病诊断", "price": "5.88" },
    // ] 
  },
  //选择区域
  bindRegionChange: function(e) {
    let that = this;
    this.setData({
      region: e.detail.value
    })
    // this.getHospital();
  },
  turn: function(e) {
    console.log(this.data.doctorMes.order);
    if (this.data.doctorMes.order == 'before') {
      wx.navigateTo({
        url: `../chRepCon/chRepCon?doctorName=${e.currentTarget.dataset.doctor}&belong=${e.currentTarget.dataset.belong}&price=${e.currentTarget.dataset.price}&order=after`
      })
    } else {
      wx.navigateTo({
        url: `../confirmPay/confirmPay?doctorName=${e.currentTarget.dataset.doctor}&belong=${e.currentTarget.dataset.belong}&price=${e.currentTarget.dataset.price}&type=1`
      })

    }
  },
  // //获取医院 
  // getHospital: function () {
  //   let that = this;
  //   let areaName = '';
  //   let city = '';
  //   let area = ''; 
  //   let provice='';
  //   console.log(this.data.region[2]);
  //   if (this.data.region[2] == '全部') {
  //     if (this.data.region[1] == '全部') {
  //       areaName = this.data.region[0];
  //     } else {
  //       areaName = this.data.region[1];
  //     }
  //   } else {
  //     city = this.data.region[1];
  //   }
  //   if (this.data.region[2] == '全部') {
  //     area = ''
  //   } else {
  //     area = this.data.region[2];
  //   }
  //   let apiUrl = `http://192.168.131.63:8080/dict/api/v1/getHospital?provice=${provice}&city=${city}&area=${area}&token=''`;
  //   wx.request({
  //     url: apiUrl, //仅为示例，并非真实的接口地址
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       that.setData({
  //         hospital: res.data.data
  //       })
  //     }
  //   })
  // },
  //获取科室
  getDepartment: function() {
    let that = this;
    let apiUrl = `http://192.168.131.63:8080/dict/api/v1/getDepartment?hospotalId=${that.data.hospital.id}&token=''`;
    wx.request({
      url: apiUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          department: res.data.data
        })
      }
    })
  },
  //获取专家列表
  // getExpert: function(areaId, deptId) {
  //   wx.request({
  //     url: 'http://192.168.131.63:8080/doctor/api/v1/findDoctorList',
  //     data: {
  //       'token': '',
  //       'areaId': areaId,
  //       'deptId': deptId
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded' // 默认值
  //     },
  //     success: res => {
  //       console.log(res.data.data)
  //       if (res.data.code == "200") {
  //         this.setData({
  //           expertList: res.data.data
  //         })
  //       }
  //     }
  //   })
  // },
  bindDepartmentChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getExpert(440000, 'all');
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'NOYBZ-WXICJ-XMGFO-FF2UV-ULBW7-UEBFX' //此处使用你自己申请的key  
    });
    this.setData({
      doctorMes: options
    })
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(resA) {
            that.setData({
              region: [resA.result.address_component.province, resA.result.address_component.city, resA.result.address_component.district]
            })
            // that.getHospital();
            // console.log(resA);
          },
          fail: function(resA) {
            console.log(resA);
          },
          complete: function(resA) {
            // console.log(resA);
          }
        });
      }
    })
    this.getDepartment();
  },
  chooseAssist:function(){//确认选择医生
    console.log(this.data.assisterId)
  },
  radioChange:function(e){
    this.setData({
      assisterId: e.detail.value
    });
  }

})