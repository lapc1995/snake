import React from 'react';

class SnakeGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map : null,
            snake: [{x: 10, y: 10}],
            keyPressed: 'ArrowLeft',
            canRender: false,
        }
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    setGame() {
        var map_aux = Array(this.props.size);
        for(var i = 0; i < this.props.size; i++) {
            map_aux[i] = Array(this.props.size);
            for(var j = 0; j < this.props.size; j++) {
                map_aux[i][j] = 0;
            }
        }

        var snake_aux = Array(1);
        snake_aux[0] = {x: 10, y: 10};
        map_aux[snake_aux[0].y][snake_aux[0].x] = 1;

        var position = this.getFoodPosition(map_aux);
        map_aux[position.y][position.x] = 2;
        
        return {map: map_aux, snake: snake_aux}
    }

    startGame() {
        var gameVars = this.setGame();
        this.setState({
            map: gameVars.map,
            snake: gameVars.snake,
            canRender:true
        })
    }

    getFoodPosition(map) {
        var foodSet = false;
        var x = 0;
        var y = 0;
        while(!foodSet) {
            x = Math.floor((Math.random() * this.props.size) + 0);
            y = Math.floor((Math.random() * this.props.size) + 0);
            if(map[y][x] === 0)
                foodSet = true;
        }
        return {x: x, y: y}
    }

    updateSnakePosition() {

        //copy snake
        var snake_aux = Array(this.state.snake.length);
        for(var i = 0; i < snake_aux.length; i++) {
            snake_aux[i] = {x: this.state.snake[i].x, y: this.state.snake[i].y};
        }

        //copy map
        var map_aux = Array(this.props.size);
        for(i = 0; i < this.props.size; i++) {
            map_aux[i] = Array(this.props.size);
            for(var j = 0; j < this.props.size; j++) {
                map_aux[i][j] = this.state.map[i][j];
            }
        }

        var oldX = snake_aux[0].x;
        var oldY = snake_aux[0].y;

        if(this.state.keyPressed === 'ArrowUp') {
            snake_aux[0].y = snake_aux[0].y - 1;
            if(snake_aux[0].y < 0)
                snake_aux[0].y = this.props.size-1;
        } else if(this.state.keyPressed === 'ArrowDown') {
            snake_aux[0].y = snake_aux[0].y + 1;
            if(snake_aux[0].y >= this.props.size)
                snake_aux[0].y = 0;
        } else if(this.state.keyPressed === 'ArrowLeft') {
            snake_aux[0].x = snake_aux[0].x - 1;
            if(snake_aux[0].x < 0) 
                snake_aux[0].x = this.props.size-1;
        } else if(this.state.keyPressed === 'ArrowRight') {
            snake_aux[0].x = snake_aux[0].x + 1;
            if(snake_aux[0].x >= this.props.size) 
                snake_aux[0].x = 0;
        }

        var eatFood = false;

        if(map_aux[snake_aux[0].y][snake_aux[0].x] === 1) {
            var gameVars = this.setGame();
            snake_aux = gameVars.snake;
            map_aux = gameVars.map;
        } else if(map_aux[snake_aux[0].y][ snake_aux[0].x] === 2) {
            eatFood = true;
            var position = this.getFoodPosition(map_aux);
            map_aux[position.y][position.x] = 2;
        }
        
        map_aux[snake_aux[0].y][ snake_aux[0].x] = 1;
        
        for(i = 1; i < snake_aux.length; i++) {
            var tempX = snake_aux[i].x;
            var tempY = snake_aux[i].y;

            snake_aux[i].x = oldX;
            snake_aux[i].y = oldY;
            map_aux[oldY][oldX] = 1;

            oldX = tempX;
            oldY = tempY;
        }

        if(eatFood) {
            snake_aux.push({x:oldX, y: oldY});
            map_aux[oldY][oldX] = 1;
        } else {
            map_aux[oldY][oldX] = 0;
        }
        
        this.setState({
            snake: snake_aux,
            map: map_aux
          });
       
    }

    componentDidMount() {
        this.startGame();
        this.intervalID = setInterval(
            () => this.tick(),
            50
        );
        document.addEventListener("keydown", this.onKeyPressed, false);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
        document.removeEventListener("keydown", this.onKeyPressed, false);
    }

    tick() {
       this.updateSnakePosition();
    }

    onKeyPressed(e) {
        if( (this.state.snake.length > 1 && 
                !((e.key === 'ArrowUp' && this.state.keyPressed === 'ArrowDown') || 
                 (e.key === 'ArrowDown' && this.state.keyPressed === 'ArrowUp') ||
                 (e.key === 'ArrowRight' && this.state.keyPressed === 'ArrowLeft') ||
                 (e.key === 'ArrowLeft' && this.state.keyPressed === 'ArrowRight'))
            ) || this.state.snake.length === 1)
               this.setState({keyPressed: e.key});
    }

    render() {
        if(this.state.canRender) {
            var size = this.props.scale * 10;
            var result = Array(this.props.size);
            var key = 0;
            for(var i = 0; i < this.props.size; i++) {
                var line = Array(this.props.size);
                for(var j = 0; j < this.props.size; j++) {
                    if(this.state.map[i][j] === 0){
                        line[j] = <svg key={key} width={size} height={size}>
                                    <rect width={size} height={size} style={{fill:"rgb(0,0,0,0)"}} />
                                  </svg>
                    } else if(this.state.map[i][j] === 1) {
                        line[j] = <svg key={key} width={size} height={size}>
                                    <rect width={size} height={size} style={{fill:"rgb(0,255,0)"}} />
                                  </svg>
                    } else if(this.state.map[i][j] === 2) {
                        line[j] = <svg key={key} width={size} height={size}>
                                    <rect width={size} height={size} style={{fill:"rgb(255,0,0)"}} />
                                  </svg>
                    }
                    key++; 
                }
                result[i] = (<div key={i*1000} style={{height: size + 'px'}}>{line}</div>);
            }
            return (<div>{result}</div>);
        }
        return (<div></div>);
    }
}

export default SnakeGame;