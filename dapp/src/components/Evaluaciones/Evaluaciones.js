import {useState} from "react";
import {drizzleReactHooks} from '@drizzle/react-plugin'

import EvaluacionesHead from "./EvaluacionesHead";
import EvaluacionesBody from "./EvaluacionesBody";
import EvaluacionesHead2 from "./EvaluacionesHead2";
import EvaluacionesBody2 from "./EvaluacionesBody2";

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const SoloCoordinador = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const coordinadorAddr = useCacheCall("Asignatura", "coordinador");

    if (coordinadorAddr !== drizzleState.accounts[0]) {
        return <p>NO ERES EL COORDINADOR</p>
    }
    return <>
        {children}
    </>

};

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

const Evaluaciones = () => {
    
	const {drizzle, useCacheCall} = useDrizzle();
    const el = useCacheCall("Asignatura", "evaluacionesLength");

	// Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;
	
	let [nombre, setnombre] = useState("")
	let [fecha, setfecha] = useState("")
	let [puntos, setpuntos] = useState("")
	let [ei, setei] = useState("")
	
	

    return (
        <section className="AppEvaluaciones">
            <h2>Evaluaciones</h2>
            <table>
                <EvaluacionesHead/>
                <EvaluacionesBody evaluacionesLength={el ?? 0}/>
            </table>
			
			<h3>Añadir Evaluación</h3>	
				<SoloCoordinador>
					<form>
					 	<p>
							Nombre del examen:  &nbsp;
							<input key="nombre" type="text" name="nombre" value={nombre} placeholder="nombre"
								   onChange={ev => setnombre(ev.target.value)}/>
						</p>
						
						<p>
							Fecha del examen:  &nbsp;
							<input key="fecha" type="text" name="fecha" value={fecha} placeholder="fecha"
								   onChange={ev => setfecha(ev.target.value)}/>
						</p>
						
						<p>
							Puntos del examen:  &nbsp;
							<input key="puntos" type="text" name="puntos" value={puntos} placeholder="puntos"
								   onChange={ev => setpuntos(ev.target.value)}/>
						</p>
						
						<button key="submit" className="pure-button" type="button"
								onClick={ev => {
									ev.preventDefault();
									 const stackId = drizzle.contracts.Asignatura.methods.creaEvaluacion.cacheSend(nombre, fecha, puntos);
									setLastStackID(stackId);
								}}>
							Crear evaluación
						</button>

						<p> Último estado = {status} </p>
					</form>
				</SoloCoordinador>
				
			<h3>Lista de notas en una determinada evaluación</h3>
				<SoloPyC>
				<form>
				<p>
					Índice de la evaluación:  &nbsp;
					<input key="ei" type="text" name="ei" value={ei} placeholder="ei"
								   onChange={ev => setei(ev.target.value)}/>
				
				</p>
				</form>
				
				<p></p>
				<table>
					<EvaluacionesHead2 valorei = {ei}/>
					<EvaluacionesBody2 valorei = {ei}/>
				</table>
				
				</SoloPyC>
				
        </section>
    );
};

export default Evaluaciones;