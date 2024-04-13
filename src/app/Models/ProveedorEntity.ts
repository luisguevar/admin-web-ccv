export class ProveedorEntity {
    constructor(
        public id?: number,
        public cRazonSocial?: string,
        public nTipoPersona?: number,
        public nTipoDocumento?: number,
        public cNroDocumento?: string,
        public cCelular?: string,
        public cPaginaWeb?: string,
        public cCorreo?: string,
        public cDireccion?: string,
        public cActividadPrincipal?: string,
        public cObservaciones?: string,
        public nEstado?: number,
        public cUsuarioCreacion?: string,
        public cUsuarioModificacion?: string,
        public listContactos?: Array<ProveedorContactoEntity>,
 


    ) { }
}

export class ProveedorContactoEntity {
    constructor(
        public id?: number,
        public proveedor_id?: number,
        public cNombreCompleto?: string,
        public cCelular?: string,
        public cCorreo?: string,
        public nTipoDocumento?: number,
        public cNroDocumento?: string,
        public nEstado?: number,
        public cUsuarioCreacion?: string,
        public cUsuarioModificacion?: string,


    ) { }
}