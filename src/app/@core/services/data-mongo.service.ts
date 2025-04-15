import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataMongoService {

  constructor(private http: HttpClient) {}
    private apiUrl = environment.apiBaseUrl;
    getAll(){
     return this.http.get<any>(this.apiUrl+'/event',{

      });
    }
    getById(id:any){
      return this.http.get<any>(this.apiUrl+'/event/'+id,{

      });
    }
    postEvent(data: any){
      return this.http.post<any>(this.apiUrl+'/event',data);
    }
    deleteEvent(id:any){
      return this.http.delete<any>(this.apiUrl+'/event/'+id,{

      });    }
    updateEvent(id:any,data:any){
      return this.http.put<any>(this.apiUrl+'/event/'+id,data

      );    }

}
