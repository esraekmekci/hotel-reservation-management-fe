import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-customer',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgFor, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {
  customerId: number = 0;
  route: ActivatedRoute = inject(ActivatedRoute);
  name: string = "";
  surname: string = "";
  identityNumber: any = "";
  phone: any = "";
  birthdate: string = "";
  newCustomer: any = {};

  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {
    this.customerId = Number(this.route.snapshot.params['id']);
  }

  ngOnInit(){
    this.apiService.getCustomerById({id: this.customerId}).subscribe(data => {
      this.name = data.name;
      this.surname = data.surname;
      this.identityNumber = data.identityNumber;
      this.phone = data.phone;
      this.birthdate = data.birthdate;
    });
  }

  navigateToHome(){
    this.router.navigate(['/']);
  }

  saveCustomer(){
    try{
      this.newCustomer = {
        id: this.customerId,
        name: this.name,
        surname: this.surname,
        identityNumber: this.identityNumber,
        phone: this.phone,
        birthdate: this.birthdate
      }
      this.apiService.updateCustomer(this.newCustomer).subscribe(data => {
        console.log(data)
        if (data){
          alert("Customer successfully updated.");
          this.navigateToHome();
        }
        else{
          alert("Customer cannot be updated.");
        
        }
      });
    } catch (error) {
      console.log(error);
    }

  }
}
