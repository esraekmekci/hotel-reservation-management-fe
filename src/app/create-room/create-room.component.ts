import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import { NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [NgFor, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent {
  roomNumber: string = "";
  capacity: number = 0;
  roomTypes: any[] = [];
  roomType: string = '';
  features: any[] = [];
  price: string = "";
  capacities: number[] = [1, 2, 3, 4, 5];
  featureList: any[] = [];
  newRoom: any = {};
  
  constructor(private router: Router, private apiService: ApiService) {}    

  ngOnInit(){
    this.apiService.getAllRoomTypes().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.roomTypes.push(data[i]);
      }
    });

    this.apiService.getAllFeatures().subscribe(data => {
      this.featureList = data;
    });
  }

  navigateToHome(){
    this.router.navigate(['/']);
  }

  updateFeatures(id:number){ 
    if (this.features.includes(id)){
      this.features = this.features.filter(feature => feature !== id);
    } else {
      this.features.push(id);
    }

    console.log(this.features)
  }

  saveRoom(){
    try{
      this.newRoom = {
        roomNumber: this.roomNumber,
        capacity: this.capacity,
        roomType: this.roomType,
        featureIds: this.features,
        price: this.price
      }

      this.apiService.createRoom(this.newRoom).subscribe(data => {
        console.log(data);
        if (data === null){
          alert("Room already exists.");  
        }
        else{
          alert("Room successfully created.");
          this.navigateToHome();
        }
      });
    }
    catch (error:any){
      console.error(error);
      alert('An error occurred while saving the room: ' + error.message);
    }
  }
  
}
