'user strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Container, Row, Col, Card,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Captcha from './components/Captcha.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
    };
  }

  captchaValidated = () => {
    this.setState({ success: true });
  }

  render(){
    const { success } = this.state;
    return(
      <Container>
        <Row>
          <Col sm={6}>
          &nbsp;
          <Card>
            <Captcha
              preamble="Prove you're not a robot:"
              onValid={this.captchaValidated}
              size={9}
              ignoreChars="abcdefghijklmnopqrstuvwxyz"
              noise={5}
              color="false"
              bg="cc9966"
              width={300}
              height={90}
              fontSize={60}
            />
          </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            { success && (
              <p>The captcha was validated. Reload to try again.</p>
            )}
          </Col>
        </Row>
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
