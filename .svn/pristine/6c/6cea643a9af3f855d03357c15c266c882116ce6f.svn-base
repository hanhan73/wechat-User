/**
 * Created by Administrator on 2017/7/27/027.
 */
import { ElementRef ,Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { TCommonPage } from '../basic-page';
import { TAuth } from '../services';
import { TopupService } from '../services';
@Component({
  selector: 'page-myshare',
  templateUrl: 'myshare.html'
})

export class MysharePage extends TCommonPage {


  constructor(private el: ElementRef,
              public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public auth: TAuth, public top: TopupService) {
    super(navCtrl, navParams, loadingCtrl, toastCtrl);

  }

}
