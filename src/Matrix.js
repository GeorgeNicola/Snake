import React, {Component} from 'react';
import Pixel from './Pixel';
import './Matrix.css';

class Matrix extends Component {
    constructor(props){
        super(props);
        this.state = {
            score: 0,
            state: 2,
            // 1-before the game starts
            // 2-play the game
            // 3-stop the game
            matrix: [],
            direction: {
                x: 0, 
                y: -1
            },
            speed: 250, //Speed in ms 
            snake:[
                {
                    x: 7,
                    y: 5
                },
                {
                    x: 6,
                    y: 5
                },
                {
                    x: 5,
                    y: 5
                }
            ],//Snake's position
            directionCheck: 1,//Change direction only once per interval
            food: {
                x: "",
                y: ""
            }//Food's position

        }
    }

    keyboard(event, Matrix){
        switch(event.keyCode){
            case 37:
                //console.log("Left Arrow");
                if(Matrix.state.direction.x !== 1 && Matrix.state.directionCheck === 1)
                //Making sure the snake doesn't go backwards and moves only once per interval
                    Matrix.setState({direction: { x: -1, y: 0} });
                    Matrix.setState({directionCheck: 0});
                break;//LEFT arrow
            case 38:
                //console.log("Up Arrow");
                if(Matrix.state.direction.y !== -1 && Matrix.state.directionCheck === 1)
                    Matrix.setState({direction: { x: 0, y: 1} });
                    Matrix.setState({directionCheck: 0});
                break;//UP arrow
            case 39:
                //console.log("Right Arrow");
                if(Matrix.state.direction.x !== -1 && Matrix.state.directionCheck === 1)
                    Matrix.setState({direction: { x: 1, y: 0} });
                    Matrix.setState({directionCheck: 0});
                break;//RIGHT arrow
            case 40:
                //console.log("Down Arrow");
                if(Matrix.state.direction.y !== 1 && Matrix.state.directionCheck === 1)
                    Matrix.setState({direction: { x: 0, y: -1} });
                    Matrix.setState({directionCheck: 0});
                break;//DOWN arrow
            default:
                break;
        }
    }

    move(diry = 0, dirx = 0){
        const {snake, matrix} = this.state;//Object destructuring
        let snakeLength = snake.length;
        let x = snake[0].x - dirx;//Snake head position on x
        let y = snake[0].y + diry;//Snake head position on y


        if(x > 16 || x < 0 || y >=17 || y <=-1 ){
            this.die();
            //If shake bumps into a wall
        }else{

            matrix[snake[snakeLength-1].x][snake[snakeLength-1].y] = 0;
            //Detele the snake's last element
            for( let i = snake.length - 1; i >= 1; i--){
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
                matrix[snake[i].x][snake[i].y] = 1;
                this.forceUpdate();
            }//Change snake's body positiona nd show it


            matrix[x][y] = 1;//Show snake's head
            snake[0].x = x;
            snake[0].y = y;//Change head's position

            this.forceUpdate();
        }
    }

    getPoint(){
        this.addFood();
        this.grow();
        this.setState({score: this.state.score+1});
        this.props.changeScore(this.state.score);//Update score
    }

    addFood(){
        //Random integer: Math.floor(Math.random() * (max - min + 1)) + min;
        const {snake} = this.state;

        let k=0, x,y; 
        while(k===0){
            k=1;
            x = Math.floor(Math.random() * (17));
            y = Math.floor(Math.random() * (17));

            for(let i=0;i<snake.length;i++){
                if(snake[i].x === x) k=0; 
                if(snake[i].y === y) k=0; 
            }//Check if food spawns above the snake
        }

        this.setState({food:{x,y}});//Update food's position
        let newMatrix = this.state.matrix;
        newMatrix[x][y] = 2;
        this.setState({matrix: newMatrix});
    }

    grow(){
        let newSnake = this.state.snake;
        newSnake.push({x: 0, y: 0});//Add new element to snake
        this.setState({snake: newSnake});//Update snake's length
    }

    snakeBump(){
        const {snake} = this.state;

        for(let i=1;i<snake.length;i++){
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y)
                return 1;
        }
        return 0;
    }//If snake bumps into himself

    die(){
        this.reset();
    }

    reset(){
        let defaultSnake = [{x: 7, y: 5},{x: 6,y: 5},{x: 5,y: 5}];//Default Snake


        this.setState({
                score: 0,
                state: 2,
                matrix: [],
                direction: {
                    x: 0, 
                    y: -1
                },
                speed: 200, 
                snake: defaultSnake,
                directionCheck: 1,
                food: {
                    x: "",
                    y: ""
                }
        })//State's default values

        this.createDefaultMatrix();//Refreshes the matrix
        this.props.changeScore(this.state.score);//Update score
    }

    createDefaultMatrix(){
        var createMatrix = [];
        for(var i=0; i<17; i++) 
            createMatrix[i] = new Array(17).fill(0);

        for(let i=0;i<this.state.snake.length;i++){
            createMatrix[this.state.snake[i].x][this.state.snake[i].y] = 1;
        }
        this.setState({matrix: createMatrix});
    }//Create the default board

    componentDidMount(){
        document.addEventListener("keydown", (e) => this.keyboard(e, this) );//Button press listener

        this.createDefaultMatrix();

        this.interval = setInterval(() => {
            const {state, food, snake, direction} = this.state;
            this.setState({directionCheck: 1});//The player can change direction only once per interval

            if(food.x === "" && food.y === ""){
                this.addFood();
            }//Add first food
            
            if(state === 2){
                this.move(direction.x, direction.y);
            }//If game had status 2, the run game

            if(food.x === snake[0].x && food.y === snake[0].y){
                this.getPoint();
            }//Get food --> get point

            if(this.snakeBump() === 1){
                this.die();
            }

        }, this.state.speed);//Functions loop
    }



    componentWillUnmount(){
        document.removeEventListener("keydown", (e) => this.keyboard(e, this) );
        clearInterval(this.interval);
    }

    render(){
        const matrixColor=['#22272b','#151D25'];//Matrix colors
        const snakeColor='#00e59b';
        const foodColor="red";
        const { matrix } = this.state;

        return(
            <div className="matrix">
                {matrix.map((row, i) => {
                    return(
                        row.map((col, j) => {
                            switch(matrix[i][j]){
                                case 0:
                                    if((i+j)%2 === 0)
                                        return <Pixel color={matrixColor[0]} key={(i,j)} />
                                    else
                                        return <Pixel color={matrixColor[1]} key={(i,j)}/>
                                    //Create the board
                                case 1:
                                        return <Pixel color={snakeColor} key={(i,j)}/>
                                        //Show snake
                                case 2:
                                        return <Pixel color={foodColor} key={(i,j)}/>
                                        //Add food
                                default:
                                    break;

                            }
                            return 0;
                        })
                    )
                })}
            </div>
        )}
}

export default Matrix;