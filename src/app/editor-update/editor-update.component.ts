import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-update',
  templateUrl: './editor-update.component.html',
  styleUrls: ['./editor-update.component.css']
})
export class EditorUpdateComponent implements OnInit {
  getId: any;
  tok: any;
  editorOtherChanges: boolean = false;
  emp: any;
  totalSec: any;
  numberOfVideos: any;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    videoDuration: new FormControl(0),
    videoDeliveryDate: new FormControl(""),
    videoType: new FormControl("null"),
    editorStatus: new FormControl("null", [Validators.required]),
    editorPayment: new FormControl(),
    editorOtherChanges: new FormControl(""),
    editorChangesPayment: new FormControl(),
    totalEditorPayment: new FormControl(0),
    youtubeLink: new FormControl(""),
    videoDurationMinutes: new FormControl(0),
    videoDurationSeconds: new FormControl(0),
    numberOfVideos: new FormControl("")
  })

  constructor(private router: Router, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any) => {

      this.updateForm.patchValue({
        custCode: res['custCode'],
        videoDuration: res['videoDuration'],
        videoDeliveryDate: res['videoDeliveryDate'],
        videoType: res['videoType'],
        editorPayment: res['editorPayment'],
        editorStatus: res['editorStatus'],
        editorOtherChanges: res['editorOtherChanges'],
        editorChangesPayment: res['editorChangesPayment'],
        totalEditorPayment: res['totalEditorPayment'],
        youtubeLink: res['youtubeLink'],
        videoDurationMinutes: res['videoDurationMinutes'],
        videoDurationSeconds: res['videoDurationSeconds'],
        numberOfVideos: res['numberOfVideos']
      })
    })

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })

    this.auth.allEmployee().subscribe((res: any) => {
      console.log("All Employees==>", res);
      this.emp = res;
    })
  }

  ngOnInit(): void {

    this.updateForm.get('editorStatus')?.valueChanges.subscribe((value) => {
      if (value === 'Completed') {
        this.updateForm.get('youtubeLink')?.setValidators([Validators.required]);
      } else {
        this.updateForm.get('youtubeLink')?.clearValidators();
      }
      this.updateForm.get('youtubeLink')?.updateValueAndValidity();
    });


  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate() {

    console.log("duration==>", this.updateForm.get('videoDurationSeconds')?.value);
    const Minsec: number = this.updateForm.get('videoDurationMinutes')?.value || 0;
    const sec: number = this.updateForm.get('videoDurationSeconds')?.value || 0;
    this.totalSec = Minsec * 60 + sec;
    this.updateForm.get('videoDuration')?.setValue(this.totalSec);
    console.log("Total Sec==>", this.totalSec);

    this.emp.forEach((employee: { signupUsername: string, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number, paymentTwoVideo: number, paymentThreeVideo: number }) => {
      if (employee.signupUsername === this.tok.signupUsername) {
        switch (this.updateForm.get('numberOfVideos')?.value) {
          case 'One':
            if (this.totalSec > 0 && this.totalSec <= 60) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment60Sec);
            } else if (this.totalSec > 60 && this.totalSec <= 90) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment90Sec);
            } else if (this.totalSec > 90 && this.totalSec <= 120) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment120Sec);
            } else if (this.totalSec > 120 && this.totalSec <= 150) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment150Sec);
            } else if (this.totalSec > 150 && this.totalSec <= 180) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment180Sec);
            } else {
              this.updateForm.get('editorPayment')?.setValue(0);
            }
            break;
          case 'Two':
            if (this.totalSec > 0 && this.totalSec <= 60) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment60Sec + employee.paymentTwoVideo);
            } else if (this.totalSec > 60 && this.totalSec <= 90) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment90Sec + employee.paymentTwoVideo);
            } else if (this.totalSec > 90 && this.totalSec <= 120) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment120Sec + employee.paymentTwoVideo);
            } else if (this.totalSec > 120 && this.totalSec <= 150) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment150Sec + employee.paymentTwoVideo);
            } else if (this.totalSec > 150 && this.totalSec <= 180) {
              this.updateForm.get('editorPayment')?.setValue(employee.payment180Sec + employee.paymentTwoVideo);
            } else{
              this.updateForm.get('editorPayment')?.setValue(0);
            }
            break;
          case 'Three':
            if (this.totalSec > 0 && this.totalSec <= 60){
              this.updateForm.get('editorPayment')?.setValue(employee.payment60Sec + employee.paymentThreeVideo);
            } else if (this.totalSec > 60 && this.totalSec <=90){
              this.updateForm.get('editorPayment')?.setValue(employee.payment90Sec + employee.paymentThreeVideo);
            } else if (this.totalSec > 90 && this.totalSec <=120){
              this.updateForm.get('editorPayment')?.setValue(employee.payment120Sec + employee.paymentThreeVideo);
            } else if(this.totalSec > 120 && this.totalSec <=150){
              this.updateForm.get('editorPayment')?.setValue(employee.payment150Sec + employee.paymentThreeVideo);
            } else if(this.totalSec > 150 && this.totalSec <=180){
              this.updateForm.get('editorPayment')?.setValue(employee.payment180Sec + employee.paymentThreeVideo);
            } else{
              this.updateForm.get('editorPayment')?.setValue(0);
            }
            break;
          default:
            this.updateForm.get('editorPayment')?.setValue(0);
        }
      }
    })

    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res: any) => {
      console.log("Data Updated Successfully", res);
      this.ngZone.run(() => { this.router.navigateByUrl('/editor-home/editor-dashboard') })
    }, (err) => {
      console.log(err)
    })
  }


  onChange(event: any) {
    if (event.target.value === 'yes') {
      this.editorOtherChanges = true;
    } else {
      this.editorOtherChanges = false;
    }
  }
}
