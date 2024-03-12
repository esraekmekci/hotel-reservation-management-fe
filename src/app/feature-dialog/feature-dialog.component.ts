import { Component, Inject } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-overview',
  templateUrl: 'dialog-overview.html',
  styleUrl: './feature-dialog.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class FeatureDialogComponent {
  newFeature: any = {};

  constructor(
    public dialogRef: MatDialogRef<FeatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService : ApiService,
    private router: Router
  ) { console.log(data)}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveFeature(){
    this.newFeature = {
      name: this.data.name
    }

    if (this.data.editMode) {
      this.newFeature.id = this.data.featureId;
      this.apiService.updateFeature(this.newFeature).subscribe(data => {
        console.log(data);
        this.dialogRef.close();
      });
    }
    else {
      this.apiService.createFeature(this.newFeature).subscribe(data => {
        this.dialogRef.close();
      });
    }
  }
}
