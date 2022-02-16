import MisDatos from "./MisDatos";
import MisNotas from "./MisNotas";

const MisCosas = () => {

    return <section className="AppMisCosas">
        <h2>Mis Cosas</h2>
		<p>Solo se muestran tus datos y tus notas si eres un alumno matriculado</p>
        <MisDatos/>
        <MisNotas/>
    </section>;
}

export default MisCosas;