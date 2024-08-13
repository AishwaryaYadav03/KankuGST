import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './modules/components/admin-dashboard/admin-dashboard.component';
import { AddProductComponent } from './modules/components/add-product/add-product.component';
import { AddPurchaseComponent } from './modules/components/add-purchase/add-purchase.component';
import { AddSalesComponent } from './modules/components/add-sales/add-sales.component';
import { AddSupplierComponent } from './modules/components/add-supplier/add-supplier.component';
import { MonthlyComponent } from './modules/components/monthly/monthly.component';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { MonthlypurchaseComponent } from './modules/components/monthlypurchase/monthlypurchase.component';
import { AdminHomeComponent } from './modules/components/admin-home/admin-home.component';
import { PurchaseBillComponent } from './modules/components/purchase-bill/purchase-bill.component';

const routes: Routes = [
  {
    path: '',
    component: SignInComponent
  },
  {
    path: 'registration',
    component: SignUpComponent
  },
  {
    path: 'admin-dashboard',
    canActivate: [AuthGuard],
    component: AdminDashboardComponent,
    children: [
      {path:'',component:AdminHomeComponent},
      {path:'add-product',component:AddProductComponent},
      {path:'add-purchase',component:AddPurchaseComponent},
      {path:'add-sales',component:AddSalesComponent},
      {path:'add-supplier',component:AddSupplierComponent},
      {path:'monthly',component:MonthlyComponent},
      {path:'monthlypurchase',component:MonthlypurchaseComponent},
      {path:'purchase-bill',component:PurchaseBillComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // providers: [AuthGuard]
})
export class AppRoutingModule { }