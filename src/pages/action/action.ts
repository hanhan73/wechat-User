/**
 * Created by Administrator on 2017/7/18/018.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { TCommonPage } from '../basic-page';
import { HomePage } from "../home/home";
import { TopupService } from '../services';
import { ActionService } from '../services';
import { TAuth } from '../services';

declare var WeixinJSBridge;

@Component({
  selector: 'page-action',
  templateUrl: 'action.html'
})

export class ActionPage extends TCommonPage
{
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public service: TopupService,
              public auth: TAuth,
              public action: ActionService)
  {
    super(navCtrl, navParams, loadingCtrl, toastCtrl);

    this.iccid = localStorage.getItem('iccid');
    this.action.ActivateOrder().then(
      data => this.InitAction(data),
      error => console.log(error)
    )
  }

  InitAction(data)
  {
    localStorage.removeItem('state');
    localStorage.removeItem('iccid')

    if (data.status == 1) {
      this.actionItem = data.data;
      console.log(this.actionItem);
    }
    else {
      this.ShowToast(data.msg);
    }

  }

  ActionPay() {
    this.service.CreateOrder(
      this.iccid, this.actionItem.id, this.actionItem.price, this.auth.openid
    ).then(
      data => this.CallPay(data),
      error => console.log(error)
    )

  }

  CallPay(data)
  {
    console.log(data);

    if (data.status == 1)
    {
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
    if (WeixinJSBridge == "undefined")
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

  private actionItem;
  private iccid;
}
