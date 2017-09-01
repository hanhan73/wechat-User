/**
 * Created by Administrator on 2017/7/3/003.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-code',
  templateUrl: 'code.html'
})

export class CodePage
{
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams)
  {
    //todo: 二维码图片链接，不能写死，要从服务端获取
  }
}
