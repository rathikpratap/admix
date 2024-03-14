import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent {

  getId: any;
  Category: any;
  
  safeVideoUrl: SafeResourceUrl | null = null;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    custName: new FormControl("", [Validators.required]),
    custNumb: new FormControl("", [Validators.required]),
    custBussiness: new FormControl("", [Validators.required]),
    closingDate: new FormControl("", [Validators.required]),
    closingPrice: new FormControl("", [Validators.required]),
    closingCateg: new FormControl("", [Validators.required]),
    AdvPay: new FormControl("", [Validators.required]),
    remainingAmount: new FormControl(""),
    custCity: new FormControl("", [Validators.required]),
    custState: new FormControl("", [Validators.required]),
    projectStatus: new FormControl("", [Validators.required]),
    salesPerson: new FormControl("", [Validators.required]),
    youtubeLink: new FormControl(""),
    remark: new FormControl("", [Validators.required]),
    restAmount: new FormControl(""),
    restPaymentDate: new FormControl("")
  })

  updateEmbeddedVideoUrl() {
    const youtubeLink = this.updateForm.get('youtubeLink')!.value;
    if (youtubeLink) {
      const videoId = this.extractVideoId(youtubeLink);
      if(videoId){
        const embeddedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embeddedVideoUrl);
      } else{
        this.safeVideoUrl = null;
      }
      console.log("Video ID====>>", videoId);
    }else {
      this.safeVideoUrl = null;
    }
  }

  extractVideoId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }


  constructor(private router: Router, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.updateForm.valueChanges.subscribe(values => {
      const closingPriceValue = parseFloat(values.closingPrice || '0');
      const AdvPayValue = parseFloat(values.AdvPay || '0');
      const restAmountValue = parseInt(values.restAmount || '0');
      const remainingAmount = closingPriceValue - AdvPayValue - restAmountValue;

      this.updateForm.get('remainingAmount')!.setValue(remainingAmount.toString());
    });

    this.auth.getCustomer(this.getId).subscribe((res: any) => {
      console.log("res ==>", res);

      this.updateForm.patchValue({
        custCode: res['custCode'],
        custName: res['custName'],
        custNumb: res['custNumb'],
        custBussiness: res['custBussiness'],
        closingDate: res['closingDate'],
        closingPrice: res['closingPrice'],
        closingCateg: res['closingCateg'],
        AdvPay: res['AdvPay'],
        custCity: res['custCity'],
        remainingAmount: res['remainingAmount'],
        custState: res['custState'],
        projectStatus: res['projectStatus'],
        salesPerson: res['salesPerson'],
        youtubeLink: res['youtubeLink'],
        remark: res['remark'],
        restAmount: res['restAmount'],
        restPaymentDate: res['restPaymentDate']
      })
      this.updateEmbeddedVideoUrl();
    });

    this.auth.getCategory().subscribe((category:any)=>{
      console.log("Categories===>>", category);
      this.Category = category;
    })

  }



  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate() {
    this.auth.updateCustomer(this.getId, this.updateForm.value).subscribe((res: any) => {
      console.log("Data Updated Successfully");
      this.ngZone.run(() => { this.router.navigateByUrl('/salesHome/salesDashboard') })
    }, (err) => {
      console.log(err)
    })
  }

}
