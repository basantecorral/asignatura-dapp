import {useState} from "react";
import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";

const {AccountData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const SoloOwner = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const ownerAddr = useCacheCall("Asignatura", "owner");

    if (ownerAddr !== drizzleState.accounts[0]) {
        return <p>NO ERES EL OWNER</p>
    }
    return <>
        {children}
    </>

};

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


function Home() {
	const {drizzle, useCacheCall} = useDrizzle();
	const ownerAddr = useCacheCall("Asignatura", "owner");
	const coordinadorAddr = useCacheCall("Asignatura", "coordinador");
	const cerrada = useCacheCall("Asignatura", "cerrada");
	
	// Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;
	
	let [newcAddr, setCoordinadorAddr] = useState("")
    
	return (
		<article className="AppMisDatos">
			<h2>Página Home de la Asignatura</h2>
			<h3>Dirección del owner y del coordinador</h3>
			<p>Dirección del usuario owner: <span style={{color: "blue"}}>{ownerAddr}</span></p>
			<p>Dirección del coordinador de la Asignatura: <span style={{color: "blue"}}>{coordinadorAddr}</span></p>
			<h3>Cambiar coordinador</h3>
				<SoloOwner>
					<form>
					 	<p>
							Dirección del coordinador:  &nbsp;
							<input key="coordinador" type="text" name="coordinador" value={newcAddr} placeholder="Dirección del coordinador"
								   onChange={ev => setCoordinadorAddr(ev.target.value)}/>
						</p>
						
						<button key="submit" className="pure-button" type="button"
								onClick={ev => {
									ev.preventDefault();
									 const stackId = drizzle.contracts.Asignatura.methods.setCoordinador.cacheSend(newcAddr);
									setLastStackID(stackId);
								}}>
							Cambiar
						</button>

						<p> Último estado = {status} </p>
					</form>
				</SoloOwner>
			
			<h3>Estado de la Asignatura</h3>
			<p>Estado: <span style={{color: "blue"}}>{cerrada ? (<span>Cerrada</span>):(<span>Abierta</span>)}</span></p>
			
			<h3>Cambiar estado</h3>
				<SoloCoordinador>
					<form>
					 	
						<button key="submit" className="pure-button" type="button"
								onClick={ev => {
									ev.preventDefault();
									 const stackId = drizzle.contracts.Asignatura.methods.cerrar.cacheSend();
									setLastStackID(stackId);
								}}>
							Cerrar
						</button>

						<p> Último estado = {status} </p>
					</form>
				</SoloCoordinador>
		</article>
	);
}

export default Home;