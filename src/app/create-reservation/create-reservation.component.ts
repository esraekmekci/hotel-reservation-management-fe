import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { NgIf, NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [NgFor, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, JsonPipe, NgIf],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.css'
})

export class CreateReservationComponent {
  roomId: number = 0;
  capacity: number = 0;
  isFull: boolean = false;
  reservation: any = {serviceIds: [], serviceQuantities: [], customerIds: [], roomNumber: '', checkInDate: '', checkOutDate: '', checkedInDate: '', checkedOutDate: ''};
  route: ActivatedRoute = inject(ActivatedRoute);
  services: any[] = [];
  rooms: any[] = [];
  customers: any[] = [];
  selectedServices: string[] = []; 
  serviceQuantities: { [key: string]: number } = {};
  selectedRoom: any = 0;
  selectedCustomerIds: any[] = [];
  selectedCheckInDate: string = '';
  selectedCheckOutDate: string = '';
  isCheckedIn: string = '';
  isCheckedOut: string = '';
  range: FormGroup;
  
  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {
    this.roomId = Number(this.route.snapshot.params['id']);
    this.initializeQuantities();
    this.range = this.fb.group({
      start: [new Date()], 
      end: [new Date()] 
    });
  }  

  ngOnInit(){
    this.apiService.getRoomById({id: this.roomId}).subscribe(data => {
      this.selectedRoom = data;
      this.capacity = this.selectedRoom.capacity;
    });

    this.apiService.getAllRooms().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.rooms.push(data[i]);
      }
    });

    this.apiService.getAllCustomers().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.customers.push(data[i]);
      }
    });

    this.apiService.getAllServices().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.services.push(data[i]);
      }
    });
  }
  
  initializeQuantities() {
    for (let service of this.services) {
      this.serviceQuantities[service.id] = 0;
    }
  }

  checkCapacity() {
    if (this.selectedCustomerIds.length >= this.capacity) {
      this.isFull = true;
    } else {
      this.isFull = false;
    }
  }

  isOptionDisabled(customer: any): boolean {
    return this.selectedCustomerIds.length >= this.capacity && !this.selectedCustomerIds.includes(customer.id);
  }

  saveService(serviceId: any, i: number) {
    const quantity = this.serviceQuantities[serviceId];
    console.log(serviceId, quantity)
    if (quantity > 0 && quantity !== undefined) {
      this.reservation.serviceIds.push(serviceId);
      this.reservation.serviceQuantities.push(this.serviceQuantities[serviceId]);
      this.disableButton(i);
    } else {
      console.log("Quantity is undefined.");
    }
  }

  disableButton(i: number) {
    const button = document.getElementById('button_' + i);
    if (button) {
      button.setAttribute('disabled', 'true');
    }
  }
  
  enableButton(i: number) {
    const button = document.getElementById('button_' + i);
    if (button) {
      button.removeAttribute('disabled');
    }
  }

  navigateToHome(){
    this.router.navigate(['/']);
  }

  watchDateRange() {
    const startDate = new Date(this.range.value.start);
    const endDate = new Date(this.range.value.end);
    let year = startDate.getFullYear();
    let month = ("0" + (startDate.getMonth() + 1)).slice(-2); 
    let day = ("0" + startDate.getDate()).slice(-2); 
    this.selectedCheckInDate = `${year}-${month}-${day}`;
    year = endDate.getFullYear();
    month = ("0" + (endDate.getMonth() + 1)).slice(-2);
    day = ("0" + endDate.getDate()).slice(-2);
    this.selectedCheckOutDate = `${year}-${month}-${day}`;
  }

  saveReservation() {
    console.log("basarili")
    try{
      this.watchDateRange();
      if (this.selectedRoom){
        this.reservation.roomNumber = this.selectedRoom.roomNumber;
      }
      if (this.selectedCustomerIds.length > 0){
        this.reservation.customerIds = this.selectedCustomerIds;
      }
      if (this.selectedCheckInDate !== 'NaN-aN-aN'){
        this.reservation.checkInDate = this.selectedCheckInDate;
      }
      if (this.selectedCheckOutDate !== 'NaN-aN-aN'){
        this.reservation.checkOutDate = this.selectedCheckOutDate;
      }
      if (this.isCheckedIn === 'true') {
        this.reservation.checkedInDate = new Date().toISOString();
      }
      else if (this.isCheckedIn === 'false'){
        this.reservation.checkedInDate = null;
      }
      if (this.isCheckedOut === 'true') {
        this.reservation.checkedOutDate = new Date().toISOString();
      }
      else if (this.isCheckedOut === 'false'){
        this.reservation.checkedOutDate = null;
      }
      this.apiService.createReservation(this.reservation).subscribe(data => {
          console.log(data);
          alert("Reservation successfully updated.");
        this.navigateToHome();
      });
      console.log(this.reservation);
    }
    catch (error: any) {
      console.log(error);
      alert("Error: " + error.message);
    }
  }
}
