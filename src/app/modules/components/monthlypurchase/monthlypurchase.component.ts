import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../services/admin.service';
import { Papa } from 'ngx-papaparse';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';

interface ProductsElements {
  position: number;
  purchaseDate: string;
  supplierName: string;
  supplierGstNumber: number;
  billNumber: number;
  goodsAmount: number;
  igst: number;
  cgst: number;
  sgst: number;
  TCS: number;
  finalAmount: number;
  roundUpAmount: number;
}

@Component({
  selector: 'app-monthlypurchase',
  templateUrl: './monthlypurchase.component.html',
  styleUrls: ['./monthlypurchase.component.css'],
  providers: [DatePipe]
})
export class MonthlypurchaseComponent implements OnInit {
  displayedColumns: string[] = [
    'position', 'purchaseDate', 'supplierName', 'supplierGstNumber', 'billNumber',
    'goodsAmount', 'igst', 'cgst', 'sgst', 'TCS', 'finalAmount', 'roundUpAmount'
  ];
  dataSource = new MatTableDataSource<ProductsElements>([]);
  
  today_date: any = ""

  isDataLoaded: Boolean = false;
   
  purchase = {
    purchaseId: 0
  }
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private adminService: AdminService,
    private papa: Papa,
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
  
  
  



 

  






  onSubmit() {
    if (this.form.valid) {
      const transformedData = this.transformPurchaseData();
  
      console.log('Sending data to backend:', transformedData);
  
      this.adminService.monthlyPurchaseSummary(transformedData).subscribe(
        res => {
          console.log('Response from backend:', res);
          this.isDataLoaded = true;
          if (res && res.length > 0) {
            // Set position for each element
          res.forEach((element: { position: any; }, index: number) => {
            element.position = index + 1;
          });
            this.dataSource.data = res; // Update the table with the response data
            this.toastr.success("Data fetched successfully.", "Success");
            // Store the data in sessionStorage
            // sessionStorage.setItem('monthlyPurchaseData', JSON.stringify(res));
          } else {
            this.dataSource.data = []; // Clear the table if no data
            this.toastr.info("No data found for the selected dates.", "Info");
            // Clear the sessionStorage
            sessionStorage.removeItem('monthlyPurchaseData');
          }
        },
        error => {
          console.error('Error occurred:', error);
          this.toastr.error("Failed to fetch data. Please try again.", "Error");
        }
      );
    } else {
      this.toastr.warning('Please fill out all required fields.');
    }
  }

  
  
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadPDF() {
    const doc = new jsPDF();
    doc.text('Product List', 10, 10);
    // Set column widths
  // const columnWidths = [10, 30, 30, 30, 20, 30, 20, 20, 20, 20, 30, 30];

    (doc as any).autoTable({
      head: [['No.', 'Date', 'PartyName', 'GSTNO', 'BillNO', 'GoodsAMT', 'IGST', 'CGST', 'SGST', 'TCS', 'BillAmt', 'RoundUpAMT']],
      body: this.dataSource.data.map(element => [
        element.position, element.purchaseDate, element.supplierName, element.supplierGstNumber, element.billNumber,
        element.goodsAmount, element.igst, element.cgst, element.sgst, element.TCS, element.finalAmount, element.roundUpAmount
      ])
    });
    doc.save('product-list.pdf');
  }

  downloadCSV() {
    const csvData = this.dataSource.data.map(element => ({
      No: element.position,
      Date: element.purchaseDate,
      PartyName: element.supplierName,
      GSTNO: element.supplierGstNumber,
      BillNO: element.billNumber,
      GoodsAMT: element.goodsAmount,
      IGST: element.igst,
      CGST: element.cgst,
      SGST: element.sgst,
      TCS: element.TCS,
      BillAmt: element.finalAmount,
      RoundUpAMT: element.roundUpAmount
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
