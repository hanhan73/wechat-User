  /**
   * Created by Administrator on 2017/7/13/013.
   */
  import { Component} from '@angular/core';
  import { NavController, NavParams } from 'ionic-angular';
  import { LoadingController, ToastController } from 'ionic-angular';
  import { TCommonPage } from '../basic-page';
  import { SrechargeService } from '../services';
  import { TAuth } from '../services';
  import { TopupPage } from '../topup/topup';
  import { HomeService } from '../services'

  @Component({
    selector: 'page-srecharge',
    templateUrl: 'srecharge.html'
  })

  export class SrechargePage extends TCommonPage {
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public auth: TAuth,
                public pageService: SrechargeService,
                public homeService: HomeService ) {
      super(navCtrl, navParams, loadingCtrl, toastCtrl);
      this.Init();

    }

    /**
     * 初始化
     * @param data
     * @constructor
     */
    Init() {
      if(localStorage.getItem('iccid') != null) {
        this.numCard = localStorage.getItem('iccid');
        localStorage.removeItem('iccid')
        this.pageService.QueryCard(
          this.numCard
        ).then(
          data => this.GetCardInfo(data),
          error => console.log(error)
        )

      }
      this.pageService.QueryCardHistory().then(
        data => this.GetQueryCardHistory(data),
        error => console.log(error)
      )
    }

    GetQueryCardHistory(data) {
      let item = data.data;
      for(let i = 0; i < item.length; i++) {
        this.items.push({"text": item[i].iccid, "style": 'item-histroy'});
      }

    }
    GetCardInfo(data) {
      this.CardInfo = data.data;

      if (this.CardInfo != null) {
        this.InitItems(this.CardInfo);
        this.Search();
      }
      else {
        this.Clear();
        this.ShowToast('您输入的卡号不存在！');
      }
    }

    ToOrder() {
      if ( this.numCard != null && this.CardInfo != null ) {
        this.navCtrl.push(TopupPage , {item: this.numCard});
      }
      else {
        this.ShowToast('请输入卡号！')
      }
    }

    /**
     * 绑定设备
     * @constructor
     */
    Todevice() {
      if ( this.numCard != null && this.CardInfo != null ) {
        this.auth.login().then(
          data => {
            localStorage.setItem('token',data.token)
            this.homeService.BindingDevice(
              this.numCard
            ).then(
               data =>{
                 this.ShowToast(data.msg)
                   if(data.status == 1){
                    this.Loading();
                    this.GoBack();
                    this.FreeLoading();
                  }
                },
              error => console.log(error)
              )
          },
          error => console.log(error)
        )
      }
      else {
        this.ShowToast('请输入卡号！')
      }

    }

    querycard() {
      if ((this.numCard == '')|| (this.numCard == undefined)){
        this.ShowToast('请输入卡号！');
        this.CardInfo = null;
        this.Clear();
        return;
      }
      this.pageService.QueryCard(this.numCard).then(
        data => this.GetCardInfo(data),
        error =>console.log(error)
      );
    }

    InitItems(data)
    {
      //todo: 接口数据缺失
      this.iccid = {
        "left_day": 212,
        "state": "正常使用",
        "used_flow": data.used_flow,
        "type": "1G/1个月非按清零"
      };
      this.total_flow = data.total_flow;
      this.used_flow = data.used_flow;
    }

    Search()
    {
      console.log(this.numCard);
      this.found = true;
      this.setAnimate();
    }

    getItems(ev: any)
    {
      if (this.is_select_event)
      {
        this.is_select_event = false;
        return;
      }
      let text = ev;
      if (text && text.trim() != '')
      {
        this.show_items = [];
        this.show_items = this.items.filter((item) => {
          return (item.text.indexOf(text) > -1);
        });

        if (this.CanShowHistroy())
        {
          this.show_items.push({"text": '系统会自记住您最近查询的5条记录', "style": 'basic-item-histroy'});
        }
      }
    }

    CanShowHistroy()
    {
      return this.show_items.length > 0;
    }

    SelectItem(value)
    {
      this.numCard = value;
      this.show_items = [];
      this.is_select_event = true;
    }

    IncFlow()
    {
      this.flow = 0;
      console.log(this.flow)
      this.timer = setInterval(() => {
        if (this.flow < this.total_flow)
        {
          this.flow = this.flow + Math.floor(this.total_flow/30);
          if (this.flow >= this.total_flow)
          {
            this.flow = this.total_flow - this.used_flow;
          }
        }
      }, 90);

      setTimeout(() =>
      {
        clearInterval(this.timer);
        console.log("clear interval");
      }, 4000);

    }

    setAnimate()
    {
      this.animateIninitial = true;
      setTimeout(() =>
      {
        this.animateIninitial = false;
      }, 3000);

      this.IncFlow();
    }

    Clear()
    {
      this.flow = 0;
      this.found = false;
    }

    animateIninitial: boolean = false;
    found = false;

    private CardInfo;
    private numCard;
    private items = [];
    private show_items = [];
    private is_select_event = false;
    private total_flow ;
    private flow;
    private timer;
    private used_flow;
    private iccid;
  }
