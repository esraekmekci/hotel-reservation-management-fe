import {OnInit, Component, Inject} from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FeatureDialogComponent } from '../feature-dialog/feature-dialog.component';

export interface Feature {
  id: number;
  name: string;
  roomNumbers: string;
}

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, NgFor],
  templateUrl: './feature-section.component.html',
  styleUrl: './feature-section.component.css'
})
export class FeatureSectionComponent implements OnInit {
  features : Feature[] = [];
  searchInput: string = "";
  filteredFeatures: any[] = [];
  name: string = "";

  constructor(private apiService : ApiService, public dialog: MatDialog){ 
    this.filteredFeatures = this.features;
  };
  
  async ngOnInit(){
    this.apiService.getAllFeatures().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        let roomNumbers = '';
        this.apiService.getRoomsByFeature({featureId: data[i].id}).subscribe(data2 => {
          roomNumbers = data2.map((room: { roomNumber: any; }) => room.roomNumber).join(', ');
          this.features.push({
            id: data[i].id,
            name: data[i].name,
            roomNumbers: roomNumbers
          });
        })
      }
    });
  }

  onSearchInput(event: any){
    this.searchInput = event.target.value;
    this.filterFeatures();
  }

  filterFeatures() {
    if (!this.searchInput) {
      this.filteredFeatures = this.features;
      return;
    }

    this.filteredFeatures = this.features.filter(feature =>
      feature.name.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }

  openDialog(editMode: boolean, featureId: any): void {
    if (editMode) {
      this.getFeature(featureId);
    }
    else {
      this.name = "";
    }

    setTimeout(() => {
      const dialogRef = this.dialog.open(FeatureDialogComponent, {
        data: {name: this.name, editMode: editMode, featureId: featureId},
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.refreshFeatures();
      });
    }, 500);

    
  }

  getFeature(featureId: any) {
    this.apiService.getFeatureById({id: featureId}).subscribe(data => {
      this.name = data.name;
    });
  }

  refreshFeatures() {
    this.features = [];
    this.ngOnInit();

    setTimeout(() => {
      this.filterFeatures();
    }, 500);
  }

  deleteFeature(id: number) {
    this.apiService.deleteFeature({id: id}).subscribe(data => {
      this.filteredFeatures = this.filteredFeatures.filter(feature => feature.id !== id);
    });
    alert("Feature successfully deleted.");
  }

}
