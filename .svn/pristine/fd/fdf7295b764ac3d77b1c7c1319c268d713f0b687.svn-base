import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TBasicService } from '../providers/basic-service';

@Injectable()
export class TopupService extends TBasicService
{
  constructor(public http: Http)
  {
    super(http);
  }

  GetOrderList(iccid) {
    console.log(iccid);
    let data = {};
    data['iccid'] = iccid;
    console.log('this is GetOrderList');
    return this.Put(data, 'wx_price_list')

  }
  /*
   创建充值订单
   */
  CreateOrder(iccid, id, price, openid) {
    console.log('this is GetOrderList');
    let data = {};
    data['iccid'] = iccid;
    data['openid'] = openid;
    data['price_list_id'] = id;
    data['price'] = price;
    return this.Post(data,'recharge');
  }

}
