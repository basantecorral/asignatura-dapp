import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const SoloProfesor = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

	const myAddress = drizzleState.accounts[0];
    const esProfesor = useCacheCall("Asignatura", "datosProfesor", myAddress);

    if (esProfesor !== "" ) {
        return <>
        {children}
		</>
    }
    return <p>NO SOY EL PROFESOR</p>

};


/*
PENDIENTE DE INVESTIGAR:
Si se usa useCacheSend, se envian varias transacciones cada vez que se hace un submit del formulario.
El problema esta relacionado con actualizar el estado del stackIds dentro de la implementacion de ese hook.
 */

const Calificar = ({alumnoAddr, ei}) => {
    const {drizzle} = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    // Conservar los valores metidos en el formulario
    //let [alumnoAddr, setAlumnoAddr] = useState("")
    //let [indexEval, setEvalIndex] = useState("")
    let [tipo, setTipo] = useState("")
    let [calificacion, setCalificacion] = useState("")

    return (<article className="AppMisDatos">
        <h2>Calificar</h2>
        <SoloProfesor>
            <form>


                <p>
                    Tipo: (0=NP 1=Nota 2=MH):  &nbsp;
                    <input key="tipo" type="number" name="tipo" value={tipo} placeholder="Tipo de nota"
                           onChange={ev => setTipo(ev.target.value)}/>
                </p>
                <p>
                    Nota (x10):  &nbsp;
                    <input key="calificacion" type="number" name="calificacion" value={calificacion} placeholder="Nota"
                           onChange={ev => setCalificacion(ev.target.value)}/>
                </p>

                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.califica.cacheSend(alumnoAddr, ei, tipo, calificacion);
                            setLastStackID(stackId);
                        }}>
                    Calificar
                </button>

                <p> Último estado = {status} </p>
            </form>
        </SoloProfesor>
    </article>);
};

export default Calificar;