import { LightningElement, wire } from "lwc";
import searchEmployees from "@salesforce/apex/EmployeeController.searchEmployees";
import employeeResource from "@salesforce/resourceUrl/employee_management";
import { publish, MessageContext } from "lightning/messageService";
import EMPLOYEE_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/EmployeeListUpdate__c";
import { NavigationMixin } from "lightning/navigation";

export default class EmployeeList extends NavigationMixin(LightningElement) {
  searchTerm = "";
  dropdownOptions = [
    { label: "All", value: "all" },
    { label: "Argentina", value: "Argentina" },
    { label: "USA", value: "USA" },
    { label: "India", value: "India" }
  ];
  filterVal = "all";
  appResources = {
    maleEmployeeImg: `${employeeResource}/male.png`,
    femaleEmployeeImg: `${employeeResource}/female.png`
  };

  employees;
  @wire(MessageContext) messageContext;
  @wire(searchEmployees, { searchTerm: "$searchTerm", filterVal: "$filterVal" })
  loadEmployees(result) {
    if (result.data) {
      const updatedResults = result.data.map((employee) => ({
        ...employee,
        imageSource: this.getEmployeeImageSource(employee)
      }));
      this.employees = updatedResults;
      const message = {
        employees: updatedResults
      };
      publish(this.messageContext, EMPLOYEE_LIST_UPDATE_MESSAGE, message);
    }
  }

  handleSearchTermChange(event) {
    window.clearTimeout(this.delayTimeout);
    const searchTerm = event.target.value;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.searchTerm = searchTerm;
    }, 300);
  }

  handleDropdownChange(event) {
    const dropDownValTerm = event.target.value;
    this.filterVal = dropDownValTerm;
  }

  get hasResults() {
    return this.employees.length > 0;
  }

  getEmployeeImageSource(employee) {
    return employee.Gender__c === "Male"
      ? this.appResources.maleEmployeeImg
      : this.appResources.femaleEmployeeImg;
  }

  handleEmployeeView(event) {
    const employeeId = event.detail;
    try {
      this[NavigationMixin.Navigate]({
        type: "standard__recordPage",
        attributes: {
          recordId: employeeId,
          objectApiName: "Employee__c",
          actionName: "view"
        }
      });
    } catch (error) {
      console.error("Error navigating to record page:", error);
    }
  }
}
