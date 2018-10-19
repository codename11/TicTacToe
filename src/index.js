import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){/*Funkcija koja pravi komponentu, daje joj klasu i pravi prop pod nazivom 'onClick'.*/

	let klasa = props.winningCombo && (props.winningCombo[1][0]==props.id || props.winningCombo[1][1]==props.id || props.winningCombo[1][2]==props.id) ? "square2" : "square1";

	return (
      <button id={props.id} className={klasa} onClick={() => {props.onClick();}}>
        {props.value}{/*Pravi se prop pod imenom 'value'*/}
      </button>
    );
}

class Board extends React.Component {	

	renderSquare(i) {/*Funkcija prosledjuje svoj parametar komponenti square. U handleClick funkciji se odlucuje koji ce se simbol pribeleziti u this.state.squares na osnovu parametra koji mu prosledjuje renderSquare funkcija iz koje se ova funkcija poziva. Niz square, 'i' mu je indeks, pa se posto mu se prosledi indeks na kome se zeli upisati iks ili oks zavisno od uslova, te kada se to obavi, bulijanska vrednost this.state.xIsNext se setuje na suprotno.*/
	
		return <Square key={"square-"+i.toString()} winningCombo={this.props.winningCombo} id={i.toString()} value={this.props.squares[i]} onClick={() => {this.props.onClick(i);}}/>;/*prop pod imenom 'value' iz Square komponente, dobija vrednost od stateProperty-ja zvanog squares.*/
	}
	
	/*Alternativni nacin za generisanje mreze 3x3.
	squared = (arr = [0, 1, 2]) => arr.map(row => (
		<div className="board-row" key={row}> {arr.map(col => this.renderSquare(row * 3 + col))} </div>
	));*/ 
		
	squared = () => {

		const rows = [];
		for (let i = 0; i < 3; i++) {
			
			const cols = [];
			for (let j = 0; j < 3; j++) {
				cols.push(this.renderSquare(i * 3 + j));
			}
			rows.push(<div className="board-row" key={"row-"+i.toString()}>{cols}</div>);
			
		}
	
		return rows;
	};
	
  render() {

    return (
      <div>
		{this.squared()}
      </div>
    );
  }
}

