/**
 * Created by Administrator on 2017/8/10/010.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TBasicService } from '../providers/basic-service';
import { TAuth } from '../providers/auth';

@Injectable()
export class SrechargeService extends TBasicService {
  constructor(public http: Http, public auth: TAuth) {
    super(http);
  }

  /**
   * 查询充值页面
   * srecharge
   * ================================================================================================================
   */
  QueryCard(iccid) {
    console.log(iccid)
    let data = {};
    data['iccid'] = iccid;
    return this.Put(data,'query_card');

  }

  QueryCardHistory() {
    return this.Get('input_history');
  }
  //改为服务端做  历史记录保存
  // AddInfo(iccid, dispalyid) {
  //   let data = {};
  //   data['iccid'] = iccid;
  //   data['display_iccid'] = dispalyid;
  //   return this.Post(data , 'input_history');
  //
  // }

}
