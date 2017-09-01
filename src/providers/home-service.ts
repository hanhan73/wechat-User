import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TBasicService } from '../providers/basic-service';
import { TAuth } from '../providers/auth';

@Injectable()
export class HomeService extends TBasicService
{
  constructor(public http: Http, public auth: TAuth) 
  {        
    super(http);
  }
  
  CheckUser()
  {
    let openid = this.auth.openid;
    let data = {"openid": openid};
    return this.Put(data, 'check_customer');    
  }
  
  GetDeviceList()
  {
    //获取设备列表
    return this.Get('devices');
  }

  BindingDevice(iccid)
  {
    //绑定设备
    let data = {"iccid": iccid};
    return this.Post(data, 'devices');
  }
  
  UnbindingDevice(id)
  {
    //解除绑定
    return this.Delete('devices/' + id);
  }
}
