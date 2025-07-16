import { Injectable } from '@angular/core';

export interface TrackLogo {
  isIcon: boolean;
  initials?: string;
  icon?: string;
  bgColor: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackLogoService {
  private bgColorPalette: string[] = ['#e0e7ff', '#f3e8ff', '#fce7f3'];
  private textColorPalette: string[] = ['#4338ca', '#9333ea', '#db2777'];

  constructor() { }

  getLogo(title: string, type: 'song' | 'announcement'): TrackLogo {
    if (type === 'announcement') {
      return {
        isIcon: true,
        icon: 'person',
        bgColor: '#dbeafe', // A light blue background for the icon
        color: '#1d4ed8'   // A deep blue for the icon color
      };
    }

    if (!title) {
      return { isIcon: false, initials: '?', bgColor: '#e5e7eb', color: '#4b5563' };
    }

    const initials = title.substring(0, 2).toUpperCase();
    const lastCharCode = title.charCodeAt(title.length - 1);
    const colorIndex = lastCharCode % this.bgColorPalette.length;

    return {
      isIcon: false,
      initials,
      bgColor: this.bgColorPalette[colorIndex],
      color: this.textColorPalette[colorIndex]
    };
  }
}
