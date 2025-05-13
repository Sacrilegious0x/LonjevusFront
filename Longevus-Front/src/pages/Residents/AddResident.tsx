import AddResidentForm from "../../components/AddResidentForm";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { Link } from 'react-router-dom';

const AddResident: React.FC = () => {
    return (
        <>
            <HeaderA />
            <div className="container">
                <div className="row">
                    <div className="div_ResidentForm card mt-5 mb-5 border-primary">
                        <h1 className="fw-bold text-uppercase">Agregar Residente</h1>
                        <AddResidentForm />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddResident;