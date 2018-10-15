import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { destroyAllFiles } from '../actions/files';
import { destroyAllTags } from '../actions/tags';

import Reset from '../components/Reset';

const mapStateToProps = (state) => {
  return {
    dirs: state.dirs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    save: () => {
      dispatch(push('/'));
    },
    destroyData: () => {
      dispatch(destroyAllFiles('/'));
      dispatch(destroyAllTags('/'));
      dispatch(push('/'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reset);
