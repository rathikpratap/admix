// src/app/services/messaging.service.ts
import { Injectable, OnInit } from '@angular/core';
import { getMessaging, getToken, } from 'firebase/messaging';
import { onBackgroundMessage } from "firebase/messaging/sw";
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor() {

  }


  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BHmkgyfsHZamUGuX-0MNoZSc72gnOZKuzHVyOARqNnbIjqJWQCCy_vslmOOwqTWVJ1W0czMf4quFYarqU-TVq-A' }).then(
      (currentToken) => {
        if (currentToken) {
          console.log("Yes, We have Token");
          console.log(currentToken);
          //return currentToken;
        } else {
          console.log("We have a problem ")
          //return false;
        }
      }
    )
    // onBackgroundMessage(messaging,(payload)=>{
    //   console.log("Background Message===>",payload);
    // })
  }

}
