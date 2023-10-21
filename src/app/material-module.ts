import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from '@angular/material/expansion';

// import { NgxEchartsModule } from 'ngx-echarts';
const materialModules = [

  // TableVirtualScrollModule,
  MatTableModule,
  MatPaginatorModule,
  MatSelectModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatRadioModule,
  MatDialogModule,
  MatExpansionModule,
  // NgxMaskModule.forRoot(),
  MatButtonModule,
  MatFormFieldModule,
  
  MatProgressBarModule,
  MatCheckboxModule,
  MatPaginatorModule,
  
  // MatStepperModule,
  // NgxDatatableModule,
  // MatProgressButtonsModule,
  MatSortModule,
  
];

@NgModule({
  declarations: [],
  imports: [materialModules],
  exports: [materialModules],
})
export class MaterialModule {}
