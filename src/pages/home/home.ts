import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController,NavController, NavParams, ToastController, LoadingController, Slides } from 'ionic-angular';
import { TCommonPage } from '../basic-page';
import { SigninPage } from '../signin/signin'
import { TAuth } from '../services';
import { HomeService } from '../services';
import { RechargePage } from '../recharge/recharge';
import { TopupPage } from '../topup/topup';
import { SrechargePage } from '../srecharge/srecharge';
import { MysharePage } from  '../myshare/myshare';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends TCommonPage implements OnInit, OnDestroy
{
  @ViewChild(Slides) slides: Slides;
  constructor(
    public auth: TAuth,
    public service: HomeService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController)
  {
    super(navCtrl, navParams, loadingCtrl, toastCtrl);
    this.InitFuncItems();
    this.RefreshUserInfo();

  }

  ngOnInit(): void
  {
  }

  ngOnDestroy(): void
  {
  }

  /**
   * 初始化 用户信息
   *====================================================================================================================
   */
  RefreshUserInfo()
  {
    this.service.CheckUser().then(
      data => this.GetUserInfo(data),
      error => console.log(error)
    );
  }

  GetUserInfo(data)
  {
    if (data.status == 1)
    {
        this.Userdata = data.data;
        this.MyPortrait = this.Userdata.headimg;
        this.point = this.Userdata.credit;
        this.signed = this.Userdata.mark == 1;
        if (this.signed)
        {
          this.SignBtnName = "已签到";
        }
        else
        {
          this.SignBtnName = "签到领积分";
        }

        this.GetDeviceList();
    }
    else
    {
      //该分支正常不会执行到此处.
      this.ShowToast('请求数据异常!');
    }
  }

  Sign()
  {
    //签到
    if (this.signed)
    {
      this.OpenSignPage();
    }
    else
    {
      this.auth.Sign().then(
        data => {
          console.log(data);
          this.RefreshUserInfo();
          if (data.status == 1)
          {
            this.OpenSignPage();
          }
          else
          {
            this.ShowToast(data);
          }
        },
        error => console.log(error)
      );
    }

  }

  GetDeviceList()
  {
    this.service.GetDeviceList().then(
      data => {
        if (data.status == 1)
        {
          this.deviceInfo = data.data;
        }
      },
      error => console.log(error)
    );
  }

  BindingDevice(id)
  {
    this.service.UnbindingDevice(id).then(
      data => {
        if (data.status == 1)
        {
          this.ShowToast('解除成功!');
          this.RefreshUserInfo();
        }
        else
        {
          this.ShowToast('解除失败!');
          console.log(data.msg);
        }
      },
      error => console.log(error)
    );
  }

  GetDeviceFlow(item) {
    let result = item.detail.total_flow - item.detail.used_flow;
    if ( result >= 1024 ) {
      result = result/1024;
      return result + 'G';
    }
    else {
      return result + 'M';
    }

  }

  HasbindedDevice()
  {
    return this.deviceInfo.length > 0;
  }

  OpenSignPage()
  {
    this.navCtrl.push(SigninPage, {point: this.point});
  }

  /*
  跳转充值记录页面
   */
  OpenOrderListPage() {
    this.navCtrl.push(RechargePage);
  }
  /*
  跳转充值页面
   */
  OpenChargePage(iccid) {
    this.navCtrl.push(TopupPage, {item:iccid});
  }

  /*
  跳转查询充值页面
   */
  OpenSearchPage() {
    this.navCtrl.push(SrechargePage);
  }

  /*
   跳转我的分润页面
   */
  OpenMySharePage() {
    this.navCtrl.push(MysharePage);
  }

  InitFuncItems()
  {
    this.FuncItems.push(
      {
        "name": '查询充值',
        "src": 'assets/icon/hot.svg',
        "tag": 0
      }
    );

    this.FuncItems.push(
      {
        "name": '我的分润',
        "src": '../../assets/icon/fenrun.svg',
        "tag": 1
      }
    );

    this.FuncItems.push(
      {
        "name": '进入商店',
        "src": 'assets/icon/shop.svg',
        "tag": 2
      }
    );

    this.FuncItems.push(
      {
        "name": '网络测速',
        "src": 'assets/icon/wangluo.svg',
        "tag": 3
      }
    );

    this.FuncItems.push(
      {
        "name": '我的车机',
        "src": 'assets/icon/C-CAR.svg',
        "tag": 4
      }
    );

    this.FuncItems.push(
      {
        "name": '充值记录',
        "src": 'assets/icon/recharge.svg',
        "tag": 5
      }
    );

    this.FuncItems.push(
      {
        "name": '我的相机',
        "src": 'assets/icon/photograph.svg',
        "tag": 6
      }
    );

    this.FuncItems.push(
      {
        "name": '录像',
        "src": 'assets/icon/consumption.svg',
        "tag": 7
      }
    );

  }

  FuncItemClick(item)
  {
    switch(item.tag)
    {
      case 0: this.OpenSearchPage(); break;
      case 1: this.OpenMySharePage(); break;
      case 5: this.OpenOrderListPage(); break;
      default: this.ShowToast(item.name +'还在维护，敬请期待。', 3000, "bottom");
    }
  }

  slideChanged()
  {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    this.Play();
  }

  Play()
  {
    this.played = true;
    setTimeout(() => {
      this.played = false;
    }, 1000);
  }

  inputChanged(ev: any)
  {
    console.log('input.....');
  }

  showProompt(id) {
    let prompt = this.alertCtrl.create({
      title: '解绑设备',
      message: "您确定解绑此ICCID吗？",

      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: data => {
            this.BindingDevice(id);
          }
        }
      ]
    });
    prompt.present();
  }

  // private input_text;
  private FuncItems = [];
  private played = false;
  private signed = false;
  private point: number;
  private MyPortrait: string;
  private SignBtnName: string = '签到领积分';
  private deviceInfo = [];
  private Userdata;
}
