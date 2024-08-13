import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

interface Purchase {
  position: number;
  productId: string;
  quantity: number;
  date: string;
  sGST:number;
  cGST:number;
  iGST:number;
  price:number;
  billNumber:string;
}

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {
  
  isSupplierInfoVisible: boolean = true;
  isPurchaseButtonVisible: boolean = false;
  isSupplierEmpty: boolean = true;
  purchaseIds: string[] = [];
  productQty: number[] = [];
  SGST: number[] = [];
  CGST: number[] = [];
  IGST: number[] = [];
  Price: number[] = [];
  // BillNumber:string[]=[];
  totalPrchaseQty: number = 0;
  form: FormGroup;
  purchaseDataSource = new MatTableDataSource<Purchase>();
  purchaseDisplayedColumns: string[] = ['position', 'productId', 'quantity','sGST','cGST','iGST','billNumber' ,'date','price'];
  purchaseCounter: number = 1;
  BillNumber: any;

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      purchaseId: [''],
      productQuantity: ['', Validators.required],
      productId: [''],
      productName: [''],
      productCategory: [''],
      totalPurchaseAmount: [''],
      quantity: ['', Validators.required],
      cGST: [0], // Default value
      iGST: [0], // Default value
      sGST: [0], // Default value
      purchaseDate: [new Date(), Validators.required],
      unit_price: ['', Validators.required],
      billNumber:[''],
      price: [''],
      customer: [''],
      contact: [''],
      GST: [''],
      address: [''],
    });

    this.onFormChanges();
  }

  purchaseData = {
    products: [] as { productId: string }[],
    productQuantity: [] as { productQty: number }[],
    totalPurchaseQuantity: 0,
    totalPurchaseAmount: 0,
    // billNumber: "", 
    sGST: 0,
    cGST: 0,
    iGST: 0,
    supplier: {
      supplierId: ""
    }
  }

  suppliers = [
    {
      supplierId: "",
      supplierName: "",
      supplierGSTNo: "",
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
  }

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
  }

  // isSupplierEmpty: Boolean = true;

  ngOnInit() {
    this.service.getSuppliers().subscribe(res => {
      if (res !== null) {
        this.suppliers = res;
      } else {
        this.isSupplierEmpty = false;
      }
    }, err => {
      this.isSupplierEmpty = false;
    });

    this.form.get('quantity')?.valueChanges.subscribe(() => this.calculateTotalPrice());

    this.service.getAllProductsCategory().subscribe(res => {
      if (res !== null) {
        this.products = res;
      }
    });
  }

  @ViewChild('productId') productId!: ElementRef;
  // @ViewChild('billNumber') billNumber!: ElementRef;

  addPurchase() {
    const newPurchase: Purchase = {
      position: this.purchaseCounter++,
      productId: this.productId.nativeElement.value,
      quantity: parseInt(this.form.value.productQuantity),
      sGST: parseInt(this.form.value.sGST),
      cGST: parseInt(this.form.value.cGST),
      iGST: parseInt(this.form.value.iGST),
      price: parseFloat(this.form.value.price),
      // billNumber:this.billNumber.nativeElement.value,
      billNumber:this.form.value.billNumber,
      date: this.formatDate(this.form.value.purchaseDate),
    };

    this.purchaseDataSource.data = [...this.purchaseDataSource.data, newPurchase];
    this.purchaseIds.push(newPurchase.productId);
    this.productQty.push(newPurchase.quantity);
    this.SGST.push(newPurchase.sGST);
    this.CGST.push(newPurchase.cGST);
    this.IGST.push(newPurchase.iGST);
    this.BillNumber.push(newPurchase.billNumber);
    this.Price.push(newPurchase.price);

    this.resetForm();
    this.calculateTotalPrice();
  }

  resetForm() {
    this.form.reset({
      purchaseDate: new Date()
    });
  }

  getTotalPurchaseQty() {
    return this.purchaseDataSource.data.reduce((acc, purchase) => acc + purchase.quantity, 0);
  }

  // getcGST() {
  //   return this.purchaseDataSource.data.reduce((acc, purchase) => acc + purchase.cGST, 0);
  // }

  // getsGST() {
  //   return this.purchaseDataSource.data.reduce((acc, purchase) => acc + purchase.sGST, 0);
  // }

  // getiGST() {
  //   return this.purchaseDataSource.data.reduce((acc, purchase) => acc + purchase.iGST, 0);
  // }

  // getbillNumber() {
  //   return this.purchaseDataSource.data.reduce((acc, purchase) => acc + purchase.billNumber, 0);
  // }

  getTotalPurchaseCost() {
    return this.purchaseDataSource.data.reduce((acc, purchase) => acc + purchase.price, 0);
  }

  formatDate(date: string): string {
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
    const quantity = parseFloat(this.form.value.productQuantity) || 0;
    const totalPrice = unitPrice * quantity;

    this.form.get('price')?.setValue(totalPrice.toFixed(2), { emitEvent: false });
  }

  sup2 = [{
    supplierId: "",
    supplierName: "",
    supplierGSTNo: "",
    supplierContact: "",
    supplierAddress: ""
  }]

  supplier = {
    supplierId: "",
    supplierName: "",
    supplierGSTNo: "",
    supplierContact: "",
    supplierAddress: ""
  }

  supplier2 = {
    supplierId: "",
    supplierName: "",
    supplierGSTNo: "",
    supplierContact: "",
    supplierAddress: ""
  }

  getSuppliersByName() {
    const supplierName = this.form.get('customer')?.value;
    this.supplier.supplierName = supplierName;
    this.service.getSuppliersByName(this.supplier).subscribe(res => {
      this.sup2 = res;
    });
    this.form.get('email')?.setValue("");
    this.form.get('address')?.setValue("");
  }

  getSuppliersByContact() {
    const supplierContact = this.form.get('contact')?.value;
    this.supplier.supplierContact = supplierContact;
    this.service.getSuppliersByContact(this.supplier).subscribe(res => {
      this.supplier2 = res;
    });
  }

  loadProductByCategory() {
    const productCategory = this.form.get('productCategory')?.value;
    this.service.getProductByProductCategory(productCategory).subscribe(res => {
      this.loadedProducts = res;
    });
  }

  @ViewChild('productUnitPriceInput') productUnitPriceInput!: ElementRef;

  loadProductById() {
    const productId = this.form.get('productName')?.value;

    this.service.getSignleProductByProductId(productId).subscribe(res => {
      this.loadedSignleProduct = res;
    }, err => {
      console.log(err);
      alert(err);
    });
  }

  productByName = {
    productName: ""
  }

  productResponse = {
    productId: 0,
    productName: "",
    productCategory: "",
    productHSNNo: "",
    productPrice: "",
    productUnitType: ""
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
    
    return {
      purchaseProducts: this.purchaseDataSource.data.map(purchase => ({
        product: {
          productId: +purchase.productId
        },
        productQuantity: purchase.quantity,
        cgst: purchase.cGST ,
        sgst: purchase.sGST,
        igst: purchase.iGST,
      })),
      supplier: {
        supplierId: +this.supplier2.supplierId
      },
      purchaseDate: this.formatDate(this.form.value.purchaseDate),
      // billNumber: this.form.get('billNumber')?.value || ''
      billNumber: this.form.value.billNumber || '' 
    };
  }

  viewPurchaseDetails(){
    this.router.navigate(['/admin-dashboard/purchase-bill'])
  }

  submitForm() {
    const transformedData = this.transformPurchaseData();

    console.log('Sending data to backend:', transformedData);

    this.service.purchaseProduct(transformedData).subscribe(
      res => {
        console.log('Response from backend:', res);
        if (res) {
          this.purchaseDataSource.data = [];
          // this.router.navigate(['/admin-dashboard/add-sales']);
          this.toast.success("New purchase added to your inventory.", "Purchase Created.");
         
        }

        this.isSupplierInfoVisible = false;
        this.isPurchaseButtonVisible = true;
      },
      error => {
        console.error('Error occurred:', error);
        this.toast.info("New purchase initiation failed. Please try again.", "Purchase Failed.");
      }
    );
  }
}
