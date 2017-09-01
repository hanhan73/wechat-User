import { Component } from '@angular/core';
import { LoadingController, IonicApp, App, MenuController } from 'ionic-angular';
import { PlatformLocation } from '@angular/common';
import { HomePage } from '../pages/home/home';
import { TAuth }  from '../providers/auth';
import { RegisterPage } from '../pages/register/register';
import { SrechargePage } from '../pages/srecharge/srecharge';
import { CodePage } from '../pages/code/code';
import { ActionPage } from '../pages/action/action'
// import { SigninPage } from '../pages/signin/signin';
// import { RechargePage } from "../pages/recharge/recharge";
// import { MysharePage } from "../pages/myshare/myshare";


@Component({
  templateUrl: 'app.html'
})

export class MyApp
{
  rootPage = undefined;
  loader = undefined;

  constructor(
    private Auth: TAuth,
    private loadingCtrl: LoadingController,
    private _app: App,
    private _ionicApp: IonicApp,
    private _menu: MenuController,
    location: PlatformLocation)
  {
    this.Loading();
    this.setupBackButtonBehavior();
    Auth.GetRequestParam(location.search);

    this.Auth.login().then(
      data => localStorage.setItem('token',data.token),
      error => console.log(error)
    );
    //判断是否微信用户
    this.Auth.IfNewUser().then(
      data => this.IsNewUser(data),
      error => console.log(error+'1212121')
    )
  }

  private setupBackButtonBehavior ()
  {
    //回退方法，临时称这么作，最后统一升级成@IonicPage写法
    // If on web version (browser)
    if (window.location.protocol !== "file:") {

      // Register browser back button action(s)
      window.onpopstate = (evt) => {

        // Close menu if open
        if (this._menu.isOpen()) {
          this._menu.close ();
          return;
        }

        // Close any active modals or overlays
        let activePortal = this._ionicApp._loadingPortal.getActive() ||
          this._ionicApp._modalPortal.getActive() ||
          this._ionicApp._toastPortal.getActive() ||
          this._ionicApp._overlayPortal.getActive();

        if (activePortal) {
          activePortal.dismiss();
          return;
        }

        // Navigate back
        if (this._app.getRootNav().canGoBack()) this._app.getRootNav().pop();

      };

      // Fake browser history on each view enter
      this._app.viewDidEnter.subscribe((app) => {
        history.pushState (null, null, "");
      });

    }

  }

  //初始化 调用请求是否为新用户的方法 customer/openid
  IsNewUser(data)
  {
    console.log(data);
    switch(data.status)
    {
      case -1:
        this.rootPage = CodePage;
        break;

      case 0:
        this.rootPage = RegisterPage;
        break;

      case 1:
        //判断是否有iccid
        let iccid = localStorage.getItem('iccid');
        let state = parseInt(localStorage.getItem('state'));

        if (iccid != null)
        {
          if (state == 1)
          {
            this.rootPage = ActionPage;
          }
          else
          {
            this.rootPage = SrechargePage;
          }
        }
        else
        {
          this.rootPage = HomePage; //首页
        }
    }

    this.FreeLoading();
  }

  Loading(context="数据加载中", duration=5000)
  {
      if (this.loadingCtrl != undefined)
      {
          this.loader = this.loadingCtrl.create(
              {
                  content: context,
                  duration: duration
              }
          );
          this.loader.present();
      }
  }

  FreeLoading()
  {
      if (this.loader != undefined)
      {
          this.loader.dismiss();
      }
  }

}

