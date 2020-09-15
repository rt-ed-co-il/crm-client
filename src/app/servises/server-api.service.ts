import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERV, PORT } from 'app/app.component';


@Injectable()
export class ServerApiService {
  constructor(private http: HttpClient) { }

  //STUDENT SEVER
  fetchNewStudent(student:string) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post('https://rt-students.xyz:8000/create-user' , student , httpOptions ); 
  } 
  //CRM SERVER
  fetchJobMaster(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/statistic/leads_jobmaster',data, httpOptions); 
  }  
  
  fetchLeadsReport(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/statistic/leads_report',data, httpOptions); 
  }  
  fetchReportInterval(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/statistic/report_interval',data, httpOptions); 
  }
  fetchPersonsByString(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/personsbystring',data, httpOptions); 
  }
  fetchPersonByPersonID(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/personbypersonid',data, httpOptions); 
  }
  fetchLeadByPersonID(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/leadbypersonid',data, httpOptions); 
  }
  fetchActionsByPersonID(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/actionsbypersonid',data, httpOptions); 
  }
  fetchReadFileBase64(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/file/readfilebase64',data, httpOptions); 
  }
  //NEW INDIVIDUAL
  fetchIndividualNew(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/individual/individualnew',data, httpOptions); 
  }
  fetchIndividualByEntyID(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/individual/individualbyentyid',data, httpOptions); 
  }
  fetchReadDirByName(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/file/readdirbyname',data, httpOptions); 
  }
  fetchwriteFileBase64(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/file/writefilebase64',data, httpOptions); 
  }
  
  fetchPersonUpdate(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/personupdate',data, httpOptions); 
  }
  fetchLeadUpdate(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/leadupdate',data, httpOptions); 
  }

  fetchActionUpdate(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/actionupdate',data, httpOptions); 
  }


  fetchSMSText(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/sms/smstext',data, httpOptions); 
  }

  fetchMailText(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/email/mailtext',data, httpOptions); 
  }

  fetchNewAction(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/actionnew',data, httpOptions); 
  }

  fetchNewContract(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/createcontract',data, httpOptions); 
  }

  fetchPersonNew(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/personnew',data, httpOptions); 
  }

  fetchLeadNew(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/person/leadnew',data, httpOptions); 
  }

  fetchNewUser(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/users/',data, httpOptions); 
  }

  fetchUpdateUser(data) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.post('http://'+SERV+':'+PORT+'/api/users/update',data, httpOptions); 
  }

  fetchGet(url) {
    let token:string = 'Token '+ sessionStorage.getItem('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': token
        })
    };
    return this.http.get('http://'+SERV+':'+PORT+'/api'+url, httpOptions);
  }


  fetchLogin(username:string, password:string) {
    let body:string = JSON.stringify({
      user: {
          email: username, 
          password: password
      }
    });
    
    const loginHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://'+SERV+':'+PORT+'/api/users/login', body, {headers:loginHeaders}); 
  }

}
