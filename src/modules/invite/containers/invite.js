import {render} from 'react-dom';
import {compose} from 'react-komposer';

import component from '../components/invite';
import actions from '../actions/invite';

const composer = (props, onData) => {

	let componentData = {
		actions
	};

	onData(null, componentData);
};

export default compose(composer)(component);
