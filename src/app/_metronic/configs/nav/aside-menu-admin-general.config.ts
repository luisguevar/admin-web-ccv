export const AsideMenuAdminGeneral = {
  items: [
    {
      title: 'Dashboard',
      root: true,
      name: "dashboard",
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },

    { section: 'Usuario' },

    {
      title: 'Usuarios',
      root: true,
      name: "users",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/users',
      submenu: [

        {
          title: 'Gestión de Usuarios',
          page: '/usuarios/listado-usuarios'
        }
      ]
    },

    {
      title: 'Clientes',
      root: true,
      name: "clientes",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Communication/Group.svg',
      page: '/clientes',
      submenu: [

        {
          title: 'Gestión de clientes',
          page: '/clientes/listado-clientes'
        }
      ]
    },

    { section: 'Productos' },
    {
      title: 'Categorias',
      root: true,
      name: "categorias",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Electric/Gas-stove.svg',
      page: '/categorias',
      submenu: [

        {
          title: 'Gestión de Categorias',
          page: '/categorias/listado-categorias'
        }
      ],

    },
    {
      title: 'Proveedores',
      root: true,
      name: "proveedores",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Shopping/Box2.svg',
      page: '/proveedores',
      submenu: [

        {
          title: 'Gestión de Proveedores',
          page: '/proveedores/gestionar-proveedores'
        }
      ]
    },

    {
      title: 'Productos',
      root: true,
      name: "productos",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Home/Armchair.svg',
      page: '/productos',
      submenu: [
        /*  {
           title: 'Crear Producto',
           page: '/productos/add-producto'
         }, */
        {
          title: 'Gestión de Productos',
          page: '/productos/listado-productos'
        }
      ]
    },



    { section: 'Ventas' },
    {
      title: 'Ventas',
      root: true,
      name: "ventas",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Communication/Clipboard-list.svg',
      page: '/ventas',
      submenu: [
        {
          title: 'Punto de venta',
          page: '/punto-venta/add-new-sale'
        },
        {
          title: 'Ordenes',
          page: '/ventas/lista-de-ordenes'
        }
      ]
    },
    {
      title: 'Cotizaciones',
      root: true,
      name: "cotizaciones",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Shopping/Box2.svg',
      page: '/cotizaciones',
      submenu: [

        {
          title: 'Gestión de Cotizaciones',
          page: '/cotizaciones/gestionar-cotizaciones'
        }
      ]
    },

    { section: 'Ecommerce' },
    {
      title: 'Sliders',
      root: true,
      name: "sliders",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Design/Image.svg',
      page: '/sliders',
      submenu: [
        {
          title: 'Listar Sliders',
          page: '/sliders/lista'
        }
      ]
    },
    {
      title: 'Cupones',
      root: true,
      name: "cupones",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Home/Toilet.svg',
      page: '/cupones',
      submenu: [
        {
          title: 'Regitrar Cupon',
          page: '/cupones/registrar-cupon'
        },
        {
          title: 'Listar Cupones',
          page: '/cupones/lista-cupones'
        }
      ]
    },
    {
      title: 'Descuento',
      root: true,
      name: "descuento",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Home/Cupboard.svg',
      page: '/descuento',
      submenu: [
        {
          title: 'Registrar Descuento',
          page: '/descuento/registrar-descuento'
        },
        {
          title: 'Listar descuentos',
          page: '/descuento/lista-descuentos'
        }
      ]
    },
  ]
}