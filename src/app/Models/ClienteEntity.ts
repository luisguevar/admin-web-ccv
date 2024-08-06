export class ClienteEntity {
    constructor(
        public id?: number,
        public cNombres?: string,
        public cApellidos?: string,
        public cCorreo?: string,
        public nTipoPersona?: number,
        public nTipoDocumento?: number,
        public cNroDocumento?: string,
        public cCelular?: string,
        public cDireccion?: string,
        public pais_id?: number,
        public ciudad_id?: number,
        public nEstado?: number,
        public cUsuarioCreacion?: string,
        public cUsuarioModificacion?: string,

    ) { }
}

