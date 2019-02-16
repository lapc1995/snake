import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ReactPlayer from 'react-player';

class Snake extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map : null,
            snake: [{x: 10, y: 10}],
            keyPressed: 'ArrowLeft',
        }
        this.onKeyPressed = this.onKeyPressed.bind(this);

        var m = Array(this.props.size);
        for(var i = 0; i < this.props.size; i++) {
            m[i] = Array(this.props.size).fill(0);
        }

        var x = Math.floor((Math.random() * this.props.size-1) + 0);
        var y = Math.floor((Math.random() * this.props.size-1) + 0);
        m[y][x] = 2;

        this.state.map = m;



        this.setState({
            
        })
    }

    updateSnakePosition() {

        //copy snake
        var snake_aux = Array(this.state.snake.length);
        for(var i = 0; i < snake_aux.length; i++) {
            snake_aux[i] = {x: this.state.snake[i].x, y: this.state.snake[i].y};
        }

        //copy map
        var map_aux = Array(this.props.size);
        for(var i = 0; i < this.props.size; i++) {
            map_aux[i] = Array(this.props.size);
            for(var j = 0; j < this.props.size; j++) {
                map_aux[i][j] = this.state.map[i][j];
            }
        }

        var oldX = snake_aux[0].x;
        var oldY = snake_aux[0].y;

        if(this.state.keyPressed == 'ArrowUp') {
            snake_aux[0].y = snake_aux[0].y - 1;
            if(snake_aux[0].y < 0)
                snake_aux[0].y = this.props.size-1;
        } else if(this.state.keyPressed == 'ArrowDown') {
            snake_aux[0].y = snake_aux[0].y + 1;
            if(snake_aux[0].y >= this.props.size)
                snake_aux[0].y = 0;
        } else if(this.state.keyPressed == 'ArrowLeft') {
            snake_aux[0].x = snake_aux[0].x - 1;
            if(snake_aux[0].x < 0) 
                snake_aux[0].x = this.props.size-1;
        } else if(this.state.keyPressed == 'ArrowRight') {
            snake_aux[0].x = snake_aux[0].x + 1;
            if(snake_aux[0].x >= this.props.size) 
                snake_aux[0].x = 0;
        }

        var eatFood = false;

        if(map_aux[snake_aux[0].y][snake_aux[0].x] == 1) {
            map_aux = Array(this.props.size);
            for(var i = 0; i < this.props.size; i++) {
                map_aux[i] = Array(this.props.size).fill(0);
            }

            var x = Math.floor((Math.random() * this.props.size-1) + 0);
            var y = Math.floor((Math.random() * this.props.size-1) + 0);
            map_aux[y][x] = 2;
            snake_aux = Array(1);
            snake_aux[0] = {x: 10, y: 10};
        }

        if(map_aux[snake_aux[0].y][ snake_aux[0].x] == 2) {
            eatFood = true;
            var x = Math.floor((Math.random() * this.props.size-1) + 0);
            var y = Math.floor((Math.random() * this.props.size-1) + 0);
            map_aux[y][x] = 2;
        }
        
        map_aux[snake_aux[0].y][ snake_aux[0].x] = 1;
        
        for(var i = 1; i < snake_aux.length; i++) {
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
                !((e.key == 'ArrowUp' && this.state.keyPressed == 'ArrowDown') || 
                 (e.key == 'ArrowDown' && this.state.keyPressed == 'ArrowUp') ||
                 (e.key == 'ArrowRight' && this.state.keyPressed == 'ArrowLeft') ||
                 (e.key == 'ArrowLeft' && this.state.keyPressed == 'ArrowRight'))
            ) || this.state.snake.length == 1)
               this.setState({keyPressed: e.key});
    }

    render() {
       
        var result = Array(this.props.size);
        for(var i = 0; i < this.props.size; i++) {
            var line = Array(this.props.size);
            for(var j = 0; j < this.props.size; j++) {
                if(this.state.map[i][j] == 1) {
                    line[j] = <svg width="10" height="10">
                                <rect width="10" height="10" style={{fill:"rgb(0,255,0)"}} />
                                </svg>
                } else if(this.state.map[i][j] == 2) {
                    line[j] = <svg width="10" height="10">
                                <rect width="10" height="10" style={{fill:"rgb(255,0,0)"}} />
                                </svg>
                } else {
                    line[j] = <svg width="10" height="10">
                                <rect width="10" height="10" style={{fill:"rgb(0,0,255)"}} />
                                </svg>
                }
            }
            result[i] = (<div style={{height:'10px'}}>{line}</div>);
        }
        return (<div>{result}</div>);
    }
}

class Screen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
      
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        const container = {
            position: 'relative',
            width: this.state.width + 'px',
            height: this.state.height - 4 + 'px',
            
          }
        const video = {
            width:this.state.width + 'px',
            height:this.state.height - 4 + 'px',
          }
    
        const game= {
            position: 'absolute',
            top: this.state.height/2 - 150 + 'px',
            left:this.state.width/2 - 150 + 'px',
          }

        return(<div style={container}>
            <div style={video}>
                <ReactPlayer 
                    url='https://www.youtube.com/watch?v=Q-i1XZc8ZwA' 
                    playing 
                    loop  
                    width='100%'
                    height='100%'
                />
            </div>
            <div style={game}>
                <Snake size='30' />
            </div>
       </div>
      );
}
    }


    



ReactDOM.render(<Screen/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
