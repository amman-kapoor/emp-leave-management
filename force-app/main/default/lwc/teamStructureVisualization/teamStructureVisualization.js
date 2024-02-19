// teamStructureVisualization.js
import { LightningElement, wire } from "lwc";
import getEmployeeHierarchy from "@salesforce/apex/EmployeeController.getEmployeeHierarchy";

export default class TeamStructureVisualization extends LightningElement {
  employeeHierarchy;

  @wire(getEmployeeHierarchy)
  loadHierarchy({ error, data }) {
    if (error) {
      // TODO: handle error
    } else if (data) {
      this.employeeHierarchy = data;
    }
  }
}
