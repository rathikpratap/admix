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
  

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    Duration: new FormControl(""),
    videoDeliveryDate: new FormControl(""),
    videoType: new FormControl("null"),
    scriptStatus: new FormControl("null", [Validators.required]),
    editorPayment: new FormControl(""),
    otherChanges: new FormControl("No"),
    editorChangesPayment: new FormControl("")
  }) 

  constructor(private router: Router, private ngZone: NgZone,private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer){
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any)=>{

      this.updateForm.patchValue({
        custCode: res['custCode'],
        Duration: res['Duration'],
        videoDeliveryDate: res['videoDeliveryDate'],
        videoType: res['videoType'],
        editorPayment: res['editorPayment'],
        scriptStatus: res['scriptStatus'],
        otherChanges: res['otherChanges'],
        editorChangesPayment: res['editorChangesPayment']
      })
    })
 
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })

    this.auth.allEmployee().subscribe((res:any)=>{
      console.log("All Employees==>", res);
      
      res.forEach((employee: { signupUsername: string, signupPayment: string; }) => {
        if(employee.signupUsername === this.tok.signupUsername){
          console.log("Employee==>", employee.signupPayment)
          this.updateForm.get('editorPayment')!.setValue(employee.signupPayment);
        }
      });
    })
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate(){
    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res:any)=>{
      console.log("Data Updated Successfully", res);
      this.ngZone.run(()=> { this.router.navigateByUrl('/editor-home/editor-dashboard')})
    }, (err)=>{
      console.log(err)
    })
  }
}
