import  { useState } from "react";
import { Link } from "react-router-dom";
import '../css/styles.css';

const Header = () => {

    const [menuActive, setMenuActive] = useState<string | null>(null);

    return (
       <header className="header">
            <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap py-3">
                <div className="logo">
                    <Link to={"/roles_permisos"}><img src="/img/logo.jpg" alt="Logo del sitio" />
                    </Link>
                   
                </div>
            <nav className="navbar p-0">
                <ul className="ul-actions d-flex flex-wrap justify-content-end">

                    <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('residents')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Residentes

                        {menuActive === 'residents' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/residente/mostrar">Lista de Residentes</Link>
                                </li>
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/residente/agregar">Agregar Residente</Link>
                                </li>
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/visitas">Registro Visitas</Link>
                                </li>
                                    <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/habitaciones">Habitaciones</Link>
                                    <Link className="sub_menu-options" to="/habitaciones/agregar">Agregar Habitación</Link>
                                </li>
                            </ul>
                        )}

                    </li>
                        
                    <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('personal')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Personal

                        {menuActive === 'personal' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/empleado/mostrar">Lista de Personal</Link>
                                </li>
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/empleado/agregar">Agregar Personal</Link>
                                </li>
                            </ul>
                        )}

                    </li>

                    <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('inventory')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Inventario y Compras

                        {menuActive === 'inventory' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/inventario">Lista de Inventario</Link>
                                    <Link className="sub_menu-options" to="/compras/agregar">Agregar Compra</Link>
                                    <Link className="sub_menu-options" to="/compras">Listar Compras</Link>
                                    <Link className="sub_menu-options" to="/productos">Listar Productos</Link>
                                    <Link className="sub_menu-options" to="/productos/agregar">Agregar Productos</Link>
                                </li>
                            </ul>
                        )}

                    </li>

                    <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('permissions')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Permisos

                        {menuActive === 'permissions' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/roles_permisos">Mostrar permisos</Link>
                                </li>
                            </ul>
                        )}

                    </li>

                     <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('suppliers')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Proveedores

                        {menuActive === 'suppliers' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/proveedores">Listar Proveedores</Link>
                                </li>
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/proveedores/agregar">Agregar Proveedores</Link>
                                </li>
                            </ul>
                        )}

                    </li>

                    <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('activities')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Actividades

                        {menuActive === 'activities' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/actividades/mostrar">Lista de Actividades</Link>
                                </li>
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/actividad/agregar">Agregar Actividad</Link>
                                </li>
                            </ul>
                        )}

                    </li>
                    
                </ul>
            </nav>
            </div>
        </header>
    );
};

export default Header;
