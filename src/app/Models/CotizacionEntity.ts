export class CotizacionEntity {
    constructor(
        public id?: number,
        public cCorrelativo?: string,
        public cliente_id?: number,
        public vendedor_id?: number,
        public dFechaEmision?: Date,
        public dFechaExpiracion?: Date,
        public nTotal?: number,
        public cObservaciones?: string,
        public nEstado?: number,
        public bTieneDescuento?: boolean,
        public nValorDescuento?: number,
        public cUsuarioCreacion?: string,
        public cUsuarioModificacion?: string,
        public cNombreCliente?: string,
        public cClienteCorreo?: string,
        public listProductos?: Array<CotizacionProductoEntity>,



    ) { }
}

export class CotizacionProductoEntity {
    constructor(
        public id?: number,
        public cotizacion_id?: number,
        public producto_id?: number,
        public producto_nombre?: string,
        public nCantidad?: number,
        public nPrecioUnitario?: number,
        public nDescuento?: number,
        public nEstado?: number,
        public cUsuarioCreacion?: string,
        public cUsuarioModificacion?: string,
        public nTotalConDescuento?: number,
        public nTotalSinDescuento?: number,
        public nTotalDescuento?: number


    ) { }
}

