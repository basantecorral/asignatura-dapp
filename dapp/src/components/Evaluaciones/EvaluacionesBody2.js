import {drizzleReactHooks} from "@drizzle/react-plugin";

import EvaluacionRow2 from "./EvaluacionRow2";

const {useDrizzle} = drizzleReactHooks;

const EvaluacionesBody2 = ({valorei}) => {
    const {useCacheCall} = useDrizzle();

    const ml = useCacheCall("Asignatura", "matriculasLength") || 0;

    let rows = [];
    for (let i = 0; i < ml; i++) {
        rows.push(<EvaluacionRow2 key={"cb-"+i} alumnoIndex={i} valorei={valorei}/>);
    }

    return <tbody>{rows}</tbody>;
};

export default EvaluacionesBody2;