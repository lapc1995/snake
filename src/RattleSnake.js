import React from 'react';
import ReactPlayer from 'react-player';
import SnakeGame from './SnakeGame';

class RattleSnake extends React.Component {
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

        var size = 30;
        var scale = 2;

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
            top: this.state.height/2 - ((size * scale *10)/2) + 'px',
            left:this.state.width/2 - ((size * scale *10)/2) + 'px',
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
                <SnakeGame size={size} scale={scale} />
            </div>
       </div>
      );
    }
}

export default RattleSnake;