import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  public isMobile(): boolean {
    if (typeof window !== 'undefined') {
      // Check for touch events and a common mobile User-Agent regex for more reliability
      const hasTouch = 'ontouchstart' in window;
      const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return hasTouch || isMobileUA;
    }
    return false;
  }
}
