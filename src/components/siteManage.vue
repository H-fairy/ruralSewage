<template>
  <div class="site-manage">
    <!-- 自然村 -->
    <div class="top-select">
      <i class="line"></i>
      <Tabs :animated="false" @on-click="tabClick" name="villageId" :value="villageId">
        <TabPane :label="item.name" v-for="(item, index) in villageList" :key="index" tab="villageId" :name="item.id">
          <div class="tab-content" v-if="siteList.length>0">
            <!-- 站点 -->
            <div class="cl">
              <p class="fl tab-message b-block cl" style="border-top:1px solid rgba(56, 220, 201, 0.3);">
                <b>运行日期:{{siteMessage.operatedate}}</b>
                <b>工艺:{{siteMessage.technology}}</b>
                <b>处理规模:{{siteMessage.processingscale}}</b>
                <b>出水标准:{{siteMessage.effluentstandard}}</b>
              </p>
              <div class="fr">
                <div class="fl site-select">
                  <RadioGroup v-model="siteId" type="button" size="large" @on-change="selectSite">
                    <Radio v-for="(item, index) in siteList" :key="index" :label="item.id">{{item.name}}</Radio>
                </RadioGroup>
                </div>
                <!-- <div class="fl"  @click="settingModal = true">
                  <i class="setting-icon"></i>
                </div> -->
                <div class="fl" v-if="showUnpus" @click="videoModalFlag"><i class="setting-icon video-icon"></i></div>
              </div>
            </div>
            <div style="text-align:left;position:relative;top: -54px;" class="b-block cl" v-if="showUnpus">
              <b :title="'当前瞬时水量:'+mointorList.nowWater+'m³/h'">当前瞬时水量: {{mointorList.nowWater}} m³/h </b>
              <b :title="'昨日总产水量:'+mointorList.yesterdayWater+'m³'">昨日总产水量:{{mointorList.yesterdayWater}} m³ </b>
              <b :title="'昨日总耗电量:'+mointorList.yesterdayEnergy+'KWh'">昨日总耗电量: {{mointorList.yesterdayEnergy}}KWh</b>
              <b :title="'吨水位能耗:'+mointorList.energyWater+'KWh/m³'"> 吨水位能耗: {{mointorList.energyWater}}KWh/m³</b>
            </div>
            <div style="text-align:left;position:relative;top: -54px;" class="b-block cl" v-else>
              <b :title="'昨日总耗电量:'+mointorList.yesterdayEnergy+'KWh'">昨日总耗电量: {{mointorList.yesterdayEnergy}}KWh</b>
            </div>
            <!-- 监测指标 -->
            <div class="cl tab-center">
              <div class="fl tab-conf" ><iframe :src="diagramUrl" frameborder="0" style="height:100% ;width: 100%;text-align:center" id="blur_iframe"></iframe></div>
              <div class="fr equipment-tabs">
                <i class="line"></i>
                <Tabs name="name1" vlaue="name1">
                    <TabPane label="设备情况" tab="name1" name="name1">
                        <ul class="cl equipment-tabs-title">
                          <li class="fl" style="text-align:center;">设备名称</li>
                          <li class="fl">启停</li>
                          <li class="fl">故障</li>
                          <li class="fl">备用</li>
                          <li class="fl">在线</li>
                        </ul>
                        <div style="overflow-y:auto;height: 600px;" class="equip-scroll">
                        <!-- <happy-scroll color="#3AE6D2" size="12" hide-horizontal> -->
                          <!-- 内层盒子——内容区 -->
                          <div>
                            <ul class="equipment-tabs-list cl" v-for="(i,index) in equipStatusList" :key="index">
                              <li class="fl" :title="i.name" style="text-align:center;">
                                {{i.name}}
                              </li>
                              <!-- 启停 -->
                              <li class="fl">
                                <i :class="{'equipment-launch':i.runstate == '运行'}"></i>
                              </li>
                              <!-- 故障 -->
                              <li class="fl">
                                <i :class="{'equipment-trouble':i.runstate == '故障'}"></i>
                              </li>
                              <!-- 备用 -->
                              <li class="fl">
                                <i :class="{'equipment-standby':(i.runstate == '停止' && i.name.indexOf('提升泵')!= -1 &&siteMessage.restypetitle != '泵站')}"></i>
                              </li>
                              <!-- 在线 -->
                              <li class="fl">
                                <i :class="{'equipment-online':i.runstate!='离线'}"></i>
                              </li>
                            </ul>

                          </div>
                        <!-- </happy-scroll> -->
                        </div>
                    </TabPane>
                    <TabPane label="运行参数" tab="name1" name="name2">
                      <ul class="cl equipment-tabs-title">
                          <li class="fl" style="width: 72%;text-align:center;">参数名称</li>
                          <li class="fl" style="width: 28%;text-align:center;">当前值</li>
                        </ul>
                        <!-- <happy-scroll color="#3AE6D2" size="12" hide-horizontal> -->
                          <!-- 内层盒子——内容区 -->
                          <div style="overflow:auto;height: 600px;" class="equip-scroll">
                            <ul class="equipment-tabs-list cl" v-for="(item,index) in settingData" :key="index">
                              <li class="fl" style="width: 72%;text-align:center;" :title="item.description">
                                {{item.description}}
                              </li>
                             
                              <li class="fl" style="width: 28%;text-align:center;">
                                {{item.values}}
                              </li>
                            </ul>

                          </div>
                        <!-- </happy-scroll> -->
                    </TabPane>
                </Tabs>
              </div>
              <!-- <div class="fl tab-conf" ><iframe src="../static/site.html" frameborder="0" style="height: 100%;width: 100%;"></iframe></div> -->
              <!-- <div class="fr" v-if="showUnpus" @click="videoModalFlag"><i class="setting-icon video-icon"></i></div> -->
            </div>
          </div>
          <div v-else></div>
        </TabPane>
      </Tabs>
      <div class="top-search" >
        <Select
            prefix="ios-search"
            placeholder="请输入站点名称"
            v-model="topSearch"
            filterable
            clearable
            remote
            :remote-method="remoteMethodSite"
            @on-change="selectSiteValue"
            :loading="loadingSite">
            <Option v-for="(option, index) in searchSiteList" :value="option.value" :key="index">{{option.label}}</Option>
        </Select>
        <Button v-if="homeFlag" @click="returnHome">返回</Button>
      </div>
    </div>
    <!-- 参数修改弹出层 -->
    <!-- <Modal
        title="设备情况"
        v-model="settingModal"
        :styles="{top: '100px'}" class-name="blue-modal" :transfer="false">
        <div>
          <Table :columns="settingColumns" :data="settingData" class="setting-table" max-height="400"></Table>
        </div>
         <div slot="footer">
        </div>
    </Modal> -->
    <!-- 设备详情弹出框 -->
    <Modal :title="equipName" v-model="equipDetails" class-name="blue-modal equip-modal" :transfer="false" :closable="true" width="700">
      <div>
        <div class="cl equip-state">
          
          <span class="fl">
            设备状态：<i>{{equipMessage.runstate||'--'}}</i>&nbsp;&nbsp;&nbsp;&nbsp;设备编号：<i>{{equipMessage.equipmentcoding||'--'}}</i>
          </span>
          <!-- <div class="fr">
            <Button>开启</Button>
            <Button>关闭</Button>
          </div> -->
        </div>
        <div class="detail-message">
          <Tabs value="name1" :animated="false">
            <TabPane label="详情" name="name1">
              <h3 class="equip-title">信息</h3>
              <ul class="equip-details" style="height: 239px;overflow:auto;">
                <li class="row-two">设备名称：{{equipMessage.name||'--'}}</li>
                <li class="row-two">设备编号：{{equipMessage.equipmentcoding||'--'}}</li>
                <li class="row-two">设备型号：{{equipMessage.equipmenttype||'--'}}</li>
                <li class="row-two">设备厂家：{{equipMessage.equipmentmanufacturer||'--'}}</li>
                <li class="row-two">安装日期：{{equipMessage.installdate||'--'}}</li>
                <li class="row-one">安装位置：{{equipMessage.belongspace_title||'--'}}</li>
              </ul>
            </TabPane>
            <TabPane label="告警" name="name2">
              <div style="height: 300px;overflow: auto;">
                <div v-if="alarmMessage.moname">
                  <h3 class="equip-title">{{alarmMessage.levelname}}告警</h3>
                  <ul class="equip-details">
                    <li class="row-two">告警设备：{{alarmMessage.moname}}</li>
                    <li class="row-two">告警状态：{{alarmMessage.sheetStatus|alarmStatus}}</li>
                    <li class="row-two">告警类型：{{alarmMessage.typename}}</li>
                    <li class="row-two">告警时间：{{alarmMessage.occurtimestr}}</li>
                    <li class="row-one">告警位置：{{alarmMessage.nodename}}</li>
                    <li class="row-one">告警标题：{{alarmMessage.title}}</li>
                  </ul>
                  <h3 class="equip-title">告警流程</h3>
                  <div>
                    <Table :columns="alarmColumns" :data="alarmData"></Table>
                  </div>
                </div>
                <div v-else>
                  暂无告警
                </div>
                
              </div>
            </TabPane>
        </Tabs>
        </div>
      </div>
    </Modal>
    <!-- 视频监控弹窗 -->
    <Modal v-model="videoModal" class-name="blue-modal equip-modal vertical-center-modal" id="detail-message" 
    @on-cancel="cancelVideo"
    :transfer="false" width="755">
      <div class="detail-message" >
        <Tabs :animated="false" @on-click="videoTabClick" :value="videoTabValue">
          <TabPane label="图片监控">
            <!-- <div style="text-align:left;">
              <DatePicker type="date" :options="disableDate" placeholder="Select date" style="width: 250px;margin-bottom: 20px;"></DatePicker>
            </div> -->
            <div style="width: 720px;height: 510px;overflow:hidden;">
              <iframe width="100%" height="100%" style="min-height: 500px; display:block;" :src="photoUrl" scrolling="no"></iframe>
            </div>
          </TabPane>
          <TabPane label="实时视频">
            <div style="width: 720px;height: 510px;overflow:hidden;">
              <iframe width="100%" height="100%" :src="videoUrl" scrolling="no"></iframe>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </div>
