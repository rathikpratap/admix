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
  showEditorPayment : boolean = false;

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
    videoDurationSeconds: new FormControl(0)
  }) 

  constructor(private router: Router, private ngZone: NgZone,private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer){
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any)=>{

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
        videoDurationSeconds: res['videoDurationSeconds']
      })
    })
 
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })

    this.auth.allEmployee().subscribe((res:any)=>{
      console.log("All Employees==>", res);
      this.emp = res;
      // res.forEach((employee: { signupUsername: string, signupPayment: string; }) => {
      //   if(employee.signupUsername === this.tok.signupUsername){
      //     console.log("Employee==>", employee.signupPayment)
      //     this.updateForm.get('editorPayment')!.setValue(employee.signupPayment);
      //   }
      // });
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

  onUpdate(){
    
    const editorPayment1: number = parseFloat(this.updateForm.get('editorPayment')?.value || '0');
    const editorChangesPayment1: number = parseFloat(this.updateForm.get('editorChangesPayment')?.value || '0');
    const totalEditorPayment1: number = editorPayment1 + editorChangesPayment1;
    this.updateForm.get('totalEditorPayment')?.setValue(totalEditorPayment1);

    this.emp.forEach((employee: {signupUsername: string, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number})=>{
      if(employee.signupUsername === this.tok.signupUsername){
        console.log("Payment Of employee===>>", employee.payment60Sec);
        if(this.totalSec > 0 && this.totalSec <= 60){
          console.log("60Sec Payment",employee.payment60Sec);
          this.updateForm.get('editorPayment')?.setValue(employee.payment60Sec);
        } else if(this.totalSec > 60 && this.totalSec <= 90){
          this.updateForm.get('editorPayment')?.setValue(employee.payment90Sec);
        } else if(this.totalSec > 90 && this.totalSec <=120){
          this.updateForm.get('editorPayment')?.setValue(employee.payment120Sec);
        } else if(this.totalSec > 120 && this.totalSec <=150){
          this.updateForm.get('editorPayment')?.setValue(employee.payment150Sec);
        } else if(this.totalSec > 150 && this.totalSec <=180){
          this.updateForm.get('editorPayment')?.setValue(employee.payment180Sec);
        }
      }
    })

    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res:any)=>{
      console.log("Data Updated Successfully", res);
      this.ngZone.run(()=> { this.router.navigateByUrl('/editor-home/editor-dashboard')})
    }, (err)=>{
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
   

   DurationChange(){
    console.log("duration==>",this.updateForm.get('videoDurationSeconds')?.value);
    const Minsec: number = this.updateForm.get('videoDurationMinutes')?.value || 0;
    const sec: number = this.updateForm.get('videoDurationSeconds')?.value || 0;
    this.totalSec = Minsec * 60 + sec;
    this.updateForm.get('videoDuration')?.setValue(this.totalSec);
    console.log("Total Sec==>", this.totalSec);
    this.showEditorPayment = this.totalSec > 180;
   }
}
