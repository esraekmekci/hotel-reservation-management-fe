import {OnInit, Component} from '@angular/core';
import { NgFor } from '@angular/common';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

export interface Room {
  id: number;
  roomNumber: number;
  capacity: number;
  roomType: string;
  features: string;
  price: number;
}

@Component({
  selector: 'app-room-section',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgFor, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './room-section.component.html',
  styleUrl: './room-section.component.css'
})

export class RoomSectionComponent  implements OnInit {
  rooms : Room[] = [];
  reservations:any[] = [];
  filteredRooms: any[] = []; 
  roomTypes: any[] = [];
  selectedRoomType: string = '';
  capacities: number[] = [1, 2, 3, 4, 5];
  selectedCapacity: number = 0;
  initialized: boolean = false;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private apiService : ApiService, private router: Router){ 
    this.filteredRooms = this.rooms;
  };
  
  async ngOnInit(){
    this.apiService.getAllRooms().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.rooms.push({
          id: data[i].id,
          roomNumber: data[i].roomNumber,
          features: data[i].features.map((feature: { name: any; }) => feature.name).join(', '),
          capacity: data[i].capacity,
          roomType: data[i].roomType,
          price: data[i].price
        });
      }
    });

    this.apiService.getAllReservations().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.reservations.push({
          id: data[i].id,
          roomNumber: data[i].room.roomNumber,
          checkInDate: data[i].checkInDate,
          checkOutDate: data[i].checkOutDate
        });
      }
    });

    this.apiService.getAllRoomTypes().subscribe(data => {
      this.roomTypes = data;
    });

  }

  navigateToEditRoom(id: number) {
    this.router.navigate(['/editroom', id]);
  }

  navigateToCreateReservation(id: number) {
    this.router.navigate(['/createreservation', id]);
  }

  navigateToCreateRoom() {
    this.router.navigate(['/createroom']);
  }

  deleteRoom(id: number) {
    this.apiService.deleteRoom({id: id}).subscribe(data => {
      this.filteredRooms = this.filteredRooms.filter(room => room.id !== id);
    });
    alert("Room successfully deleted.");
  }
  
  showAvailableRooms() {
    const start = this.range.value.start;
    const end = this.range.value.end;
    if ((start === null || end === null || start === undefined || end === undefined) && !this.selectedCapacity && !this.selectedRoomType) {
      this.filteredRooms = this.rooms;
      return;
    }
    this.filteredRooms = this.rooms.filter(room => {
      if (!(start === null || end === null || start === undefined || end === undefined)){
        for (let reservation of this.reservations) {
          if (reservation.roomNumber === room.roomNumber) {
            const reservationStart = new Date(reservation.checkInDate);
            const reservationEnd = new Date(reservation.checkOutDate);
            if (start >= reservationStart && start <= reservationEnd) {
              return false;
            }
            if (end >= reservationStart && end <= reservationEnd) {
              return false;
            }
            if (start <= reservationStart && end >= reservationEnd) {
              return false;
            }
          }
        }
      }
      if (this.selectedRoomType && room.roomType !== this.selectedRoomType) {
        return false;
      }
      if (this.selectedCapacity && room.capacity !== this.selectedCapacity) {
        return false;
      }
      return true;
    });
    }

    resetFields() {
      this.selectedRoomType = '';
      this.selectedCapacity = 0;
      this.range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      });
      this.filteredRooms = this.rooms;
    }

}
