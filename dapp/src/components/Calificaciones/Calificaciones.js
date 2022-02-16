import CalificacionesHead from "./CalificacionesHead";
import CalificacionesBody from "./CalificacionesBody";
import Calificar from "./Calificar";
import {useParams, Link} from "react-router-dom";
import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const SoloPyC = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
	
	const myAddress = drizzleState.accounts[0];
   
    const esProfesor = useCacheCall("Asignatura", "datosProfesor", myAddress);
	const coordinadorAddr = useCacheCall("Asignatura", "coordinador");
	
	if(esProfesor !== "" || coordinadorAddr === drizzleState.accounts[0]){
		return <>
        {children}
		</>
	}
    return <p>NO ERES PROFESOR, NI COORDINADOR</p>
};

export const Calificaciones = () => {

    return (
        <section className="AppCalificaciones">
            <h2>Calificaciones</h2>
            <p>En esta pestaña solo se pueden ver todas las notas si eres coordinador o profesor, si eres un alumno matriculado ve a la pestaña de mis cosas para consultar tu información</p>
			<SoloPyC>
			<table>
                <CalificacionesHead />
                <CalificacionesBody />
            </table>
			</SoloPyC>
			<p>Solo se permite modificar las calificaciones a los profesores</p>
        </section>
    );
};

export const Calificacion = () => {
    const {useCacheCall} = useDrizzle();

    let {alumnoAddr, ei} = useParams();

    const datos = useCacheCall("Asignatura", "datosAlumno", alumnoAddr);

    return <>
        <header className="AppAlumno">
            <h2>Alumno a calificar</h2>
        </header>
        <ul>
            <li><b>Nombre:</b> {datos?.nombre ?? "Desconocido"}</li>
			<li><b>DNI:</b> {datos?.DNI ?? "Desconocido"}</li>
            <li><b>Email:</b> {datos?.email ?? "Desconocido"}</li>
            <li><b>Address:</b> {alumnoAddr}</li>
			<li><b>Evaluación:</b> {ei}</li>
        </ul>
		
		<Calificar alumnoAddr = {alumnoAddr} ei = {ei}/>
		
        <Link to="/calificaciones">Volver</Link>
    </>
};

//export default Calificaciones;