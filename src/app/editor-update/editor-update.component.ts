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
  company: any;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    custBussiness : new FormControl(""),
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
    numberOfVideos: new FormControl(""),
    companyName: new FormControl("")
  })

  constructor(private router: Router, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any) => {

      this.updateForm.patchValue({
        custCode: res['custCode'],
        custBussiness: res['custBussiness'],
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
        numberOfVideos: res['numberOfVideos'],
        companyName: res['companyName']
      })
    })

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })

    this.auth.allEmployee().subscribe((res: any) => {
      console.log("All Employees==>", res);
      this.emp = res;
    });
    this.auth.getCompany().subscribe((res: any) => {
      this.company = res;
      console.log("Company Details===> ", this.company);
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

    const CompName = this.updateForm.get('companyName')?.value;
    console.log("COMP NAme====>>", CompName);

    this.company.forEach((comp: { companyName: string, signupName: string,payment30Sec: number, payment45Sec: number, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number, paymentTwoVideo: number, paymentThreeVideo: number }) => {
      if (comp.companyName === CompName && comp.signupName === this.tok.signupUsername) {
        switch (this.updateForm.get('videoType')?.value) {
          case 'Normal Graphics':
            switch (this.updateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.updateForm.get('editorPayment')?.setValue(0);
            }
            break;
          case 'Motion Graphics':
            switch (this.updateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.updateForm.get('editorPayment')?.setValue(0);
            }
            break;
          case 'Green Screen':
            switch (this.updateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.updateForm.get('editorPayment')?.setValue(0);
            }
            break;
            case 'Voice Over Edit':
            switch (this.updateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45){
                  this.updateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.updateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.updateForm.get('editorPayment')?.setValue(0);
            }
            break;
        }

      }
    })
    const editorPayment1: number = this.updateForm.get('editorPayment')?.value;
    const editorChangesPayment1: number = this.updateForm.get('editorChangesPayment')?.value;
    const totalEditorPayment1: number = editorPayment1 + editorChangesPayment1;
    this.updateForm.get('totalEditorPayment')?.setValue(totalEditorPayment1);

    const currentDate = new Date().toISOString();
    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res: any) => {
      console.log("Data Updated Successfully", res);
      const projectStatusControl = this.updateForm.get('editorStatus');
        projectStatusControl?.valueChanges.subscribe(value => {
          if (value === 'Completed') {
            let selectedEmployee = this.emp.find((employee: any) => employee.signupRole === 'Admin');
            console.log("SELECTED EMPLOYEE===>", selectedEmployee);
            let msgTitle = "Project Complete";
            let msgBody = `${this.updateForm.get('custBussiness')?.value} by ${this.tok.signupUsername}`;
            this.auth.sendNotification([selectedEmployee], msgTitle, msgBody, currentDate).subscribe((res: any) => {
              if (res) {
                alert("Notification Sent");
              } else {
                alert("Error Sending Notification");
              }
            });
          }
        });

        // Manually trigger the value change logic for projectStatus
        projectStatusControl?.setValue(projectStatusControl.value, { emitEvent: true });
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
      this.updateForm.get('editorChangesPayment')?.setValue(0);
    }
  }
}
