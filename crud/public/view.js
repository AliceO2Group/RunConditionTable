import loadedView from './components/loaded/loaded-view.js';
import basic from './components/basic.js';
import spinner from './components/spinner.js';

export default function view(model) {
    return model.loaded? loadedView(model) : model.spinner ? spinner() : basic(model);
}
