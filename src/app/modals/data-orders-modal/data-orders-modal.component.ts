import { Component, Inject, OnInit } from "@angular/core";
import { ApiService } from "../../service/api.service";
import Swal from "sweetalert2";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-data-orders-modal",
  templateUrl: "./data-orders-modal.component.html",
  styleUrls: ["./data-orders-modal.component.scss"],
})
export class DataOrdersModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DataOrdersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService
  ) { }

  name: String = "";
  apellidos: String = "";
  direccion: String = "";
  email: String = "";
  ciudad: String = "";
  pais: String = "";
  telefono: String = "";
  comentario: String = "";
  pickUp: 'SH' | 'PS' = 'PS';
  payment: 'cash' | 'target' = 'cash';
  total: String = "";
  detallePedido = [];


  crearPedido() {
    let status = false;
    if (this.name === "") {
      this.swalFire("Error", "Nombre vacio", "Debe ingresar un nombre");
    } else if (this.apellidos === "") {
      this.swalFire("Error", "Apellido vacio", "Debe ingresar un apellido");
    } else if (this.direccion === "") {
      this.swalFire("Error", "Direccion vacia", "Debe ingresar una direccion");
    } else if (this.email === "") {
      this.swalFire("Error", "Email vacio", "Debe ingresar un email");
    } else if (this.ciudad === "") {
      this.swalFire(
        "Error",
        "Ciudad vacia",
        "Debe ingresar una ciudad o departamento"
      );
    } else if (this.telefono === "") {
      this.swalFire("Error", "Telefono vacio", "Debe ingresar un telefono");
    } else {
      Swal.fire({
        title: "Confirmacion de datos",
        text: "¿Los datos ingresados son correctos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.post('Pedido/createPedido', {
            Pedido: {
              ClienteID: '1', //obtener del localstorage
              VendedorID: '1', // por el momento enviarlo quemado
              RepartidorID: '1', // por el momento enviarlo quemado
              Estado: "Proceso",
              Comentario: this.comentario,
              total: this.data.total,
              nombreCliente: this.name + " " + this.apellidos,
              direccionEntrega: this.direccion,
              emailCliente: this.email,
              ciudadEntrega: 'Guatemala',
              telefonoCliente: this.telefono.toString(),
              metodoPago: this.payment,
              tipoEntrega: this.pickUp,
              DetallePedido: this.data.detallePedido
            }
          }).subscribe({
            next: (res: any) => {
              console.log(res.retrievePedidosResponse);
              if (res.retrievePedidosResponse.ApiResponseIndicator == "SUCCESS") {
                Swal.fire("Pedido se ha creado con exito!", "ID: " + res.retrievePedidosResponse.ID, "success");
                this.dialogRef.close({
                  status: status = true
                });
              } else {
                this.swalMixin("No se pudo crear el pedido", "error");
              }
            },
            error: (error: any) => {
              this.swalMixin("Error al crear el pedido", "error");
              console.error("Error al crear el pedido", error);
            },
          })

        }
      });
    }
  }
  ngOnInit(): void {
    this.total = this.data?.total;
    this.detallePedido = this.data?.detallePedido;
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
