import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessagingService } from '../service/messaging-service';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, ChartData, ChartOptions, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        //label: 'Number of Closings',
        backgroundColor: ['#FF6384', // Color for the first segment
          '#36A2EB', // Color for the second segment
          '#FFCE56', // Color for the third segment
        ], // Example color
        borderColor: ['#FF6384', // Border color for the first segment
          '#36A2EB', // Border color for the second segment
          '#FFCE56', // Border color for the third segment
        ], // Example color
        borderWidth: 1
      }
    ]
  };
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      // {
      //   data: [],
      //   //label: 'Number of Closings',
      //   backgroundColor: ['#FF6384', // Color for the first segment
      //     '#36A2EB', // Color for the second segment
      //     '#FFCE56', // Color for the third segment
      //     ], // Example color
      //   borderColor: ['#FF6384', // Border color for the first segment
      //     '#36A2EB', // Border color for the second segment
      //     '#FFCE56', // Border color for the third segment
      //     ], // Example color
      //   borderWidth: 1
      // }
    ]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Salesperson'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Conversion Rate (%)'
        }
      }
    }
  };

  public lineChartData: ChartData<'line'> = {
    labels: [], // This will hold the labels for the X-axis (e.g., months)
    datasets: [
      // {
      //   data: [], // This will hold the conversion rate data
      //   label: 'Conversion Rate',
      //   borderColor: '#42A5F5',
      //   fill: false,
      //   tension: 0.1
      // }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "%";
          }
        }
      }
    }
  };


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
  onGoingDataCount: any;
  rangeTop: any;
  rangeMonthRestAmount: any;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_name: new FormControl("null"),
    categStartDate: new FormControl(""),
    categEndDate: new FormControl("")
  });

  // Array of predefined colors
  private color: string[] = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#E7E9ED', // Light Gray
    '#7DCEA0', // Green
    '#D4AC0D', // Gold
    '#D98880'  // Salmon
  ];

  ngOnInit(): void {

    this.categForm.get('campaign_name')?.valueChanges.subscribe(value => {
      this.campaignName = this.categForm.get('campaign_name')?.value;
    });

    Chart.register(
      DoughnutController,
      ArcElement,
      Tooltip,
      Legend,
      BarController,
      BarElement,
      CategoryScale,
      LinearScale
    );

    this.auth.conversionRateMonthly().subscribe((res: any) => {
      const conversionData = res.data;
      const salesPeople = Array.from(new Set(conversionData.map((item: { salesPerson: string }) => item.salesPerson)));
      const monthsYears = Array.from(new Set(conversionData.map((item: { month: number, year: number }) => `${item.month}/${item.year}`)));

      this.lineChartData.labels = monthsYears;

      this.lineChartData.datasets = salesPeople.map((salesPerson: any, index: number) => {
        const salesPersonData = conversionData.filter((item: { salesPerson: string }) => item.salesPerson === salesPerson);
        const data = monthsYears.map(monthYear => {
          const item = salesPersonData.find((dataItem: { month: number, year: number }) => `${dataItem.month}/${dataItem.year}` === monthYear);
          return item ? Number(item.conversionRate) : 0;
        });

        return {
          data: data,
          label: salesPerson,
          borderColor: this.color[index % this.color.length], // Assign color from the predefined array
          backgroundColor: this.color[index % this.color.length],
          fill: false,
          tension: 0.1
        };
      });
    });

    this.auth.topCategory().subscribe((data: { _id: string, numberOfClosings: number }[]) => {
      const labels = data.map(item => item._id);
      const values = data.map(item => item.numberOfClosings);

      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FF6F61', '#6A1B9A', '#1E88E5'
      ];

      const backgroundColors = colors.slice(0, values.length);
      const borderColors = backgroundColors.map(color => color.replace('0.5', '1')); // Adjust border colors


      this.doughnutChartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors, // Set segment colors
            borderColor: borderColors,
            borderWidth: 1
          }
        ]
      };
    });

    // this.auth.conversionRate().subscribe((res: any) => {
    //   const data = res.data;
    //   const labels = data.map((item: { salesPerson: string }) => item.salesPerson);
    //   const conversionRate = data.map((item: { conversionRate: string }) => parseFloat(item.conversionRate));

    //   this.barChartData = {
    //     labels: labels,
    //     datasets: [
    //       {
    //         data: conversionRate,
    //         label: 'Conversion Rate(%)',
    //         backgroundColor: 'rgba(75, 192, 192, 0.5)',
    //         borderColor: 'rgba(75, 192, 192, 1)',
    //         borderWidth: 1
    //       }
    //     ]
    //   };
    // });

  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
      this.auth.getOngoingRangeData(startDate, endDate).subscribe((onGoingData: any) => {
        this.onGoingDataCount = onGoingData.length;
      }, (error) => {
        console.error("Error Fetching Ongoing", error);
      });
      this.auth.rangeTopPerformer(startDate, endDate).subscribe((top: any) => {
        this.rangeTop = top[0]?._id;
      });
      this.auth.rangeTotalRecv(startDate, endDate).subscribe((res: any) => {
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
  other(){
    const url = `/b2b-dashboard`;
    window.location.href = url;
    //window.open(url,'_blank');
  }
}
