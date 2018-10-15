import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import About from '../components/About';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    exit: () => {
      dispatch(push('/'));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(About);
