export class VentaEntity {
    constructor(
        public id?: number,
        public cCorrelativo?: string,
        public nTipoOrigen?: number,
        public cliente_id?: number,
        public vendedor_id?: number,
        public nTipoComprobante?: number,
        public nTipoPago?: number,
        public nEfectivoRecibido?: number,
        public bEfectivoExacto?: boolean,
        public nVuelto?: number,
        public cCodigoOperacion?: string,
        public nSubTotal?: number,
        public IGV?: number,
        public nValorIGV?: number,
        public nDescuento?: number,
        public nTotal?: number,
        public cObservaciones?: string,
        public nEstado?: number,
        public cUsuarioCreacion?: string,
        public cUsuarioModificacion?: string,
        public cClienteCorreo?:string,

        public cVendedorCorreo?:string,

        public listProductos?: Array<DetalleVentaEntity>,



    ) { }
}

export class DetalleVentaEntity {
    constructor(
        public id?: number,
        public venta_id?: number,
        public producto_id?: number,
        public producto_nombre?: string,
        public nCantidad?: number,
        public nPrecioUnitario?: number,
        public nDescuento?: number,
        public nEstado?: number,
        public cUsuarioCreacion?: string,
        public cUsuarioModificacion?: string

    ) { }
}

