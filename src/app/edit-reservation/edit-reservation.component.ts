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

export interface Reservation {
  id: number;
  room: any;
  currentCustomers: any[];
  services: any[];
  checkInDate: string;
  checkOutDate: string;
  checkedIn: boolean;
  checkedOut: boolean;
  checkedInDate: string;
  checkedOutDate: string;
}

@Component({
  selector: 'app-edit-reservation',
  standalone: true,
  imports: [NgFor, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, JsonPipe, NgIf],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-reservation.component.html',
  styleUrl: './edit-reservation.component.css'
})

export class EditReservationComponent {
  reservationId: number = 0;
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

  capacity: number = 0;
  isFull: boolean = false;

  range = new FormGroup({
    start: new FormControl<any | null>(null),
    end: new FormControl<any | null>(null),
  });
  
  currentReservation: Reservation = {
    id: 0,
    room: {},
    currentCustomers: [],
    services: [],
    checkInDate: '',
    checkOutDate: '',
    checkedIn: false,
    checkedOut: false,
    checkedInDate: '',
    checkedOutDate: ''
  };

  ngOnInit(){
    this.apiService.getReservationById({id: this.reservationId}).subscribe(data => {
      this.currentReservation = {
        id: this.reservationId,
        room: data.room,
        currentCustomers: data.customers,
        services: data.services,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        checkedIn: data.checkedInDate !== null,
        checkedOut: data.checkedOutDate !== null,
        checkedInDate: data.checkedInDate,
        checkedOutDate: data.checkedOutDate
      };

      this.apiService.getReservationServicesByReservationId({id: this.reservationId}).subscribe(data2 => {
        for (let j = 0; j < data2.length; j++) {
          for (let k = 0; k < this.currentReservation.services.length; k++) {
            if (this.currentReservation.services[k].id === data2[j].service.id) {
              this.currentReservation.services[k].quantity = data2[j].quantity;
            }
          }
        }
      });

      this.selectedRoom = this.currentReservation.room;
      this.selectedCustomerIds = this.currentReservation.currentCustomers.map(customer => customer.id);
      this.isCheckedIn = this.currentReservation.checkedIn ? 'true' : 'false';
      this.isCheckedOut = this.currentReservation.checkedOut ? 'true' : 'false';
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

    setTimeout(() => {
      this.apiService.getRoomById({id: this.selectedRoom.id}).subscribe(data => {
        this.capacity = data.capacity;
      });
    }, 500);


  }
  
  initializeQuantities() {
    for (let service of this.services) {
      this.serviceQuantities[service.id] = 0;
    }

    for (let i = 0; i < this.currentReservation.services.length; i++ ) {
      let service = this.currentReservation.services[i];
      this.serviceQuantities[service.id] = service.quantity;
      this.saveService(service.id, i);
    }
  }

  checkCapacity() {
    console.log(this.capacity)
    if (this.selectedCustomerIds.length >= this.capacity) {
      this.isFull = true;
    } else {
      this.isFull = false;
    }
  }

  isOptionDisabled(customerId: any): boolean {
    return this.selectedCustomerIds.length >= this.capacity && !this.selectedCustomerIds.includes(customerId);
  }

  saveService(serviceId: any, i: number) {
    const quantity = this.serviceQuantities[serviceId];
    console.log(serviceId, quantity)
    if (quantity > 0 && quantity !== undefined && quantity !== this.currentReservation.services[i].quantity) {
      this.reservation.serviceIds.push(serviceId);
      this.reservation.serviceQuantities.push(this.serviceQuantities[serviceId]);
      this.disableButton(i-1);
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

  saveReservation() {
    try{
      this.watchDateRange();
      this.reservation.id = this.reservationId;
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
      if (this.isCheckedIn === 'true' && this.currentReservation.checkedIn === false) {
        this.reservation.checkedInDate = new Date().toISOString();
      }
      else if (this.isCheckedIn === 'false' && this.currentReservation.checkedIn === true){
        this.reservation.checkedInDate = null;
      }
      else if (this.currentReservation.checkedInDate){
        this.reservation.checkedInDate = this.currentReservation.checkedInDate;
      }
      if (this.isCheckedOut === 'true' && this.currentReservation.checkedOut === false) {
        this.reservation.checkedOutDate = new Date().toISOString();
      }
      else if (this.isCheckedOut === 'false' && this.currentReservation.checkedOut === true){
        this.reservation.checkedOutDate = null;
      }
      else if (this.currentReservation.checkedOutDate){
        this.reservation.checkedOutDate = this.currentReservation.checkedOutDate;
      }
      this.apiService.updateReservation(this.reservation).subscribe(data => {
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

  navigateToHome(){
    this.router.navigate(['/']);
  }

  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {
    this.reservationId = Number(this.route.snapshot.params['id']);
    setTimeout(() => {
      this.initializeQuantities();
      this.range = this.fb.group({
        start: [new Date(((new Date(this.currentReservation.checkInDate)).getMonth() + 1).toString().padStart(2, '0') + '/' + (new Date(this.currentReservation.checkInDate)).getDate().toString().padStart(2, '0') + '/' + (new Date(this.currentReservation.checkInDate)).getFullYear()), []], 
        end: [new Date(((new Date(this.currentReservation.checkOutDate)).getMonth() + 1).toString().padStart(2, '0') + '/' + (new Date(this.currentReservation.checkOutDate)).getDate().toString().padStart(2, '0') + '/' + (new Date(this.currentReservation.checkOutDate)).getFullYear()), []] 
      });
      console.log(this.range)
    }, 500);
  }  
}
