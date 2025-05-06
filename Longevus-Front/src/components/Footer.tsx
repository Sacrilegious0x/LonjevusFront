
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Columna: Dirección */}
          <div className="footer-column">
            <h3>Dirección</h3>
            <p>Hogar de Ancianos de Guápiles</p>
            <p>La Colonia, Guápiles, Limón, Costa Rica</p>
            <div className="mapa-footer">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.5049222354664!2d-83.7850991!3d10.220799500000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0b86ae0c16a21%3A0x5cf7698e45baf43f!2s66C7%2B8X7%20Hogar%20de%20Ancianos%20de%20Gu%C3%A1piles%2C%20Lim%C3%B3n%2C%20Gu%C3%A1piles!5e0!3m2!1ses-419!2scr!4v1746554952304!5m2!1ses-419!2scr"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Columna: Teléfonos */}
          <div className="footer-column">
            <h3>Teléfonos</h3>
            <p>(+506) 2222-2222</p>
            <p>
              <strong>WhatsApp:</strong> (+506) 8888-8888
            </p>
          </div>

          {/* Columna: Contacto */}
          <div className="footer-column">
            <h3>Correo Electrónico</h3>
            <p>
              <a href="mailto:info@hogarlacolonia.cr">
                info@hogarlacolonia.cr
              </a>
            </p>
            
          </div>
        </div>

        {/* Parte inferior */}
        <div className="footer-bottom">
          <button className="btn-footer">Uso Interno</button>
          <p>&copy; 2025 Hogar de Ancianos La Colonia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
