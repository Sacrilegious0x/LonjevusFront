import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../css/styles.css';

const Header = () => {

    const [menuActive, setMenuActive] = useState<string | null>(null);

    return (
        <header className="header">
            <div className="logo">
                <img src="/img/logo.jpg" alt="Logo del sitio" />
            </div>
            <nav>
                <ul className="ul-actions">

                    <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('residents')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Residentes

                        {menuActive === 'residents' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/">Lista de Residentes</Link>
                                </li>
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="#">Agregar Residente</Link>
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
                                    <Link className="sub_menu-options" to="/mostrar">Lista de Personal</Link>
                                </li>
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/">Agregar Personal</Link>
                                </li>
                            </ul>
                        )}

                    </li>

                    <li className="ul-actions-li"
                        onMouseEnter={() => setMenuActive('inventory')}
                        onMouseLeave={() => setMenuActive(null)}>

                        Inventario

                        {menuActive === 'inventory' && (
                            <ul className="sub_ul-actions">
                                <li className="sub_ul-actions-li">
                                    <Link className="sub_menu-options" to="/">Lista de Inventario</Link>
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
                                    <Link className="sub_menu-options" to="/proveedores/guardar">Agregar Proveedores</Link>
                                </li>
                            </ul>
                        )}

                    </li>
                    
                </ul>
            </nav>
        </header>
    );
};

export default Header;
