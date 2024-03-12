import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { EditReservationComponent } from './edit-reservation/edit-reservation.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';

export const routes: Routes = [
    { path: '', component: NavbarComponent },
    { path: 'editreservation/:id' , component: EditReservationComponent },
    { path: 'editroom/:id' , component: EditRoomComponent },
    { path: 'editcustomer/:id' , component: EditCustomerComponent },
    { path: 'createreservation/:id' , component: CreateReservationComponent },
    { path: 'createroom' , component: CreateRoomComponent },
    { path: 'createcustomer' , component: CreateCustomerComponent }
];
