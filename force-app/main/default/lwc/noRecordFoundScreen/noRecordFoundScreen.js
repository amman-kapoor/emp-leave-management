// NoRecordFoundScreen.js
import { LightningElement } from "lwc";
import employeeResource from "@salesforce/resourceUrl/employee_management";

export default class NoRecordFoundScreen extends LightningElement {
  // Set the image path using the Salesforce static resource URL
  imagePath = `${employeeResource}/noRecordFound.jpg`;
}
