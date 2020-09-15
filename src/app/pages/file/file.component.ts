import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalService } from '../../modal/modal.service';
import { ImgPath, LastEntries, PORT_CLIENT, SERV, PORT } from 'app/app.component';
//import { Router } from '@angular/router';
import { ServerApiService } from '../../servises/server-api.service';
import { ToastrService } from "ngx-toastr";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'file-cmp',
    moduleId: module.id,
    templateUrl: 'file.component.html',
    providers: [ServerApiService]
})

export class FileComponent implements OnInit{
    directory:string;
    ImgPath:string = ImgPath;
    img_file:number = 0;
    files:string[]=[];
    word_viewer:string;
    url: string = '';
    urlSafe: SafeResourceUrl;
    filesExist = false;
    fileName = '';
    constructor(
        public sanitizer: DomSanitizer, 
        private modalService: ModalService,
        private toastr: ToastrService,
        private ServerApiService: ServerApiService
      ) {
        let str = sessionStorage.getItem("individual2edit");
        let lastEntrie:LastEntries = JSON.parse(str);
        this.directory = 'person'+lastEntrie.person_id;
    }
    // modal window
    openModal(id: string) {
        this.modalService.open(id);
    }
    closeModal(id: string) {
        this.modalService.close(id);
    }
    //Angular get file block
    fileData: File = null;
    previewUrl:any = null;
    previewText:any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;

    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        if (this.fileData) {
            var reader = new FileReader();      
            reader.readAsDataURL(this.fileData); 
            reader.onload = (_event) => { 
                this.previewUrl = reader.result;
            }
        }
    }

    showFile (file_name) {
        this.previewUrl = 'http://'+SERV+':'+PORT+'/files/'+this.directory+'/'+file_name
        if (
            file_name.indexOf('jpg') !== -1 || 
            file_name.indexOf('png') !== -1
        ) {
            this.img_file = 2;
        } else if (file_name.indexOf('pdf') !== -1) {
            this.img_file = 1;
        } else if (
            file_name.indexOf('doc') !== -1 ||
            file_name.indexOf('docx') !== -1 ||
            file_name.indexOf('ppt') !== -1 ||
            file_name.indexOf('pptx') !== -1 ||
            file_name.indexOf('xls') !== -1 ||
            file_name.indexOf('xlsx') !== -1 
        ) {
            this.url = 'https://docs.google.com/gview?url='+this.previewUrl+'&embedded=true';
            this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
            this.img_file = 4;
        } else this.img_file = 0;
        this.openModal('custom-modal-3');  
    }
    
    ChangingValue() {}
    ngOnInit() {
        this.readDirByName(this.directory);
    }

    readFileBase64(dir_name,  file_name, callback) {
        console.log('readFileBase64');
        if (dir_name.length>0 && file_name.length>0) {
            let fileData2Server = { 
                filename: {
                    dir_name:   dir_name,
                    file_name:  file_name,
                    file_type:  '',
                },
                blob: {
                    file_blob: ''
                }
            }
            let strData = JSON.stringify(fileData2Server);
            this.ServerApiService.fetchReadFileBase64(strData)
            .subscribe((data)=>{
                console.log(data);
                callback(data);

            }, (error) => {
                console.log('error :',error);
                callback(null);
            });
        }
    }

    readDirByName(userData) {
        //console.log('readDirByName',userData);
        if (userData) {
            this.files = [];
            let fileData2Server = { 
                filename: {
                    dir_name:   ''+userData,
                    file_name:  '',
                    file_type:  '',
                },
                blob: {
                    file_blob: ''
                }
            }
            let strData = JSON.stringify(fileData2Server);
            this.ServerApiService.fetchReadDirByName(strData)
            .subscribe((data:{dir_name: string, files_list: string[]})=>{
                console.log(data);
                if (data.files_list) {
                    for (let i=0; i<data.files_list.length; i++) {
                        this.files.push(data.files_list[i]);
                    }
                    this.filesExist = true;
                } else this.filesExist = false;
            }, (error) => {
                console.log('error :',error);
            });
        }
    }
    writeFileBase64() {
        console.log('writeFileBase64');
        // Process checkout data here
        if (this.previewUrl == null) {
            this.toastr.warning(
                '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Select File First</span>',"",
                {
                    timeOut: 2000,
                    closeButton: true,
                    enableHtml: true,
                    toastClass: "alert alert-warning alert-with-icon",
                    positionClass: "toast-top-center"
                }
            );
            return;
        }
        let blob: any = null;
        if (this.img_file === 3) {
            blob = "data:text/rtf;base64,"+ btoa(this.previewText);
        } else {
            blob = this.previewUrl;
        }
        let fileData2Server = { 
            filename: {
                dir_name:   this.directory,
                file_name:  this.fileData.name,
                file_type:  this.fileData.type,
            },
            blob: {
                file_blob: blob
            }
        }
        let strData = JSON.stringify(fileData2Server);
        this.ServerApiService.fetchwriteFileBase64(strData)
        .subscribe((data:{result: string, file: string} )=>{
            //CLEAN FIELD!!!!
            this.fileName = '';
            this.readDirByName(this.directory);
            this.toastr.success(
                '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">File saved'+data.file+'</span>',"",{
                  timeOut: 3000,
                  closeButton: true,
                  enableHtml: true,
                  toastClass: "alert alert-success alert-with-icon",
                  positionClass: "toast-top-center"
                }
              );
        }, (error) => {
            console.log(error);
        });
        //this.userForm.reset();
    }
}


//word
//data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,
//.pptx
//data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,
//.xlsx
//data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,
//.jpg
//data:image/jpeg;base64,
//.pdf
//data:application/pdf;base64,