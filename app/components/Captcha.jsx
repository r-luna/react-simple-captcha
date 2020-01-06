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
      preamble: '',
      postamble: '',
      size: 0,
    };
    this.isloaded = false;
  }

  getCaptcha = () => {
    const { isSolved } = this.state;
    if (isSolved) {
      return;
    }
    const { size, ignoreChars, noise, color, bg, width, height, fontSize, } = this.props;
    this.setState({ answerAttempted: false });
    this.setState({ verifyText: '' });
    axios.post(`/captcha/`, {
      size, ignoreChars, noise, color, bg, width, height, fontSize,
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
    const { preamble, postamble, size } = this.props;
    this.setState({preamble});
    this.setState({postamble});
    this.setState({size});
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
      svg, verifyText, isSolved, answerAttempted, preamble, postamble, size,
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
            { preamble.length !== 0 &&
              (<p>{preamble}</p>)
            }
            <InputGroup>
              <Input
                onChange={this.handleFieldChange}
                placeholder=""
                maxLength={size}
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
            <p>
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
                && ( postamble )
              }
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

Captcha.defaultProps = {
  preamble: '',
  postamble: '',
  onValid: null,
  size: undefined,
  width: undefined,
  height: undefined,
  fontSize: undefined,
  ignoreChars: undefined,
  noise: undefined,
  color: undefined,
  bg: undefined,
};

Captcha.propTypes = {
  preamble: PropTypes.string,
  postamble: PropTypes.string,
  onValid: PropTypes.func,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fontSize: PropTypes.number,
  ignoreChars: PropTypes.string,
  noise: PropTypes.number,
  color: PropTypes.string,
  bg: PropTypes.string,
};

export default Captcha;
