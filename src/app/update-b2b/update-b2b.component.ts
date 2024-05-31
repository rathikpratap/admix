import { Component, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-update-b2b',
  templateUrl: './update-b2b.component.html',
  styleUrls: ['./update-b2b.component.css']
}) 
export class UpdateB2bComponent {
  getId: any;
  tok:any;
  employee:any;
  companies: any;
  editorOtherChanges: boolean = false;

  codeInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    console.log("Its Called");
    const inputElement = this.el.nativeElement.querySelector('input[type=text]');
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
  }
  b2bUpdateForm = new FormGroup({
    b2bProjectCode: new FormControl("", [Validators.required]),
    companyName: new FormControl("", [Validators.required]),
    b2bProjectName: new FormControl("",[Validators.required]),
    b2bCategory: new FormControl("null",[Validators.required]),
    b2bVideoType: new FormControl("null", [Validators.required]),
    b2bProjectDate: new FormControl(""),
    b2bProjectPrice: new FormControl(0),
    b2bVideoDurationMinutes: new FormControl(""),
    b2bVideoDurationSeconds: new FormControl(""),
    b2bEditor: new FormControl(""),
    youtubeLink: new FormControl(""),
    b2bRemark: new FormControl(""),
    salesPerson: new FormControl(""),
    salesTeam: new FormControl(""),
    projectStatus: new FormControl(""),
    editorPayment: new FormControl(0),
    editorOtherChanges: new FormControl(""),
    editorChangesPayment: new FormControl(0),
    numberOfVideos: new FormControl("")
  });


  constructor(private router: Router, private ngZone: NgZone,private renderer: Renderer2, private el: ElementRef, private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.allEmployee().subscribe((res:any)=>{
      this.employee = res.filter((emp:any)=> emp.signupRole === 'Editor')
      console.log("Editorss===>", this.employee);
    });
    this.auth.getCompany().subscribe((res:any)=>{
        this.companies = res.filter((company: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.companyName === company.companyName)
        );
    });

    this.auth.getB2b(this.getId).subscribe((res:any)=>{
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
      numberOfVideos: res['numberOfVideos']
    }) 
  }) 

  }

  getB2bCustomerFormControl(b2bName: any) : AbstractControl | null{
    return this.b2bUpdateForm.get(b2bName);
  }
  onUpdate() {
    this.auth.updateB2b(this.getId, this.b2bUpdateForm.value).subscribe((res: any) => {
      console.log("Data Updated Successfully");
      this.ngZone.run(() => { this.router.navigateByUrl('/salesHome/b2b-dashboard') })
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
