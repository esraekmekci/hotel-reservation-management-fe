import { Component, inject } from '@angular/core';
import { MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import { NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgFor, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent {
  name: string = "";
  surname: string = "";
  identityNumber: any = "";
  phone: any = "";
  birthdate: string = "";
  newCustomer: any = {};

  constructor(private router: Router, private apiService: ApiService) {}    

  saveCustomer(){
    try{
      this.newCustomer = {
        name: this.name,
        surname: this.surname,
        identityNumber: this.identityNumber,
        phone: this.phone,
        birthdate: this.birthdate
      }
      this.apiService.createCustomer(this.newCustomer).subscribe(data => {
        console.log(data)
        if (data){
          alert("Customer successfully created.");
          this.navigateToHome();
        }
        else{
          alert("Customer already exists.");
        
        }
      });
    } catch (error) {
      console.log(error);
    }

  }
  
  navigateToHome(){
    this.router.navigate(['/']);
  }
}
