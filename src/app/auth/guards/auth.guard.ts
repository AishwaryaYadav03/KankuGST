import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { ToastrService } from 'ngx-toastr';

export const AuthGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const toastrService = inject(ToastrService);

  if (storageService.getToken() !== null &&
    storageService.getUser() !== null &&
    storageService.getUserRole() == "ADMIN") {
    return true;
  }
  // router.navigate(['/']);
  return false;
};