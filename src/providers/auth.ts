import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TBasicService } from '../providers/basic-service';
import { LoadingController, ToastController } from 'ionic-angular';
@Injectable()
export class TAuth extends TBasicService
{
  constructor(public http: Http,public loadingCtrl: LoadingController,
  public toastCtrl: ToastController)
  {
    super(http);
  }

  get state(): string
  {
    return localStorage.getItem('state');
  }

  set state(value: string)
  {
    localStorage.setItem('state', value);
  }

  get openid(): string
  {
    return localStorage.getItem("openid");
  }

  set openid(value: string)
  {
    localStorage.setItem("openid", value);
  }

  get iccid(): string
  {
    return localStorage.getItem("iccid");
  }

  set iccid(value: string)
  {
    localStorage.setItem("iccid", value);
  }
  get genre(): any
  {
    return localStorage.getItem("genre");
  }

  set genre(value: any)
  {
    localStorage.setItem("genre", value);
  }

  GetRequestParam(url)
  {
    localStorage.removeItem('openid');
    if (url)
    {
        let idx = url.indexOf("?");
        if (idx != -1)
        {
            let uri = url.slice(idx + 1);
            uri = uri.split("&");
            // console.log(uri)
            for (let param of uri)
            {
              let p = param.split('=');
              if (p.length > 1)
              {
                let param_name = p[0];
                let param_value = p[1];
                console.log(param_name+'====='+param_value);
                localStorage.setItem(param_name, param_value);
              }
            }
        }
    }
  }

  login()
  {
      let param = {"username":this.openid};
      console.log(this.openid)
      return this.Post(param, 'login2');
  }

  logout()
  {
    localStorage.removeItem('token');
  }

  has_logon(): Boolean
  {
    return localStorage.getItem('token') != undefined;
  }
  //签到
  Sign() {
    let data = {};
    data['openid'] = this.openid;
    return this.Put(data,'sign');

  }

  RegisterUser(Phonenum,mycode: number) {
    let data = {};
    data['openid'] = this.openid;
    data['mobile_no'] = Phonenum;
    data['code'] = mycode;
    return this.Post(data, 'customer');

  }

  SendCode(Phonenum) {
    return this.Get('get_code/'+Phonenum);
  }

  IfNewUser() {
    console.log('this is Check_customer');
    let data = {};
    data['openid'] = this.openid;
    return this.Put(data,'check_customer');

  }

  /**
   * 签到页面  获取已签到日期
   * =================================================================================================
   */
   GetsignTime() {
     let data={};
     return this.Put(data,'sign_list')
   }

  public UserInfo;
  // public Reged: Boolean;


}
