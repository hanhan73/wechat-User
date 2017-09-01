/**
 * Created by Administrator on 2017/7/5/005.
 */
import { Component ,ViewChild } from '@angular/core';
import { NavController, NavParams,Slides} from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { TCommonPage } from '../basic-page';
import { TAuth } from '../services';
import { RechargeService } from '../services';

@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html'
})

export class RechargePage extends TCommonPage
{
  @ViewChild(Slides) slides: Slides;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public recharge: RechargeService,
    public auth: TAuth)
  {
    super(navCtrl, navParams, loadingCtrl, toastCtrl);
    this.recharge.GetOrders().then(
      data => this.OrderList(data),
      error => console.log(error)
    )

  }

  onSlidechanged(){
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == this.slist.length){
      currentIndex = currentIndex-1;
    }
    let iccid = this.slist[currentIndex].iccid;

    this.recharge.GetOrderByiccid(iccid).then(
      data => this.order = data.data,
      error => console.log(error)
    );

  }

  OrderList(data){
    if (data.status == 1) {
      this.list = data.data;
      this.slist = data.data.detail;
      console.log(this.slist)

      if ( this.slist == "" ) {

        this.ShowToast('请先绑定卡，再查询充值记录！');
      }
      else {

        this.recharge.GetOrderByiccid(this.slist[0].iccid).then(
          data => this.order = data.data,
          error => console.log(error + data.msg)
        );
      }
      console.log(data);
    }
    else {
      this.ShowToast(data.msg);
    }

  }
  private list;
  private slist;
  private order;
}
