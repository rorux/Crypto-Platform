import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NumberFormatter {
    constructor(private decimalPipe: DecimalPipe) {}

    public formatPrice(price: number): string {
        return this.decimalPipe.transform(price, '1.0-5') || '';
    }

    public formatLargeNumber(price: number): string {
        return this.decimalPipe.transform(price, '1.0-0') || '';
    }
}
