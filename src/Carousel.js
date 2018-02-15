/* globals d3 */

class Carousel {
  constructor (nPages) {
    this.kaggleData = null;
    this.centerIndex = null;

    this.nextTimeout = 0;

    (async () => {
      const kaggleUrl = 'https://www.kaggle.com/datasets_v2.json?sortBy=hottest&pagesize=20&page=';
      const options = {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      };
      // Fire off parallel requests for the first nPages, and stitch them together
      this.kaggleData = await Promise.all([...new Array(nPages)]
        .map((dummy, pageNo) => d3.json(kaggleUrl + (pageNo + 1), options)))
        .then(results => {
          return results.reduce((agg, page) => {
            return agg.concat(page.datasetListItems);
          }, []);
        });
      // Once we've got this.kaggleData, start filling in the images
      this.setupImages();
      // While things are loading, start up the animation
      this.jumpNext();
    })();
  }
  setupImages () {
    // First, get the size / position of the placeholder thumbnail,
    // the offset to the next one, as well as the y-coordinate of the
    // containing group
    let thumb0 = d3.select('#thumb0');
    let attrs = {
      width: +thumb0.attr('width'),
      height: +thumb0.attr('height'),
      x: +thumb0.attr('x'),
      y: +thumb0.attr('y')
    };
    this.thumbOffset = d3.select('#thumb1').attr('x') - attrs.x;
    this.yTranslate = parseFloat(d3.select('#carousel').attr('transform')
      .split(',')[1]);

    let images = d3.select('#carousel').selectAll('image')
      .data(this.kaggleData);
    images.exit().remove();
    images = images.enter().append('image').merge(images);

    images
      .attr('xlink:xlink:href', 'spinner.gif') // initially set to the already-loaded spinner.gif
      .attr('x', (d, i) => attrs.x + i * this.thumbOffset)
      .attr('y', attrs.y)
      .attr('width', attrs.width)
      .attr('height', attrs.height);

    images.attr('xlink:xlink:href', d => d.thumbnailImageUrl);
  }
  jumpRandom () {
    this.jump(Math.floor(Math.random() * this.kaggleData.length));
  }
  jumpNext () {
    let index = this.centerIndex + 1;
    if (this.centerIndex >= this.kaggleData.length - 1) {
      index = 0;
    }
    this.jump(index, Carousel.NEXT_TIMEOUT);
  }
  jump (index, delay) {
    this.centerIndex = index;
    let t = d3.transition();
    d3.select('#carousel')
      .transition(t)
      .attr('transform', `translate(${-index * this.thumbOffset},${this.yTranslate})`);

    d3.select('#datasetName').text(this.kaggleData[index].title);
    this.layoutDescription(this.kaggleData[index].overview);

    window.clearTimeout(this.nextTimeout);
    if (delay) {
      this.nextTimeout = window.setTimeout(() => {
        this.jumpNext();
      }, delay);
    }
  }
  layoutDescription (text) {
    const fillLine = (lineObj, remainingWords, truncate) => {
      if (remainingWords.length === 0) {
        lineObj.text('');
        return [];
      }
      let nWords = 1;
      while (nWords <= remainingWords.length) {
        lineObj.text(remainingWords.slice(0, nWords).join(' '));
        if (lineObj.node().getBoundingClientRect().width > Carousel.MAX_TEXT_WIDTH) {
          if (truncate) {
            lineObj.text(remainingWords.slice(0, nWords - 1).join(' ') + '...');
            return [];
          } else {
            lineObj.text(remainingWords.slice(0, nWords - 1).join(' '));
            return remainingWords.slice(nWords - 1);
          }
        }
        nWords += 1;
      }
      return [];
    };
    let words = text.split(' ');
    words = fillLine(d3.select('#line1'), words, false);
    words = fillLine(d3.select('#line2'), words, false);
    fillLine(d3.select('#line3'), words, true);
  }
  getCurrentDatasetUrl () {
    return 'https://www.kaggle.com' +
      this.kaggleData[this.centerIndex].datasetUrl +
      '/data';
  }
}
Carousel.NEXT_TIMEOUT = 2000;
Carousel.MAX_TEXT_WIDTH = 1400;

export default Carousel;
