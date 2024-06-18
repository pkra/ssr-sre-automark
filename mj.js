import { sreLinearizer } from './sre.js';

// TeX to MathML
import { TeX } from 'mathjax-full/mjs/input/tex.js';
import { HTMLDocument } from 'mathjax-full/mjs/handlers/html/HTMLDocument.js';
import { liteAdaptor } from 'mathjax-full/mjs/adaptors/liteAdaptor.js';
import { STATE } from 'mathjax-full/mjs/core/MathItem.js';
import { SerializedMmlVisitor } from 'mathjax-full/mjs/core/MmlTree/SerializedMmlVisitor.js';

const MmlVisitor = SerializedMmlVisitor;

import 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/amscd/AmsCdConfiguration.js';
import 'mathjax-full/js/input/tex/bbox/BboxConfiguration.js';
import 'mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax-full/js/input/tex/braket/BraketConfiguration.js';
import 'mathjax-full/js/input/tex/cancel/CancelConfiguration.js';
import 'mathjax-full/js/input/tex/color/ColorConfiguration.js';
import 'mathjax-full/js/input/tex/configmacros/ConfigMacrosConfiguration.js';
import 'mathjax-full/js/input/tex/enclose/EncloseConfiguration.js';
import 'mathjax-full/js/input/tex/extpfeil/ExtpfeilConfiguration.js';
import 'mathjax-full/js/input/tex/html/HtmlConfiguration.js';
import 'mathjax-full/js/input/tex/tagformat/TagFormatConfiguration.js';
import 'mathjax-full/js/input/tex/textmacros/TextMacrosConfiguration.js';
import 'mathjax-full/js/input/tex/unicode/UnicodeConfiguration.js';
import 'mathjax-full/js/input/tex/verb/VerbConfiguration.js';
import 'mathjax-full/js/input/tex/mathtools/MathtoolsConfiguration.js';
import 'mathjax-full/js/input/tex/cases/CasesConfiguration.js';
import 'mathjax-full/js/input/tex/empheq/EmpheqConfiguration.js';
import 'mathjax-full/js/input/tex/colortbl/ColortblConfiguration.js';
const packageList = [
    'base',
    'ams',
    'amscd',
    'bbox',
    'boldsymbol',
    'braket',
    'cancel',
    'cases',
    'color',
    'colortbl',
    'empheq',
    'enclose',
    'extpfeil',
    'html',
    'mathtools',
    'unicode',
    'verb',
    'configmacros',
    'tagformat',
    'textmacros'
]

const tex = new TeX({
    packages: packageList,
    tagSide: 'left',
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
import { parseHTML } from 'linkedom'
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
const mml2svg = async (mathstring, options) => mathjax.handleRetriesFor(() => svghtml.convert(mathstring, options));

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
    
    const mjx = await mml2svg(mmlNode.outerHTML, {
        em: 16,
        ex: 8,
        containerWidth: 80 * 16,
    });
    mjx.querySelectorAll('*').forEach(node => cleanupAttributes(node));

    return mjx.outerHTML;
};

console.log(await mjenrich(process.argv[2]));
