// IIFE -> Immediately Invoked Function 
// Expression
(() => {

    const BTN_REINICIAR = "btnReiniciar"
    const ID_CONTADOR = "contador"
    const VALOR_CONTADOR = 100
    const PERIODO_INTERVALO = 10



    class contadorComponent {
        //responsavel por iniciar a funcao, 
        //neste caso a funcao inicializar
        constructor() {
            this.inicializar()
        }
        prepararContadorProxy() {
            const handle = {
                set: (currentContext, propertyKey, newValue) => {
                    console.log(currentContext, propertyKey, newValue);
                    if (!currentContext.valor) {
                        currentContext.efetuarParada()
                    }


                    currentContext[propertyKey] = newValue
                    return true
                }
            }
            // 'middleWhere' ou proxy 
            // responsavel por criar
            // uma analize de comportamento 
            // no contador do html 
            const contador = new Proxy({
                valor: VALOR_CONTADOR,
                efetuarParada: () => { }
            }, handle)
            return contador
        }
        agendaParadaContador({ elementoContador, idIntervalo }) {
            return () => {
                clearInterval(idIntervalo)
                elementoContador.innerHTML = ""
                this.desabilitarBotao(false)
            }

        }
        // guarda os atributos e reexecuta
        // trocando o contador criando um 
        // 'while' junto com as 'strings'
        atualizarTexto = ({ elementoContador, contador }) => () => {
            const identificadorTexto = '$$contador'
            const textoPadrao = `Começando em <strong>${identificadorTexto}<strong/> segundos...`
            elementoContador.innerHTML = textoPadrao.replace(identificadorTexto, contador.valor--)
        }

        prepararBotao(elementoBotao, iniciarFn) {
            elementoBotao.addEventListener('click', iniciarFn.bind(this))
            return (valor = true) => {
                const atributo = 'disabled'
                if (valor) {
                    elementoBotao.setAttribute(atributo, valor)
                    return;
                }
                elementoBotao.removeAttribute(atributo)
            }
        }
        inicializar() {
            console.log('Inicializou!');
            //pega um valor do html e guarda em uma //variavel 
            const elementoContador = document.getElementById(ID_CONTADOR)
            // cria uma variavel que guarda um  
            // objeto o qual sera
            // observado a cada mudanca de 
            // estado no proxy
            const contador = this.prepararContadorProxy()

            // contador.valor = 100
            // contador.valor = 90
            // contador.valor = 80

            const argumentos = {
                elementoContador,
                contador
            }
            const fn = this.atualizarTexto(argumentos)
            const idIntervalo = setInterval(fn, PERIODO_INTERVALO)
            {
                const elementoBotao = document.getElementById(BTN_REINICIAR)
                const desabilitarBotao = this.prepararBotao(elementoBotao
                    , this.inicializar)

                desabilitarBotao()
                const argumentos = { elementoContador, idIntervalo }
                // const desabilitarBotao = () => console.log('desabilitou...');
                const pararContadorFn = this.agendaParadaContador.apply({ desabilitarBotao }, [argumentos])
                contador.efetuarParada = pararContadorFn

            }





        }

    }

    window.contadorComponent = contadorComponent
})()