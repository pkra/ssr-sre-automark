import { sreLinearizer } from './sre.js';

// TeX to MathML
import { TeX } from 'mathjax-full/mjs/input/tex.js';
import { HTMLDocument } from 'mathjax-full/mjs/handlers/html/HTMLDocument.js';
import { liteAdaptor } from 'mathjax-full/mjs/adaptors/liteAdaptor.js';
import { STATE } from 'mathjax-full/mjs/core/MathItem.js';
import { SerializedMmlVisitor } from 'mathjax-full/mjs/core/MmlTree/SerializedMmlVisitor.js';

const MmlVisitor = SerializedMmlVisitor;

const packageList = [
    'base',
    'action',
    'ams',
    'amscd',
    'bbox',
    'boldsymbol',
    'braket',
    // 'bussproofs',
    'cancel',
    'cases',
    'centernot',
    'color',
    'colortbl',
    'empheq',
    'enclose',
    'extpfeil',
    'gensymb',
    'html',
    'mathtools',
    'mhchem',
    'newcommand',
    'noerrors',
    'noundefined',
    'upgreek',
    'unicode',
    'verb',
    'configmacros',
    'tagformat',
    'texhtml',
    'textcomp',
    'textmacros'
]

const tex = new TeX({
    packages: packageList
});
const html = new HTMLDocument('', liteAdaptor(), { InputJax: tex });
const visitor = new MmlVisitor();
const toMathML = (node) => visitor.visitTree(node, html);

const tex2mml = (string, display) => {
    return toMathML(
        html.convert(string || '', { display: display, end: STATE.CONVERT })
    );
};


// MathML to SVG / CHTML
import { mathjax } from 'mathjax-full/mjs/mathjax.js';

// import 'mathjax-full/mjs/util/asyncLoad/esm.js'; // Throws for fonts
mathjax.asyncLoad = async (name) => import(name + '.js');// FIX asyncload

import { MathML } from 'mathjax-full/mjs/input/mathml.js';
import { SVG } from 'mathjax-full/mjs/output/svg.js';
import { parseHTML, DOMParser } from 'linkedom'
import { linkedomAdaptor } from 'mathjax-full/mjs/adaptors/linkedomAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/mjs/handlers/html.js';
const adaptor = linkedomAdaptor(parseHTML);
RegisterHTMLHandler(adaptor);
const mml = new MathML();
import { MathJaxModernFont } from 'mathjax-modern-font/mjs/svg.js';
const modernFont = new MathJaxModernFont({
    dynamicPrefix: 'mathjax-modern-font/mjs/svg/dynamic'
});

const svg = new SVG({
    fontData: modernFont,
    displayOverflow: 'overflow',
    linebreaks: {
        inline: false,
    }
});
svg.font.loadDynamicFilesSync();

const svghtml = mathjax.document('', { InputJax: mml, OutputJax: svg });

const mjenrich = async (texstring, displayBool) => {

    const mml = tex2mml(texstring, displayBool);

    // DO SOMETHING WITH SRE

    const mmlNode = await sreLinearizer(mml);

    const cleanupAttributes = (node) => {
        [...node.attributes].forEach((attr) => {
            if (!attr.name.startsWith('data-')) return;
            node.removeAttribute(attr.name);
        });
    };
    
    const mjx = svghtml.convert(mmlNode.outerHTML, {
        em: 16,
        ex: 8,
        containerWidth: 80 * 16,
    });
    mjx.querySelectorAll('*').forEach(node => cleanupAttributes(node));

    return mjx.outerHTML;
};

console.log(await mjenrich(process.argv[2]));
