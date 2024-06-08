import { Component } from '@angular/core';
import numWords from 'num-words';

@Component({
  selector: 'app-est-invoice',
  templateUrl: './est-invoice.component.html',
  styleUrls: ['./est-invoice.component.css']
})
export class EstInvoiceComponent {
  
  wordsAmt = numWords(1185);
}
