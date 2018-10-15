import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Home from '../components/Home';
import { upsertTag, checkTag, uncheckTag, removeTag } from '../actions/tags';
import { upsertFile, tagFile, removeFile } from '../actions/files';

const mapStateToProps = (state) => {
  return {
    dirs: state.dirs,
    files: state.files,
    tags: state.tags,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSettings: (data) => {
      dispatch(push('/settings'));
    },
    upsertFile: (absolute, file) => {
      dispatch(upsertFile(absolute, file))
    },
    removeFile: (absolute) => {
      dispatch(removeFile(absolute))
    },
    tagFile: (absolute, hashtags) => {
      hashtags.forEach(tag => {
        dispatch(upsertTag(tag));
      });
      dispatch(tagFile(absolute, hashtags))
    },
    removeTag: (tag) => {
      dispatch(removeTag(tag))
    },
    toggleCheckTag: (tag) => {
      if (tag.checked === true) dispatch(uncheckTag(tag.name)); else dispatch(checkTag(tag.name));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
