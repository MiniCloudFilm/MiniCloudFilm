let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItem: '全部',
    hospital: [],
    departmentIndex: [0, 0],
    depart: [
      [],
      []
    ],
    index: 0,
    areaIndex: [0, 0, 0],
    value: 0,
    areaId: 'all',
    deptId: 'all',
    url: app.globalData.api.expertList.image
  },

  //获取专家列表
  getExpert: function (areaId, deptId,page) {
    wx.request({
      url: app.globalData.api.expertList.expertList,
      data: {
        'token': '',
        'areaId': areaId,
        'deptId': deptId,
        'page': page,
        'pageSize': 10
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code == "200") {
          this.setData({
            expertList: app.globalData.pageLoad.check(this.data.expertList, res.data.data.datas, 10, this)
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        app.globalData.util.showFail("服务连接失败");
      } 

    })
  },
  //获取科室
  getDepartment: function () {
    wx.request({
      url: app.globalData.api.picker.getDepartment, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        let arr = res.data.data;
        let arr0 = {
          "deptName": "全部",
          "children": [],
          "deptId": 'all',
          "parentId": 0
        }
        arr.unshift(arr0);
        // console.log(arr);
        if (res.data.code == "200") {
          this.setData({
            departList: arr
          })
          let depart = [
            [],
            []
          ]
          for (let i = 0; i < arr.length; i++) {
            depart[0].push(arr[i])
          }
          depart[1] = arr[0].children;
          // console.log(depart);
          this.setData({
            department: depart
          })
        }
      }
    })
  },
  //获取科室列
  bindMultiPickerColumnChange: function (e) {
    // console.log(e.detail.column, e.detail.value);
    var data = {
      department: this.data.department,
      departmentIndex: this.data.departmentIndex
    };
    data.departmentIndex[e.detail.column] = e.detail.value;
    // console.log(data.departmentIndex);
    if (e.detail.column == 0) {
      for (let i = 0; i < this.data.departList.length; i++) {
        if (e.detail.value == i) {
          let list = this.data.department;
          list[1] = this.data.departList[i].children;
          this.setData({
            department: list
          })
        }
      }
    }
    this.setData({
      departmentIndex: data.departmentIndex
    })
  },
  //选定科室
  bindDepartmentChange: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      expertList: [],
      page: 1,
      isHideLoadMore: true,
      isLoad: true,
      isEnd: true
    })
    // console.log(e);
    let index = e.detail.value;
    let parent = index[0];
    let value = index[1];
    let areaId = this.data.areaId;
    let list = this.data.departList;
    for (let i = 0; i < list.length; i++) {
      if (parent == i) {
        if (value == 0) {
          this.setData({
            deptId: list[i].deptId
          })
          this.getExpert(areaId, this.data.deptId,1)
        } else {
          this.setData({
            deptId: list[i].children[value].deptId
          })
          this.getExpert(areaId, this.data.deptId,1)
        }
      }
    }
  },
  //选择区域
  bindAreaColumnChange: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      expertList: [],
      page: 1,
      isHideLoadMore: true,
      isLoad: true,
      isEnd: true
    })
    var data = {
      areaList: this.data.areaList,
      areaIndex: this.data.areaIndex
    };
    data.areaIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      data.areaIndex[1] = 0;
      data.areaIndex[2] = 0;
    }
    for (let i = 0; i < this.data.areaList[e.detail.column].length; i++) {
      if (e.detail.value == i) {
        let list = this.data.areaList;
        let parentId = list[e.detail.column][i].areaId;
        let level = list[e.detail.column][i].areaLevel + 1;
        if (level < 4) {
          this.getArea(parentId, level);
        }
      }
      this.setData({
        areaIndex: data.areaIndex
      })
    }
    // console.log(this.data.areaList)
  },
  //选定区域
  bindAreaChange: function (e) {
    // console.log(e.detail.value, this.data.areaList); 
    let indexArr = e.detail.value;
    let areaList = this.data.areaList;
    let areaId = "";
    let deptId = this.data.deptId;
    if (indexArr[2] == 0) {
      if (indexArr[1] == 0) {
        if (indexArr[0] == 0) {
          areaId = areaList[0][0].areaId
          this.getExpert(areaId, deptId,1);
        } else {
          areaId = areaList[0][indexArr[0]].areaId
          this.getExpert(areaId, deptId,1);
        }
      } else {
        areaId = areaList[1][indexArr[1]].areaId
        this.getExpert(areaId, deptId,1);
      }
    } else {
      areaId = areaList[2][indexArr[2]].areaId
      this.getExpert(areaId, deptId,1);
    }
    this.setData({
      areaId: areaId
    })
  },
  //获取地市
  getArea: function (parentId, level) {
    wx.request({
      url: app.globalData.api.picker.getArea,
      data: {
        'token': '',
        'parentId': parentId,
        'level': level
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res);
        // console.log(res.data.data)
        if (res.data.code == "200") {
          let list = res.data.data;
          let first = {
            "areaId": 'all',
            "areaName": '全部',
            "areaLevel": level,
            "parentId": parentId
          }
          list.unshift(first)
          let DList = this.data.areaList;
          if (level == 1) {
            DList[0] = list;
            this.setData({
              areaList: DList
            })
          } else if (level == 2) {
            DList[2] = [];
            DList[2].push(first);
            this.setData({
              arealist: DList
            })
            DList[1] = list;
            this.setData({
              areaList: DList
            })
          } else if (level == 3) {
            DList[2] = [];
            DList[2] = list;
            this.setData({
              areaList: DList
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中..',
    });
    this.getArea('0', 1);
    // console.log(options);
    this.getDepartment();
    this.getExpert('all', 'all',1);
    this.setData({
      dialogId: options.dialogId,
      areaList: [
        [],
        [],
        []
      ],
      isHideLoadMore: true,
      isEnd: true,
      page: 1
    })
  },
  chooseAssist: function () {//确认选择医生
    if (this.data.assisterId == wx.getStorageSync('userList').userId) {
      app.globalData.util.showWarning("不能选自己哦");
    } else if (this.data.assisterId == undefined) {
      app.globalData.util.showWarning("请选择协助者");
    } else {
      wx.request({
        url: app.globalData.api.assistList.chooseAssist,
        data: {
          'token': wx.getStorageSync('token'),
          'userId': this.data.assisterId,
          "dialogId": this.data.dialogId,
          "userType": 3
        },
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          if(res.data.code=='200'){
            let pages = getCurrentPages();//当前页
            let prevPage = pages[pages.length - 2];//上一页
            prevPage.setData({
              ifNeedAssist: "false"//去掉协助按钮
            });
            wx.navigateBack({
              delta: 1
            });
          }else{
            app.globalData.util.showFail("请求失败")
          }
          
        },
        fail:function(){
          app.globalData.util.showFail("服务连接失败")
        }
      });

    }
  },
  radioChange: function (e) {
    this.setData({
      assisterId: e.detail.value
    });
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    app.globalData.pageLoad.pullDownRefresh(this, this.getExpert, [this.data.areaId, this.data.deptId, 1]);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 显示加载图标   
    app.globalData.pageLoad.reachBottom(this, this.getExpert, [this.data.areaId, this.data.deptId, this.data.page]);
  },
  onPageScroll: function (e) {
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
})