/* globals d3 */
import Carousel from './Carousel.js';

d3.text('static.svg')
  .then(svgText => {
    d3.select('body')
      .html(svgText)
      .append('input')
      .attr('id', 'hiddenInput')
      .attr('type', 'text');
  });

window.carousel = new Carousel(4);
let stage = 0;
d3.select('body').on('click', () => {
  if (stage === 0) {
    window.carousel.jumpRandom();
    let hiddenInput = d3.select('#hiddenInput').node();
    hiddenInput.value = window.carousel.getCurrentDatasetUrl();
    hiddenInput.select();
    document.execCommand('Copy');
  } else if (stage === 1) {
    window.open(window.carousel.getCurrentDatasetUrl());
    window.carousel.jumpNext();
  }
  stage += 1;
  if (stage >= 2) {
    stage = 0;
  }
});
