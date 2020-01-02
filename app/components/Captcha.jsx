import React from 'react';
import axios from 'axios';
import Interweave from 'interweave';
import PropTypes from 'prop-types';
import Octicon, { Sync } from '@primer/octicons-react';
import {
  Container, Row, Col, Input, InputGroupAddon,
  InputGroup, InputGroupText, Button,
} from 'reactstrap';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class Captcha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: '',
      verifyText: '',
      answerText: '',
      isSolved: null,
      answerAttempted: false,
    };
    this.isloaded = false;
  }

  getCaptcha = () => {
    const { isSolved } = this.state;
    if (isSolved) {
      return;
    }
    this.setState({ answerAttempted: false });
    this.setState({ verifyText: '' });
    axios.get('/captcha', {
      cancelToken: source.token,
    })
      .then((response) => {
        this.setState({ answerText: response.headers.captcha });
        this.setState({ svg: `<img src="data:image/svg+xml;base64,${btoa(response.data)}" />` });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  cancel = () => {
    // as per https://github.com/axios/axios#cancellation
    source.cancel('canceled');
  }

  componentDidMount = () => {
    this.isloaded = true;
    this.getCaptcha();
  }

  getNewCode = () => {
    this.getCaptcha();
  }

  verify = () => {
    const { verifyText, answerText } = this.state;
    const { onValid: onValidCB } = this.props;
    this.setState({ answerAttempted: true });
    if (verifyText === answerText) {
      this.setState({ isSolved: true }, () => onValidCB());
    }
  }

  handleFieldChange = (e) => {
    e.persist();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  isValid = () => {
    const { isSolved } = this.state;
    return isSolved || false;
  }

  reset = () => {
    this.setState({ isSolved: false });
    this.setState({ answerAttempted: false });
    this.getCaptcha();
  }

  render() {
    const {
      svg, verifyText, isSolved, answerAttempted,
    } = this.state;
    return (
      <Container className="captcha">
        <Row>
          <Col>
            <Interweave content={svg} />
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Prove you&apos;re not a robot:</p>
            <InputGroup>
              <Input
                onChange={this.handleFieldChange}
                placeholder=""
                maxLength={4}
                id="verifyText"
                value={verifyText}
                // eslint-disable-next-line no-mixed-operators
                className={isSolved && ('verified') || !isSolved && answerAttempted && ('incorrect') || ('')}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...(isSolved ? { disabled: true } : {})}
              />
              <InputGroupAddon addonType="append" size="sm" className="reload-btn-wrapper">
                <InputGroupText>
                  { /* eslint-disable-next-line max-len */ }
                  { /* eslint-disable-next-line no-script-url, jsx-a11y/anchor-is-valid, jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events */ }
                  <div
                    role="button"
                    onClick={this.getNewCode}
                    className={!isSolved ? 'clickable' : ''}
                  >
                    <Octicon icon={Sync} />
                  </div>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col className="verify">
            { !isSolved
              && (
                <Button
                  variant="outline-primary"
                  onClick={this.verify}
                >
                  Verify
                </Button>
              )}
            {
              isSolved
              && (<p>You&apos;re human!!</p>)
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

Captcha.defaultProps = {
  onValid: null,
};

Captcha.propTypes = {
  onValid: PropTypes.func,
};

export default Captcha;
