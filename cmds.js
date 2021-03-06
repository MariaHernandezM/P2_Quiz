


const{log, biglog, errorlog, colorize} = require("./out");

const model = require('./model');



/**
 * Muestra la ayuda.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.helpCmd = rl => {
    log("Commandos:");
    log(" h|help  - Muestra esta ayuda.");
    log( " list - Listar los quizzes existentes.");
    log("show <id> - Muestra la pregunta y la respuesta el P2_Quiz indicado. ");
    log("add - Añadir un nuevo P2_Quiz interactivamente.");
    log("delete <id> - Borrar el quiz indicado.");
    log(" edit <id> - Editar el quiz indicado.\n");
    log("test <id> - Probar el quiz indicado.");
    log("p|play - Jugar a preguntar aleatoriamente todos los quizzes.\n");
    log("credits - Créditos.");
    log("q|quit - Salir del programa.");
    rl.prompt();
};


/**
 * Listar los quizzes existentes en el modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.listCmd = rl => {


    model.getAll().forEach((quiz,id) => {


      log(`  [${colorize(id,'magenta')}]: ${quiz.question}`);
    });




    rl.prompt();
};


/**
 * Muestra el P2_Quiz indicando en el parámetro: la pregunta y la respuesta.
 *
 * @param id Clave del quiz a mostrar.
 */

exports.showCmd = (rl,id) => {

       if (typeof id === "undefined") {
           errorlog(`Falta el parametro id.`);
       }else{
           try{
               const quiz = model.getByIndex(id);
               log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);

       } catch(error){
           errorlog(error.message);
           }
       }



    rl.prompt();

};
/**
 * Añade un nuevo quiz al módelo.
 * Pregunta interactivamente por la pregunta y por la respuesta.
 */

exports.addCmd = rl => {

    rl.question(colorize('Introduzca una pregunta: ', 'red'), question =>{

        rl.question(colorize('Introduzca una respuesta ', 'red'), answer =>{


            model.add(question, answer);
            log(` ${colorize(' Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')}${answer}`);

    rl.prompt();
});

});

};

/**
 * Borra un quiz del modelo.
 *
 * @param id Clave del quiz a borrar en el modelo.
 */

exports.deleteCmd = (rl,id) => {

    if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);
    }else{
        try{
             model.deleteByIndex(id);

        } catch(error){
            errorlog(error.message);
        }
    }




    rl.prompt();

};


/**
 * Edita un quiz del modelo.
 *
 * @param id Clave del quiz a editar en el modelo.
 */

exports.editCmd = (rl,id) =>{
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
    }
    else{
        try {
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
            rl.question(colorize(' Introduce una respuesta ', 'red'), answer => {
                model.update(id, question, answer);
            log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
        });
        }   catch(error){
            errorlog(error.message);
            rl.prompt();
        }
    }
};

/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
 *
 * @param id Clave del quiz a probar.
 */

exports.testCmd =(rl,id)  => {

    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else
        try {

            const quiz = model.getByIndex(id);

            rl.question(`${colorize(quiz.question, 'red')}${colorize('? ', 'red')}`, respuesta => {

                const resp = quiz.answer;

            if (respuesta.trim().toLowerCase() === resp.trim().toLowerCase()) {
                log('Su respuesta es correcta.')
                biglog("Correcta", "green")
                rl.prompt();
            } else {
                log('Su respuesta es incorrecta.')
                biglog("Inorrecta", "red")
                rl.prompt();
            }
        });


        }catch(error){
    errorlog(error.message);
    rl.prompt();
   }

};
/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 */

exports.playCmd = rl => {
    let score = 0;
    let tamaño = model.count();
    let toBeResolved = new Array(tamaño);

    for (var i = 0; i< tamaño ;i++) {

        for ( var j = 0; j< tamaño; j++) {
            toBeResolved[j] = j;
        }
        const playOne = () => {
            if(toBeResolved.length <= 0) {

                log("No hay más preguntas");
                log(`Fin del juego. Aciertos: ${score}`);
                biglog(`${score}`, "blue");
                rl.prompt();
            } else {
                try {

                    let aleatorio = Math.floor(Math.random()*(toBeResolved.length));
                    let id = toBeResolved[aleatorio];
                    let quiz = model.getByIndex(id);

                    rl.question(`${colorize( quiz.question, 'red')}${colorize('? ', 'red')}`, respuesta => {
                        const resp = quiz.answer;
                    if (respuesta.trim().toLowerCase() === resp.trim().toLowerCase()){
                        toBeResolved.splice(aleatorio,1);
                        score++;
                        log(`Correcto - Lleva ${score} aciertos`)
                        playOne();
                    }else {
                        log('INCORRECTO')
                        log(`Fin del juego. Aciertos: ${score}`);
                        biglog(`${score}`, "blue");
                        rl.prompt();
                    }
                });
                }catch(error){
                    errorlog(error.message);
                    rl.prompt();
                }
            }
        }
        playOne();
    }
};



/**
 * Muestra los nombres de los autores de la práctica.
 */

exports.creditsCmd = rl => {
    log('Autores de la práctica:');
    log('MARIA', 'green');
    rl.prompt();


};


/**
 * Terminar el programa.
 */

exports.quitCmd = rl => {
    rl.close();

};


