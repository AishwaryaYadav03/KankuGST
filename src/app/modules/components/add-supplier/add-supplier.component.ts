import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.css'
})
export class AddSupplierComponent {

  constructor(private service:AdminService,
              private formBuilder:FormBuilder,
              private toast:ToastrService,
              private router:Router

  ){}

  form  = new FormGroup({
    supplierName: new FormControl(''),
    supplierContact: new FormControl(''),
    supplierAddress: new FormControl(''),
    supplierGSTNo: new FormControl(''),
    
    


  });
  // products = {
  //   SupplierName: "",
  //   SupplierContact: "",
  //   SupplierAddress: "",
  //   SupplierGSTNo: "",
    
    
    
  // }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      supplierName: ["", [Validators.required]],
      supplierContact: ["", [Validators.required]],
      supplierAddress: ["", [Validators.required]],
      supplierGSTNo: ["", [Validators.required]]
     
          
    });
  }

  resetForm() {
    this.form.reset();
  }

  formSubmit() {
    // alert(JSON.stringify(this.form.value));
    if (this.form.valid) {
      this.service.addSupplier(this.form.value).subscribe(res => {
        this.toast.success('Product added successfully:', 'Product Added');
        this.form.reset();
        // this.router.navigate(['/admin-dashboard/show-data']);
      }, error => {
        this.toast.error('Error adding product:', "Failed!");
      });
    }
  }

  }
