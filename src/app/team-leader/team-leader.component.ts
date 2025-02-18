import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessagingService } from '../service/messaging-service';

@Component({
  selector: 'app-team-leader',
  templateUrl: './team-leader.component.html',
  styleUrl: './team-leader.component.css'
})
export class TeamLeaderComponent implements OnInit {

  tok: any;
  data: any;
  allData: any;
  totalEntries: any;
  todayEntries: any;
  rangeData: any;
  totalAmount: any;
  totalRecv: any;
  totalDue: any;
  dataLength: any;
  allProjects: any;
  monthRestAmount: any;
  accessToken: any;
  totalDayEntry: any;
  totalEntry: any;
  allActiveProjects: any;
  dueData: any;
  restData: any;
  topPerformer: any;
  topYearlyPerformer: any;
  monthlyPerformer: { [key: string]: { [month: number]: number } } = {};
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  campaign_names: any;
  campaignName: any;
  campaignData: any;
  closing_names: any;
  todayAmount: any;
  advToday: any;
  totalAmountAM: any;
  restAmount: any;
  todayRestAmount: any;
  restToday: any;
  rangeDataCount: any;
  onGoingDataCount:any;
  rangeTop:any;
  rangeMonthRestAmount:any;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_name: new FormControl("null"),
    categStartDate: new FormControl(""),
    categEndDate: new FormControl("")
  });

  ngOnInit(): void {
    this.categForm.get('campaign_name')?.valueChanges.subscribe(value => {
      this.campaignName = this.categForm.get('campaign_name')?.value;
    });  
  }
  
  constructor(private auth: AuthService, private messagingService: MessagingService) {
    this.auth.getAccessToken().subscribe((res: any) => {
      this.accessToken = res;
    });

    this.messagingService.requestPermission();

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    })
    this.auth.getAllProjects().subscribe((allList: any) => {
      console.log("allList", allList)
      this.data = allList;
      this.dataLength = allList.length;
    })

    this.auth.getAllCompleteProjects().subscribe((allProject: any) => {
      console.log("allProject", allProject)
      this.allData = allProject;
    })
    this.auth.getMonthEntries().subscribe((res: any) => {
      this.totalEntry = res.totalEntries;
      this.totalEntries = res.totalEntries.length;
      this.totalAmount = res.totalAmount;
      this.totalRecv = res.totalRecv;
      this.totalDue = res.totalDue;
    }, (error) => {
      console.error('Error fetching total Entries', error);
    });

    this.auth.getTodayEntries().subscribe((todayRes: any) => {
      console.log('Response Data:', todayRes);
      this.totalDayEntry = todayRes.totalDayEntry;
      if (Array.isArray(this.totalDayEntry)) {
        this.todayEntries = this.totalDayEntry.length;
      } else {
        this.todayEntries = 0;
      }
    }, (error) => {
      console.error('Error Fetching today Entreis', error);
    });
    this.auth.allProjectsAdmin().subscribe((res: any) => {
      this.allActiveProjects = res;
      this.allProjects = res.length;
    });
    this.auth.monthRestAmount().subscribe((res: any) => {
      this.monthRestAmount = res;
    });
    this.auth.getDueAmountAdmin().subscribe((res: any) => {
      this.dueData = res;
    });
    this.auth.getRestAmountAdmin().subscribe((res: any) => {
      this.restData = res;
    });
    this.auth.topPerformer().subscribe((res: any) => {
      this.topPerformer = res;
    });
    this.auth.monthlyPerformer().subscribe((res: any) => {
      this.monthlyPerformer = res;
    });
    this.auth.todayAmount().subscribe((res: any) => {
      this.todayAmount = res.advAmount;
      this.advToday = res.advToday;
      this.todayRestAmount = res.restAmount;
      this.restToday = res.restToday;
    });
    this.auth.receivedQr().subscribe((res: any) => {
      this.totalAmountAM = res.advTotals;
      this.restAmount = res.restTotals;
    });

    this.auth.getCampaign().subscribe((res: any) => {
      this.campaign_names = res.filter((campaign: any, index: number, self: any[]) =>
        index === self.findIndex((c: any) => c.campaign_Name === campaign.campaign_Name));
    });

    this.auth.getClosing().subscribe((res: any) => {
      this.closing_names = res.filter((closing: any, index: number, self: any[]) =>
        index === self.findIndex((clo: any) => clo.closingCateg === closing.closingCateg));
    })
  }

  downloadRestAmountFile() {
    this.auth.getRestAmountDownloadAdmin();
  }
  downloadDueAmountFile() {
    this.auth.getDueAmountDownloadAdmin();
  }
  downloadTotalDayEntryFile() {
    this.auth.getTodayEntryDownloadAdmin();
  }
  downloadTotalEntryFile() {
    this.auth.getTotalEntryDownloadAdmin();
  }
  downloadActiveEntryFile() {
    this.auth.getTotalOngoingDownloadAdmin();
  }
  downloadAllActiveEntryFile() {
    this.auth.getAllActiveDownloadAdmin();
  }

  onSubmit() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.getDatabyRange(startDate, endDate).subscribe((rangeData: any) => {
        console.log("Data by Date Range==>", rangeData);
        this.rangeData = rangeData;
        this.rangeDataCount = rangeData.rangeTotalData.length;
      }, (error) => {
        console.error('Error fetching data', error);
      });
      this.auth.getOngoingRangeData(startDate, endDate).subscribe((onGoingData: any) =>{
        this.onGoingDataCount = onGoingData.length;
      },(error)=>{
        console.error("Error Fetching Ongoing", error);
      });
      this.auth.rangeTopPerformer(startDate, endDate).subscribe((top:any)=>{
        this.rangeTop = top[0]?._id;
      });
      this.auth.rangeTotalRecv(startDate, endDate).subscribe((res:any)=>{
        this.rangeMonthRestAmount = res;
      });
    } else {
      console.error("Start date and End Date is not Valid");
    }
  }
  onCategSubmit() {
    const startDateValue = this.categForm.value.categStartDate;
    const endDateValue = this.categForm.value.categEndDate;
    const campaign = this.campaignName;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate && campaign) {
      this.auth.getDatabyCampaign(startDate, endDate, campaign).subscribe((res: any) => {
        this.campaignData = res;
      }, (error) => {
        console.log("Error Fetching Data", error);
      });
    } else {
      console.error("Start date and End Date is not Valid");
    }
  };

  onCategClosingSubmit() {
    const startDateValue = this.categForm.value.categStartDate;
    const endDateValue = this.categForm.value.categEndDate;
    const campaign = this.campaignName;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate && campaign) {
      this.auth.getDataByClosingCamp(startDate, endDate, campaign).subscribe((res: any) => {
        this.campaignData = res;
      }, (error) => {
        console.log("Error Fetching Data", error);

      });
    } else {
      console.error("Start date and End date is not valid");
    }
  };

  downloadRangeFile() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.downloadRangeFile(startDate, endDate);
    }
  }

  downloadCampaignLead() {
    const startDateValue = this.categForm.value.categStartDate;
    const endDateValue = this.categForm.value.categEndDate;
    const campaign = this.campaignName;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate && campaign) {
      this.auth.downloadCampaignLead(startDate, endDate, campaign);
    }
    this.categForm.reset();
  }

  downloadCategoryCamp() {
    const startDateValue = this.categForm.value.categStartDate;
    const endDateValue = this.categForm.value.categEndDate;
    const campaign = this.campaignName;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate && campaign) {
      this.auth.downloadCategoryCamp(startDate, endDate, campaign);
    }
    this.categForm.reset();
  }

  downloadDueFile() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.downloadDueFile(startDate, endDate);
    }
  }

  resetData() {
    location.reload();
  }
  bundles(){
    const url = `/salesHome/bundle-dashboard`;
    window.location.href = url;
    //window.open(url,'_blank');
  }
  salesWork(){
    const url = `/salesHome/salesDashboard`;
    window.location.href = url;
    //window.open(url,'_blank');
  }
}