</template>
<script>
import { get, post } from "@/request/api";
export default {
  name: '',
  data () {
    return {
      value:null,
      showUnpus: true,// 是否展示摄像头
      topSearch:null,// 按站点搜索查询
      loadingSite:false,
      searchSiteList:[],
      villageId:null,//默认选中自然村
      siteUrl:null,
      spanClick: 'handleSpanClick', //html中需要响应的事件
      homeFlag:false,
      search:null,
      settingModal:false,
      equipDetails:false,
      videoModal:false,
      videoTabValue: null,
      equipName: null,
      villageList:[],//自然村
      siteList: [],//站点
      siteId: null,
      mointorList:{},// 监测指标
      siteMessage: {},// 站点信息
      diagramUrl:null,//组态图url
      videoUrl: null, 
      videoId: null,
      videoCode: null,
      photoUrl: null,
      equipMessage:{}, // 设备信息
      alarmMessage:{},
      disableDate:{
         disabledDate (date) {
             return date && date.valueOf() >= new Date();
         }
     },
      settingData:[],
      settingColumns:[
        {
          title:'名称',
          key:'description',
          align:'left',
          width:300
        },{
          title:'当前值',
          key:'values',
          align:'center'
        }
      ],
      alarmData:[
        // {createDate: '2020-06-25 08:00:00'}
      ],
      alarmColumns:[
        {
          title:'时间',
          key:'createDate',
          render:(h,params) => {
            return h('div', [
                h('p', params.row.createDate.trim().split(/\s+/)[0]),
                h('p', params.row.createDate.trim().split(/\s+/)[1])
            ]);
          }
        },{
          title:'告警标题',
          key:'title'
        },{
          title:'状态',
          key:'state',
          render:(h, params) => {
            if(params.row.state == 0){
              return h('p', '未接受')
            }else if(params.row.state == 1){
              return h('p', '已自动派单')
            }else if(params.row.state == 2){
              return h('p', '处理中')
            }else if(params.row.state == 3){
              return h('p', '已处理')
            }
         }
        },{
          title:'部门',
          key:'deptname'
        },{
          title:'处理人',
          key:'dealname'
        }
      ],
      villageFlagId:null,//行政村id
      siteFlagId: null,//站点id
      allSiteList: [],//所有的站点列表
      searchSiteId: null,//搜索站点id
      searchVillageId: null,//搜索自然村id
      searchAdminId: null, //搜索行政村id
      equipStatusList:[]
    }
  },
  filters: {
    alarmStatus:(val)=>{
      if(val){
        if(val == 0) return '未接受'
        if(val == 1) return '已派发'
        if(val == 2) return '处理中'
        if(val == 3) return '已完成'
      }
    }
  },
  created(){
    
  },
  mounted() {
    if(this.$route.query.homeFlag == 'gis'){
      this.homeFlag = true;
      this.searchSiteId = this.$route.query.siteid;//搜索站点id
      this.searchVillageId =  this.$route.query.natureid;//搜索自然村id
      this.searchAdminId = this.$route.query.resid //搜索行政村id
    }else{
      this.homeFlag = false;
      this.searchSiteId = null;//搜索站点id
      this.searchVillageId =  null;//搜索自然村id
      this.searchAdminId = null //搜索行政村id
    }
    //获取站点
    this.GetVillage();
    //
    this.addClickEventListener();
    this.getSiteList();
    // let self = this;
    // this.$nextTick(function () {
    //   document.addEventListener('keyup', function (e) {
    //     //此处填写你的业务逻辑即可
    //     if (e.keyCode == 27) {
    //       if(self.equipDetails == true){
    //         self.equipDetails == false;
    //       }
    //     }
    //   })
    // })
  },
  watch:{
    $route(to,from){
      if(this.$route.query.homeFlag == 'gis'){
        this.homeFlag = true;
        this.searchSiteId = this.$route.query.siteid;//搜索站点id
        this.searchVillageId =  this.$route.query.natureid;//搜索自然村id
        this.searchAdminId = this.$route.query.resid //搜索行政村id
      }else{
        this.homeFlag = false;
        this.searchSiteId = null;//搜索站点id
        this.searchVillageId =  null;//搜索自然村id
        this.searchAdminId = null //搜索行政村id
      }
      
      //获取站点
      this.GetVillage();
      this.addClickEventListener();
      
    }
  },
  methods:{
    /**
     * 返回
     */
    returnHome(){
      window.parent.postMessage({
        close:true
      },'*');
    },
    /**
     * 获取站点列表
     */
    getSiteList() {
      let params = {
        name: '站'
      }
      get('/wes/zhjy/queryStationByName', params).then(response => {
        this.allSiteList = response.data
      })
    },
    /**
     * 查询站点
     */
    remoteMethodSite(query) {
      if (query !== '') {
          this.loadingSite = true;
          setTimeout(() => {
              this.loadingSite = false;
              const list = this.allSiteList.map(item => {
                let values = '{'+'"id":'+item.id+','+'"belongspace":'+item.belongspace+','+'"belongvillageid":'+item.belongvillageid+'}';//站点id，自然村id，行政村id
                  return {
                      value: values,
                      label: item.name
                  };
              });
              this.searchSiteList = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
          }, 200);
      } else {
          this.searchSiteList = [];
      }
    },
    selectSiteValue(value) {
      this.$nextTick(function () {
        this.topSearch = null;
      })
      if(value){
        let valueJson = JSON.parse(value);
        this.searchSiteId = valueJson.id;
        this.searchVillageId = valueJson.belongspace;
        this.searchAdminId = valueJson.belongvillageid;
        this.GetVillage(this.searchAdminId);
        
        
      }
    },
    addClickEventListener(){
      let _this =this;
      window.addEventListener('message',function(e){
        var id = e.data.clickId
        if(e.data.clickId != undefined || e.data.clickId != null){
          _this.diagramClick(id);
        }
      },false);
    },
    videoTabClick(val){
      this.videoTabValue = val;
      if(val == 1){
        var root = process.env.API;
        let wrapBox= document.getElementById('detail-message');
        let contentBox = wrapBox.childNodes[2].childNodes[0];

        let left = contentBox.offsetLeft + 20 + 240 + 33;
        let top = contentBox.offsetTop + 83 + 63 - 30;
        // console.log(contentBox.offsetTop,left,top)
        if(this.homeFlag == true){
          left = contentBox.offsetLeft + 20 + 240 + 25;
          top = contentBox.offsetTop + 83 + 63 - 28;
        }
        this.videoUrl = root+'/wes/video/preview?point=' + this.videoCode + '&type=startPreview&left=' + left + '&top=' + top +'&width=720&height=460'
      }else{
        this.videoUrl = ''
      }
    },
    cancelVideo(){
      this.videoUrl = '';
      // console.log(this.videoUrl)
    },
    videoModalFlag(){
      if(this.videoCode != null ||this.videoCode != undefined) {
        this.videoModal = true;
        this.videoTabValue = 0;
      }else{
         this.$Message.info('没有找到资源！');
      }
    },
    diagramClick(id){
      this.equipDetails = true;
      document.getElementById('blur_iframe').blur();
      let self = this;
      this.$nextTick(function () {
        document.addEventListener('keyup', function (e) {
          //此处填写你的业务逻辑即可
          if (e.keyCode == 27) {
            if(self.equipDetails == true){
              self.equipDetails == false;
            }
          }
        })
      })
      let params = {
        resid: id,
      }
      get('/wes/zhjy/queryStationByResId', params).then(response => {
        this.equipMessage = response.data
        this.equipName = response.data.name

      })
      get('/wes/alarmmanage/getrecordbyres', params).then(response => {
        // console.log(response.data)
        if(response.data.alarm){
          this.alarmMessage = response.data.alarm[0];
          this.alarmData = response.data.flow;
        }else{
          this.alarmMessage = {};
          this.alarmData = [];
        }
        
      })
    },
    /**
     * 视频弹层展示
     */
    /**
     * 获取监控图片
     */
    getPhoto(id){
       var root = process.env.API;
       this.photoUrl = root+'/wes/video/history?point=' + id;

    },

    /**
     * 行政村获取自然村
     */
     GetVillage() {
      //  if(this.$route.query.homeFlag == 'gis'){
      //   this.homeFlag = true;
      //   this.searchSiteId = this.$route.query.siteid;//搜索站点id
      //   this.searchVillageId =  this.$route.query.natureid;//搜索自然村id
      //   this.searchAdminId = this.$route.query.resid; //搜索行政村id
      // }else{
      //   this.homeFlag = false;
      //   this.searchSiteId = null;//搜索站点id
      //   this.searchVillageId =  null;//搜索自然村id
      //   this.searchAdminId = null; //搜索行政村id
      // }
      // console.log(this.homeFlag,this.searchSiteId,this.searchVillageId,this.searchAdminId)
       let params;
       if(this.searchAdminId != null){
         params = {
            resid: this.searchAdminId
         }
       }else{
         params = {
            resid: this.$route.query.resid
         }
       }
      get('/wes/zhjy/queryDataByResId',params).then(response => {
        let dataJson = response.data;
        let arr = Object.keys(dataJson)
        console.log(dataJson)
        if(arr.length<=0){
          this.$Message.info('暂时没有站点！');
          return;

        }
        let dataArray = [];
        for (var i in dataJson) {
          dataArray.push({id:i,name:dataJson[i]});
        }
        this.villageList = dataArray;
        if(this.searchVillageId!= null) {
          this.villageId = this.searchVillageId+''
        }else{
          this.villageId =dataArray[0].id
        }
        // console.log(this.villageId, dataArray[0].id)
        this.searchAdminId = null;
        this.searchVillageId = null;
        this.getSite(this.villageId);

      });
    },
    /**
     * 自然村获取站点
     */
     getSite(id) {
       let params;
       if(id){
         params = {
           resid: id
         }
       }else{
         params = {
           resid: this.villageFlagId==null?this.villageList[0].id:this.villageFlagId
         }
       }
      get('/wes/zhjy/queryDataByResId',params).then(response => {
        let dataJson = response.data;
        let dataArray = [];
        for (var i in dataJson) {
          dataArray.push({id:i,name:dataJson[i]});
        }
        this.siteList = dataArray;
        if(this.siteList.length>0){
          if(this.searchSiteId != null){
            this.siteId = this.searchSiteId+''
          }else{
            this.siteId = dataArray[0].id
          }
          this.searchSiteId = null
          // this.siteId = this.searchSiteId||dataArray[0].id;
          this.operMessage(this.siteId);
        }
        
        
      });
      
    },
    operMessage(id){
        this.getMonitor(id);
        this.getMessage(id);
        this.getParameter(id);
        this.getDiagramUrl(id);
        this.getVideoId(id)
        this.getEquipStatus(id);
      },
    /**
     * 获取摄像头id
     */
    getVideoId(id) {
      let params = {
        resid: id
      };
      get('/wes/zhjy/queryDataByResId', params).then(response => {
        for (var i in response.data) {
          if (response.data[i] === '摄像头') {
            this.videoId = i;
            // return;
          }
        }
        if(this.videoId == null){
        }else{
          this.getVideoMessage(this.videoId);
        }
        
        
      })
    }, 
    /**
     * 摄像头id查询摄像头详细信息
     */
    getVideoMessage(id) {
      let params = {
        resid: id
      };
      get('/wes/zhjy/queryStationByResId', params).then(response => {
        this.videoCode = response.data.streamurl;
         if(response.data.streamurl == undefined){
        }else{
          // this.getVideoMessage(this.videoId);
          this.getPhoto(this.videoCode)
        }
        
      })
    },


    tabClick(id){
      // console.log(id)
      this.villageFlagId = id;
      this.villageId = id;
      this.getSite(id);
    },
    /**
     * 选择站点
     */
    selectSite(id) {
      this.operMessage(id);
    },
    /**
     * 获取监测数据
     */
    getMonitor(id){
      let params ={resid: id};
      get('/wes/zhjy/queryMonitorByResId', params).then(response => {
        this.mointorList = response.data;
        this.$nextTick(function () {
          this.mointorList = response.data;
        })
      })
    },
    getEquipStatus(id){
      let params = {id: id}
      get('/wes/zhjy/selectshblb', params).then(response => {
        this.equipStatusList = response.data.listrturn;
        this.$nextTick(function () {
          this.equipStatusList = response.data.listrturn;
        })
        console.log(this.equipStatusList.length,1)
      })
    },
    /**
     * 查询站点信息
     */
    getMessage(id) {
      let params = {resid: id};
      get('wes/zhjy/queryStationByResId',params).then(response => {
        this.siteMessage = response.data;
        // console.log(this.siteMessage,1)
        if(this.siteMessage.restypename == 'pus') {
          this.showUnpus = false;
        }else{
          this.showUnpus = true;
        }
      })
    },
    /**
     * 获取参数列表 ?resid=455
     */
    getParameter(id){
      let params = {resid: id};
      get('/wes/zhjy/querySelectcanshu', params).then(response => {
        this.settingData = response.data;
      })
    },
    /**
     * 获取组态图url
     */
    getDiagramUrl(id){
      var root = process.env.API;
      let params = {resid: id};
      this.diagramUrl = root +'/diagram/diagraminstantiation/index?resid=' + id;
    }
  }
}
</script>
<style lang="less" >
@import url(../assets/css/index.css);
@primary-color: #3AE6D2;
@background-color: #151939;
@font-color: #D9FDF8;
html { height: 100%;background: @background-color;}
body { min-height: 100%;background: @background-color; padding-right: 0!important;}
.site-manage {
  color: #747474;
  overflow-x: hidden;
  .equip-scroll::-webkit-scrollbar{ 
          width:0;
      }
  .ivu-modal-mask{
    background: rgba(4,6,19,.6);
  }
  .tab-content{
    padding:10px 20px;
    .b-block{
      b{
        float: left;
        width: 180px;
        text-align: left;
        font-weight: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-right: 1px solid rgba(56, 220, 201,0.3);
        border-bottom: 1px solid rgba(56, 220, 201,0.3);
        line-height: 40px;
        height: 40px;
        padding-left: 10px;
      }
      b:first-child{
        border-left: 1px solid rgba(56, 220, 201,0.3);
      }
    }
    .tab-message{
      color: @primary-color;
      line-height: 40px;
    }
    .setting-icon{
      display: inline-block;
      width:40px;
      height:40px;
      border:1px solid @primary-color;
      margin-left:12px;
      border-radius: 3px;
      background-image: url(../assets/images/seeting2.png);
      background-size: 70%;
      background-repeat: no-repeat;
      background-position:center center;
      cursor: pointer;
    }
    .video-icon{
      background-image: url(../assets/images/sxt2.png);
    }
  }
  .ivu-select-selection{
    background: none;
    border-color: @primary-color!important;
  }
  .ivu-select-dropdown{
    background: @background-color;
    border: 1px solid @primary-color;
    margin: 10px 0;
    max-height: 300px;
  }
  .ivu-select-item{
    color: @font-color;
    font-size: 14px;
    padding: 20px;
    border-bottom: 1px solid #225F61;
    text-align: left;

  }

  .ivu-select-item:hover{
    background:rgba(58,230,210,0.2);
    color:@primary-color;
  }
  .ivu-select-single .ivu-select-selection{
    height: 40px;
    .ivu-select-input{
      line-height: 40px;
      height: 40px;
      width: 200px;
      color: @primary-color;
    }
  }
  .ivu-select-item-focus, .ivu-select-item:hover{
    background: rgba(58, 230, 210, 0.2);
  }
  .top-select{
    position: relative;
    .line{
      position: absolute;
      left:0;
      right: 0;
      top: 61px;
      height: 1px;
      background: #38DCC9;
      opacity: 0.3;
    }
    .top-search{
      position: absolute;
      top:10px;
      right: 20px;
      .ivu-select{
        width: 200px;
        .ivu-icon{
          font-size: 20px;
          color: @primary-color;
        }
      }
    }
    .site-select{
      .ivu-radio-group-button.ivu-radio-group-large .ivu-radio-wrapper{
        margin: 0 10px;
        padding: 0 20px;
        border-radius: 3px;
        border:1px solid @primary-color;
        background: none;
        color: @primary-color;
      }
      .ivu-radio-group-button .ivu-radio-wrapper:after, .ivu-radio-group-button .ivu-radio-wrapper:before{
        display: none;
      }
      .ivu-radio-group-button .ivu-radio-wrapper-checked{
        background: @primary-color!important;
        color:@background-color!important;
      }
    }
    .ivu-tabs-bar{
      max-width: calc(100% - 380px);
    }
  }
  .ivu-tabs-bar{
    border-bottom: 0px;
    // max-width:calc(100% - 380px);
    overflow: hidden;
    margin-bottom: 0;
  }

  .ivu-tabs{
    color: @primary-color;
    .ivu-tabs-nav-next, .ivu-tabs-nav-prev{
      width:50px;
      top: 25px;
    }
    .ivu-tabs-nav-next{
      right: -5px;
    }
    .ivu-tabs-nav-prev{
      left:-5px;
    }
    .ivu-tabs-nav-next i, .ivu-tabs-nav-prev i{
      font-size: 28px;
    }
    .ivu-tabs-nav{
      margin: 0px 10px;
      .ivu-tabs-tab{
        width: 100px;
        text-align:center;
        padding:20px 0;
        font-size: 16px;
      }
      .ivu-tabs-tab-active{
        color: @primary-color;  
      }
      .ivu-tabs-tab:hover {
        color: @primary-color;
      } 
      .ivu-tabs-ink-bar{
        background-color: @primary-color;
        height: 3px;
      }
    }
  }
  .ivu-btn{
    margin-left: 10px;
    height: 40px;
    padding: 0 20px;
    background: none;
    color: #39E4D0;
    border:1px solid #39E4D0;
  }
  .ivu-btn>i, .ivu-btn>span{
    line-height: 40px;
  }
  .tab-center{
    position: relative;
    top: -40px;
    .tab-conf{
      width: calc(100% - 390px);
      height: 650px;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .equipment-tabs{
      width: 380px;
      position: relative;
      top: -70px;
      .ivu-tabs-nav{
        margin: 0;
      }
      .ivu-tabs-tab{
        font-size: 14px!important;
        color: @font-color;
        width:80px;
        height: 63px;
      }
      .ivu-tabs-tab-focused{
          color:@primary-color!important;
          font-weight: bold;
        }
      .ivu-tabs-bar{
        width:380px;
        max-width: 10000px;
      }
      .ivu-tabs-tabpane{
        // display: block!important;
        width: 380px;
        margin-top: 15px;
        border: 1px solid #246F78;
        border-radius: 2px;
        border-radius: 2px;
        background: rgba(58,230,210,0.05);
        height: 600px;
        overflow-y: hidden;
      }
      .equipment-tabs-title,.equipment-tabs-list{
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: @primary-color;
        font-weight: bold;
        padding:0 15px;
        border-bottom: 1px solid #246F78;
        li{
          width: 15%;
          text-align: center;
        }
        li:first-child{
          width: 40%;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .equipment-tabs-list{
        font-size: 13px;
        color: @font-color;
        // padding: 0 0 0 15px!important;
        li{
          i{
            display: inline-block;
            width:15px;
            height: 15px;
            border-radius: 50%;
            background: #b8b8b8;
          }
          .equipment-launch{
            background: #29CE5D;
          }
          .equipment-trouble{
            background: #FF7878;
          }
          .equipment-standby{
            background: #FFCC40;
          }
          .equipment-online{
            background: #FFFFFF;
          }
        }
      }
      // .happy-scroll-container{
      //   width: 398px!important;
      //   height:598px!important;
      // }
      .happy-scroll-content{
        // height: 450px;
        // width: 380px;
        // height: 100%;
        display: block;
        .equipment-tabs-list{
          padding: 0 15px;
          // border-top: 1px solid #246F78;
        }
      }
    }
    .mon-ind{
      text-align: left;
      width: 270px;
      height:190px;
      border:1px solid @primary-color;
      border-radius: 2px;
      h3{
        font-size: 15px;
        padding-left:12px;
        height:44px;
        line-height: 44px;
        border-bottom:1px solid @primary-color;
        font-weight: bold;
      }
      li{
        margin-top: 15px;
        color:#D9FDF8;
        font-size: 13px;
        padding-left: 12px;
      }
    }
  }
  .blue-modal{
        .ivu-modal{
            // top: 0;
            
            .ivu-modal-content{
              background: @background-color;
              border: 1px solid rgba(68,215,211,0.52);
              .ivu-modal-close{
                .ivu-icon-ios-close{
                  color:@primary-color;
                }
              }
              .ivu-modal-header{
                border-bottom: 2px solid #225F61;
                text-align: left;
               .ivu-modal-header-inner{
                 color: @primary-color;
               }
              }
            }
            .ivu-table{
              background: none;
              color: @font-color;
              th{
                background: rgba(159,224,216,0.1);
                color: @font-color;
                border-bottom: 0;
              }
              td{
                background: none;
                border-bottom: 1px solid #225F61;
              }
              a,a:hover{
                color: @primary-color;
              }
            }
            .ivu-table:before{
              background-color: #225F61;
            }
            .ivu-modal-footer{
              display: none;
            }
        }
  }
  .equip-modal{
    .equip-state{
      color: @font-color; 

    }
    .detail-message{
      padding-bottom: 20px;
      .ivu-tabs{
        .ivu-tabs-nav{
          margin: 0;
        }
        .ivu-tabs-bar{
          border-bottom: 1px solid #225F61;
        }
        .ivu-tabs-tab{
          padding: 5px 0 20px;
        }
      }
      .ivu-select-dropdown{
        background: @background-color;
        border: 1px solid #215D6C;
        border-radius: 4px;
        .ivu-date-picker-header{
          border: 1px solid #215D6C;
        }
        .ivu-date-picker-cells-cell-disabled,.ivu-date-picker-cells-cell-disabled:hover{
          background: @background-color;
        }
        .ivu-date-picker-cells-focused em{
          box-shadow:0 0 0 1px #215D6C inset
        }
        .ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em{
          background:@primary-color;
          border-radius: 50%;
        }
        .ivu-date-picker-cells-cell-today em:after{
          background: @primary-color;
        }
      }
      .ivu-input{
        border: 1px solid #215D6C;
        padding-left: 10px;
      }
      .ivu-date-picker-focused input{
        box-shadow: 0 0 0 2px rgba(33,93,108,.2);
      }
    }
    .equip-title{
      text-align: left;
      margin: 40px 0 15px;
    }
    .equip-details{
      text-align: left;
      color: @font-color;
      li{
        // line-height: 25px;
        margin-bottom: 10px;
        font-size: 13px;
      }
      .row-two{
        display: inline-block;
        width: 48%;
        text-align: left;
      }
      .row-one{
        width: 100%;
      }
    }
  }
  #detail-message{
    .detail-message{
      padding-bottom: 0!important;
    }
    .ivu-modal-close .ivu-icon-ios-close{
      top: 10px;
    }
  }
  .vertical-center-modal{
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .ivu-modal{
          top: 0;
      }
  }
  .ivu-input{
    background:none;
    border:1px solid #39E4D0;
    height:40px;
    color: #39E4D0;
    width:260px;
    font-size: 16px;
  }
  .ivu-input-icon{
    left:0;
    right: auto;
    font-size:24px;
    color:#39E4D0;
    top:5px;
  }
  .ivu-input-with-suffix{
    padding-left:32px;
    padding-right:10px;
  }
  .ivu-input-suffix{
    top: 2px;
  }
  .ivu-input-prefix i, .ivu-input-suffix i{
    font-size: 20px;
    color: @font-color;
  }
}
@media (max-width: 576px){
  #detail-message{
    .ivu-modal{
      width: 755px!important;
    }
  }
}
</style>