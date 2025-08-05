import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService} from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-b2b-update',
  templateUrl: './editor-b2b-update.component.html',
  styleUrls: ['./editor-b2b-update.component.css']
})
export class EditorB2bUpdateComponent implements OnInit {
  getId: any;
  tok: any;
  editorOtherChanges: boolean = false;
  totalSec: any;
  numberOfVideos: any;
  companies: any;
  employee: any;
  allEmployee: any;
  allCompany: any;
  pointTable: { second: number, points: number }[] = [];

  b2bUpdateForm = new FormGroup({
    b2bProjectCode: new FormControl("", [Validators.required]),
    companyName: new FormControl("", [Validators.required]),
    b2bProjectName: new FormControl("", [Validators.required]),
    b2bCategory: new FormControl("null", [Validators.required]),
    b2bVideoType: new FormControl("null", [Validators.required]),
    b2bProjectDate: new FormControl(""),
    b2bProjectPrice: new FormControl(0),
    b2bVideoDurationMinutes: new FormControl(0),
    b2bVideoDurationSeconds: new FormControl(0),
    b2bEditor: new FormControl(""),
    youtubeLink: new FormControl(""),
    b2bRemark: new FormControl(""),
    salesPerson: new FormControl(""),
    salesTeam: new FormControl(""),
    projectStatus: new FormControl(""),
    editorPayment: new FormControl(),
    editorOtherChanges: new FormControl(""),
    editorChangesPayment: new FormControl(),
    totalEditorPayment: new FormControl(0),
    numberOfVideos: new FormControl(""),
    videoDuration: new FormControl(0),
    pointsEarned: new FormControl(),
    pointsCalculated: new FormControl()
  });

  handleSpecialCases(videoType: string): string {
    if (videoType === 'Background Music' || videoType === 'Refine') {
      return 'Voice Over Edit';
    }
    return videoType;
  }

