import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { upsertDir, removeDir, setIncSubFolder } from '../actions/dirs';
import Settings from '../components/Settings';

const mapStateToProps = (state) => {
  return {
    dirs: state.dirs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    upsertDir: (path) => {
      dispatch(upsertDir(path));
    },
    removeDir: (path) => {
      dispatch(removeDir(path));
    },
    save: () => {
      dispatch(push('/'));
    },
    setIncSubFolder: (path, state) => {
      dispatch(setIncSubFolder(path, state));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
