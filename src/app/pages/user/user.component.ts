import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UsersData, ImgPath } from 'app/app.component';
import { Router } from '@angular/router';
import { ServerApiService } from '../../servises/server-api.service';


@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
    providers: [ServerApiService]
})

export class UserComponent implements OnInit{
    ImgPath:string = ImgPath;
    userForm;
    user:UsersData = null;
    roles:string[] = ['branch','basic', 'supervisor', 'admin'];
    categoryes:string[] = ['manager', 'instructor', 'sales', 'marketing'];
    branches:String[]=['100','200','300'];
    img_file:number;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private ServerApiService: ServerApiService
      ) {
        let str:string = sessionStorage.getItem("user2edit");
        this.user = JSON.parse(str);
        if (this.user.photo) {this.img_file = 1} else {this.img_file = 0}
        this.userForm = this.formBuilder.group({
            _id:        this.user._id,
            first_name: this.user.first_name,
            last_name:  this.user.last_name,
            category:   this.user.category,
            role:       this.user.role,
            branch:     this.user.branch,
            phone:      this.user.phone,
            address:    this.user.address,
            photo:      this.user.photo,
            email:      this.user.email,
            rtuser:     this.user.rtuser,
        });
      }

    //Angular get file block
    fileData: File = null;
    previewUrl:any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        this.preview();
    }
    preview() {
        if (!this.fileData) {
            return;
        }
        var mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        var reader = new FileReader();      
        reader.readAsDataURL(this.fileData); 
        reader.onload = (_event) => { 
            this.img_file = 2;
            this.previewUrl = reader.result; 
        }
    }  //File block end

    ChangingValue(e) {}
    ngOnInit() {}
    cancel() {
        this.router.navigate(['/users']);
    }

    onSubmit(userData) {
        // Process checkout data here
        let imgBlob: any = "";
        if (this.previewUrl) {
            imgBlob=this.previewUrl
        }
        let userData2Server = {
            user: {
                _id: userData._id,
                first_name: userData.first_name, 
                last_name:  userData.last_name,
                email:      userData.email,
                category:   userData.category,
                branch:     userData.branch,
                phone:      userData.phone,
                address:    userData.address,
                photo:      userData.photo,
                rtuser:     userData.rtuser,
                role:       userData.role
            },
            photo: {
                img_blob: imgBlob
            }
        }
        console.log('User update:', userData2Server);

        let strData = JSON.stringify(userData2Server);
        this.ServerApiService.fetchUpdateUser(strData)
        .subscribe((data:UsersData)=>{
            console.log(data);
            this.ServerApiService.fetchGet('/users/userlist')
            .subscribe((data:UsersData[])=>{
              let st:string = JSON.stringify(data);
              sessionStorage.setItem('users',st);
            }, (error) => {
                console.log(error);
            //    this.loginError = "DB Meetings error :" + error.status;
            //    this.loginErrorText = error.statusText;
            });
        }, (error) => {
            console.log(error);
        //    this.loginError = "DB Meetings error :" + error.status;
        //    this.loginErrorText = error.statusText;
        });
        //this.userForm.reset();
      }
}
