import DS from 'ember-data';
const { Model, attr } = DS;

export default class AirQualityAnalysisModel extends Model {
    @attr('boolean')
    inAreaOfConcern;
}
