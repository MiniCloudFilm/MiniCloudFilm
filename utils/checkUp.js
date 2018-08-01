var check = (dataList, dataJson, pageSize,that)=>{
  let tmpArr;
  if (that.data.page > 1) {
    tmpArr = dataList
  } else {
    tmpArr = [];
  }   
  tmpArr.push.apply(tmpArr, dataJson);
  if (dataJson.length == 0) {
    that.setData({
      showNoData:true,
      isLoad: false
    }) 
    if (that.data.page > 1) {
      that.setData({
        isEnd: false,
      })
    }
  } else {
    if (dataJson.length < pageSize) {
      that.setData({
        isLoad: false
      })
      if (that.data.page > 1) {
        that.setData({
          isEnd: false
        })
      }
    } else {
      that.setData({
        isLoad: true,
        page: ++that.data.page
      })
    }
  }
  that.setData({
    isHideLoadMore: true
  })
  return tmpArr
} 

//下拉刷新
var pullDownRefresh= (that, getData,arr) => {
  wx.showNavigationBarLoading() //在标题栏中显示加载  
  that.setData({
    page: 1,
    isEnd: true,
    showNoData: false  //暂无数据判定
  }) 
  console.log(arr)
  if(arr){ 
    getData.apply(that, arr);
  }else{ 
    getData();
  }
  setTimeout(() => {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新 
  }, 1500);
} 
/**
 * 上拉加载  that:this对象  getData: 获取数据方法 arr: 参数
 */
var reachBottom = (that, getData, arr)=>{
  if (that.data.isLoad) {
    that.setData({
      isHideLoadMore: false
    })
    if (arr) {
      getData.apply(that, arr);
    } else {
      getData();
    }
  } else {
    if (that.data.page > 1) {
      that.setData({
        isEnd: false
      })
    } 
  }
}
module.exports = { check, pullDownRefresh, reachBottom} 