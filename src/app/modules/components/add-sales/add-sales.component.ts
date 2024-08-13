import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

interface Sales {
  position: number;
  productId: string;
  quantity: number;
  date: string;
  price: number;
  sGST: number;
  cGST: number;
  iGST: number;
  Billno: string;
}

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
  styleUrls: ['./add-sales.component.css']
})
export class AddSalesComponent implements OnInit {
  purchaseIds: string[] = [];
  productQty: number[] = [];
  totalSaleAmount: number = 0;
  totalSaleQty: number = 0;
  SGST: number[] = [];
  CGST: number[] = [];
  IGST: number[] = [];
  Price: number[] = [];
  form: FormGroup;
  purchaseDataSource = new MatTableDataSource<Sales>();
  purchaseDisplayedColumns: string[] = ['position', 'productId', 'quantity', 'sGST', 'cGST', 'iGST', 'Billno', 'date', 'price'];
  saleCounter: number = 1;
  Billno: any;

  // @ViewChild('productId', { static: false }) productId!: ElementRef;

  constructor(
    private service: AdminService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      purchaseId: [''],
      productCategory: [''],
      unit_price: [''],
      productId: [''],
      productName: [''],
      // productCost: [''],
      quantity: [''],
      Billno: [''],
      SaleDate: [new Date()],
      SalesQuantity: [''],
      SalesTotalAmount: [''],
      cGST: [''],
      iGST: [''],
      sGST: [''],
      price: [''],
      name: [''],
      address: [''],
    });
  }

  saleData = {
    products: [] as { productId: string }[],
    productQuantity: [] as { productQty: number }[],
    totalSaleQuantity: 0,
    totalSaleAmount: 0,
    sGST: 0,
    cGST: 0,
    iGST: 0,
    customer: {
      customerName: "",
     
      
      customerAddress: "",
    }
  };

  suppliers = [
    {
      supplierId: "",
      supplierName: "",
      supplierEmail: "",
      supplierContact: "",
      supplierAddress: ""
    }
  ];

  products = [];

  loadedProducts = [
    {
      productId: "",
      productName: "",
      productCategory: "",
      productHSNNo: "",
      productPrice: "",
      productUnitType: ""
    }
  ];

  product = {
    productId: 0,
    productName: "",
    productCategory: "",
    productHSNNo: "",
    productPrice: "",
    productUnitType: ""
  };

  loadedSignleProduct = {
    productId: 0,
    productName: "",
    productCategory: "",
    productHSNNo: "",
    productPrice: "",
    productUnitType: ""
  }

  purchase = {
    purchaseId: 0
  };

  ngOnInit() {
    this.service.getSuppliers().subscribe(res => {
      if (res !== null) {
        this.suppliers = res;
      }
    });

    this.form.get('quantity')?.valueChanges.subscribe(() => this.calculateTotalPrice());

    this.service.getAllProductsCategory().subscribe(res => {
      if (res !== null) {
        this.products = res;
      }
    });
  }

  @ViewChild('productId') productId!: ElementRef;
  addSales() {
    // if (!this.productId || !this.productId.nativeElement) {
    //   this.toast.error("Product ID element is not defined", "Error");
    //   return;
    // }

    const newSales: Sales = {
      position: this.saleCounter++,
      productId: this.productId.nativeElement.value,
      quantity: parseInt(this.form.value.SalesQuantity),
      sGST: parseInt(this.form.value.sGST),
      cGST: parseInt(this.form.value.cGST),
      iGST: parseInt(this.form.value.iGST),
      price: parseFloat(this.form.value.price),
      Billno: this.form.value.Billno,
      date: this.formatDate(this.form.value.SaleDate),
    };

    this.purchaseDataSource.data = [...this.purchaseDataSource.data, newSales];
    this.purchaseIds.push(newSales.productId);
    this.productQty.push(newSales.quantity);
    this.SGST.push(newSales.sGST);
    this.CGST.push(newSales.cGST);
    this.IGST.push(newSales.iGST);
    this.Price.push(newSales.price);
    this.Billno.push(newSales.Billno);
    

    this.resetForm();
    this.calculateTotalPrice();
  }

  resetForm() {
    this.form.reset({
      SaleDate: new Date() // Reset date to current date
    });
  }

  getTotalSaleCost() {
    return this.purchaseDataSource.data.reduce((acc, sale) => acc + sale.price, 0);
  }

  getTotalSaleQty() {
    return this.purchaseDataSource.data.reduce((acc, sale) => acc + sale.quantity, 0);
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  calculateTotalPrice() {
    const unitPrice = parseFloat(this.form.value.unit_price) || 0;
    const quantity = parseFloat(this.form.value.SalesQuantity) || 0;
    const totalPrice = unitPrice * quantity;
    this.form.get('price')?.setValue(totalPrice.toFixed(2), { emitEvent: false });
  }

  loadProductByCategory() {
    const productCategory = this.form.get('productCategory')?.value;
    this.service.getProductByProductCategory(productCategory).subscribe(res => {
      this.loadedProducts = res;
    });
  }

  loadProductById() {
    const productId = this.form.get('productName')?.value;

    this.service.getSignleProductByProductId(productId).subscribe(res => {
      this.loadedSignleProduct = res;
    }, err => {
      console.log(err);
      alert(err);
    });
  }


  onFormChanges(): void {
    this.form.get('cGST')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('iGST')?.setValue('');
      }
    });

    this.form.get('sGST')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('iGST')?.setValue('');
      }
    });

    this.form.get('iGST')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('cGST')?.setValue('');
        this.form.get('sGST')?.setValue('');
      }
    });
  }











  transformPurchaseData() {
    console.log('Form Values:', this.form.value);
    console.log('DataSource Values:', this.purchaseDataSource.data);
  
    const transformedData = {
      saleProducts: this.purchaseDataSource.data.map(sales => ({
        product: {
          productId: +sales.productId
        },
        productQuantity: sales.quantity,
        cgst: sales.cGST || 0,
        sgst: sales.sGST || 0,
        igst: sales.iGST || 0 // Ensure igst is included, set default to 0 if null/undefined
      })),
      customerName: this.form.value.name || '', 
      customerAddress: this.form.value.address || '', 
      saleDate: this.formatDate(this.form.value.SaleDate),
      sellerGstNumber: this.form.value.sellerGstNumber || '',
      billNumber: this.form.value.Billno || '' // Change Billno to billNumber
    };
  
    console.log('Transformed Data:', transformedData);
    return transformedData;
  }
  

  submitForm() {
    const transformedData = this.transformPurchaseData();

    console.log('Sending data to backend:', transformedData);

    this.service.saleProduct(transformedData).subscribe(
      res => {
        console.log('Response from backend:', res);
        if (res) {
          this.purchaseDataSource.data = [];
          // this.router.navigate(['/admin-dashboard/show-purchases']);
          this.toast.success("New purchase added to your inventory.", "Sales Created.");
        }
      },
      error => {
        console.error('Error occurred:', error);
        this.toast.info("New purchase initiation failed. Please try again.", "Purchase Failed.");
      }
    );
  }


  
}