class Game extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.initialState = {
			history: [{
				squares: Array(9).fill(null),//Puni se niz sa defoltnim vrednostima. squares sluzi da vodi racuna gde treba iks ili oks da upise.
			}],
			stepNumber: 0, //Ovde se skladisti index svakog poteza, tj. njegov redni broj.
		  xIsnext: true, //Bulijanska vrednost koja sluzi kao prekidac kada je koji igrac na redu.
		  col: null,
		  row: null,
		  upDown: false
		}
		
		this.state = this.initialState;
		this.reArrange = this.reArrange.bind(this);
		this.calculateWinner = this.calculateWinner.bind(this);
	}
	
	handleClick(i){/*Setuje this.state.squares koja je niz, odnosno ubacuje jos jednu vrednost u niz.*/
		
		/* Promenljiva 'i' je parametar koja sluzi za identifikaciju dugmeta. Zato kad se poziva funkcija, kao parametar joj se prosledjuje broj koji sluzi kao redni da bi znalo na koje se dugme kliknulo. Prosledjivanje se vrsi dole, prilikom renderovanja.*/
		
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length-1];
		const squares = current.squares.slice();//Pravi kopiju this.state.squares niza, jer se ne sme direktno vrsiti intervencija na state-nizu.
		
		const winner = this.calculateWinner(current.squares);
		
		if (winner || squares[i]) {/*Kada ove vrednost izraza postane istinite, odnosno (true || true)==true, (true || false)==true ili (false || true)==true prekida se izvrsavanje, tj. prazan return. Slicno kao sto brejk ispada iz petlje i ne vraca se u nju. Samo je (false || false)==false i tada se ne izvrsava. Odnosno, svo vreme je false tako da cim makar od jednog postane true, izraz postane istinit i kod se u njemu izvrsava.*/
			
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O'; //Ukoliko this.state.xIsNext true, onda squares[i] dobija vrednost 'X', ukoliko je false, onda dobija vrednost 'O'.
		
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),/*Ovde se belezi svaki potez. Dakle prilikom belezenja poteza, ne presnimava se na sledeci, vec se samo nadodaje novi potez. Stari potezi ostaju ubelezeni.*/
			stepNumber: history.length,/* duzina istorije je u stvari zadnji potez, odnosno indeks zadnjeg unesenog poteza. */
			xIsNext: !this.state.xIsNext,
			col: (i===0 || i===3 || i===6) ? '1' : (i===1 || i===4 || i===7) ? '2' : '3',/*Izracunava kolonu odigranog znaka*/
			row: i<=2 ? '1' : i<=5 ? '2' : '3'/*Izracunava red odigranog znaka*/
		});
		
	}

	setActive(step) {
		this.setState({ active: step });
	}
	
	jumpTo(step){/*Funkcija koja pozivom na onClick sluzi za vracanje na odredjeni (prethodni)potez. Parametar 'step' je objekat obelezenih pozicija, tj. gde je stavljen iks ili oks. */
			
		if(step===0){//Resets state if button "Go to game start/reset" is clicked.
			this.setState(this.initialState);	
		}
		else{
			this.setState({
				stepNumber: step,
				xIsNext: (step%2) === 0
			});
		}

	}
	
	reArrange(){

		this.setState({
			upDown: !this.state.upDown
		});
	
	}

	calculateWinner(squares) {
		const lines = [/*Moguce kombinacije za pobedu*/
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];/* lines[i]={0,3,6}=[a,b,c] gde je sada a=0, b=3  c=6.
			Zatim se vrsi provera niza squares tako sto se vrednosti dodeljene promenljivama a, b i c postave za indekse istog. Posto ima tri promenljive(a,b,c), onda se clanovi niza squares sa ovim indeksima, medjusobno uporedjuju. Ukoliko sva tri clana niza, sa datim indeksima, sadrze istu vrednost(iks ili oks), onda se proglasava pobednik. */

			if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
				
				return [squares[a], lines[i]];
			}
		}
		return null;
		
	}
	
  render() {
	  
		const downUp = this.state.upDown;
		const history = this.state.history;//Pravi se kopija objekta history.
		const current = history[this.state.stepNumber];//Ovde se stavlja zadnji(trenutni) odigran potez koji je zabelezen u objektu.
		const winner = this.calculateWinner(current.squares);//Ovde se belezi simbol(iks ili oks) pobednika koji sastavi sva tri ista simbola u nizu.

		const moves = history.map((step, move) => {/*Ovde se pravi lista odigranih poteza u obliku dugmica. Klikom na nekih od tih dugmica se moze vratiti na prethodni potez.*/
			const desc = move ? "Go to move #" + move : "Go to game start/reset";/*Ovde se postavlja tekst zavisno od rednog broja poteza. Natpis Go to move #1 na dugmetu i itd.. U else stoji po defoltu "Go to game start", a za svaki potez se dodaje tekst ali se menja broj.*/
			
			return (/*Renderovanje dugmica u listi. U svakom dugmetu je prisutna funkcija koja kada se aktivira, vraca unazad na zeljeni potez. Parametar 'move' koji joj se prosledjuje je indeks tog poteza, on se dobavlja od 'map' metode. 'move' ovde sluzi i kao indeks svakg pojedinacnog generisanog 'li' elementa.*/
				<li key={move} className={this.state.active === step ? 'active' : ''} onClick={() => this.setActive(step)}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});
		
		let movesCopy;
		if(downUp===false){
			movesCopy = moves;
		}
		else{
			movesCopy = moves.reverse();
		}
		
		let status;//Promenljiva u kojoj se belezi tekst sa simbolom pobednika. 
		if(winner){// Po difoltu ova promenljiva je nedefinisana, te je false. Ona sluzi da se u njoj zabelezi pobednicki simbol. Kada se u njoj nesto zabelezi, onda nije vise nedefinisana, te je onda true i kod se izvrsava.
		
			status = "Winner: " + winner[0];//Bele se tekst i simbol pobednika.
		}
		else{//Sve dok je 'winner' promenljiva nedefinisana ovaj kod se izvrsava. Izvrsenje se sastoji od teksta i simbola igraca koji je trenutno na redu, odnosno sledeci.
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		if(this.state.history.length===10 && !winner){
			status = "This one is a draw!";
		}
		
		// Displaying columns and rows
		let column;
		let row;
		
		if(this.state.col){
			column = "Column No. " + this.state.col;
		}
		else{
			column = "Play to show column coordinate";
		}
		
		if(this.state.row){
			row = "Row No. " + this.state.row;
		}
		else{
			row = "Play to show row coordinate";
		}

		return (
		  <div className="game">
			<div className="game-board">{/*current.squares promenljiva je u stvari niz iz objekta iz state-a. prop-u squares iz board komponente, te u njoj square komponente, dodeljuje se prop i vrednost za prop. Salje se u Board koji ga prosledjuje Square(value). handleClick(i) takodje vodi do istih komponenti, a parametar je u stvari indeks kliknutog dugmeta.*/}
			
			<Board squares={current.squares} winningCombo={winner} onClick={(i) => this.handleClick(i)}/>
			</div>
			<div className="game-info">
			<button onClick={this.reArrange}>ReArrange</button>
			<div>{column}</div>
			<div>{row}</div>
			
			<div>{status}</div>{/*Prikazivanje vrednosti prethodno definisane promenljive.*/}
			<ol id="myList">{movesCopy}</ol>{/*Prikazivanje vrednosti prethodno definisane promenljive.*/}
			</div>
		  </div>
		);
		
	}
}

ReactDOM.render(<Game />,document.getElementById('root'));
