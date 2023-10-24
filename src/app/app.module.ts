import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MaterialModule } from './material-module';
import { MatTableModule } from '@angular/material/table';
import { DataOrdersModalComponent } from './modals/data-orders-modal/data-orders-modal.component';
import { ViewPedidosModalComponent } from './modals/view-pedidos-modal/view-pedidos-modal.component';
import { NewProductComponent } from './modals/new-product/new-product.component';
import { ModifyProductModalComponent } from './modals/modify-product-modal/modify-product-modal.component';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MaterialModule,
    MatTableModule,
    MatChipsModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    DataOrdersModalComponent,
    ViewPedidosModalComponent,
    NewProductComponent,
    ModifyProductModalComponent

  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
