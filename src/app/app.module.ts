import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProductComponent } from './modules/components/add-product/add-product.component';
import { AddPurchaseComponent } from './modules/components/add-purchase/add-purchase.component';
import { AddSalesComponent } from './modules/components/add-sales/add-sales.component';
import { AddSupplierComponent } from './modules/components/add-supplier/add-supplier.component';
import { MonthlyComponent } from './modules/components/monthly/monthly.component';
import { AdminDashboardComponent } from './modules/components/admin-dashboard/admin-dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminNavbarComponent } from './modules/components/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from './modules/components/admin-sidebar/admin-sidebar.component';
import { ToastrModule } from 'ngx-toastr'

// Angular Material Modules
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth/guards/auth.guard';
import { authInterceptor } from './auth/services/auth.interceptor';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { MonthlypurchaseComponent } from './modules/components/monthlypurchase/monthlypurchase.component';
import { AdminHomeComponent } from './modules/components/admin-home/admin-home.component';
import { PurchaseBillComponent } from './modules/components/purchase-bill/purchase-bill.component';
@NgModule({
  declarations: [
    AppComponent,
  

    AddProductComponent,
    AddPurchaseComponent,
    AddSalesComponent,
    AddSupplierComponent,
    MonthlyComponent,
    AdminDashboardComponent,
    AdminNavbarComponent,
    AdminSidebarComponent,
    SignInComponent,
    SignUpComponent,
    MonthlypurchaseComponent,
    AdminHomeComponent,
    PurchaseBillComponent,
   

   
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatDatepickerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatPaginatorModule,
    MatDialogModule,
    HttpClientModule,
    
    
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    authInterceptor,
    
    
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
