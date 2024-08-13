
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import BASE_URL from '../../auth/services/helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private http:HttpClient) { }

  public addProduct(data: any): Observable<any> {
    return this.http.post(BASE_URL + "/product/addProduct", data);
  }

  // public getLastProduct(): Observable<any> {
  //   return this.http.get(BASE_URL + "/product/getLastProduct");
  // }

  public purchaseProduct(data: any): Observable<any> {
    return this.http.post(BASE_URL + "/purchase/purchaseProduct", data);
  }

  public addSupplier(data: any): Observable<any> {
    return this.http.post(BASE_URL + "/supplier/addSupplier", data);
  }

  public addSales(data: any): Observable<any> {
    return this.http.post(BASE_URL + "/sales/addSales", data);
  }

  public getStockByProductId(id:any):Observable<any>{
    return this.http.get(BASE_URL + `/stock/getStockByProductId/${id}`);
  }

  public getSignleProductByProductId(id:any): Observable<any> {
    return this.http.get(BASE_URL + `/product/getSignleProductByProductId/${id}`);
  }

  
  public getSuppliers(): Observable<any> {
    return this.http.get(BASE_URL + "/supplier/getSuppliers");
  }
  
  public getSuppliersByName(name: any): Observable<any> {
    return this.http.post(BASE_URL + "/supplier/getSuppliersByName", name);
  }

  public getSuppliersByContact(contact: any): Observable<any> {
    return this.http.post(BASE_URL + "/supplier/getSupplierByContact", contact);
  }

  
  public getAllProducts(): Observable<any> {
    return this.http.get(BASE_URL + "/product/getProducts");
  }

  public getProductByProductCategory(category:any): Observable<any> {
    return this.http.get(BASE_URL + `/product/getProductByProductCategory/${category}`);
  }
  public getAllProductsCategory(): Observable<any> {
    return this.http.get(BASE_URL + "/product/getAllProductsCategory");
  }

  public saleProduct(data: any): Observable<any> {
    return this.http.post(BASE_URL + "/sale/saleProduct", data);
  }
  
  public monthlyPurchaseSummary(data: any): Observable<any> {
    return this.http.post(BASE_URL + "/purchase/monthlyPurchaseSummary", data);
  }

  public monthlySaleSummary(data: any): Observable<any> {
    return this.http.post(BASE_URL + "/sale/monthlySaleSummary", data);
  }



  // public getLastPurchase(): Observable<any> {
  //   return this.http.get(BASE_URL + "/purchase/getLastPurchase");
  // }
}

