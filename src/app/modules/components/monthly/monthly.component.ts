import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { MatTableDataSource } from '@angular/material/table';
import { Papa } from 'ngx-papaparse';
import { DatePipe } from '@angular/common';

export interface ProductsElements {
  position: number;
  // productId: number;
  saleDate: string;
  saleBillNumber: number;
  paymentType: number;
  sallerGstNumber: number;
  goodsAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  finalAmount: number;
  roundUpAmount: number;
}

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrl: './monthly.component.css',
  providers: [DatePipe]
})
export class MonthlyComponent {

  



displayedColumns: string[] = ['position','saleDate', 'saleBillNumber', 'paymentType', 'sallerGstNumber', 'goodsAmount', 'cgstAmount', 'sgstAmount', 'igstAmount', 'finalAmount','roundUpAmount'];
products: ProductsElements[] = [];
dataSource = new MatTableDataSource<ProductsElements>([]);
today_date: any = ""



isDataLoaded: Boolean = false;

constructor(
  private papa: Papa,
  private service: AdminService,
  private formBuilder: FormBuilder,
  private toast: ToastrService,
  private router: Router,
  private datePipe: DatePipe
) {}

form:FormGroup = new FormGroup({
  "startDate" : new FormControl(''),
  "endDate" : new FormControl(''),
})

ngOnInit(): void {
  this.form = this.formBuilder.group({
    "startDate" : [new Date(), [Validators.required]],
    "endDate" : [new Date(), [Validators.required]],
   
  })
;


}

public getFormattedDate(): string {
  const today = new Date();
  return this.datePipe.transform(new Date(), 'M/d/yyyy') || '';
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}




transformPurchaseData() {
  const { startDate, endDate } = this.form.value;

  const transformedData = {
    startDate: startDate,
    endDate: endDate,
    purchaseProducts: this.dataSource.data
  };

  console.log('Transformed data:', transformedData);
  return transformedData;
}


onSubmitsale() {
  if (this.form.valid) {
    const transformedData = this.transformPurchaseData();

    console.log('Sending data to backend:', transformedData);

    this.service.monthlySaleSummary(transformedData).subscribe(
      res => {
        console.log('Response from backend:', res);
        this.isDataLoaded = true;

        if (res && res.length > 0) {
          // Set position for each element
          res.forEach((element: { position: any; }, index: number) => {
            element.position = index + 1;
          });
          this.dataSource.data = res; // Update the table with the response data
          this.toast.success("Data fetched successfully.", "Success");
        } else {
          this.dataSource.data = []; // Clear the table if no data
          this.toast.info("No data found for the selected dates.", "Info");
        }
      },
      error => {
        console.error('Error occurred:', error);
        this.toast.error("Failed to fetch data. Please try again.", "Error");
      }
    );
  } else {
    this.toast.warning('Please fill out all required fields.');
  }
}


downloadPDF() {
  const doc = new jsPDF();
  doc.text('Product List', 10, 10);
  (doc as any).autoTable({
    head: [['No.', 'Date', 'BillNo', 'cash', 'GSTNO', 'GoodsAMT', 'CGST', 'SGST','IGST', 'FinalAMT', 'RoundUpAMT']],
    body: this.dataSource.data.map(element => [
      element.position,
      element.saleDate,
      element.saleBillNumber,
      element.paymentType,
      element.sallerGstNumber,
      element.goodsAmount,
      element.cgstAmount,
      element.sgstAmount,
      element.igstAmount,
      element.finalAmount,
      element.roundUpAmount
    ])
  });
  doc.save('product-list.pdf');
}

downloadCSV() {
  const csvData = this.dataSource.data.map(element => ({
    No: element.position,
    Date: element.saleDate,
    BillNo: element.saleBillNumber,
    cash: element.paymentType,
    GSTNO: element.sallerGstNumber,
    GoodsAMT: element.goodsAmount,
    CGST: element.cgstAmount,
    SGST: element.sgstAmount,
    IGST: element.igstAmount,
    FinalAmt: element.finalAmount,
    roundUpAmount: element.roundUpAmount,

  }));
  const csv = this.papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'product-list.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

printTable() {
  const printContent = document.getElementsByTagName('table')[0].outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload();
}
}




