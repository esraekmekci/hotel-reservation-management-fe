import {OnInit, Component, Inject} from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';

export interface Service {
  id: number;
  name: string;
  unitPrice: number;
}

@Component({
  selector: 'app-service-section',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, NgFor],
  templateUrl: './service-section.component.html',
  styleUrl: './service-section.component.css'
})

export class ServiceSectionComponent {
  services : Service[] = [];
  searchInput: string = "";
  filteredServices: any[] = [];
  name: string = "";
  unitPrice: any = "";

  constructor(private apiService : ApiService, private router: Router, public dialog: MatDialog){ 
    this.filteredServices = this.services;
  };
  
  async ngOnInit(){
    this.apiService.getAllServices().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.services.push({
          id: data[i].id,
          name: data[i].name,
          unitPrice: data[i].unitPrice
        });
      }
    });
  }

  onSearchInput(event: any){
    this.searchInput = event.target.value;
    this.filterServices();
  }

  filterServices() {
    if (!this.searchInput) {
      this.filteredServices = this.services;
      return;
    }

    this.filteredServices = this.services.filter(service =>
      service.name.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }

  navigateToCreateService(){
    this.router.navigate(['/create-service']);
  }

  openDialog(editMode: boolean, serviceId: any): void {
    if (editMode) {
      this.getService(serviceId);
    }
    else {
      this.name = "";
      this.unitPrice = "";
    }

    setTimeout(() => {
      const dialogRef = this.dialog.open(ServiceDialogComponent, {
        data: {name: this.name, unitPrice: this.unitPrice, editMode: editMode, serviceId: serviceId},
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.refreshServices();
      });
    }, 500);

    
  }

  getService(serviceId: any) {
    this.apiService.getServiceById({id: serviceId}).subscribe(data => {
      this.name = data.name;
      this.unitPrice = data.unitPrice;
    });
  }

  refreshServices() {
    this.apiService.getAllServices().subscribe(data => {
      this.services = [];
      for(let i = 0; i < data.length; i++){
        this.services.push({
          id: data[i].id,
          name: data[i].name,
          unitPrice: data[i].unitPrice
        });
      }
    });

    setTimeout(() => {
      this.filterServices();
    }, 500);
  }

  deleteService(id: number) {
    this.apiService.deleteService({id: id}).subscribe(data => {
      this.filteredServices = this.filteredServices.filter(service => service.id !== id);
    });
    alert("Service successfully deleted.");
  }

}
