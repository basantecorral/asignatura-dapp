module.exports = async callback => {

    try {
        const Asignatura = artifacts.require("./Asignatura.sol");

        // Usar las cuentas de usuario
        const accounts = await web3.eth.getAccounts();
        if (accounts.length < 10) {
            throw new Error("No hay cuentas.");
        }

        let asignatura = await Asignatura.deployed();

        // Identificar al profesor:
        let owner = await asignatura.owner();
        console.log("Cuenta del owner =", owner);
		
		let pcAccount = accounts[1];
		console.log("Cuenta del profesor coordinador =", pcAccount);
		//await asignatura.addProfesor(pcAccount, "Juan", {from: owner});
		await asignatura.setCoordinador(pcAccount, {from: owner});
		
		let profeAccount = accounts[2];
		console.log("Cuenta del profesor =", profeAccount);
		await asignatura.addProfesor(profeAccount, "Pedro", {from: owner});
		

        console.log("Crear dos evaluaciones:");
        await asignatura.creaEvaluacion("Examen Parcial", 12345678, 30, {from: pcAccount});
        await asignatura.creaEvaluacion("Examen Final", 12349999, 70, {from: pcAccount});

        console.log("Matricular a dos alumnos:");
        let evaAccount = accounts[3];
        let pepeAccount = accounts[4];
        console.log("Cuenta de Eva =", evaAccount);
        console.log("Cuenta de Pepe =", pepeAccount);
        await asignatura.automatricula("Eva Martinez","11111111", "em@dominio.es", {from: evaAccount});
        await asignatura.automatricula("Jose Redondo","22222222", "jr@stio.com", {from: pepeAccount});

        console.log("Añadir calificaciones:");
        await asignatura.califica(evaAccount, 0, 1, 65, {from: profeAccount});
        await asignatura.califica(evaAccount, 1, 1, 75, {from: pcAccount});
        await asignatura.califica(pepeAccount, 0, 0, 0, {from: profeAccount});
        await asignatura.califica(pepeAccount, 1, 1, 50, {from: pcAccount});
    } catch (err) {   // Capturar errores
        console.log(`Error: ${err}`);
    } finally {
        console.log("FIN");
    }

    callback();      // Terminar
};