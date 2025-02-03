import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.css'
})
export class ViewInvoiceComponent implements OnInit {

  getId: any;
  invoiceData: any;
  invoiceForm!: FormGroup;

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      billType: [''],
      gstType: [''],
      rows: this.fb.array([])
    });
  }

  custForm = new FormGroup({
    custName: new FormControl(""),
    custNumb: new FormControl(""),
    custGST: new FormControl(""),
    custAddLine1: new FormControl(""),
    custAddLine2: new FormControl(""),
    custAddLine3: new FormControl("")
  });

  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private fb: FormBuilder) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    this.auth.getSelectedInvoice(this.getId).subscribe((res: any) => {
      this.invoiceData = res;
      this.invoiceForm.patchValue({
        billType: res['billType'],
        gstType: res['gstType'],  
      });
      const rows = res.rows || [];
      const rowsFormArray = this.fb.array(
        rows.map((row: { invoiceCateg: any; customCateg: any; numOfVideos: any; priceOfVideos: any; }) => this.fb.group({
          invoiceCateg: [row.invoiceCateg || ''],
          customCateg: [row.customCateg || ''],
          numOfVideos: [row.numOfVideos || 0],
          priceOfVideos: [row.priceOfVideos || 0]
        }))
      );
      this.invoiceForm.setControl('rows', rowsFormArray);
      this.custForm.patchValue({
        custName: res['custName'],
        custNumb: res['custNumb'],
        custGST: res['custGST'],
        custAddLine1: res['custAddLine1'],
        custAddLine2: res['custAddLIne2'],
        custAddLine3: res['custAddLine3']
      });
    });
  }
  get rows() {
    return this.invoiceForm.get('rows') as FormArray;
  }

  addRow() { }
}
