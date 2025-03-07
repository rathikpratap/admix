import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessagingService } from '../service/messaging-service';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, ChartData, ChartOptions, BarController, BarElement, CategoryScale, LinearScale, ChartType, Color } from 'chart.js';
import { ToastrService } from 'ngx-toastr';

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
  closingData: any;
  salesPerson_name: any;
  projectStatus: any;
  combineTwo: any;
  closingStatus: any;
  salesStatus: any;
  combineThree: any;
  cloDatat: any;
  empData: any;
  statusData: any;
  allClosings:any;
  salesEmp:any;
  remainAmtPro: any

  salesData: any[] = [];
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartType: ChartType = 'bar';

  isAscending: { [key: string]: boolean } = {
    customer: true,
    data: true,
    cloDatat: true,
    empData: true,
    combineTwo: true,
    statusData: true,
    combineThree: true,
    closingStatus: true,
    salesStatus: true
  };

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_name: new FormControl("null"),
    categStartDate: new FormControl(""),
    categEndDate: new FormControl("")
  });
  closingForm = new FormGroup({
    closing_name: new FormControl("null")
  });
  salesForm = new FormGroup({
    salesperson_name: new FormControl("null")
  });
  statusForm = new FormGroup({
    project_status: new FormControl("null")
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

    this.closingForm.get('closing_name')?.valueChanges.subscribe(value => {
      this.closingData = this.closingForm.get('closing_name')?.value;
      this.getData();
      this.check();
      this.checkTwo();
    });
    this.salesForm.get('salesperson_name')?.valueChanges.subscribe(value => {
      this.salesPerson_name = this.salesForm.get('salesperson_name')?.value;
      console.log("SalesPerson NAme=====>>", this.salesPerson_name);
      this.getSalesData();
      this.check();
      this.checkTwo();
    });
    this.statusForm.get('project_status')?.valueChanges.subscribe(value => {
      this.projectStatus = this.statusForm.get('project_status')?.value;
      console.log("PROJECT STATUS SELECT==========>>", this.projectStatus);
      this.getStatusData();
      this.checkTwo();
      this.check();
    });

    this.categForm.get('campaign_name')?.valueChanges.subscribe(value => {
      this.campaignName = this.categForm.get('campaign_name')?.value;
    });
    this.fetchSalesData();

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

  check() {
    if (this.closingData && this.salesPerson_name) {
      this.auth.getSalesClosing(this.closingData, this.salesPerson_name).subscribe((res: any) => {
        console.log("COMBINE======>>", res);
        this.combineTwo = res;
      });
    } else if (this.closingData && this.projectStatus) {
      this.auth.getClosingStatus(this.closingData, this.projectStatus).subscribe((res: any) => {
        this.closingStatus = res;
      })
    } else if (this.salesPerson_name && this.projectStatus) {
      this.auth.getSalesStatus(this.salesPerson_name, this.projectStatus).subscribe((res: any) => {
        this.salesStatus = res;
        console.log("SALES STATUS===========>>>", this.salesStatus);
      })
    }
  }
  checkTwo() {
    if (this.closingData && this.salesPerson_name && this.projectStatus) {
      this.auth.getSalesClosingStatus(this.closingData, this.salesPerson_name, this.projectStatus).subscribe((res: any) => {
        console.log("COMBINE THREE=============>>", res);
        this.combineThree = res;
      })
    }
  }

  getData() {
    this.auth.closingData(this.closingData).subscribe((list: any) => {
      this.cloDatat = list;
    })
  };
  getSalesData() {
    this.auth.empProjects(this.salesPerson_name).subscribe((list: any) => {
      this.empData = list;
    });
  };
  getStatusData() {
    this.auth.empStatus(this.projectStatus).subscribe((list: any) => {
      this.statusData = list;
    });
  }

  fetchSalesData() {
    this.auth.getSalesData().subscribe(data => {
      this.salesData = data;

      const salesPeopleSet = new Set<string>();
      const salesDataByPerson: { [salesPerson: string]: { currentMonth: number, lastMonth: number } } = {};

      let currentMonth = new Date().getMonth() + 1;
      let lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

      data.forEach((item:any) => {
        const salesPerson = item._id.salesPerson;
        const month = item._id.month;
        const totalSales = item.totalSales;

        salesPeopleSet.add(salesPerson);

        if (!salesDataByPerson[salesPerson]) {
          salesDataByPerson[salesPerson] = { currentMonth: 0, lastMonth: 0 };
        }

        if (month === currentMonth) {
          salesDataByPerson[salesPerson].currentMonth = totalSales;
        } else if (month === lastMonth) {
          salesDataByPerson[salesPerson].lastMonth = totalSales;
        }
      });

      this.chartLabels = Array.from(salesPeopleSet);
      this.chartData = [
        {
          data: this.chartLabels.map(person => salesDataByPerson[person]?.lastMonth || 0),
          label: 'Last Month Sales',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          data: this.chartLabels.map(person => salesDataByPerson[person]?.currentMonth || 0),
          label: 'Current Month Sales',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ];
    });
  }

  chartOptions: ChartOptions = {
    responsive: true
  };



  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  constructor(private auth: AuthService, private messagingService: MessagingService, private toastr: ToastrService) {
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
    });
    this.auth.allClosing().subscribe((res: any) => {
      this.allClosings = res;
    });
    this.auth.allEmployee().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.salesEmp = res.filter((empS: any) => empS.signupRole && empS.signupRole.includes('Sales Team'));
      } else {
        console.error("Unexpected response format:", res);
      }
    });
    this.auth.getremainingAmountProjects().subscribe((res: any) => {
      console.log("Remainig Projects", res);
      this.remainAmtPro = res;
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

  toggleHighlight(user: any) {
    user.isHighlighted = !user.isHighlighted;
    console.log("Toggling isHighlighted:", user.isHighlighted);
    this.updateProjectStatus(user);
  }

  updateProjectStatus(dataa: any) {
    console.log("UPDATE", dataa);
    this.auth.updateProjectStatusTeam([dataa]).subscribe((res: any) => {
      if (res) {
        console.log("UPDATE SUCCESS", res);
        this.toastr.success("Data Successfully Changed", "Success");
      }
    })
  }

  // Sort Function
  sortByClosingDate(dataSet: 'data' | 'cloDatat' | 'empData' | 'combineTwo' | 'statusData' | 'combineThree' | 'closingStatus' | 'salesStatus'): void {
    console.log("DATE DATE");
    this[dataSet].sort((a: any, b: any) => {
      const dateA = new Date(a.closingDate).getTime();
      const dateB = new Date(b.closingDate).getTime();

      return this.isAscending[dataSet] ? dateA - dateB : dateB - dateA;
    });

    this.isAscending[dataSet] = !this.isAscending[dataSet]; // Toggle sort order
  }
}
