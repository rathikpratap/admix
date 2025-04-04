import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-campaign',
  templateUrl: './assign-campaign.component.html',
  styleUrl: './assign-campaign.component.css'
})
export class AssignCampaignComponent {

  emp: any[] = [];
  tok: any;
  campaigns: any;
  salesEmp: any;

  constructor(private auth: AuthService, private toastr : ToastrService) {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.allEmployee().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.salesEmp = res.filter((empS: any) => empS.signupRole && empS.signupRole.includes('Sales Team'));
        console.log("SALES PERSON=======>>", this.salesEmp);
      } else {
        console.error("Unexpected response format:", res);
      }
    });
    this.auth.getAssignedCampaigns().subscribe((res: any) => {
      this.campaigns = res.data.map((camp: any) => ({
          name: camp.campaignName,
          assignedEmployees: camp.employees || [],
          salesPerson1: camp.employees?.[0] || "",
          salesPerson2: camp.employees?.[1] || ""
      }));
      console.log("📌 Assigned Campaigns:", this.campaigns);
  });
  }
  assign(camp: any) {
    const selectedEmployees = [camp.salesPerson1, camp.salesPerson2].filter(emp => emp);

    if (!selectedEmployees.length) {
      alert("Please select atleast One SalesPerson");
      return;
    }
    const payload = {
      campaignName: camp.name,
      employees: selectedEmployees
    }
    this.auth.assignCampaign(payload).subscribe((res: any) => {
      this.toastr.success("Campaign Assigned Successfully", 'success');
      console.log("✅ Campaign Assigned Successfully", res);
    }, (err) => {
      this.toastr.error("Error Assigning Campaign", 'error');
      console.error("❌ Error Assigning Campaign:", err);
    });
  }
}
