import {OnInit, Component} from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

export interface Customer {
  id: number;
  name: string;
  surname: string;
  identityNumber: number;
  phone: number;
  birthdate: string;
}

@Component({
  selector: 'app-customer-section',
  standalone: true,
  imports: [NgFor],
  templateUrl: './customer-section.component.html',
  styleUrl: './customer-section.component.css'
})

export class CustomerSectionComponent implements OnInit {
  customers : Customer[] = [];
  filteredCustomers: any[] = [];
  searchQuery: string = ''; 

  constructor(private apiService : ApiService, private router: Router){ 
    this.filteredCustomers = this.customers;
  };
  
  async ngOnInit(){

    this.apiService.getAllCustomers().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.customers.push({
          id: data[i].id,
          name: data[i].name,
          surname: data[i].surname,
          identityNumber: data[i].identityNumber,
          phone: data[i].phone,
          birthdate: data[i].birthdate
        });
      }
    });
  }

  onSearchInput(searchValue: any) {
    this.searchQuery = searchValue.target.value;
    this.filterCustomers();
  }

  filterCustomers() {
    if (!this.searchQuery) {
      this.filteredCustomers = this.customers;
      return;
    }

    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      customer.surname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      customer.identityNumber.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  deleteCustomer(id: number) {
    this.apiService.deleteCustomer({id: id}).subscribe(data => {
      this.filteredCustomers = this.filteredCustomers.filter(customer => customer.id !== id);
    });
    alert("Customer successfully deleted.");
  }

  navigateToEditCustomer(id: number) {
    this.router.navigate(['/editcustomer', id]);
  }

  navigateToCreateCustomer() {
    this.router.navigate(['/createcustomer']);
  }
}
