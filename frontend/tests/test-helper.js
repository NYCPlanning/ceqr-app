import Application from 'labs-ceqr/app';
import config from 'labs-ceqr/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import Application from '../app';
import config from '../config/environment';
import './helpers/flash-message';


setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
