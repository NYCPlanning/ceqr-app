import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PublicSchoolsSummaryVersionSelector extends Component {
  tagName = '';
  @service() store;
  @service() projectOrchestrator;

  @action
  async changeDataPackage(dataPackage) {
    console.info("changeDataPackage", dataPackage);
    const analysis = await this.analysis;

    analysis.set('dataPackage', dataPackage);

    this.projectOrchestrator.set('analysis', analysis);
    this.projectOrchestrator.saveAnalysis.perform();
  }
}
