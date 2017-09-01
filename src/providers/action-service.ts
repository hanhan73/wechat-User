/**
 * Created by Administrator on 2017/8/10/010.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TBasicService } from '../providers/basic-service';
import { TAuth } from '../providers/auth';

@Injectable()
export class ActionService extends TBasicService {
  constructor(public http: Http, public auth: TAuth) {
    super(http);
  }
  /**
   * 激活设备页面  action
   * =================================================================================================
   */
  ActivateOrder() {
    console.log('this is activateOrder !')
    let data = {};
    data['iccid'] = this.auth.iccid;
    console.log(data);
    return this.Put(data,'scan_code_activation');
  }
}
