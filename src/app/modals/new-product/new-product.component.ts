import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "app/service/api.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-new-product",
  templateUrl: "./new-product.component.html",
  styleUrls: ["./new-product.component.scss"],
})
export class NewProductComponent implements OnInit {
  constructor( public dialogRef: MatDialogRef<NewProductComponent>,private api: ApiService) {}

  producto: String;
  precio: number;
  
  descripcion: String;
  imagen: String;
  selectedEstado: boolean;
  estado = [
    {value: true, ViewValue: 'Disponible'},
    {value: false, ViewValue: 'No Disponible'},
  ];

  ngOnInit(): void {
    this.selectedEstado = true;
  }

  newProduct() {
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
      .post("products/setproducts", {
        Products: {
          Nombre: this.producto,
          Precio: this.precio,
          Estado: this.selectedEstado,
          Descripcion: this.descripcion,
          Foto: this.imagen
        },
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.ProductsResponse.ApiResponseIndicator == "SUCCESS") {
            Swal.fire(
              "Exito!",
              "Producto ingresado correctamente",
              "success"
            );
              this.dialogRef.close({
                result: true
              })
          } else {
            this.swalMixin("Error al ingresar producto", "error");
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
