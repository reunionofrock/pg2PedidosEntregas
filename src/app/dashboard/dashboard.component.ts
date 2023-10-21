import { Component, Injectable, OnInit } from "@angular/core";
import * as Chartist from "chartist";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DataOrdersModalComponent } from "app/modals/data-orders-modal/data-orders-modal.component";
import { ApiService } from "../service/api.service";
import Swal from "sweetalert2";
import { ViewPedidosModalComponent } from "app/modals/view-pedidos-modal/view-pedidos-modal.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
@Injectable({
  providedIn: "root", // Regístralo en el módulo raíz
})
export class DashboardComponent implements OnInit {
  barbool: boolean = true;
  skBool: boolean = false;
  myIdPedido: Number;
  myEmailPedido: String;
  products:Array<any> = [
    // Agrega más productos según tus necesidades
  ];
  cantidadProd: number = 1;

  pickUp: "puh" | "pus" = "pus";
  displayedColumnsDSKartShop: String[] = [
    "Producto",
    "Precio",
    "Cantidad",
    "subtotal",
    "Action",
  ];
  // dsKartShop = new MatTableDataSource<any>();

  dsKartShop = [
    // Agrega más productos según tus necesidades
  ];
  constructor(private dialog: MatDialog, private api: ApiService) {}

  viewPedido() {
    try {
      //?idPedido=39&emailPedido=@gmail.com
      this.api
        .get(
          "Pedido/getPedidos?idPedido=" +
            this.myIdPedido +
            "&emailPedido=" +
            this.myEmailPedido
        )
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
            if (
              resp.retrievePedidosResponse.ApiResponseIndicator == "SUCCESS"
            ) {
              this.api
                .get("Pedido/detallePedido?idPedido=" + this.myIdPedido)
                .subscribe({
                  next: (res: any) => {
                    console.log(res);
                    if (
                      res.retrievePedidosResponse.ApiResponseIndicator ==
                      "SUCCESS"
                    ) {
                      const dialogRef = this.dialog.open(
                        ViewPedidosModalComponent,
                        {
                          width: "85%",
                          height: "85%",
                          data: {
                            idPedido: this.myIdPedido,
                            correo: this.myEmailPedido,
                            detallePedido:
                              res.retrievePedidosResponse.DetallePedido,
                            pedido: resp.retrievePedidosResponse.Pedidos,
                          },
                        }
                      );
                    } else {
                      this.swalMixin("Error al cargar los pedidos", "error");
                    }
                  },
                  error: (error: any) => {
                    this.swalMixin(
                      "Error al obtener el detalle de pedidos",
                      "error"
                    );
                    console.error(
                      "Error al obtener el detalle de pedidos",
                      error
                    );
                  },
                });
            } else {
              this.swalMixin("Error al cargar los pedidos", "error");
            }
          },
          error: (error: any) => {
            this.swalMixin("Error al obtener pedidos", "error");
            console.error("Error al obtener productos", error);
          },
        });
    } catch (error) {
      console.error("Error de conexion", error);
      this.swalMixin("Error de conexion intente de nuevo", "error");
    }
  }

  getTotalCost() {
    return this.dsKartShop
      .map((t) => t.subtotal)
      .reduce((acc, value) => acc + value, 0)
      .toFixed(2);
  }

  openModal() {
    const dialogRef = this.dialog.open(DataOrdersModalComponent, {
      width: "auto",
      height: "85%",
      data: {
        total: this.getTotalCost().toString(),
        detallePedido: this.dsKartShop,
        // Configura el ancho del modal según tus necesidades
      },
    });
    // Suscríbete al evento de cierre del modal (si lo necesitas)
    dialogRef.afterClosed().subscribe((result) => {
      const data = result;
    });
  }

  getProducts() {
    try {
      if (this.products.length == 0) {
        this.api.get("products/getproducts").subscribe({
          next: (res: any) => {
            console.table(res.ProductsResponse.Productos);
            if (res.ProductsResponse.ApiResponseIndicator == "SUCCESS") {
              this.products = res.ProductsResponse.Productos;
              this.products.forEach((producto: any) => {
                producto.cantidad = 1;
                producto.subtotal = producto.precio;
              });
              this.products = [...this.products];
              this.barbool = false;
            } else {
              this.swalMixin("Error al cargar los productos", "error");
            }
          },
          error: (error: any) => {
            this.swalMixin("Error al obtener productos", "error");
            console.error("Error al obtener productos", error);
          },
        });
      }
    } catch (error) {
      console.error("Error de conexion", error);
      this.swalMixin("Error de conexion intente de nuevo", "error");
    }
  }
  addKartShop(producto: any) {
    //crea una copia del producto de lo contrario es un mergueo :v
    this.dsKartShop.push({ ...producto });
    this.dsKartShop = [...this.dsKartShop];
    this.swalMixin("Producto agregado al carrito de compras", "success");
    this.printKartbutton();
  }

  printKartbutton() {
    if (this.dsKartShop.length != 0) {
      this.skBool = true;
    } else {
      this.skBool = false;
    }
  }

  cont(valor: string, producto: any) {
    if (producto.disponible) {
      if (valor === "+") {
        producto.cantidad += 1;
        producto.subtotal = (producto.precio * producto.cantidad).toFixed(2); // Formatea el subtotal a dos decimales
      } else if (valor === "-") {
        if (producto.cantidad === 1) {
          producto.cantidad = 1;
          producto.subtotal = producto.precio.toFixed(2); // Formatea el subtotal a dos decimales cuando la cantidad llega a 1
        } else {
          producto.cantidad -= 1;
          producto.subtotal = (producto.precio * producto.cantidad).toFixed(2); // Formatea el subtotal a dos decimales
        }
      }
    } else {
      this.swalMixin("Este producto no se encuentra disponible", "warning");
    }
  }

  deleteRow(id: number) {
    try {
      const element = this.dsKartShop.find((prd) => prd.id === id);
      this.dsKartShop.splice(this.dsKartShop.indexOf(element));
      this.dsKartShop = [...this.dsKartShop];
      this.swalMixin("Producto removido del carrito de compras", "success");
    } catch (error) {
      this.swalMixin("no se puede quitar el producto", "error");
      console.error("no puede eliminar el producto", error);
    }
    this.printKartbutton();
  }
  ngOnInit() {
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
    this.getProducts();

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
    this.barbool = false;
  }
}
