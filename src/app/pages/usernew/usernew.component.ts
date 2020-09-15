import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators} from '@angular/forms';
import { UsersData, ImgPath } from 'app/app.component';
import { Router } from '@angular/router';
import { ServerApiService } from '../../servises/server-api.service';
import { MustMatch } from '../../servises//must-match.validator';


@Component({
    selector: 'user-new',
    moduleId: module.id,
    templateUrl: 'usernew.component.html',
    providers: [ServerApiService]
})

export class UserNewComponent implements OnInit{
    ImgPath:string = ImgPath;
    userForm;
    submitted = false;
    roles:string[] = ['branch','basic', 'supervisor', 'admin'];
    categoryes:string[] = ['manager', 'instructor', 'sales', 'marketing'];
    branches:String[]=['100','200','300'];
    img_file:number;
    UserErrorText:string;
    UserError:string;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private ServerApiService: ServerApiService
      ) {
        this.img_file = 0;
        this.userForm = this.formBuilder.group({
            first_name:     ['', Validators.required],
            last_name:      ['', Validators.required],
            category:       this.categoryes[0],
            role:           this.roles[0],
            branch:         this.branches[0],
            phone:          '',
            address:        '',
            photo:          '',
            email:          ['', [Validators.required, Validators.email]],
            rtuser:         ['', Validators.required],
            password:       ['', [Validators.required, Validators.minLength(6)]],
            passwordcheck:  ['', Validators.required]
        }, {
            validator: MustMatch('password', 'passwordcheck')
        }
        );
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

    // convenience getter for easy access to form fields
    get f() { return this.userForm.controls; }
    onSubmit(userData) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.userForm.invalid) {
            return;
        }
        // Process checkout data here
        let imgBlob: any = "";
        if (this.previewUrl) {
            imgBlob=this.previewUrl
        }
        let userData2Server = {
            user: {
                first_name: userData.first_name, 
                last_name:  userData.last_name,
                email:      userData.email,
                password:   userData.password,
                category:   userData.category,
                branch:     userData.branch,
                phone:      userData.phone,
                address:    userData.address,
                photo:      userData.photo,
                rtuser:     userData.rtuser,
                role:       userData.role,
            },
            photo: {
                img_blob: imgBlob
            }
        }
        console.log('User update:', userData2Server);
        let strData = JSON.stringify(userData2Server);
        this.ServerApiService.fetchNewUser(strData)
        .subscribe((data:UsersData)=>{
            console.log(data);
            this.UserError = '';
            this.ServerApiService.fetchGet('/users/userlist')
            .subscribe((data:UsersData[])=>{
              let st:string = JSON.stringify(data);
              sessionStorage.setItem('users',st);
            }, (error) => {
                console.log(error);
                this.UserError = "DB Users error :" + error.status;
                this.UserErrorText = error.statusText;
            });
        }, (error) => {
            console.log(error);
            this.UserError = "Users error :" + error.status;
            this.UserErrorText = error.error.reason;
    });
        //this.userForm.reset();
      }
}
