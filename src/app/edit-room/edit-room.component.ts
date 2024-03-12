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
  selector: 'app-edit-room',
  standalone: true,
  imports: [NgFor, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.css'
})
export class EditRoomComponent {
  roomId: number = 0;
  route: ActivatedRoute = inject(ActivatedRoute);
  roomNumber: string = "";
  capacity: number = 0;
  roomTypes: any[] = [];
  roomType: string = '';
  features: any[] = [];
  price: string = "";
  capacities: number[] = [1, 2, 3, 4, 5];
  featureList: any[] = [];
  newRoom: any = {};
  
  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {
    this.roomId = Number(this.route.snapshot.params['id']);
  }  
  
  ngOnInit(){
    this.apiService.getAllRoomTypes().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.roomTypes.push(data[i]);
      }
    });

    this.apiService.getAllFeatures().subscribe(data => {
      for (let i = 0; i < data.length; i++){
        this.featureList.push({
          id: data[i].id,
          name: data[i].name,
          checked: false
        });
      }
    });

    this.apiService.getRoomById({id: this.roomId}).subscribe(data => {
      this.roomNumber = data.roomNumber;
      this.roomType = data.roomType;
      this.capacity = data.capacity;
      this.price = data.price;
      this.features = data.features.map((feature: { id: any; }) => feature.id);
      this.initializeFeatures();
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

  initializeFeatures(){
    console.log(this.features)
    for (let i = 0; i < this.featureList.length; i++){
      if (this.features.includes(this.featureList[i].id)){
        this.featureList[i].checked = true;
      }
    }
  }

  saveRoom(){
    try{
      this.newRoom = {
        id: this.roomId,
        roomNumber: this.roomNumber,
        capacity: this.capacity,
        roomType: this.roomType,
        featureIds: this.features,
        price: this.price
      }

      this.apiService.updateRoom(this.newRoom).subscribe(data => {
        console.log(data);
        if (data === null){
          alert("Room cannot be updated.");  
        }
        else{
          alert("Room successfully updated.");
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
