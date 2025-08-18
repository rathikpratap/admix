import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
  pointTable: { second: number, points: number }[] = [];
  uploading = false;
  uploadError: string | null = null;
  fileLink = '';
  uploadProgress = 0;
  tempFilePath: string = '';
  uploadSub?: Subscription;
  uploadId: any;
  isCustomer: boolean = false;
  isTask: boolean = false;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    custBussiness: new FormControl(""),
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
    companyName: new FormControl(""),
    salesPerson: new FormControl(""),
    pointsEarned: new FormControl(),
    pointsCalculated: new FormControl()
  })

  constructor(private router: Router, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer, private toastr: ToastrService) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    //const type = this.activatedRoute.snapshot.paramMap.get('type');

    this.auth.getCustomer(this.getId).subscribe((res: any) => {
      console.log("READCUST======>>", res);

      if (res.custCode || res?._doc?.custCode) {
        this.isCustomer = true;
      } else if (res.taskName) {
        this.isTask = true;
      }

      this.updateForm.patchValue({
        custCode: res['custCode'] || res?._doc?.custCode || res?.SrNo,
        custBussiness: res['custBussiness'] || res?._doc?.custBussiness || res?.taskName,
        videoDuration: res['videoDuration'] || res?._doc?.videoDuration || res?.taskDuration,
        videoDeliveryDate: this.formatDate(res['videoDeliveryDate'] || res?._doc?.videoDeliveryDate || res?.taskDeliveryDate),
        videoType: res['videoType'] || res?._doc?.videoType || res?.taskVideoType,
        editorPayment: res['editorPayment'] || res?._doc?.editorPayment || res?.taskEditorPayment,
        editorStatus: res['editorStatus'] || res?._doc?.editorStatus || res?.graphicStatus,
        editorOtherChanges: res['editorOtherChanges'] || res?._doc?.editorOtherChanges || res?.taskEditorOtherChanges,
        editorChangesPayment: res['editorChangesPayment'] || res?._doc?.editorChangesPayment || res?.taskEditorChangespayment,
        totalEditorPayment: res['totalEditorPayment'] || res?._doc?.totalEditorPayment || res?.taskTotalEditorPayment,
        youtubeLink: res['youtubeLink'] || res?._doc?.youtubeLink || res?.taskYoutubeLink,
        videoDurationMinutes: res['videoDurationMinutes'] || res?._doc?.videoDurationMinutes || res?.taskVideoDurationMinutes,
        videoDurationSeconds: res['videoDurationSeconds'] || res?._doc?.videoDurationSeconds || res?.taskVideoDurationSeconds,
        numberOfVideos: res['numberOfVideos'] || res?._doc?.numberOfVideos || res?.taskNumberOfVideos,
        companyName: res['companyName'] || res?._doc?.companyName || res?.taskCompanyName,
        salesPerson: res['salesPerson'] || res?._doc?.salesPerson || res?.graphicDesigner
      });
    });

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })

    this.auth.allEmployee().subscribe((res: any) => {
      this.emp = res;
    });
    this.auth.getCompany().subscribe((res: any) => {
      this.company = res;
    });
    this.auth.getPoint().subscribe((res: any) => {
      this.pointTable = res.data;
      console.log('Point Table:', this.pointTable);
    });
  }
  formatDate(isoDate: string): string {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadError = null;

    const formData: FormData = new FormData();
    formData.append('file', file);

    const uploadId = uuidv4();  // 🆕 unique ID
    this.uploadId = uploadId;   // store for cancel
    formData.append('uploadId', uploadId);

    const existingLink = this.updateForm.get('youtubeLink')?.value;
    if (existingLink) {
      formData.append('existingLink', existingLink);
    }

    this.uploadSub = this.auth.uploadToDrive(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        }

        if (event.type === HttpEventType.Response) {
          this.uploading = false;
          const res = event.body;
          //this.tempFilePath = res.tempFilePath;

          if (res.success && res.webViewLink) {
            this.fileLink = res.webViewLink;
            this.updateForm.get('youtubeLink')?.setValue(res.webViewLink);

            if (res.oldFileDeleted) {
              this.toastr.info('Old file deleted');
            }
            this.toastr.success('New file uploaded successfully!');
          } else {
            this.toastr.error('Upload Failed');
          }
        }
      },
      error: (err) => {
        this.uploading = false;
        this.uploadProgress = 0;
        this.toastr.error('Upload Error');
        console.error(err);
      }
    });
  }

  cancelUpload() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
      this.uploading = false;
      this.uploadProgress = 0;
      this.toastr.warning('Upload Cancelled');

      // Tell backend to delete temp file
      if (this.uploadId) {
        this.auth.cancelUpload(this.uploadId).subscribe({
          next: () => {
            console.log('Temp file deleted');
          },
          error: (err) => {
            console.error('Failed to delete temp file:', err);
          }
        });
      }
    }
  }
  ngOnDestroy() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
  }

  onUpdate() {

    //new
    const payload = this.updateForm.value;
    let finalPayload: any = {};

    const Minsec: number = this.updateForm.get('videoDurationMinutes')?.value || 0;
    const sec: number = this.updateForm.get('videoDurationSeconds')?.value || 0;
    this.totalSec = Minsec * 60 + sec;
    this.updateForm.get('videoDuration')?.setValue(this.totalSec);

    const CompName = this.updateForm.get('companyName')?.value;

    this.company.forEach((comp: { companyName: string, signupName: string, payment30Sec: number, payment45Sec: number, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number, paymentTwoVideo: number, paymentThreeVideo: number }) => {
      if (comp.companyName === CompName && comp.signupName === this.tok.signupUsername) {
        switch (this.updateForm.get('videoType')?.value) {
          case 'Normal Graphics':
            switch (this.updateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.updateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
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

    // Earned Points Calculation
    const videoType = this.updateForm.get('videoType')?.value;
    if (!videoType || videoType === 'null') {
      this.toastr.warning('Please select a Video Type');
      return;
    }
    this.auth.getPointsByVideoType(videoType).subscribe((res: any) => {
      if (res.success && res.data?.points) {
        const pointTable = res.data.points;

        let matchedPoint = 0;

        for (let i = 0; i < pointTable.length; i++) {
          if (this.totalSec <= pointTable[i].second) {
            matchedPoint = pointTable[i].points;
            break;
          }
        }

        if (matchedPoint === 0 && pointTable.length > 0) {
          matchedPoint = pointTable[pointTable.length - 1].points;
        }
        // 🔽 Add extra points based on number of videos
        const numberOfVideos = this.updateForm.get('numberOfVideos')?.value;
        if (numberOfVideos === 'Two') {
          matchedPoint += 0.25;
        } else if (numberOfVideos === 'Three') {
          matchedPoint += 0.5;
        }
        console.log("POINTS EARNED=======>>", matchedPoint);
        // Set in form
        this.updateForm.get('pointsEarned')?.setValue(matchedPoint);
        this.updateForm.get('pointsCalculated')?.setValue(true);

        this.toastr.success(`Points calculated: ${matchedPoint}`);

        // Proceed with your actual form submission logic here
        // e.g., this.auth.submitVideoForm(this.updateForm.value).subscribe(...)

        if (this.isCustomer) {
          finalPayload = {
            custCode: payload.custCode,
            custBussiness: payload.custBussiness,
            videoDurationMinutes: payload.videoDurationMinutes,
            videoDurationSeconds: payload.videoDurationSeconds,
            videoDeliveryDate: payload.videoDeliveryDate,
            videoType: payload.videoType,
            editorPayment: payload.editorPayment,
            editorStatus: payload.editorStatus,
            editorOtherChanges: payload.editorOtherChanges,
            editorChangesPayment: payload.editorChangesPayment,
            totalEditorPayment: payload.totalEditorPayment,
            youtubeLink: payload.youtubeLink,
            numberOfVideos: payload.numberOfVideos,
            companyName: payload.companyName,
            salesPerson: payload.salesPerson,
            pointsEarned: this.updateForm.get('pointsEarned')?.value,
            pointsCalculated: true
          };
        }

        if (this.isTask) {
          finalPayload = {
            SrNo: payload.custCode,
            taskName: payload.custBussiness,
            taskVideoDurationMinutes: payload.videoDurationMinutes,
            taskVideoDurationSeconds: payload.videoDurationSeconds,
            taskDeliveryDate: payload.videoDeliveryDate,
            taskVideoType: payload.videoType,
            taskEditorPayment: payload.editorPayment,
            graphicStatus: payload.editorStatus,
            taskEditorOtherChanges: payload.editorOtherChanges,
            taskEditorChangesPayment: payload.editorChangesPayment,
            taskTotalEditorPayment: payload.totalEditorPayment,
            taskYoutubeLink: payload.youtubeLink,
            taskNumberOfVideos: payload.numberOfVideos,
            taskCompanyName: payload.companyName,
            graphicDesigner: payload.salesPerson,
            pointsEarned: this.updateForm.get('pointsEarned')?.value,
            pointsCalculated: true
          };
        }

        const currentDate = new Date().toISOString();
        this.auth.updateCustomerbyEditor(this.getId, finalPayload).subscribe((res: any) => {
          this.toastr.success('Data Updated Successfully', 'Success');
          const projectStatusControl = this.updateForm.get('editorStatus');
          projectStatusControl?.valueChanges.subscribe(value => {
            if (value === 'Completed') {
              let selectedEmployee = this.emp.find((employee: any) => employee.signupRole === 'Admin');
              let sales = this.updateForm.get('salesPerson')?.value;
              let msgTitle = "Project Complete";
              let msgBody = `${this.updateForm.get('custBussiness')?.value} by Editor`;
              this.auth.sendNotificationsAdmin([selectedEmployee], sales, msgTitle, msgBody, currentDate).subscribe((res: any) => {
                if (res) {
                  this.toastr.success('Notification Send', 'Success');
                } else {
                  this.toastr.error('Error Sending Notification', 'Error');
                }
              });
            }
          });
          // Manually trigger the value change logic for projectStatus
          projectStatusControl?.setValue(projectStatusControl.value, { emitEvent: true });
          this.ngZone.run(() => { this.router.navigateByUrl('/editor-home/editor-dashboard') })
        }, (err) => {
          console.log(err)
        });
      } else {
        this.toastr.warning('No points found for selected video type.');
      }
    }, err => {
      console.error('Error fetching point table:', err);
      this.toastr.error('Failed to fetch points. Try again.');
    });
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