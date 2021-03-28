import React from 'react';
import './footer.scss';
import "bootstrap/dist/css/bootstrap.min.css";


export default function Footer(props) {

    return (
        <div className="main-Footer">
            <div className="contenedor-secciones">
                <div className="intro">
                    <h4><strong>Sobre nosotras</strong></h4>
                </div>
            </div>
            <div className="categorias-footer">

                <div className="chicas">
                    <div className="a">
                        <a href="https://www.linkedin.com/feed/">
                            <img src="https://ca.slack-edge.com/TPRS7H4PN-U01C2HV4TBQ-deaf1c922155-512" alt={'No se encontró la imagen'}/>
                            <h4>Mara Bayurk</h4>
                        </a>
                    </div>
                    <div className="b">
                        <a href="https://www.linkedin.com/feed/"><i class="fab fa-linkedin"/></a>
                    </div>
                </div>

                <div className="chicas">
                    <div className="a">
                        <a href="https://www.linkedin.com/feed/">
                            <img src="https://ca.slack-edge.com/TPRS7H4PN-U013E9ADYR4-34b6d1dd8adb-512" alt={'No se encontró la imagen'} />
                            <h4>Gabriela Canela</h4>
                        </a>
                    </div>
                    <div className="b">
                        <a href="https://www.linkedin.com/feed/"><i class="fab fa-linkedin"/></a>
                    </div>
                </div>

                <div className="chicas">
                    <div className="a">
                        <a href="https://www.linkedin.com/feed/">
                            <img src="https://ca.slack-edge.com/TPRS7H4PN-U01C5VCP7BP-5a413de05bd6-512" alt={'No se encontró la imagen'} />
                            <h4>Angelismar Magallanes</h4>
                        </a>
                    </div>
                    <div className="b">
                        <a href="https://www.linkedin.com/feed/"><i class="fab fa-linkedin"/></a>
                    </div>
                </div>

                <div className="chicas">
                    <div className="a">
                        <a href="https://www.linkedin.com/feed/">
                            <img src="https://ca.slack-edge.com/TPRS7H4PN-U01C9D79S9Z-b09dc6d64b32-512" alt={'No se encontró la imagen'} />
                            <h4>Paula Donoso</h4>
                        </a>
                    </div>
                    <div className="b">
                        <a href="https://www.linkedin.com/feed/"><i class="fab fa-linkedin"/></a>
                    </div>
                </div>

                <div className="chicas">
                    <div className="a">
                        <a href="https://www.linkedin.com/feed/">
                            <img src="https://ca.slack-edge.com/TPRS7H4PN-U01CMUMJ9Q9-5b9e75b4de8e-512" alt={'No se encontró la imagen'} />
                            <h4>Leonelvis Garcia</h4>
                        </a>
                    </div>
                    <div className="b">
                        <a href="https://www.linkedin.com/feed/"><i class="fab fa-linkedin"/></a>
                    </div>
                </div>

            </div>
            <div className="contenedor-redes">
                <p>2021 KITTY'S SHOP Argentina. Todos los derechos reservados</p>
            </div>
        </div>
    )
};
