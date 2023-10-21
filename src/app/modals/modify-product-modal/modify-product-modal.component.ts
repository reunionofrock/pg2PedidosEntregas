import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-product-modal',
  templateUrl: './modify-product-modal.component.html',
  styleUrls: ['./modify-product-modal.component.scss']
})
export class ModifyProductModalComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ModifyProductModalComponent>,private api: ApiService) { }

  id: number;
  producto: String;
  precio: number;
  descripcion: String;
  selectedEstado: boolean;
  estado = [
    {value: true, ViewValue: 'Disponible'},
    {value: false, ViewValue: 'No Disponible'},
  ];
  imagen: String;

  ngOnInit(): void {
    this.id=this.data.id;
    this.producto = this.data.nombre;
    this.precio = this.data.precio;
    this.descripcion = this.data.descrripcion;
    this.selectedEstado = this.data.disponible;
    this.imagen=this.data.imagen;
  }

  modifyProduct() {
    if (this.producto === "" || this.producto === undefined) {
      this.swalFire("warning", "Nombre producto invalido", "Ingresa un nombre de producto");
    } else if (this.precio <= 0 || this.precio === undefined) {
      this.swalFire("warning", "Precio invalido", "El precio debe ser mayor a 0");
    }else if(this.descripcion === "" || this.descripcion === undefined){
      this.swalFire("warning", "Descripcion vacia", "Debe ingresar una descripcion");
    }else if(this.imagen === "" || this.imagen === undefined){
      this.swalFire("warning", "Link invalido", "Debe ingresar un link de imagen valido");
    } else {
      this.api
      .post("products/modifyProduct", {
        Products: {
          idProducto: this.id.toString(),
          Nombre: this.producto,
          Precio: this.precio.toString(),
          Estado: this.selectedEstado,
          Descripcion: this.descripcion,
          Imagen: this.imagen
        },
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.ProductsResponse.ApiResponseIndicator == "SUCCESS") {
            Swal.fire(
              "Exito!",
              "Producto modificado correctamente",
              "success"
            );
              this.dialogRef.close({
                result: true
              })
          } else {
            this.swalMixin("Error al modificar producto", "error");
          }
        },
        error: (error: any) => {
          this.swalMixin("Error de servidor", "error");
          console.error("Error de servidor", error);
        },
      });
    }
    
  }

  swalFire(icon, title, text) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  swalMixin(title, icon) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icon,
      title: title,
    });
    // this.barbool = false;
  }
}
