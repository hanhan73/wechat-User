/**
 * Created by Administrator on 2017/7/7/007.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { TCommonPage } from '../basic-page';
import { HomePage } from "../home/home";
import { TAuth } from '../services';
import { TopupService } from '../services';

declare var WeixinJSBridge;

@Component({
  selector: 'page-topup',
  templateUrl: 'topup.html'
})

export class TopupPage extends TCommonPage
{
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public auth: TAuth,
    public service: TopupService)
  {
    super(navCtrl, navParams, loadingCtrl, toastCtrl);
    this.iccid = navParams.get('item');
    this.service.GetOrderList(this.iccid).then(
      data => this.Orderlist(data),
      error => console.log(error)
    );

  }

  /**
   * 获取充值项目
   *====================================================================================================================
   */
  Orderlist(data) {
    console.log(data);
    if (data.status == 1)
    {
      this.good_items = data.data;
      setInterval(() => {
        let nowtime = new Date();
        let endtime= new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
        let expire = (endtime.getTime() - nowtime.getTime())/1000;
        this.hours = Math.floor(expire/3600);
        this.diviser = Math.floor(expire%3600/60);
        this.seconde = Math.floor(expire%60);

        if ( this.hours < 10) {
          this.hours = '0'+this.hours;
        }
        if ( this.diviser < 10 ) {
          this.diviser = '0' + this.diviser
        }
        if ( this.seconde < 10 ) {
          this.seconde = '0' + this.seconde;
        }
        // console.log(this.hours+'//' + this.diviser +'//'+ this.seconde);

      }, 1000);
    }
  }

  /*
   区分不同套餐样式
   */
  OrderStyle(ob) {
    if (ob.mode == 0 || ob.mode == 1) {
      //新用户
      return {
        'border': '1px solid #F59211',
        'background': 'url("../../assets/icon/Order/yellow.png") bottom no-repeat',
        'background-size': '100%'
      }
    }

  }

  LabelStyle(ob) {
    if (ob.mode == 1 || ob.mode == 0) {
      return {
        'color': '#15a6ff'
      }
    }

  }

  FlowStyle(ob) {
    if (ob.mode == 1 || ob.mode == 0) {
      return {
        'font-size': '1.4rem'
      }
    }
    else {
      return {
        'font-size': '2.5rem'
      }
    }
  }

  BottmStyle (ob) {
    if (ob.mode == 1 || ob.mode == 0) {
      return {
        'margin-top': '13%'
      }
    }
  }
  /**
   * 选择充值项目
   *====================================================================================================================
  */
  ChangeOrder(item)
  {
    let money;
    if (item.mode == 0) {
      money = (item.price*item.discount)/100/100;
    }
    else {
      money = item.price/100;
    }
    let prompt = this.alertCtrl.create({
      title: '充值详情',
      message: "您将订购价值" + money + "元的" + (item.flow_size)/1024 + "G流量套餐",
      buttons: [
        {
          text: '确认支付',
          handler: data => {
            this.CreateOrder(item.id, money);
          },
          cssClass:'alertbuttn'
        }
      ]
    });
    prompt.present();
  }

  //创建订单
  CreateOrder(order_id, money) {
    /**
    * 创建充值订单 iccid  套餐ID  价格 类型1
    */
    this.service.CreateOrder(this.iccid, order_id, money*100, this.auth.openid
    ).then(
      data => this.CallPay(data),
      error => console.log(error)
    )

  }

  CallPay(data) {
    console.log(data);

    if (data.status == 1) {
      this.ToPay(data.data);
    }
  }

  CallWeixinPay(data)
  {
    let that = this;
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        "appId": data.appid,
        "timeStamp": data.time_stamp,
        "nonceStr": data.old_nonce_str,
        "package": "prepay_id=" + data.prepay_id,
        "signType": "MD5",
        "paySign": data.pay_sign
      },
      function(res) {
        WeixinJSBridge.log(res.err_msg);
        if(res.err_msg == 'get_brand_wcpay_request:ok')
        {
          that.navCtrl.setRoot(HomePage);
        }
    })
  }

  ToPay(data)
  {
    if ( WeixinJSBridge == "undefined")
    {
      if (document.addEventListener)
      {
        document.addEventListener('WeixinJSBridgeReady', this.CallWeixinPay, false);
      }
      else if (document.addEventListener){
        document.addEventListener('WeixinJSBridgeReady', this.CallWeixinPay);
        document.addEventListener('onWeixinJSBridgeReady', this.CallWeixinPay);
      }
    }
    else {
      this.CallWeixinPay(data);
    }
  }


  private iccid;
  private good_items;
  private hours;
  private diviser;
  private seconde;
}
