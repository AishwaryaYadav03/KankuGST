// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { StorageService } from './storage/storage.service';
// import { Router } from '@angular/router';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const storageService = inject(StorageService);
//   const router = inject(Router);

//   let authReq = req;
//   const token = storageService.getToken();
//   if (token != null) {
//     authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
//   }
//   if (storageService.getUser() == null) {
//     storageService.logout();
//     router.navigate(['/']);
//   }

//   return next(authReq);
// };



import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { StorageService } from './storage/storage.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private service:StorageService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.service.getToken();
    if(token!=null){
      authReq = authReq.clone({setHeaders:{Authorization:`Bearer ${token}`}});
    }
    
    return next.handle(authReq);
  }

}

export const authInterceptor=[
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }
];