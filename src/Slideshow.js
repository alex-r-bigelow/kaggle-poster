/* globals d3 */
class Slideshow {
  constructor (slides, options) {
    this.slides = slides;
    this.slideNo = 0;

    options = options || {};
    this.loop = options.loop || false;

    this.slides[0].load();
    d3.select('body').on('click', () => { this.advance(); });
  }
  advance () {
    let currentSlide = this.slides[this.slideNo];
    if (!currentSlide.advance()) {
      this.slideNo += 1;
      if (this.slideNo >= this.slides.length) {
        if (this.loop) {
          this.slideNo = 0;
        } else {
          this.slideNo -= 1;
          return false;
        }
      }
      this.slides[this.slideNo].load();
    }
    return true;
  }
  reverse () {
    let currentSlide = this.slides[this.slideNo];
    if (!currentSlide.reverse()) {
      this.slideNo -= 1;
      if (this.slideNo < 0) {
        if (this.loop) {
          this.slideNo = this.slides.length - 1;
        } else {
          this.slideNo = 0;
          return false;
        }
      }
      this.slides[this.slideNo].load(true);
    }
    return true;
  }
}

export default Slideshow;