  constructor(private router: Router, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private auth: AuthService, private toastr: ToastrService) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getB2b(this.getId).subscribe((res: any) => {
      this.b2bUpdateForm.patchValue({

        b2bProjectCode: res['b2bProjectCode'],
        companyName: res['companyName'],
        b2bProjectName: res['b2bProjectName'],
        b2bCategory: res['b2bCategory'],
        b2bVideoType: res['b2bVideoType'],
        b2bProjectDate: res['b2bProjectDate'],
        b2bProjectPrice: res['b2bProjectPrice'],
        b2bVideoDurationMinutes: res['b2bVideoDurationMinutes'],
        b2bVideoDurationSeconds: res['b2bVideoDurationSeconds'],
        b2bEditor: res['b2bEditor'],
        youtubeLink: res['youtubeLink'],
        b2bRemark: res['b2bRemark'],
        projectStatus: res['projectStatus'],
        salesPerson: res['salesPerson'],
        salesTeam: res['salesTeam'],
        editorPayment: res['editorPayment'],
        editorOtherChanges: res['editorOtherChanges'],
        editorChangesPayment: res['editorChangesPayment'],
        numberOfVideos: res['numberOfVideos'],
        videoDuration: res['videoDuration'],
        totalEditorPayment: res['totalEditorPayment']
      })
    });
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Ecpired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.allEmployee().subscribe((res: any) => {
      this.employee = res.filter((emp: any) => emp.signupRole === 'Editor')
      this.allEmployee = res;
    });
    this.auth.getCompany().subscribe((res: any) => {
      this.companies = res.filter((company: any, index: number, self: any[]) =>
        index === self.findIndex((c: any) => c.companyName === company.companyName)
      );
      this.allCompany = res;
    });
    this.auth.getPoint().subscribe((res: any) => {
      this.pointTable = res.data;
    });
  }
  getB2bCustomerFormControl(b2bName: any): AbstractControl | null {
    return this.b2bUpdateForm.get(b2bName);
  }

  ngOnInit(): void {
    this.b2bUpdateForm.get('projectStatus')?.valueChanges.subscribe((value) => {
      if (value === 'Completed') {
        this.b2bUpdateForm.get('youtubeLink')?.setValidators([Validators.required]);
      } else {
        this.b2bUpdateForm.get('youtubeLink')?.clearValidators();
      }
      this.b2bUpdateForm.get('youtubeLink')?.updateValueAndValidity();
    });
  }
  onUpdate() {
    const min: number = this.b2bUpdateForm.get('b2bVideoDurationMinutes')?.value || 0;
    const sec: number = this.b2bUpdateForm.get('b2bVideoDurationSeconds')?.value || 0;
    this.totalSec = min * 60 + sec;
    this.b2bUpdateForm.get('videoDuration')?.setValue(this.totalSec);

    const CompName = this.b2bUpdateForm.get('companyName')?.value;

    this.allCompany.forEach((comp: { companyName: string, signupName: string, payment30Sec: number, payment45Sec: number, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number, paymentTwoVideo: number, paymentThreeVideo: number }) => {
      if (comp.companyName === CompName && comp.signupName === this.tok.signupUsername) {
        switch (this.b2bUpdateForm.get('b2bVideoType')?.value) {
          case 'Normal Graphics':
            switch (this.b2bUpdateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.b2bUpdateForm.get('editorPayment')?.setValue(0);
            }
            break;
          case 'Motion Graphics':
            switch (this.b2bUpdateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.b2bUpdateForm.get('editorPayment')?.setValue(0);
            }
            break;
          case 'Green Screen':
            switch (this.b2bUpdateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.b2bUpdateForm.get('editorPayment')?.setValue(0);
            }
        }

        const videoType = this.b2bUpdateForm.get('b2bVideoType')?.value || '';
        const handledVideoType = this.handleSpecialCases(videoType);

        switch (handledVideoType) {
          case 'Voice Over Edit':
            switch (this.b2bUpdateForm.get('numberOfVideos')?.value) {
              case 'One':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Two':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentTwoVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentTwoVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              case 'Three':
                if (this.totalSec > 0 && this.totalSec <= 30) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment30Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 30 && this.totalSec <= 45) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment45Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 45 && this.totalSec <= 60) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment60Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 60 && this.totalSec <= 90) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment90Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 90 && this.totalSec <= 120) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment120Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 120 && this.totalSec <= 150) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment150Sec + comp.paymentThreeVideo);
                } else if (this.totalSec > 150 && this.totalSec <= 180) {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(comp.payment180Sec + comp.paymentThreeVideo);
                } else {
                  this.b2bUpdateForm.get('editorPayment')?.setValue(0);
                }
                break;
              default:
                this.b2bUpdateForm.get('editorPayment')?.setValue(0);
            }
            break;
          default:
            this.b2bUpdateForm.get('editorPayment')?.setValue(0);
        }
      }
    })
    const editorPayment1: number = this.b2bUpdateForm.get('editorPayment')?.value;
    const editorChangesPayment1: number = this.b2bUpdateForm.get('editorChangesPayment')?.value;
    const totalEditorPayment1: number = editorPayment1 + editorChangesPayment1;
    this.b2bUpdateForm.get('totalEditorPayment')?.setValue(totalEditorPayment1);

    //Earned Points Calculation
    const videoType = this.b2bUpdateForm.get('b2bVideoType')?.value;
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
        this.b2bUpdateForm.get('pointsEarned')?.setValue(matchedPoint);
        this.b2bUpdateForm.get('pointsCalculated')?.setValue(true);

        this.toastr.success(`Points calculated: ${matchedPoint}`);

        const currentDate = new Date().toISOString();

        this.auth.updateB2bbyEditor(this.getId, this.b2bUpdateForm.value).subscribe((res: any) => {

          const projectStatusControl = this.b2bUpdateForm.get('projectStatus');
          projectStatusControl?.valueChanges.subscribe(value => {
            if (value === 'Completed') {
              let selectedEmployee = this.allEmployee.find((emp: any) => emp.signupRole === 'Admin');
              let sales = this.b2bUpdateForm.get('salesPerson')?.value;
              let msgTitle = "B2b Project Complete";
              let msgBody = `${this.b2bUpdateForm.get('b2bProjectName')?.value} by Editor`;
              this.auth.sendNotificationsAdmin([selectedEmployee], sales, msgTitle, msgBody, currentDate).subscribe((res: any) => {
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
        });
      }else{
        this.toastr.warning('No points found for selected video type.');
      }
    },err => {
      console.error('Error fetching point table:',err);
      this.toastr.error('Failed to fetch points. Try Again');
    });
  }

  onChange(event: any) {
    if (event.target.value === 'yes') {
      this.editorOtherChanges = true;
    } else {
      this.editorOtherChanges = false;
      this.b2bUpdateForm.get('editorChangesPayment')?.setValue(0);
    }
  }
}
