import React from 'react';
import Button from '../components/Button/Button';

class ExternalCamera extends React.PureComponent {
    state = {
        videoIsOpen: false,
    };

    openVideo = () => {
        this.setState({ videoIsOpen: true })
    }

    renderVideoEl() {
        if (this.state.videoIsOpen) {
            return (
                <video
                    width='100%'
                    height='450px'
                    src='http://localhost:3000/camera.webm'
                />
            );
        }
        return null;
    }

    render() {
        return (
            <div>
                <Button onClick={this.openVideo}>
                    Open watch video
                </Button>
                {this.renderVideoEl()}
            </div>
        );
    }
}

export default ExternalCamera;
