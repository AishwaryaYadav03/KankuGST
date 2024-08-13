import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {

  constructor(
    private service: AdminService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private router: Router
  ) { }

  
  form  = new FormGroup({
    productName: new FormControl(''),
    productCategory: new FormControl(''),
    productHSNNo: new FormControl(''),
    productPrice: new FormControl(''),
    productUnitType:new FormControl('')

  });



  ngOnInit(): void {
    this.form = this.formBuilder.group({
      productName: ["", [Validators.required]],
      productHSNNo: ["", [Validators.required]],
      productPrice: ["", [Validators.required]],
      productCategory: ["", [Validators.required]],
      productUnitType: ["", [Validators.required]]
     
    });

  }
  products = {
    productId: "",
    productName: "",
    productHSNNo: "",
    productDescription: "",
    productCategory: "",
    productCost: "",
    productDate: "",
    // productImage: ""
  }

 

  

  resetForm() {
    this.form.reset();
  }

  formSubmit() {
    alert(JSON.stringify(this.form.value));

    if (this.form.value) {
      this.service.addProduct(this.form.value).subscribe(res => {
        this.toast.success('Product added successfully:', 'Product Added');
        // this.form.reset();
        // this.router.navigate(['/admin-dashboard/add-purchase']);
      }, error => {
        this.toast.error('Error adding product:', "Failed!");
      });
    }
  }


}







