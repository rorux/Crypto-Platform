import { Component } from '@angular/core';
import { Converter } from '../../ui';

@Component({
    selector: 'app-converter-page',
    imports: [Converter],
    templateUrl: './converter-page.html',
    styleUrl: './converter-page.scss',
    standalone: true,
})
export class ConverterPage {}
