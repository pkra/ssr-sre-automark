import { SVG } from 'mathjax-full/js/output/svg.js';
import { SvgMtable } from 'mathjax-full/js/output/svg/Wrappers/mtable.js';
import { SvgWrappers } from 'mathjax-full/js/output/svg/Wrappers.js';


// HACK courtesy of dpvc@MathJax; enables max-width:100% in labeled content by disabling "floating" labels / percentage widths
class customSVG extends SVG {
    createRoot(wrapper) {
        const bbox = wrapper.getBBox();
        if (bbox.pwidth) {
            bbox.pwidth = '';
        }
        return super.createRoot(wrapper);
    }
}
// HACK courtesy of dpvc@MathJax; rewrites table nodes in expected dom order; 
class customSvgMtable extends SvgMtable {

    constructor(factory, node, parent = null) {
        super(factory, node, parent);
        this.isTop = false;
        this.adaptor.setAttribute(this.labels, 'transform', '');
    }

    subTable(svg, labels, side, dx) {
        const getTransformValuesArray = (node) => adaptor?.getAttribute(node, 'transform')?.match(/translate\((.*)\)/)?.pop().split(',').map(string => parseInt(string)) || [0, 0];

        super.subTable(svg, labels, side, dx);
        const adaptor = this.adaptor;
        adaptor.remove(labels);
        const labelsTransformValues = getTransformValuesArray(labels); // NOTE we'll add the label-group's translation to each label's translation
        const labeledRows = adaptor.childNodes(svg).filter(childNode => adaptor.getAttribute(childNode, 'data-mml-node') === 'mlabeledtr');
        adaptor.childNodes(labels).forEach((label, index) => {
            const labelTransformValues = getTransformValuesArray(label);
            const rowTransformValues = getTransformValuesArray(labeledRows[index]); // NOTE we will subtract the row translation from the label translation
            adaptor.setAttribute(label, 'transform', `translate(${labelsTransformValues[0] - rowTransformValues[0] + labelTransformValues[0]}, ${labelsTransformValues[1] - rowTransformValues[1] + labelTransformValues[1]})`);
            adaptor.insert(label, adaptor.firstChild(labeledRows[index]));
        })
    }
}
SvgWrappers[customSvgMtable.kind] = customSvgMtable;
// END HACK rewriting dom order of tables

import { MathJaxModernFont } from 'mathjax-modern-font/mjs/svg.js';
const modernFont = new MathJaxModernFont({
    dynamicPrefix: 'mathjax-modern-font/mjs/svg/dynamic'
});

export const svg = new customSVG({
    fontData: modernFont,
    displayAlign: 'left',
    displayIndent: '0',
    displayOverflow: 'overflow',
    linebreaks: {
        inline: false,
    },
});
