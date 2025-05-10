import Header from "../components/Header";
import Footer from "../components/Footer";
import '../css/styles.css';

const Residents = () => {

    return (
        <>
            <Header />
            <div className="container">

                <div>
                    <h1 className="tableTittled display-3">Listado de Residentes</h1>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Identificación</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Edad</th>
                            <th scope="col">Habitación</th>
                            <th scope="col">Foto</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>John</td>
                            <td>Doe</td>
                            <td>@social</td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <Footer />
        </>
    );
};

export default Residents;