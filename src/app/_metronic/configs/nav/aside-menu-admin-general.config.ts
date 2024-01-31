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
          page: '/users/list'
        }
      ]
    },
    { section: 'Comercial' },
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
      svg: './assets/media/svg/icons/Files/Selected-file.svg',
      page: '/cotizaciones',
      submenu: [
        {
          title: 'Crear Cotización',
          page: '/cotizaciones/add-new-cotizacion'
        },
        {
          title: 'Lista de Cotizaciones',
          page: '/cotizaciones/list-cotizacion'
        }
      ]
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
          title: 'Registrar Proveedor',
          page: '/proveedores/add-new-proveedor'
        },
        {
          title: 'Lista de Proveedores',
          page: '/proveedores/list-proveedor'
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
          title: 'Gestionar clientes',
          page: '/clientes/lista'
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
          page: '/categorias/lista'
        }
      ]
    },
    {
      title: 'Productos',
      root: true,
      name: "products",
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Home/Armchair.svg',
      page: '/products',
      submenu: [
        {
          title: 'Crear Producto',
          page: '/products/add-product'
        },
        {
          title: 'Lista de Productos',
          page: '/products/list-product'
        }
      ]
    },
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