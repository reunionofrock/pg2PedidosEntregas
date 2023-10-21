import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import Swal from "sweetalert2";
import { ApiService } from "../service/api.service";
import { Session } from "protractor";
import { Observable } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { NewProductComponent } from "app/modals/new-product/new-product.component";
import { ModifyProductModalComponent } from "app/modals/modify-product-modal/modify-product-modal.component";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  user: String = "";
  pass: String = "";
  sesion: boolean = false;
  barbool: boolean = false;
  dataSource = new MatTableDataSource<any>();
  products: [];

  pedidos: [];
  displayedColumns = ["id", "producto", "precio", "estado", "action"];
  displayedColumnsDSKartShopAccepted = [
    "direccion",
    "total",
    "id",
    "accion",
    "estado",
  ];
  ngOnInit() {
    this.verifySesion();
  }

  verifySesion() {
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn == "true") {
      this.sesion = true;
      this.getProducts();
      this.getPedidosconDetalle();
    }
  }
  ngAfterViewInit() {
    // this.runOnRouteChange();
  }
  editRow(element: any) {
    const dialogRef = this.dialog.open(ModifyProductModalComponent, {
      width: "auto",
      height: "auto",
      data: element,
    });
    dialogRef.afterClosed().subscribe((result) => {
      const data = result;
      if (data) {
        this.getProducts();
      }
    });
  }
  deleteRow(element: any) {
    Swal.fire({
      title: "Estas seguro de borrar un producto?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete("products/delProduct?id=" + element.id).subscribe({
          next: (res: any) => {
            console.log(res.ProductsResponse.Productos);
            if (res.ProductsResponse.ApiResponseIndicator == "SUCCESS") {
              this.swalMixin("Producto eliminado con exito", "success");
              this.getProducts();
            } else {
              this.swalMixin("Error al cargar los productos", "error");
            }
          },
          error: (error: any) => {
            this.swalMixin("Error al eliminar producto", "error");
            console.error("Error al eliminar producto", error);
          },
        });
      }
    });
  }
  addProduct() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: "auto",
      height: "auto",
    });
    // Suscríbete al evento de cierre del modal (si lo necesitas)
    dialogRef.afterClosed().subscribe((result) => {
      const data = result;
      if (data) {
        this.getProducts();
      }
    });
  }
  getProducts() {
    try {
      this.api.get("products/getproducts").subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.ProductsResponse.ApiResponseIndicator == "SUCCESS") {
            this.products = res.ProductsResponse.Productos;
            this.products.sort((a: any, b: any) => a.id - b.id);
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
    } catch (error) {
      console.error("Error de conexion", error);
      this.swalMixin("Error de conexion intente de nuevo", "error");
    }
  }

  getPedidosconDetalle() {
    try {
      this.api.get("Pedido/getPedidos").subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp.retrievePedidosResponse.ApiResponseIndicator == "SUCCESS") {
            let pedidos = resp.retrievePedidosResponse.Pedidos;
            pedidos.forEach((pedido: any) => {
              if (pedido.idPedido !== undefined) {
                this.api
                  .get("Pedido/detallePedido?idPedido=" + pedido.idPedido)
                  .subscribe({
                    next: (res: any) => {
                      if (
                        res.retrievePedidosResponse.ApiResponseIndicator ==
                        "SUCCESS"
                      ) {
                        pedido.detalle =
                          res.retrievePedidosResponse.DetallePedido;
                        //console.log(pedido);
                      }
                    },
                    error: (error: any) => {
                      console.error(
                        "Error al obtener el detalle de pedidos",
                        error
                      );
                    },
                  });
              }
            });
            this.pedidos = pedidos;
            this.pedidos.sort((a:any, b: any) => a.idPedido-b.idPedido)
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
    console.log(this.pedidos);
  }
  //this.dataSource=new MatTableDataSource<any>(productos);

  login() {
    if (this.user.trim() === "") {
      this.swalFire("warning", "Usuario invalido", "Ingresa tu usuario");
    } else if (this.pass.trim() === "") {
      this.swalFire("warning", "Contraseña invalida", "Ingresa tu contraseña");
    } else {
      this.api
        .post("user/login", {
          login: {
            user: this.user,
            pass: this.pass,
          },
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            if (res.loginResponse.ApiResponseIndicator == "SUCCESS") {
              Swal.fire(
                "Inicio de sesion exitoso",
                "Bienvenido " + res.loginResponse.usuario.nombre,
                "success"
              );
              this.sesion = true;
              sessionStorage.setItem("isLoggedIn", this.sesion.toString());
              this.verifySesion();
            } else {
              this.swalMixin(res.loginResponse.ApiResponseDescription, "error");
            }
          },
          error: (error: any) => {
            this.swalMixin("Error de servidor", "error");
            console.error("Error de servidor", error);
          },
        });
    }
  }

  logout() {
    this.sesion = false;
    sessionStorage.removeItem("isLoggedIn");
    this.swalFire("success","Sesion cerrada con exito", "Vuelva pronto!");
  }

  modifyStatusPed(id,status){
    this.api
        .post("Pedido/modifypedido", {
            status: status,
            id_pedido: id.toString(),
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            if (res.PedidoResponse.ApiResponseIndicator == "SUCCESS") {
              this.swalMixin(res.PedidoResponse.ApiResponseDescription, "success");
              this.getPedidosconDetalle();
            } else {
              this.swalMixin(res.PedidoResponse.ApiResponseDescription, "error");
            }
          },
          error: (error: any) => {
            this.swalMixin("Error de servidor", "error");
            console.error("Error de servidor", error);
          },
        });
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
