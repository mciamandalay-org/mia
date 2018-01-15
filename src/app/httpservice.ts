import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs';

@Injectable()
export class HttpService {
    constructor(public http: Http) { }
    getData(API: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let header = new Headers();
            header.append('Content-Type', 'application/json');

            this.http.get('http://mia.mciamandalay.org/core/api/' + API).map(res => res.json()).subscribe(
                rdata => { resolve(rdata) },
                err => { reject(err) },
                () => { });
        });
    }

    postData(API: string, postobj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let header = new Headers();
            header.append('Content-Type', 'application/json');
            this.http.post('http://mia.mciamandalay.org/core/api/' + API, JSON.stringify(postobj), { headers: header, method: 'post' }).subscribe(
                rdata => { resolve(rdata) },
                err => { reject(err) },
                () => { });
        });
    }

    deleteData(API: string, postobj:string): Promise<any> {
        return new Promise((resolve, reject) => {
            let header = new Headers();
            header.append('Content-Type', 'application/json');
            this.http.delete('http://mia.mciamandalay.org/core/api/' + API+'/'+postobj, { headers: header, method: 'delete' }).subscribe(
                rdata => { resolve(rdata) },
                err => { reject(err) },
                () => { });
        });
    }
}