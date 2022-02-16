import {useState} from "react";
import {drizzleReactHooks} from '@drizzle/react-plugin'
import {useParams, Link} from "react-router-dom";

import AlumnosHead from "./AlumnosHead";
import AlumnosBody from "./AlumnosBody";

import {newContextComponents} from "@drizzle/react-components";
const {AccountData} = newContextComponents;

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const NoMatriculados = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
	
	const myAddress = drizzleState.accounts[0];
    const estaMatriculado = useCacheCall("Asignatura", "datosAlumno", myAddress);
    
	if (estaMatriculado?.nombre !== "") {
        return <p>YA ESTÁS MATRICULADO</p>
    }
    return <>
        {children}
    </>
	
};

const NoProfesor = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
	
	const myAddress = drizzleState.accounts[0];
   
    const esProfesor = useCacheCall("Asignatura", "datosProfesor", myAddress);
	
	if(esProfesor !== ""){
		return <p>ERES PROFESOR, NO PUEDES AUTOMATRICULARTE</p>
	}
    return <>
        {children}
    </>
	
};

const NoOwner = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
	
	const myAddress = drizzleState.accounts[0];
   
    const esOwner = useCacheCall("Asignatura", "owner");
	
	if(esOwner === myAddress){
		return <p>ERES EL OWNER, NO PUEDES AUTOMATRICULARTE</p>
	}
    return <>
        {children}
    </>
	
};

const NoCoordinador = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
	
	const myAddress = drizzleState.accounts[0];
   
    const esCoordinador= useCacheCall("Asignatura", "coordinador");
	
	if(esCoordinador === myAddress){
		return <p>ERES EL COORDINADOR, NO PUEDES AUTOMATRICULARTE</p>
	}
    return <>
        {children}
    </>
	
};

export const Alumnos = () => {
	const {drizzle, useCacheCall} = useDrizzle();
	const drizzleState = useDrizzleState(state => state);
	
    const ml = useCacheCall("Asignatura", "matriculasLength") || 0;
	
	// Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;
	
	let [nombre, setnombre] = useState("")
	let [dni, setdni] = useState("")
	let [email, setemail] = useState("")
	
    return (
        <section className="AppAlumnos">
            <h2>Alumnos</h2>
            <table>
                <AlumnosHead/>
                <AlumnosBody matriculasLength={ml || 0}/>
            </table>
			
			<h2>Automatriculación</h2>
			<p>Solo puedes automatricularte si eres un alumno que no está matriculado</p>
			<NoMatriculados>
			<NoProfesor>
			<NoOwner>
			<NoCoordinador>
				
				<form>
					<p>
						Nombre del alumno:  &nbsp;
						<input key="nombre" type="text" name="nombre" value={nombre} placeholder="nombre"
							   onChange={ev => setnombre(ev.target.value)}/>
					</p>
					
					<p>
						DNI del alumno:  &nbsp;
						<input key="dni" type="text" name="dni" value={dni} placeholder="dni"
							   onChange={ev => setdni(ev.target.value)}/>
					</p>
					
					<p>
						Email del alumno:  &nbsp;
						<input key="email" type="text" name="email" value={email} placeholder="email"
							   onChange={ev => setemail(ev.target.value)}/>
					</p>
					
					<button key="submit" className="pure-button" type="button"
							onClick={ev => {
								ev.preventDefault();
								 const stackId = drizzle.contracts.Asignatura.methods.automatricula.cacheSend(nombre, dni, email);
								setLastStackID(stackId);
							}}>
						Automatricula
					</button>

					<p> Último estado = {status} </p>
				</form>
			</NoCoordinador>
			</NoOwner>
			</NoProfesor>
			</NoMatriculados>
			
			
        </section>
    );
};


export const Alumno = () => {
    const {useCacheCall} = useDrizzle();

    let {addr} = useParams();

    const datos = useCacheCall("Asignatura", "datosAlumno", addr);

    return <>
        <header className="AppAlumno">
            <h2>Alumno</h2>
        </header>
        <ul>
            <li><b>Nombre:</b> {datos?.nombre ?? "Desconocido"}</li>
			<li><b>DNI:</b> {datos?.DNI ?? "Desconocido"}</li>
            <li><b>Email:</b> {datos?.email ?? "Desconocido"}</li>
            <li><b>Address:</b> {addr}</li>
        </ul>
        <Link to="/alumnos">Volver</Link>
    </>
};
