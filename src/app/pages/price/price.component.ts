import { Component } from '@angular/core';
//import { FormBuilder } from '@angular/forms';
import * as _ from "underscore";
import { ModalService } from '../../modal/modal.service';
import { ProductGroup, Product } from 'app/app.component';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'price-cmp',
  moduleId: module.id,
  templateUrl: 'price.component.html',
}) 

export class PriceComponent { 
  personForm;
  submitted = false;
  product_groups:ProductGroup[]=[];
  product_group:ProductGroup;
  products_all:Product[]=[]; 
  products :Product[]=[];
  product :Product;
  singleCourse:boolean = false;

  constructor(
    //private formBuilder: FormBuilder,
    private modalService: ModalService,
  ) {
    let str = sessionStorage.getItem("productgroup");
    this.product_groups = JSON.parse(str);
    this.product_group = this.product_groups[0];
    str = sessionStorage.getItem("product");
    this.products_all = JSON.parse(str);
    this.products = JSON.parse(str);
    this.product = this.products[0];
    this.personForm = new FormGroup({
      product_group_id: new FormControl(),
      product_id:       new FormControl()
    });
  }
  // modal window
  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
     // convenience getter for easy access to form fields
     //get f() { return this.personForm.controls; }
     ChangingProductGroup(prod_group) {
       if (+prod_group.target.value===6) {
         this.singleCourse = true;
       } else {
         this.singleCourse = false;
       }
       this.products = _.where(this.products_all, {
         product_group_id: +prod_group.target.value
       });
     }
     ChangingValue(e) {}
     //get f() { return this.findForm.controls; }
     showPrice() {
      this.product_group = _.findWhere(this.product_groups, {
        product_group_id: +this.personForm.value.product_group_id
      });
      if (+this.personForm.value.product_group_id === 6) {
        this.product = _.findWhere(this.products_all, {
          product_id: +this.personForm.value.product_id
        });
      }
      this.openModal('custom-modal-11');
     }


}
