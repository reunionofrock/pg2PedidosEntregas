import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-pedidos-modal',
  templateUrl: './view-pedidos-modal.component.html',
  styleUrls: ['./view-pedidos-modal.component.scss']
})
export class ViewPedidosModalComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ViewPedidosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    barbool: boolean = false;
    pedidos=[];
    detallePedido=[];
    panelOpenState = false;
    displayedColumns =[
      'nombre',
      'cantidad',
      'precio',
      'subtotal'
    ]
  ngOnInit(): void {
    this.pedidos = this.data?.pedido;
    this.detallePedido = this.data?.detallePedido;
  }

}
