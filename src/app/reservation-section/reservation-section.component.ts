import {OnInit, Component, NgModule} from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

export interface Reservation {
  id: number;
  roomNumber: number;
  customerNames: string;
  services: any[];
  checkInDate: string;
  checkOutDate: string;
  checkedIn: boolean;
  checkedOut: boolean;
}


@Component({
  selector: 'app-reservation-section',
  standalone: true,
  imports: [NgFor],
  templateUrl: './reservation-section.component.html',
  styleUrl: './reservation-section.component.css'
})

export class ReservationSectionComponent  implements OnInit {
  reservations:Reservation[] = [];
  filteredReservations: any[] = []; 
  searchQuery: string = ''; 

  constructor(private apiService : ApiService, private router: Router){
    this.filteredReservations = this.reservations;
  };


  filterReservations() {
    if (!this.searchQuery) {
      this.filteredReservations = this.reservations;
      return;
    }

    this.filteredReservations = this.reservations.filter(reservation =>
      reservation.customerNames.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      reservation.roomNumber.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchInput(searchValue: any) {
    this.searchQuery = searchValue.target.value;
    this.filterReservations();
  }
  
  async ngOnInit(){
    this.apiService.getAllReservations().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.reservations.push({
          id: data[i].id,
          roomNumber: data[i].room.roomNumber,
          customerNames: data[i].customers.map((customer: { name: any; surname: any; }) => {
            return `${customer.name} ${customer.surname}`;
          }).join(', '),
          services: data[i].services,
          checkInDate: data[i].checkInDate,
          checkOutDate: data[i].checkOutDate,
          checkedIn: data[i].checkedInDate !== null,
          checkedOut: data[i].checkedOutDate !== null
        });

        this.apiService.getReservationServicesByReservationId({id: data[i].id}).subscribe(data2 => {
          for (let j = 0; j < data2.length; j++) {
            for (let k = 0; k < this.reservations[i].services.length; k++) {
              if (this.reservations[i].services[k].id === data2[j].service.id) {
                this.reservations[i].services[k].quantity = data2[j].quantity;
              }
            }
          }
        });

      }
    });
  }

  navigateToEditReservation(id: number) {
    this.router.navigate(['/editreservation', id]);
  }
  
  deleteReservation(id: number) {
    this.apiService.deleteReservation({id: id}).subscribe(data => {
      this.filteredReservations = this.filteredReservations.filter(reservation => reservation.id !== id);
    });
    alert("Reservation successfully deleted.");
  }
}
