/* globals d3 */
class Slide {
  constructor (contentsPromise) {
    this.contentsPromise = contentsPromise;
  }
  async load (reverse) {
    let self = this;
    d3.select('body').html(await this.contentsPromise);
    this.enterSteps = {};
    this.exitSteps = {};
    d3.selectAll('body [data-enter]').each(function () {
      let elements = self.enterSteps[this.dataset.enter] || [];
      elements.push({
        el: this,
        display: d3.select(this).style('display') || 'block'
      });
      if (!reverse) {
        d3.select(this).style('display', 'none');
      }
      self.enterSteps[this.dataset.enter] = elements;
    });
    d3.selectAll('body [data-exit]').each(function () {
      let elements = self.exitSteps[this.dataset.exit] || [];
      elements.push({
        el: this,
        display: d3.select(this).style('display') || 'block'
      });
      if (reverse) {
        d3.select(this).style('display', 'none');
      }
      self.exitSteps[this.dataset.exit] = elements;
    });
    this.currentStep = reverse ? Infinity : -Infinity;
    if (this.onload) {
      this.onload();
    }
  }
  advance () {
    return false;
  }
  reverse () {
    return false;
  }
}

export default Slide;
