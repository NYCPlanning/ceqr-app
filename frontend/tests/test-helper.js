import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import Application from '../app';
import config from '../config/environment';
import './helpers/flash-message';


setApplication(Application.create(config.APP));

start();
