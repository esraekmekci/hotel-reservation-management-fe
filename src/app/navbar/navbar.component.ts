import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { CustomerSectionComponent } from '../customer-section/customer-section.component';
import { RoomSectionComponent } from '../room-section/room-section.component';
import { ReservationSectionComponent } from '../reservation-section/reservation-section.component';
import { FeatureSectionComponent } from '../feature-section/feature-section.component';
import { ServiceSectionComponent } from '../service-section/service-section.component';

@Component({
  selector: 'navbar-component',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
  standalone: true,
  imports: [MatTabsModule, MatIconModule, CustomerSectionComponent, RoomSectionComponent, ReservationSectionComponent, FeatureSectionComponent, ServiceSectionComponent],
})

export class NavbarComponent {}
