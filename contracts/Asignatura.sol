// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/**
 * El contrato Asignatura que representa una asignatura de la carrera.
 * Maria del Pilar Delgado Pardo y Alvaro Basante Corral
 * Version 2021
 */
 
contract Asignatura {

 /// Version 2021 - Practica
 uint public version = 2021;
 
 /**
  * address del owner que ha desplegado el contrato.
  * El contrato lo despliega el owner.
  */
 address public owner;

 /// Nombre de la asignatura
 string public nombre;

 // Curso academico
 string public curso;


 /**
  * Datos de una evaluacion.
  */
 struct Evaluacion {
	string nombre;
	uint fecha;
	uint puntos;
 }


 /// Evaluaciones de la asignatura.
 Evaluacion[] public evaluaciones;
 
 /// Datos de un alumno.
 struct DatosAlumno {
	string nombre;
	string DNI;
	string email;
 }


 /// Acceder a los datos de un alumno dada su direccion.
 mapping (address => DatosAlumno) public datosAlumno;


 // Array con las direcciones de los alumnos matriculados.
 address[] public matriculas;

 // Mapping de DNIs de los alumnos
 mapping (string => bool) public DNIs;

 /// Tipos de notas: no presentado, nota entre 0 y 10, y matricula de honor.
 enum TipoNota { NP, Normal, MH }

 /**
  * Datos de una nota.
  * La calificacion esta multipilicada por 10 porque no hay decimales.
  */
 struct Nota {
	TipoNota tipo;
	uint calificacion;
 }

 // Dada la direccion de un alumno, y el indice de la evaluacion, devuelve
 // la nota del alumno.
 mapping (address => mapping (uint => Nota)) public calificaciones;

 /**
  * address del coordinador de la asignatura
  */
 address public coordinador;

 // Estado de la asignatura
 bool public cerrada;
 
 /// Datos de un profesor.
 struct DatosProfesor {
	string nombre;
 }

 /// Acceder a los datos de un profesor dada su direccion.
 mapping (address => DatosProfesor) public datosProfesor;


 // Array con las direcciones de los profesores de la asignatura.
 address[] public profesores;
 
 /**
  * Constructor.
  *
  * @param _nombre Nombre de la asignatura.
  * @param _curso Curso academico.
  */
 constructor(string memory _nombre, string memory _curso) {

	bytes memory bn = bytes(_nombre);
	require(bn.length != 0, "El nombre de la asignatura no puede ser vacio");

	bytes memory bc = bytes(_curso);
	require(bc.length != 0, "El curso academico de la asignatura no puede ser vacio");

	owner = msg.sender;
	nombre = _nombre;
	curso = _curso;
	cerrada = false;
 }

// Función para modificar el coordinador de la asignatura
	function setCoordinador(address _coordinador) soloAbierta soloOwner public {
		coordinador = _coordinador;
	}

// Método para cerrar una asignatura
	function cerrar() soloCoordinador public {
		cerrada = true;
	}

 /**
  * El numero de evaluaciones creadas.
  *
  * @return El numero de evaluaciones creadas.
  */
 function evaluacionesLength() public view returns(uint) {
	return evaluaciones.length;
 }


 /**
  * Crear una prueba de evaluacion de la asignatura. Por ejemplo, el primer parcial, o la practica 3.
  *
  * Las evaluaciones se meteran en el array evaluaciones, y nos referiremos a ellas por su posicion en el array.
  *
  * @param _nombre El nombre de la evaluacion.
  * @param _fecha La fecha de evaluacion (segundos desde el 1/1/1970).
  * @param _puntos Los puntos que proporciona a la nota final.
  *
  * @return La posicion en el array evaluaciones,
  */
function creaEvaluacion(string memory _nombre, uint _fecha, uint _puntos) soloAbierta soloCoordinador public returns (uint) {

	bytes memory bn = bytes(_nombre);
	require(bn.length != 0, "El nombre de la evaluacion no puede ser vacio");

	evaluaciones.push(Evaluacion(_nombre, _fecha, _puntos));
	return evaluaciones.length - 1;
 }

 /**
  * El numero de alumnos matriculados.
  *
  * @return El numero de alumnos matriculados.
  */
 function matriculasLength() public view returns(uint) {
	return matriculas.length;
 }


 error MyError(string mensaje, string dni);
 /**
  * Los alumnos pueden automatricularse con el metodo automatricula.
  *
  * Impedir que se pueda meter un nombre vacio.
  * Impedir que se pueda meter un DNI vacio.
  * El DNI debe ser unico
  *
  * @param _nombre El nombre del alumno.
  * @param _DNI El DNI del alumno.
  * @param _email El email del alumno.
  */
 function automatricula(string memory _nombre, string memory _DNI, string memory _email) soloAbierta noMatriculados public {
  
	bytes memory b = bytes(_nombre);
	require(b.length != 0, "El nombre no puede ser vacio");

	bytes memory d = bytes(_DNI);
	require(d.length != 0, "El DNI no puede ser vacio");

  bool yaAdd = DNIs[_DNI];

	if(yaAdd){
	//lanzar error
	revert MyError({mensaje:"El DNI coincide con un alumno matriculado",dni:_DNI});
	}else{
		DatosAlumno memory datos = DatosAlumno(_nombre, _DNI, _email);

		datosAlumno[msg.sender] = datos;

		matriculas.push(msg.sender);

    DNIs[_DNI] = true;
	}
 }

 /**
  * Permite a un alumno obtener sus propios datos.
  *
  * @return _nombre El nombre del alumno que invoca el metodo.
  * @return _DNI El DNI del alumno que invoca el metodo.
  * @return _email El email del alumno que invoca el metodo.
  */
 function quienSoy() soloMatriculados public view returns (string memory _nombre, string memory _DNI, string memory _email) {
	DatosAlumno memory datos = datosAlumno[msg.sender];
	_nombre = datos.nombre;
	_DNI = datos.DNI;
	_email = datos.email;
 }

error MyError2(string mensaje, address direccion);
 /**
  * Solo el owner puede añadir profesores a la asignatura
  *
  * Impedir que se pueda meter un nombre vacio.
  * Dos profesores pueden tener el mismo nombre.
  * Impedir que el profesor se añada varias veces.
  *
  * @param _profesor La dirección del profesor.
  * @param _nombre El nombre del profesor.
  */
function addProfesor(address _profesor, string memory _nombre) soloAbierta soloOwner public{
	bytes memory b = bytes(_nombre);
	require(b.length != 0, "El nombre no puede ser vacio");
	
  bytes memory c = bytes(datosProfesor[_profesor].nombre);
  if(c.length != 0){
	//lanzar error
	revert MyError2({mensaje:"El address ya esta incluido en la lista de profesores",direccion:_profesor});
	}else{
		DatosProfesor memory datos = DatosProfesor(_nombre);
		datosProfesor[_profesor] = datos;
		profesores.push(_profesor);
	}
}

 /**
  * El numero de profesores de la asignatura.
  *
  * @return El numero de profesores de la asignatura.
  */
 function profesoresLength() public view returns(uint) {
	return profesores.length;
 }
 
  /**
  * Permite obtener el nombre de un profesor teniendo su direccion.
  *
  * @param _profesor Direccion del profesor
  * @return _nombre El nombre del profesor
  * 
  */
 function nombreProfe(address _profesor) public view returns (string memory _nombre){
    DatosProfesor memory datos = datosProfesor[_profesor];
	  _nombre = datos.nombre;
 }


 /**
  * Poner la nota de un alumno en una evaluacion.
  *
  * @param alumno La direccion del alumno.
  * @param evaluacion El indice de una evaluacion en el array evaluaciones.
  * @param tipo Tipo de nota.
  * @param calificacion La calificacion, multipilicada por 100 porque no hay decimales.
  */
 function califica(address alumno, uint evaluacion, TipoNota tipo, uint calificacion) soloAbierta soloProfesor public {

	require(estaMatriculado(alumno), "Solo se pueden calificar a un alumno matriculado.");
	require(evaluacion < evaluaciones.length, "No se puede calificar una evaluacion que no existe.");
	require(calificacion <= 100, "No se puede calificar con una nota superior a la maxima permitida.");
	
	Nota memory nota = Nota(tipo, calificacion);

	calificaciones[alumno][evaluacion] = nota;
 }


 /**
  * Consulta si una direccion pertenece a un alumno matriculado.
  *
  * @param alumno La direccion de un alumno.
  *
  * @return true si es una alumno matriculado.
  */
 function estaMatriculado(address alumno) private view returns (bool) {

	string memory _nombre = datosAlumno[alumno].nombre;

	bytes memory b = bytes(_nombre);

	return b.length != 0;
 }


 /**
  * Devuelve el tipo de nota y la calificacion que ha sacado el alumno que invoca el metodo en la evaluacion pasada como parametro.
  *
  * @param evaluacion Indice de una evaluacion en el array de evaluaciones.
  *
  * @return tipo El tipo de nota que ha sacado el alumno.
  * @return calificacion La calificacion que ha sacado el alumno.
  */
 function miNota(uint evaluacion) soloMatriculados public view returns (TipoNota tipo, uint calificacion) {

	require(evaluacion < evaluaciones.length, "El indice de la evaluacion no existe.");

	Nota memory nota = calificaciones[msg.sender][evaluacion];

	tipo = nota.tipo;
	calificacion = nota.calificacion;
 }

 /**
  * Modificador para que una funcion solo la pueda ejecutar el owner.
  *
  * Se usa en setCoordinador y en addProfesor.
  */
 modifier soloOwner() {

	require(msg.sender == owner, "Solo permitido al owner");
	_;
 }
 
  /**
  * Modificador para que una funcion solo la pueda ejecutar el coordinador.
  *
  * Se usa en cerrar y en crearEvaluacion.
  */
 modifier soloCoordinador() {

	require(msg.sender == coordinador, "Solo permitido al coordinador");
	_;
 }
 
 /**
  * Modificador para que una funcion solo la pueda ejecutar el profesor.
  *
  * Se usa en califica.
  */
 modifier soloProfesor() {
   
	string memory _nombre = datosProfesor[msg.sender].nombre;
	bytes memory b = bytes(_nombre);

	require(b.length != 0, "Solo permitido al profesor");
	_;
 }
 
 /**
  * Modificador para que una funcion solo la pueda ejecutar un alumno matriculado.
  * Se usa en quienSoy y miNota
  */
 modifier soloMatriculados() {

	require(estaMatriculado(msg.sender), "Solo permitido a alumnos matriculados");
	_;
 }


 /**
  * Modificador para que una funcion solo la pueda ejecutar un alumno no matriculado aun.
  * Se usa en automatricula
  */
 modifier noMatriculados() {

	require(!estaMatriculado(msg.sender), "Solo permitido a alumnos no matriculados");
	_;
 }
 
 /**
  * Modificador para una asignatura abierta.
  *
  * Se usa en setCoordinador, addProfesor, automatricula, crearEvaluacion y califica.
  */
 modifier soloAbierta() {

	require(!cerrada, "Solo permitido si la asignatura esta abierta");
	_;
 }

 /**
  * No se permite la recepcion de dinero.
  */
 receive() external payable {
	revert("No se permite la recepcion de dinero.");
 }
}