import DS from 'ember-data';
const { Model } = DS;
import { attr } from '@ember-decorators/data'

export default class AirQualityAnalysisModel extends Model {
    @attr('boolean')
    inAreaOfConcern;
}
